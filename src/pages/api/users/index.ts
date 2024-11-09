import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { displayUser } from "@lib/users/utils.ts";

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

  const processedData = users.data.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    primaryEmail: user.emailAddresses && user.emailAddresses.length > 0 ? user.emailAddresses[0].emailAddress : null,
    displayName: displayUser(user),
    imageUrl: user.imageUrl,
  }));


  return new Response(JSON.stringify(processedData), { status: 200 });
}
