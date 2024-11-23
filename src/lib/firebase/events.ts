import { firestore } from "@lib/firebase/server.ts";
import { eventSchema } from "@lib/firebase/types.ts";

import type { Event } from "@lib/firebase/types.ts";

const eventsCollection = firestore.collection('events');

export const getAllEvents = async (): Promise<Event[]> => {
  const snapshot = await eventsCollection.get();
  return snapshot.docs.map((doc) => eventSchema.parse({ ...doc.data(), id: doc.id }));
}

export const getEvent = async (eventId: string): Promise<Event | null> => {
  const doc = await eventsCollection.doc(eventId).get();
  return doc.exists ? eventSchema.parse({ ...doc.data(), id: doc.id }) : null;
}
