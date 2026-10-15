"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { GovPolicyRecord } from "@/types/govPolicy";

const COLLECTION_NAME = "govPolicies";

export function useGovPolicies() {
  const [policies, setPolicies] = useState<GovPolicyRecord[]>([]);
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
            department: item.data().department ?? "",
            headline: item.data().headline ?? "",
            description: item.data().description ?? "",
            sector: item.data().sector ?? "",
            pibReference: item.data().pibReference ?? "",
            createdAt: item.data().createdAt ?? "",
            updatedAt: item.data().updatedAt ?? "",
          })) as GovPolicyRecord[];

          setPolicies(items);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error reading gov policies:", error);
          setPolicies([]);
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
      console.error("Error initializing gov policies hook:", error);
      setPolicies([]);
      setIsLoading(false);
      return () => undefined;
    }
  }, []);

  return { policies, isLoading };
}
