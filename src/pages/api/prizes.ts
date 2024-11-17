import type { APIRoute } from "astro";
import { getAllPrizes } from "@lib/firebase/prizes.ts";

export const GET: APIRoute = async (context) => {
  const user = await context.locals.currentUser();
  const isAdmin = user?.publicMetadata.isAdmin;

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const prizes = await getAllPrizes();

  return new Response(JSON.stringify(prizes), {
    headers: {
      "content-type": "application/json",
    },
  });
}
