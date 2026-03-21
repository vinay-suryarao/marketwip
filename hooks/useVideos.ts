"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { MarketVideo } from "@/types/video";

export function useVideos() {
  const [videos, setVideos] = useState<MarketVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videosQuery = query(collection(getDb(), "videos"), orderBy("createdAt", "desc"), limit(100));

    const unsubscribe = onSnapshot(
      videosQuery,
      (snapshot) => {
        const items = snapshot.docs.map((videoDoc) => {
          const data = videoDoc.data() as Omit<MarketVideo, "id">;
          return { id: videoDoc.id, ...data };
        });
        setVideos(items);
        setIsLoading(false);
      },
      () => {
        setVideos([]);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { videos, isLoading };
}
