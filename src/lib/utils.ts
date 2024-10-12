import { Timestamp } from "firebase/firestore";
import { z } from "zod";

export const zodFirebaseTimestamp = z
  .string()
  .or(z.date())
  .or(z.custom<Timestamp>())
  .transform((value) => {
    if (typeof value === "object" && "seconds" in value) {
      return value.toDate();
    }

    return new Date(value);
  });
