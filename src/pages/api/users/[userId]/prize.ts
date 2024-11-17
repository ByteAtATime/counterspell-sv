import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { userMetadataSchema } from "@lib/firebase/types.ts";
import { buyPrize } from "@lib/firebase/prizes.ts";

export const POST: APIRoute = async (context) => {
  const sender = await context.locals.currentUser();

  const isAdmin = sender?.publicMetadata.isAdmin;

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { userId } = context.params;

  const prizeId = context.url.searchParams.get("prizeId");

  if (!prizeId || !userId) {
    return new Response("Missing required params", { status: 400 });
  }

  const client = clerkClient(context);
  const user = await client.users.getUser(userId);

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  try {
    await buyPrize(prizeId, userId);
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  const metadata = userMetadataSchema.parse(user.publicMetadata);
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...metadata,
      prizesRedeemed: [...metadata.prizesRedeemed, prizeId],
    },
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "content-type": "application/json",
    },
  });
}