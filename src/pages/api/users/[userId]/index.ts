import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { displayUser } from "@lib/users/utils";

// sending public data
export const GET: APIRoute = async (context) => {
  const { userId } = context.params;

  if (!userId) {
    return new Response("User ID is required", { status: 400 });
  }

  const client = clerkClient(context);
  const user = await client.users.getUser(userId).catch(() => null);

  if (!user) return new Response("User not found", { status: 404 });

  const response = {
    displayName: displayUser(user),
  };

  return new Response(JSON.stringify(response), { status: 200 });
};
