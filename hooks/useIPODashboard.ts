"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type {
  ActiveUpcomingIPORecord,
  IPODashboardData,
  RecentIPORecord,
} from "@/types/ipo";

const IPO_COLLECTION = "fiiDiiActivity";
const ACTIVE_PREFIX = "ipo-active-";
const RECENT_PREFIX = "ipo-recent-";
const IPO_LIMIT = 10;

export function useIPODashboard() {
  const [data, setData] = useState<IPODashboardData>({
    activeUpcoming: [],
    recentIpos: [],
    lastUpdatedAt: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(getDb(), IPO_COLLECTION), orderBy("updatedAt", "desc"), limit(200));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const activeUpcoming = snapshot.docs
            .filter((item) => item.id.startsWith(ACTIVE_PREFIX))
            .slice(0, IPO_LIMIT)
            .map((item) => ({
              id: item.id,
              ...item.data(),
            })) as ActiveUpcomingIPORecord[];

          const recentIpos = snapshot.docs
            .filter((item) => item.id.startsWith(RECENT_PREFIX))
            .slice(0, IPO_LIMIT)
            .map((item) => ({
              id: item.id,
              ...item.data(),
            })) as RecentIPORecord[];

          const latestUpdated = [
            activeUpcoming[0]?.updatedAt ?? null,
            recentIpos[0]?.updatedAt ?? null,
          ].filter(Boolean) as string[];

          setData({
            activeUpcoming,
            recentIpos,
            lastUpdatedAt: latestUpdated.length > 0 ? latestUpdated.sort((a, b) => b.localeCompare(a))[0] : null,
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error reading IPO dashboard data:", error);
          setData({ activeUpcoming: [], recentIpos: [], lastUpdatedAt: null });
          setIsLoading(false);
        },
      );

      return () => {
        try {
          unsubscribe();
        } catch {
          // Avoid crashing UI on Firestore internal watch cleanup errors.
        }
      };
    } catch (error) {
      console.error("Error initializing IPO dashboard hook:", error);
      setData({ activeUpcoming: [], recentIpos: [], lastUpdatedAt: null });
      setIsLoading(false);
      return () => undefined;
    }
  }, []);

  return { ...data, isLoading };
}
