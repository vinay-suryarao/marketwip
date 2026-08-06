import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";

export async function getCustomCompanySummary(symbol: string): Promise<string | null> {
  try {
    const docRef = doc(getDb(), "company_about_overrides", symbol.toUpperCase());
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return (snapshot.data().summaryText as string) || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching custom company summary:", error);
    return null;
  }
}

export async function saveCustomCompanySummary(symbol: string, summaryText: string): Promise<void> {
  try {
    const docRef = doc(getDb(), "company_about_overrides", symbol.toUpperCase());
    await setDoc(docRef, {
      symbol: symbol.toUpperCase(),
      summaryText,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving custom company summary:", error);
    throw new Error("Failed to save custom summary information.");
  }
}

export async function deleteCustomCompanySummary(symbol: string): Promise<void> {
  try {
    const docRef = doc(getDb(), "company_about_overrides", symbol.toUpperCase());
    await updateDoc(docRef, {
      summaryText: deleteField(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting custom company summary:", error);
    throw new Error("Failed to delete custom summary information.");
  }
}
