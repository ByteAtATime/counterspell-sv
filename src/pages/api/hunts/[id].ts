import { createHunt, getHunt } from "@lib/firebase/hunt";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const { id } = context.params;

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const shouldIncludeLocation =
    !!context.url.searchParams.get("includeLocation");

  if (shouldIncludeLocation) {
    const user = await context.locals.currentUser();
    if (!user?.publicMetadata.isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const hunt = await getHunt(id, shouldIncludeLocation);

  if (!hunt) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(JSON.stringify(hunt), { status: 200 });
};
