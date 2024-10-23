import { getAllUsersExperience } from "$lib/lib/firebase/xp";
import type { APIRoute } from "astro";

export const LEADERBOARD_SIZE = 2;

/** Gets the experience of the top LEADERBOARD_SIZE users */
export const GET: APIRoute = async (context) => {
  const user = await context.locals.currentUser();

  const isAdmin = user?.publicMetadata.isAdmin;

  const experiences = await getAllUsersExperience();
  const sortedExperiences = experiences.sort((a, b) => b.xp - a.xp);
  const topExperiences = isAdmin
    ? sortedExperiences
    : sortedExperiences.slice(0, LEADERBOARD_SIZE);
  return new Response(JSON.stringify(topExperiences), { status: 200 });
};
