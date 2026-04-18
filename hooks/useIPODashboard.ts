"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { IPODashboardSnapshot } from "@/types/ipo";

const IPO_COLLECTION = "fiiDiiActivity";
const IPO_DOC_PREFIX = "ipo-dashboard-";

export function useIPODashboard() {
  const [latest, setLatest] = useState<IPODashboardSnapshot | null>(null);
  const [history, setHistory] = useState<IPODashboardSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Read a wider window and then filter namespaced IPO docs on client.
      const q = query(collection(getDb(), IPO_COLLECTION), orderBy("updatedAt", "desc"), limit(50));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const rows = snapshot.docs
            .filter((item) => item.id.startsWith(IPO_DOC_PREFIX))
            .map((item) => ({
              id: item.id,
              ...item.data(),
            })) as IPODashboardSnapshot[];

          setHistory(rows.slice(0, 10));
          setLatest(rows[0] ?? null);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error reading IPO dashboard data:", error);
          setLatest(null);
          setHistory([]);
          setIsLoading(false);
        },
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error initializing IPO dashboard hook:", error);
      setLatest(null);
      setHistory([]);
      setIsLoading(false);
      return () => undefined;
    }
  }, []);

  return { latest, history, isLoading };
}
