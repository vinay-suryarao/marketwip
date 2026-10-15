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
import type { GovPolicyRecord, GovPolicyRow } from "@/types/govPolicy";

const COLLECTION_NAME = "govPolicies";

function cleanText(value: string) {
  return value.trim();
}

function normalizeRow(row: GovPolicyRow): GovPolicyRow {
  return {
    dateOfPost: cleanText(row.dateOfPost),
    department: cleanText(row.department),
    headline: cleanText(row.headline),
    description: cleanText(row.description),
    sector: cleanText(row.sector),
    pibReference: cleanText(row.pibReference),
  };
}

function isFilled(row: GovPolicyRow) {
  return row.headline.trim().length > 0;
}

export async function createGovPolicy(input: GovPolicyRow): Promise<GovPolicyRecord> {
  const db = getDb();
  const nowIso = new Date().toISOString();
  const row = normalizeRow(input);

  if (!isFilled(row)) {
    throw new Error("Please fill headline before posting.");
  }

  const id = `policy-${Date.now()}`;
  await setDoc(doc(db, COLLECTION_NAME, id), {
    ...row,
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  return { id, ...row, createdAt: nowIso, updatedAt: nowIso };
}

export async function updateGovPolicy(id: string, input: GovPolicyRow) {
  const row = normalizeRow(input);
  await updateDoc(doc(getDb(), COLLECTION_NAME, id), {
    ...row,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteGovPolicy(id: string) {
  await deleteDoc(doc(getDb(), COLLECTION_NAME, id));
}

export async function getGovPolicies(): Promise<GovPolicyRecord[]> {
  const db = getDb();
  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({
    id: item.id,
    dateOfPost: item.data().dateOfPost ?? "",
    department: item.data().department ?? "",
    headline: item.data().headline ?? "",
    description: item.data().description ?? "",
    sector: item.data().sector ?? "",
    pibReference: item.data().pibReference ?? "",
    createdAt: item.data().createdAt ?? "",
    updatedAt: item.data().updatedAt ?? "",
  }));
}
