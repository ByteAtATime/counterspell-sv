import type { APIRoute } from "astro";
import { createHunt } from "@lib/firebase/hunt.ts";
import { huntSchema } from "$lib/lib/firebase/types";

export const POST: APIRoute = async (context) => {
  const user = await context.locals.currentUser();
  if (!user?.publicMetadata.isAdmin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const huntData = await context.request.json();
  const parsedHuntData = huntSchema.omit({ id: true }).safeParse(huntData);
  if (!parsedHuntData.success) {
    return new Response(JSON.stringify(parsedHuntData.error), { status: 400 });
  }
  const huntId = await createHunt(parsedHuntData.data);

  return new Response(JSON.stringify({ id: huntId }), { status: 201 });
};