import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type {
  ActiveUpcomingIPORow,
  IPODashboardInput,
  IPODashboardSnapshot,
  RecentIPORow,
} from "@/types/ipo";

const IPO_DASHBOARD_COLLECTION = "fiiDiiActivity";
const IPO_HISTORY_LIMIT = 10;
const IPO_DOC_PREFIX = "ipo-dashboard-";
const IPO_KIND = "ipoDashboard";

function cleanText(value: string) {
  return value.trim();
}

function normalizeActiveUpcoming(rows: ActiveUpcomingIPORow[]) {
  return rows
    .map((row) => ({
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
    }))
    .filter((row) => Object.values(row).some((value) => value.length > 0));
}

function normalizeRecentIpos(rows: RecentIPORow[]) {
  return rows
    .map((row) => ({
      ipoName: cleanText(row.ipoName),
      priceBand: cleanText(row.priceBand),
      listingPrice: cleanText(row.listingPrice),
      listingGain: cleanText(row.listingGain),
      anchorLockIn50: cleanText(row.anchorLockIn50),
      anchorLockIn100: cleanText(row.anchorLockIn100),
      preIpoLockIn: cleanText(row.preIpoLockIn),
    }))
    .filter((row) => Object.values(row).some((value) => value.length > 0));
}

async function cleanupOldIpoSnapshots() {
  const db = getDb();
  const historyRef = collection(db, IPO_DASHBOARD_COLLECTION);
  const snapshot = await getDocs(query(historyRef, orderBy("updatedAt", "desc")));

  const ipoDocs = snapshot.docs.filter((item) => item.id.startsWith(IPO_DOC_PREFIX));

  if (ipoDocs.length <= IPO_HISTORY_LIMIT) {
    return;
  }

  const oldDocs = ipoDocs.slice(IPO_HISTORY_LIMIT);
  const batch = writeBatch(db);
  oldDocs.forEach((item) => {
    batch.delete(item.ref);
  });
  await batch.commit();
}

export async function upsertIPODashboardData(input: IPODashboardInput): Promise<IPODashboardSnapshot> {
  const db = getDb();
  const now = new Date();
  const nowIso = now.toISOString();
  const dayKey = `${IPO_DOC_PREFIX}${nowIso.slice(0, 10)}`;

  const activeUpcoming = normalizeActiveUpcoming(input.activeUpcoming);
  const recentIpos = normalizeRecentIpos(input.recentIpos);

  await setDoc(
    doc(db, IPO_DASHBOARD_COLLECTION, dayKey),
    {
      kind: IPO_KIND,
      updatedAt: nowIso,
      activeUpcoming,
      recentIpos,
    },
    { merge: false },
  );

  await cleanupOldIpoSnapshots();

  return {
    id: dayKey,
    updatedAt: nowIso,
    activeUpcoming,
    recentIpos,
  };
}
