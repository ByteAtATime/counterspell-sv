import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { displayUser } from "@lib/users/utils";
import { getUserExperience } from "@lib/firebase/xp.ts";
import { getAllEvents } from "@lib/firebase/events.ts";
import { userMetadataSchema } from "@lib/firebase/types.ts";
import { GET as GET_prizes } from "../../prizes.ts";

// sending public data
export const GET: APIRoute = async (context) => {
  const { userId } = context.params;

  if (!userId) {
    return new Response("User ID is required", { status: 400 });
  }

  const client = clerkClient(context);
  const user = await client.users.getUser(userId).catch(() => null);

  if (!user) return new Response("User not found", { status: 404 });

  if (user.publicMetadata.isAdmin || userId === user.id) {
    const allEvents = await getAllEvents();
    const eventsAttended = userMetadataSchema.parse(user.publicMetadata).eventsAttended;

    const attendedEvents = allEvents.map((event) => {
      return {
        ...event,
        attended: eventsAttended.includes(event.id)
      }
    })

    const prizeIds: string[] = user.publicMetadata.prizesRedeemed as string[];

    const prizes = await Promise.resolve(GET_prizes(context)).then((res) => res.json());

    const response = {
      displayName: displayUser(user, false),
      avatar: user.imageUrl,
      xp: await getUserExperience(userId),
      prizes: prizeIds?.map((prizeId) => prizes.find((prize: {id: string}) => prize.id === prizeId)) ?? [],
      attendedEvents
    }

    return new Response(JSON.stringify(response), { status: 200 });
  }

  const response = {
    displayName: displayUser(user),
  };

  return new Response(JSON.stringify(response), { status: 200 });
};
