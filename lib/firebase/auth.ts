import {
  createUserWithEmailAndPassword,
  Auth,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { firebaseApp, hasFirebaseClientConfig } from "@/lib/firebase/firebaseConfig";

export let auth: Auth | null = null;

if (hasFirebaseClientConfig) {
  try {
    auth = getAuth(firebaseApp);
  } catch {
    auth = null;
  }
}

export async function signIn(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase auth is not configured. Add valid Firebase keys in .env.local");
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string) {
  if (!auth) {
    throw new Error("Firebase auth is not configured. Add valid Firebase keys in .env.local");
  }
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  if (!auth) {
    return;
  }
  return signOut(auth);
}

export async function sendPasswordResetLink(email: string) {
  if (!auth) {
    throw new Error("Firebase auth is not configured. Add valid Firebase keys in .env.local");
  }
  return sendPasswordResetEmail(auth, email);
}
