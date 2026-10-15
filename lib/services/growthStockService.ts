import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { GrowthStockRecord, GrowthStockRow } from "@/types/growthStock";

const COLLECTION_NAME = "growthStocks";

function cleanText(value: string) {
  return value.trim();
}

function normalizeRow(row: GrowthStockRow): GrowthStockRow {
  return {
    dateOfPost: cleanText(row.dateOfPost),
    company: cleanText(row.company),
    sector: cleanText(row.sector),
    pe: cleanText(row.pe),
    growthFactors: row.growthFactors.map((f) => cleanText(f)).filter((f) => f.length > 0),
    description: cleanText(row.description),
  };
}

function isFilled(row: GrowthStockRow) {
  return row.company.trim().length > 0;
}

export async function createGrowthStock(input: GrowthStockRow): Promise<GrowthStockRecord> {
  const db = getDb();
  const nowIso = new Date().toISOString();
  const row = normalizeRow(input);

  if (!isFilled(row)) {
    throw new Error("Please fill company name before posting.");
  }

  const id = `growth-${Date.now()}`;
  await setDoc(doc(db, COLLECTION_NAME, id), {
    ...row,
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  return { id, ...row, createdAt: nowIso, updatedAt: nowIso };
}

export async function updateGrowthStock(id: string, input: GrowthStockRow) {
  const row = normalizeRow(input);
  await updateDoc(doc(getDb(), COLLECTION_NAME, id), {
    ...row,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteGrowthStock(id: string) {
  await deleteDoc(doc(getDb(), COLLECTION_NAME, id));
}

export async function getGrowthStocks(): Promise<GrowthStockRecord[]> {
  const db = getDb();
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({
    id: item.id,
    dateOfPost: item.data().dateOfPost ?? "",
    company: item.data().company ?? "",
    sector: item.data().sector ?? "",
    pe: item.data().pe ?? "",
    growthFactors: item.data().growthFactors ?? [],
    description: item.data().description ?? "",
    createdAt: item.data().createdAt ?? "",
    updatedAt: item.data().updatedAt ?? "",
  }));
}
