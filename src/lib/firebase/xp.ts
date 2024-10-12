import { z } from "zod";
import { app } from "./server";
import { getFirestore } from "firebase-admin/firestore";
import { zodFirebaseTimestamp } from "../utils";

const userExperienceSchema = z.object({
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

const experienceCollection = getFirestore(app).collection("experience");

export const getAllUsersExperience = async (): Promise<UserExperience[]> => {
  const snapshot = await experienceCollection.get();
  return snapshot.docs.map((doc) =>
    userExperienceSchema.parse({ ...doc.data(), id: doc.id }),
  );
};
