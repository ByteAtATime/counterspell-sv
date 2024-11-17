import type { APIRoute } from "astro";
import { getUserExperience } from "@lib/firebase/xp.ts";
import { displayUser } from "@lib/users/utils.ts";

export const GET: APIRoute = async ({ params, locals }) => {
  const user = await locals.currentUser();

  const isAdmin = user?.publicMetadata.isAdmin;

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { userId } = params;

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters" }),
      { status: 400 },
    );
  }

  const userData = {
    xp: await getUserExperience(userId),
    displayName: displayUser(user),
  };

  return new Response(JSON.stringify(userData), { status: 200 });
}
