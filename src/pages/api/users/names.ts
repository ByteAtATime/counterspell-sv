import { displayUser } from "@lib/users/utils";
import { clerkClient } from "@clerk/astro/server";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const client = clerkClient(context);

  const userIds = context.url.searchParams.get("userIds")?.split(",") ?? [];

  const users = await client.users.getUserList({ userId: userIds, limit: 25 });

  const usernames = Object.fromEntries(
    users.data.map((user) => [user.id, displayUser(user, false)]),
  );

  return new Response(JSON.stringify(usernames), { status: 200 });
};
