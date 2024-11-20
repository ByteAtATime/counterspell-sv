import { app, firestore } from "./server";
import { getFirestore } from "firebase-admin/firestore";
import {
  type UserExperience,
  userExperienceSchema,
} from "@lib/firebase/types.ts";

const experienceCollection = firestore.collection("experience");

export const getAllUsersExperience = async (): Promise<UserExperience[]> => {
  const snapshot = await experienceCollection.get();
  return snapshot.docs.map((doc) =>
    userExperienceSchema.parse({ ...doc.data(), id: doc.id }),
  );
};

export const getUserExperience = async (userId: string): Promise<UserExperience|null> => {
  const doc = await experienceCollection.doc(userId).get();
  if (!doc.exists) return null;
  return userExperienceSchema.parse({ ...doc.data(), id: doc.id });
}

export const grantUserExperience = async (
  userId: string,
  author: string,
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
      author: string;
    }[];
    history.push({
      xp: amount,
      timestamp: new Date(),
      reason,
      author,
    });
    await userDoc.set({ xp: userDocData.xp + amount, history });
  } else {
    const history = [
      {
        xp: amount,
        timestamp: new Date(),
        reason,
        author,
      },
    ];
    await userDoc.set({ xp: amount, history });
  }

  // add to global xp, written at experience/cumulative
  const cumulativeDoc = experienceCollection.doc("cumulative");
  const cumulativeDocSnapshot = await cumulativeDoc.get();
  const cumulativeDocData = cumulativeDocSnapshot.data();
  if (!cumulativeDocData) {
    await cumulativeDoc.set({ xp: amount });
  } else {
    await cumulativeDoc.update({ xp: cumulativeDocData.xp + amount });
  }
};
