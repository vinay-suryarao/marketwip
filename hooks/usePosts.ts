"use client";

import { useEffect, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { NewsPost } from "@/types/post";

export function usePosts() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const postsQuery = query(collection(getDb(), "posts"), orderBy("createdAt", "desc"), limit(50));

    const unsubscribe = onSnapshot(
      postsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((postDoc) => {
          const data = postDoc.data() as Omit<NewsPost, "id">;
          return { id: postDoc.id, ...data };
        });
        setPosts(items);
        setIsLoading(false);
      },
      () => {
        setPosts([]);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { posts, isLoading };
}
