import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { UserProfile } from "@/types/user";

function getUsersCollection() {
  return collection(getDb(), "users");
}

export async function upsertUserProfile(userId: string, payload: Partial<UserProfile>) {
  const ref = doc(getUsersCollection(), userId);
  const snapshot = await getDoc(ref);
  const normalizedEmail = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : undefined;
  const nextPayload: Partial<UserProfile> = {
    ...payload,
    ...(normalizedEmail ? { email: normalizedEmail } : {}),
  };

  if (!snapshot.exists()) {
    await setDoc(ref, {
      uid: userId,
      wishlist: [],
      updatedAt: new Date().toISOString(),
      ...nextPayload,
    });
    return;
  }

  await setDoc(
    ref,
    {
      updatedAt: new Date().toISOString(),
      ...nextPayload,
    },
    { merge: true },
  );
}

export async function addWishlistTag(userId: string, tag: string) {
  const ref = doc(getUsersCollection(), userId);
  await updateDoc(ref, {
    wishlist: arrayUnion(tag),
    updatedAt: new Date().toISOString(),
  });
}

export async function removeWishlistTag(userId: string, tag: string) {
  const ref = doc(getUsersCollection(), userId);
  await updateDoc(ref, {
    wishlist: arrayRemove(tag),
    updatedAt: new Date().toISOString(),
  });
}

export async function isUserEmailRegistered(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const q = query(getUsersCollection(), where("email", "==", normalizedEmail), limit(1));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}
