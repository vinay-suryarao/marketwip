import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type {
  ActiveUpcomingIPORecord,
  ActiveUpcomingIPORow,
  RecentIPORecord,
  RecentIPORow,
} from "@/types/ipo";

const IPO_COLLECTION = "fiiDiiActivity";
const IPO_ROW_LIMIT = 10;
const ACTIVE_PREFIX = "ipo-active-";
const RECENT_PREFIX = "ipo-recent-";

function cleanText(value: string) {
  return value.trim();
}

function normalizeActiveRow(row: ActiveUpcomingIPORow): ActiveUpcomingIPORow {
  return {
    ipoName: cleanText(row.ipoName),
    priceBand: cleanText(row.priceBand),
    dates: cleanText(row.dates),
    minInvest: cleanText(row.minInvest),
    gmp: cleanText(row.gmp),
    type: cleanText(row.type),
    pe: cleanText(row.pe),
    salesFy2324: cleanText(row.salesFy2324),
    salesFy2425: cleanText(row.salesFy2425),
    salesFy2526: cleanText(row.salesFy2526),
    netProfitFy2324: cleanText(row.netProfitFy2324),
    netProfitFy2425: cleanText(row.netProfitFy2425),
    netProfitFy2526: cleanText(row.netProfitFy2526),
    qibSub: cleanText(row.qibSub),
    retailSub: cleanText(row.retailSub),
    hniSub: cleanText(row.hniSub),
    totalSub: cleanText(row.totalSub),
    allotDate: cleanText(row.allotDate),
    refundDate: cleanText(row.refundDate),
  };
}

function normalizeRecentRow(row: RecentIPORow): RecentIPORow {
  return {
    ipoName: cleanText(row.ipoName),
    priceBand: cleanText(row.priceBand),
    listingPrice: cleanText(row.listingPrice),
    listingGain: cleanText(row.listingGain),
    anchorLockIn50: cleanText(row.anchorLockIn50),
    anchorLockIn100: cleanText(row.anchorLockIn100),
    preIpoLockIn: cleanText(row.preIpoLockIn),
  };
}

function isFilled(values: string[]) {
  return values.some((value) => value.trim().length > 0);
}

function toActiveRecord(id: string, data: DocumentData): ActiveUpcomingIPORecord {
  return {
    id,
    ipoName: data.ipoName ?? "",
    priceBand: data.priceBand ?? "",
    dates: data.dates ?? "",
    minInvest: data.minInvest ?? "",
    gmp: data.gmp ?? "",
    type: data.type ?? "",
    pe: data.pe ?? "",
    salesFy2324: data.salesFy2324 ?? "",
    salesFy2425: data.salesFy2425 ?? "",
    salesFy2526: data.salesFy2526 ?? "",
    netProfitFy2324: data.netProfitFy2324 ?? "",
    netProfitFy2425: data.netProfitFy2425 ?? "",
    netProfitFy2526: data.netProfitFy2526 ?? "",
    qibSub: data.qibSub ?? "",
    retailSub: data.retailSub ?? "",
    hniSub: data.hniSub ?? "",
    totalSub: data.totalSub ?? "",
    allotDate: data.allotDate ?? "",
    refundDate: data.refundDate ?? "",
    createdAt: data.createdAt ?? "",
    updatedAt: data.updatedAt ?? "",
  };
}

function toRecentRecord(id: string, data: DocumentData): RecentIPORecord {
  return {
    id,
    ipoName: data.ipoName ?? "",
    priceBand: data.priceBand ?? "",
    listingPrice: data.listingPrice ?? "",
    listingGain: data.listingGain ?? "",
    anchorLockIn50: data.anchorLockIn50 ?? "",
    anchorLockIn100: data.anchorLockIn100 ?? "",
    preIpoLockIn: data.preIpoLockIn ?? "",
    createdAt: data.createdAt ?? "",
    updatedAt: data.updatedAt ?? "",
  };
}

async function getIpoDocs(prefix: string) {
  const db = getDb();
  const snapshot = await getDocs(query(collection(db, IPO_COLLECTION), orderBy("createdAt", "desc")));
  return snapshot.docs.filter((item) => item.id.startsWith(prefix));
}

async function cleanupRows(prefix: string) {
  const docs = await getIpoDocs(prefix);
  if (docs.length <= IPO_ROW_LIMIT) {
    return;
  }

  const oldDocs = docs.slice(IPO_ROW_LIMIT);
  const db = getDb();
  const batch = writeBatch(db);
  oldDocs.forEach((item) => batch.delete(item.ref));
  await batch.commit();
}

export async function createActiveUpcomingRow(input: ActiveUpcomingIPORow): Promise<ActiveUpcomingIPORecord> {
  const db = getDb();
  const nowIso = new Date().toISOString();
  const row = normalizeActiveRow(input);

  if (!isFilled(Object.values(row))) {
    throw new Error("Please fill at least one field before posting Active/Upcoming IPO row.");
  }

  const id = `${ACTIVE_PREFIX}${Date.now()}`;
  await setDoc(doc(db, IPO_COLLECTION, id), {
    ...row,
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  await cleanupRows(ACTIVE_PREFIX);

  return {
    id,
    ...row,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export async function createRecentIpoRow(input: RecentIPORow): Promise<RecentIPORecord> {
  const db = getDb();
  const nowIso = new Date().toISOString();
  const row = normalizeRecentRow(input);

  if (!isFilled(Object.values(row))) {
    throw new Error("Please fill at least one field before posting Recent IPO row.");
  }

  const id = `${RECENT_PREFIX}${Date.now()}`;
  await setDoc(doc(db, IPO_COLLECTION, id), {
    ...row,
    createdAt: nowIso,
    updatedAt: nowIso,
  });

  await cleanupRows(RECENT_PREFIX);

  return {
    id,
    ...row,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export async function updateActiveUpcomingRow(id: string, input: ActiveUpcomingIPORow) {
  const row = normalizeActiveRow(input);
  await updateDoc(doc(getDb(), IPO_COLLECTION, id), {
    ...row,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateRecentIpoRow(id: string, input: RecentIPORow) {
  const row = normalizeRecentRow(input);
  await updateDoc(doc(getDb(), IPO_COLLECTION, id), {
    ...row,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteIpoRow(id: string) {
  await deleteDoc(doc(getDb(), IPO_COLLECTION, id));
}

export async function getActiveUpcomingRows(): Promise<ActiveUpcomingIPORecord[]> {
  const docs = await getIpoDocs(ACTIVE_PREFIX);
  return docs.map((item) => toActiveRecord(item.id, item.data()));
}

export async function getRecentIpoRows(): Promise<RecentIPORecord[]> {
  const docs = await getIpoDocs(RECENT_PREFIX);
  return docs.map((item) => toRecentRecord(item.id, item.data()));
}
