import { getDb } from "@/lib/firebase/firestore";
import { doc, setDoc, getDoc, DocumentSnapshot } from "firebase/firestore";

export interface FIIDIIActivity {
  id: string;
  fiiCashMarket: number;
  diiCashMarket: number;
  date: string;
  updatedAt: string;
}

const FII_DII_DOC = "latest"; // Single document that gets updated

export async function updateFIIDIIActivity(
  fiiValue: number,
  diiValue: number
): Promise<FIIDIIActivity> {
  const timestamp = new Date().toISOString();
  const db = getDb();

  const data = {
    fiiCashMarket: fiiValue,
    diiCashMarket: diiValue,
    date: timestamp,
    updatedAt: timestamp,
  };

  await setDoc(doc(db, "fiiDiiActivity", FII_DII_DOC), data, { merge: false });

  return {
    id: FII_DII_DOC,
    ...data,
  };
}

export async function getFIIDIIActivity(): Promise<FIIDIIActivity | null> {
  const db = getDb();
  const docRef = doc(db, "fiiDiiActivity", FII_DII_DOC);
  const docSnap: DocumentSnapshot = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as FIIDIIActivity;
  }

  return null;
}
