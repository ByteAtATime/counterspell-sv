import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";

export const GET: APIRoute = async (context) => {
  const user = await context.locals.currentUser();

  const isAdmin = user?.publicMetadata.isAdmin;

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Fetch all users

  const client = clerkClient(context);
  const users = await client.users.getUserList({ limit: 500 });

  return new Response(JSON.stringify(users), { status: 200 });
}
