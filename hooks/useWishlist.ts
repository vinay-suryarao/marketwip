"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import { addWishlistTag, removeWishlistTag, upsertUserProfile } from "@/lib/services/userService";

export function useWishlist(userId?: string) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const ref = doc(getDb(), "users", userId);
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (!snapshot.exists()) {
        setWishlist([]);
        return;
      }
      const data = snapshot.data() as { wishlist?: string[] };
      setWishlist(data.wishlist ?? []);
    });

    return unsubscribe;
  }, [userId]);

  const addTag = async (tag: string) => {
    if (!userId) return;
    setIsLoading(true);
    await upsertUserProfile(userId, {});
    await addWishlistTag(userId, tag);
    setIsLoading(false);
  };

  const removeTag = async (tag: string) => {
    if (!userId) return;
    setIsLoading(true);
    await removeWishlistTag(userId, tag);
    setIsLoading(false);
  };

  return { wishlist: userId ? wishlist : [], addTag, removeTag, isLoading };
}
