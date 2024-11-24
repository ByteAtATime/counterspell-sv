import { firestore } from "./server";
import type { Hunt } from "./types";
import { grantUserExperience } from "./xp";

const huntsCollection = firestore.collection("hunts");

export const createHunt = async (hunt: Omit<Hunt, "id">): Promise<string> => {
  const newDoc = await huntsCollection.add(hunt);

  return newDoc.id;
};

export const getHunt = async (
  id: string,
  includeLocation: boolean,
): Promise<Hunt | undefined> => {
  const huntDoc = await huntsCollection.doc(id).get();

  if (!huntDoc.exists) {
    return undefined;
  }

  if (!includeLocation) {
    const { location, ...huntData } = huntDoc.data()!;
    return { id: huntDoc.id, ...huntData } as Hunt;
  }

  return { id: huntDoc.id, ...huntDoc.data() } as Hunt;
};

export const claimHunt = async (id: string, userId: string): Promise<void> => {
    const huntDoc = huntsCollection.doc(id);
    const hunt = await huntDoc.get();
    
    if (!hunt.exists) {
        throw new Error("Hunt not found");
    }
    
    const { xpAmount: xp } = hunt.data()!;
    
    await grantUserExperience(userId, "Scavenger Hunt", xp, "Scavenger Hunt");
    
    await huntDoc.update({ isActive: false, claimedBy: userId });
}
