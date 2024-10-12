import { getAllUsersExperience } from "$lib/lib/firebase/xp";

export const LEADERBOARD_SIZE = 2;

/** Gets the experience of the top LEADERBOARD_SIZE users */
export const GET = async () => {
  const experiences = await getAllUsersExperience();
  const sortedExperiences = experiences.sort((a, b) => b.xp - a.xp);
  const topExperiences = sortedExperiences.slice(0, LEADERBOARD_SIZE);
  return new Response(JSON.stringify(topExperiences), { status: 200 });
};
