import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import { slugify } from "@/lib/helpers/slugify";
import type { CreatePostInput } from "@/types/post";

type PublishResult = {
  postId: string;
  targetedUsers: number;
  emailsSent: number;
};

export async function publishAdminNews(input: CreatePostInput): Promise<PublishResult> {
  const slug = slugify(`${input.title}-${Date.now()}`);

  const createdPostRef = await addDoc(collection(getDb(), "posts"), {
    ...input,
    stockTag: input.stockTag.toUpperCase(),
    slug,
    createdAt: new Date().toISOString(),
  });

  const usersSnapshot = await getDocs(
    query(collection(getDb(), "users"), where("wishlist", "array-contains", input.stockTag.toUpperCase())),
  );

  let targetedUsers = 0;
  const recipientEmails: string[] = [];

  for (const userDoc of usersSnapshot.docs) {
    const data = userDoc.data() as { email?: string };
    if (data.email) {
      recipientEmails.push(data.email);
    }
    targetedUsers += 1;
  }

  let emailsSent = 0;
  if (recipientEmails.length > 0) {
    const emailResponse = await fetch("/api/notifications/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients: recipientEmails,
        title: input.title,
        stockTag: input.stockTag.toUpperCase(),
        postSlug: slug,
      }),
    });

    if (emailResponse.ok) {
      const payload = (await emailResponse.json()) as { sentCount?: number };
      emailsSent = payload.sentCount ?? 0;
    }
  }

  return {
    postId: createdPostRef.id,
    targetedUsers,
    emailsSent,
  };
}
