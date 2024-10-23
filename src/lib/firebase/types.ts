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
