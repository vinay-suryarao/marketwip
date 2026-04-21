import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { CompanyResultInput } from "@/types/result";

const RESULTS_COLLECTION = "fiiDiiActivity";
const RESULT_PREFIX = "result-company-";

function cleanText(value: string) {
  return value.trim();
}

function cleanMetricRow(row: CompanyResultInput["sales"]) {
  return {
    yoy: cleanText(row.yoy),
    qoq: cleanText(row.qoq),
    month1: cleanText(row.month1),
    month2: cleanText(row.month2),
    month3: cleanText(row.month3),
  };
}

function normalizeInput(input: CompanyResultInput): CompanyResultInput {
  return {
    companyName: cleanText(input.companyName),
    marketCap: cleanText(input.marketCap),
    monthLabel1: cleanText(input.monthLabel1),
    monthLabel2: cleanText(input.monthLabel2),
    monthLabel3: cleanText(input.monthLabel3),
    sales: cleanMetricRow(input.sales),
    netProfit: cleanMetricRow(input.netProfit),
    eps: cleanMetricRow(input.eps),
    auditPoints: input.auditPoints.map(cleanText).filter(Boolean),
    crux: cleanText(input.crux),
  };
}

function hasData(input: CompanyResultInput) {
  if (input.companyName || input.marketCap || input.crux) {
    return true;
  }

  if (input.monthLabel1 || input.monthLabel2 || input.monthLabel3) {
    return true;
  }

  if (input.auditPoints.some(Boolean)) {
    return true;
  }

  const rows = [input.sales, input.netProfit, input.eps];
  return rows.some((row) => row.yoy || row.qoq || row.month1 || row.month2 || row.month3);
}

export async function createCompanyResult(input: CompanyResultInput) {
  const normalized = normalizeInput(input);

  if (!hasData(normalized)) {
    throw new Error("Please fill at least one field before adding a company result.");
  }

  const nowIso = new Date().toISOString();
  const id = `${RESULT_PREFIX}${Date.now()}`;
  await setDoc(doc(getDb(), RESULTS_COLLECTION, id), {
    ...normalized,
    createdAt: nowIso,
    updatedAt: nowIso,
  });
}

export async function updateCompanyResult(id: string, input: CompanyResultInput) {
  const normalized = normalizeInput(input);
  await updateDoc(doc(getDb(), RESULTS_COLLECTION, id), {
    ...normalized,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteCompanyResult(id: string) {
  await deleteDoc(doc(getDb(), RESULTS_COLLECTION, id));
}
