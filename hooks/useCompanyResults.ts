"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { CompanyResultRecord } from "@/types/result";

const RESULTS_COLLECTION = "fiiDiiActivity";
const RESULT_PREFIX = "result-company-";

export function useCompanyResults() {
  const [results, setResults] = useState<CompanyResultRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(getDb(), RESULTS_COLLECTION), orderBy("updatedAt", "desc"), limit(300));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setResults(
            snapshot.docs
              .filter((item) => item.id.startsWith(RESULT_PREFIX))
              .map((item) => ({
                id: item.id,
                ...item.data(),
              })) as CompanyResultRecord[],
          );
          setIsLoading(false);
        },
        (error) => {
          console.error("Error reading company results:", error);
          setResults([]);
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
      console.error("Error initializing company results hook:", error);
      setResults([]);
      setIsLoading(false);
      return () => undefined;
    }
  }, []);

  return { results, isLoading };
}
