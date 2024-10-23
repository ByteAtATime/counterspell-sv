import { app } from "./server";
import { getFirestore } from "firebase-admin/firestore";
import {
  type UserExperience,
  userExperienceSchema,
} from "@lib/firebase/types.ts";

const firestore = getFirestore(app);
const experienceCollection = firestore.collection("experience");

export const getAllUsersExperience = async (): Promise<UserExperience[]> => {
  const snapshot = await experienceCollection.get();
  return snapshot.docs.map((doc) =>
    userExperienceSchema.parse({ ...doc.data(), id: doc.id }),
  );
};

export const grantUserExperience = async (
  userId: string,
  amount: number,
  reason: string,
) => {
  const userDoc = experienceCollection.doc(userId);
  const userDocSnapshot = await userDoc.get();
  const userDocData = userDocSnapshot.data();
  if (userDocData) {
    const history = userDocData.history as {
      xp: number;
      timestamp: Date;
      reason: string;
    }[];
    history.push({
      xp: amount,
      timestamp: new Date(),
      reason,
    });
    await userDoc.set({ xp: userDocData.xp + amount, history });
  } else {
    const history = [
      {
        xp: amount,
        timestamp: new Date(),
        reason,
      },
    ];
    await userDoc.set({ xp: amount, history });
  }
};
