import { Firestore, getFirestore } from "firebase/firestore";
import { firebaseApp, hasFirebaseClientConfig } from "@/lib/firebase/firebaseConfig";

let dbInstance: Firestore | null = null;

export function getDb() {
	if (!hasFirebaseClientConfig) {
		throw new Error("Firebase firestore is not configured. Add valid Firebase keys in .env.local");
	}

	if (!dbInstance) {
		dbInstance = getFirestore(firebaseApp);
	}

	return dbInstance;
}
