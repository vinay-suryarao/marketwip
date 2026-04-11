import { useState, useEffect } from "react";
import { getDb } from "@/lib/firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { FIIDIIActivity } from "@/lib/services/fiiDiiService";

export function useFIIDII() {
  const [data, setData] = useState<FIIDIIActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const db = getDb();
      const unsubscribe = onSnapshot(
        doc(db, "fiiDiiActivity", "latest"),
        (snapshot) => {
          if (snapshot.exists()) {
            setData({
              id: snapshot.id,
              ...snapshot.data(),
            } as FIIDIIActivity);
          } else {
            setData(null);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching FII/DII data:", error);
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error initializing FII/DII hook:", error);
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading };
}
