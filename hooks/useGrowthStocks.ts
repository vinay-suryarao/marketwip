"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { GrowthStockRecord } from "@/types/growthStock";

const COLLECTION_NAME = "growthStocks";

export function useGrowthStocks() {
  const [stocks, setStocks] = useState<GrowthStockRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(getDb(), COLLECTION_NAME), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((item) => ({
            id: item.id,
            dateOfPost: item.data().dateOfPost ?? "",
            company: item.data().company ?? "",
            sector: item.data().sector ?? "",
            pe: item.data().pe ?? "",
            growthFactors: item.data().growthFactors ?? [],
            description: item.data().description ?? "",
            createdAt: item.data().createdAt ?? "",
            updatedAt: item.data().updatedAt ?? "",
          })) as GrowthStockRecord[];

          setStocks(items);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error reading growth stocks:", error);
          setStocks([]);
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
      console.error("Error initializing growth stocks hook:", error);
      setStocks([]);
      setIsLoading(false);
      return () => undefined;
    }
  }, []);

  return { stocks, isLoading };
}
