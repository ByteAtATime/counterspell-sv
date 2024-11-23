import type { APIRoute } from "astro";
import { getAllEvents } from "@lib/firebase/events.ts";

export const GET: APIRoute = async (context) => {
  const user = await context.locals.currentUser();

  const isAdmin = user?.publicMetadata.isAdmin;

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const events = await getAllEvents();

  return new Response(JSON.stringify(events), {
    headers: {
      "content-type": "application/json",
    },
  });
};
