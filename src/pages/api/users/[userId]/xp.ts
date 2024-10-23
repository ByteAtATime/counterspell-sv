import { grantUserExperience } from "@lib/firebase/xp";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request, locals }) => {
  const user = await locals.currentUser();

  const isAdmin = user?.publicMetadata.isAdmin;

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { userId } = params;
  const { amount, reason } = await request.json();

  if (!userId || !amount || !reason) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters" }),
      { status: 400 },
    );
  }

  await grantUserExperience(userId, amount, reason);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
