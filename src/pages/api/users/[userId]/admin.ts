import type { APIRoute } from "astro";
import { getUserExperience } from "@lib/firebase/xp.ts";
import { displayUser } from "@lib/users/utils.ts";
import { clerkClient } from "@clerk/astro/server";

export const GET: APIRoute = async (context) => {
  const user = await context.locals.currentUser();

  const isAdmin = user?.publicMetadata.isAdmin;

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { userId } = context.params;

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters" }),
      { status: 400 },
    );
  }

  const client = clerkClient(context);
  const requestUser = await client.users.getUser(userId);

  const userData = {
    xp: await getUserExperience(userId),
    displayName: displayUser(requestUser),
  };

  return new Response(JSON.stringify(userData), { status: 200 });
};
