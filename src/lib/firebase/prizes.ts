import { firestore } from "@lib/firebase/server.ts";
import { prizeSchema } from "@lib/firebase/types.ts";

const prizesCollection = firestore.collection("prizes");

export const getAllPrizes = async () => {
  const snapshot = await prizesCollection.get();
  return snapshot.docs.map((doc) =>
    prizeSchema.parse({ ...doc.data(), id: doc.id }),
  );
};

export const buyPrize = async (prizeId: string, userId: string) => {
  const prize = await prizesCollection.doc(prizeId).get();

  const prizeData = prize.data();
  if (!prize.exists || !prizeData) {
    throw new Error("Prize not found");
  }

  if (prizeData.stock <= 0) {
    throw new Error("Prize out of stock");
  }

  const user = await firestore.collection("experience").doc(userId).get();
  const userData = user.data();
  if (!user.exists || !userData) {
    throw new Error("User not found");
  }

  if (userData.xp < prizeData.cost) {
    throw new Error("Not enough XP");
  }

  await firestore.runTransaction(async (transaction) => {
    transaction.update(prizesCollection.doc(prizeId), {
      stock: prizeData.stock - 1,
    });
    transaction.update(firestore.collection("experience").doc(userId), {
      xp: userData.xp - prizeData.cost,
    });
    transaction.update(firestore.collection("experience").doc(userId), {
      history: [
        ...userData.history,
        {
          xp: -prizeData.cost,
          timestamp: new Date(),
          reason: `Bought prize: ${prizeData.name}`,
        },
      ],
    });
  });
};
