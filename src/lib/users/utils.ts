import type { User } from "@clerk/astro/server";

export const displayUser = (user: User, withEmail: boolean = true): string => {
  const emailAddon = withEmail ? ` (${user.emailAddresses[0].emailAddress})` : "";
  const userEmail = user.emailAddresses[0].emailAddress;
  if (user.fullName) return `${user.fullName}${emailAddon}`;
  if (user.username) return `${user.username}${emailAddon}`;
  if (user.firstName) return `${user.firstName}${emailAddon}`;

  if (userEmail) return userEmail;
  return "Unknown user (no name)";
};
