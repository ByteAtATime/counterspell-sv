import type { APIRoute } from "astro";
import { createHunt } from "@lib/firebase/hunt.ts";

export const POST: APIRoute = async (context) => {
  const user = await context.locals.currentUser();
  if (!user?.publicMetadata.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const huntData = await context.request.json();
  const huntId = await createHunt(huntData);

  return new Response(JSON.stringify({ id: huntId }), { status: 201 });
};