import type { APIRoute } from "astro";
import { getAllPrizes } from "@lib/firebase/prizes.ts";

export const GET: APIRoute = async (context) => {
  const prizes = await getAllPrizes();

  return new Response(JSON.stringify(prizes), {
    headers: {
      "content-type": "application/json",
    },
  });
}
