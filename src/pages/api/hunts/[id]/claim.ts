import { claimHunt, getHunt } from "@lib/firebase/hunt";
import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
    // claim a hunt
    const user = await context.locals.currentUser();

    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = context.params;

    if (!id) {
        return new Response("Not Found", { status: 404 });
    }

    await claimHunt(id, user.id);
    
    return new Response("Claimed", { status: 200 });
}
