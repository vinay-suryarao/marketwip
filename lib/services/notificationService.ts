import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import type { NewsPost } from "@/types/post";

type NotifyResult = {
  targetedUserIds: string[];
  createdNotifications: number;
};

function getUsersCollection() {
  return collection(getDb(), "users");
}

function getNotificationsCollection() {
  return collection(getDb(), "notifications");
}

export async function notifyUsersByTag(post: NewsPost): Promise<NotifyResult> {
  const usersSnapshot = await getDocs(
    query(getUsersCollection(), where("wishlist", "array-contains", post.stockTag)),
  );

  const targetedUserIds: string[] = [];
  let createdNotifications = 0;

  for (const userDoc of usersSnapshot.docs) {
    targetedUserIds.push(userDoc.id);
    await addDoc(getNotificationsCollection(), {
      userId: userDoc.id,
      postId: post.id,
      postSlug: post.slug,
      stockTag: post.stockTag,
      title: `New update for ${post.stockTag}`,
      body: post.title,
      read: false,
      createdAt: new Date().toISOString(),
    });
    createdNotifications += 1;
  }

  return { targetedUserIds, createdNotifications };
}
