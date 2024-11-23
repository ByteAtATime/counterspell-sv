import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { userMetadataSchema } from "@lib/firebase/types.ts";
import { firestore } from "@lib/firebase";
import { getEvent } from "@lib/firebase/events";
import { grantUserExperience } from "$lib/lib/firebase/xp";
import { displayUser } from "$lib/lib/users/utils";

export const GET: APIRoute = async (context) => {
  const { userId } = context.params;

  const eventId = context.url.searchParams.get("eventId");

  if (!eventId || !userId) {
    return new Response("Missing required params", { status: 400 });
  }

  const client = clerkClient(context);
  const user = await client.users.getUser(userId);

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const hasAttended = userMetadataSchema.parse(user.publicMetadata).eventsAttended.includes(eventId);

  return new Response(JSON.stringify({ hasAttended }), {
    headers: {
      "content-type": "application/json",
    },
  });
}

export const POST: APIRoute = async (context) => {
  const sender = await context.locals.currentUser();

  const isAdmin = sender?.publicMetadata.isAdmin;

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { userId } = context.params;

  const eventId = context.url.searchParams.get("eventId");

  if (!eventId || !userId) {
    return new Response("Missing required params", { status: 400 });
  }

  const client = clerkClient(context);
  const user = await client.users.getUser(userId);

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const metadata = userMetadataSchema.parse(user.publicMetadata);
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...metadata,
      eventsAttended: [...metadata.eventsAttended, eventId],
    }
  });

  const event = await getEvent(eventId);

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  await grantUserExperience(userId, displayUser(user), event.xp, `Attended event: ${event.name}`);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
