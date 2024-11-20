import type { User } from "@clerk/astro/server";

export const displayUser = (user: User, withEmail: boolean = true): string => {
  const emailAddon = withEmail
    ? ` (${user.emailAddresses[0].emailAddress})`
    : "";
  const userEmail = user.emailAddresses[0].emailAddress;
  if (user.fullName) return `${user.fullName}${emailAddon}`;
  if (user.username) return `${user.username}${emailAddon}`;
  if (user.firstName) return `${user.firstName}${emailAddon}`;

  if (userEmail) return userEmail;
  return "Unknown user (no name)";
};

export const generateFoodId = (user: User) => {
  const email = user.emailAddresses[0].emailAddress;

  if (!email) {
    throw new Error("Invalid email input");
  }

  // Calculate the sum of ASCII values of all characters in the email
  const asciiSum = email
    .split("") // Split the email into individual characters
    .map((char) => char.charCodeAt(0)) // Get ASCII value of each character
    .reduce((sum, ascii) => sum + ascii, 0); // Sum up all ASCII values

  // Generate a four-digit hash using modulo 10000
  const hash = asciiSum % 10000;

  // Format the result as a four-digit string (pad with leading zeros if necessary)
  return hash.toString().padStart(4, "0");
};
