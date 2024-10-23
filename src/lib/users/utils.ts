import type { User } from "@clerk/astro/server";

export const displayUser = (user: User): string => {
  const userEmail = user.emailAddresses[0].emailAddress;
  if (user.fullName) return `${user.fullName} (${userEmail})`;
  if (user.username) return `${user.username} (${userEmail})`;
  if (user.firstName) return `${user.firstName} (${userEmail})`;

  return userEmail;
};
