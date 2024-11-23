import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { getAllEvents } from "@lib/firebase/events.ts";
import { userMetadataSchema } from "@lib/firebase/types.ts";

export const GET: APIRoute = async (context) => {
  const { userId } = context.params;

  if (!userId) {
    return new Response("Missing required params", { status: 400 });
  }

  const client = clerkClient(context);
  const user = await client.users.getUser(userId);

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const allEvents = await getAllEvents();
  const eventsAttended = userMetadataSchema.parse(
    user.publicMetadata,
  ).eventsAttended;

  // return as eventId: boolean
  const attendedEvents = allEvents.reduce<Record<string, boolean>>(
    (acc, event) => {
      acc[event.id] = eventsAttended.includes(event.id);
      return acc;
    },
    {},
  );

  return new Response(JSON.stringify(attendedEvents), {
    headers: {
      "content-type": "application/json",
    },
  });
};
