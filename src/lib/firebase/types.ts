import { z } from "zod";
import { zodFirebaseTimestamp } from "@lib/utils.ts";

export const userExperienceSchema = z.object({
  id: z.string(),
  xp: z.number(),
  history: z.array(
    z.object({
      xp: z.number(),
      timestamp: zodFirebaseTimestamp,
      reason: z.string(),
    }),
  ),
});
export type UserExperience = z.infer<typeof userExperienceSchema>;

export const userMetadataSchema = z.object({
  eventsAttended: z.array(z.string()).default([]),
  prizesRedeemed: z.array(z.string()).default([]),
  isAdmin: z.boolean().default(false),
});
export type UserMetadata = z.infer<typeof userMetadataSchema>;

export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  xp: z.number().default(0),
});
export type Event = z.infer<typeof eventSchema>;

export const prizeSchema = z.object({
  id: z.string(),
  name: z.string(),
  cost: z.number(),
  stock: z.number(),
  imageUrl: z.string(),
  description: z.string(),
});

export type Prize = z.infer<typeof prizeSchema>;
