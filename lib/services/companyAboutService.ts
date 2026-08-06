import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";

export async function getCustomCompanyAbout(symbol: string): Promise<string | null> {
  try {
    const docRef = doc(getDb(), "company_about_overrides", symbol.toUpperCase());
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data().aboutText as string;
    }
    return null;
  } catch (error) {
    console.error("Error fetching custom company about:", error);
    return null;
  }
}

export async function saveCustomCompanyAbout(symbol: string, aboutText: string): Promise<void> {
  try {
    const docRef = doc(getDb(), "company_about_overrides", symbol.toUpperCase());
    await setDoc(docRef, {
      symbol: symbol.toUpperCase(),
      aboutText,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving custom company about:", error);
    throw new Error("Failed to save custom about information.");
  }
}
