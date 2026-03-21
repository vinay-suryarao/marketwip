import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/firestore";
import { slugify } from "@/lib/helpers/slugify";
import type { CreatePostInput, NewsPost } from "@/types/post";
import { NEWS_CATEGORIES } from "@/constants/newsCategories";

function getPostsCollection() {
  return collection(getDb(), "posts");
}

export async function getAllPosts(): Promise<NewsPost[]> {
  try {
    const snapshot = await getDocs(query(getPostsCollection(), orderBy("createdAt", "desc"), limit(24)));
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<NewsPost, "id">;
      return { id: doc.id, ...data };
    });
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const snapshot = await getDocs(query(getPostsCollection(), where("slug", "==", slug), limit(1)));
    const first = snapshot.docs[0];
    if (!first) return null;
    return { id: first.id, ...(first.data() as Omit<NewsPost, "id">) };
  } catch {
    return null;
  }
}

export async function createPost(input: CreatePostInput) {
  const slug = slugify(`${input.title}-${Date.now()}`);
  const validCategory =
    NEWS_CATEGORIES.find((category) => category.value === input.category)?.value ?? "other";

  const docRef = await addDoc(getPostsCollection(), {
    ...input,
    category: validCategory,
    slug,
    createdAt: new Date().toISOString(),
  });

  return { id: docRef.id, slug };
}

export async function deletePost(postId: string): Promise<void> {
  const postRef = doc(getDb(), "posts", postId);
  await deleteDoc(postRef);
}

export async function updatePost(slug: string, input: Partial<CreatePostInput>): Promise<void> {
  const post = await getPostBySlug(slug);
  if (!post) {
    throw new Error("Post not found");
  }

  const postRef = doc(getDb(), "posts", post.id);

  const newSlug = input.title ? slugify(`${input.title}-${Date.now()}`) : slug;
  const validCategory = input.category
    ? NEWS_CATEGORIES.find((category) => category.value === input.category)?.value ?? post.category
    : undefined;
  const normalizedTag = input.stockTag ? input.stockTag.toUpperCase() : undefined;

  await updateDoc(postRef, {
    ...input,
    ...(validCategory ? { category: validCategory } : {}),
    ...(normalizedTag ? { stockTag: normalizedTag } : {}),
    slug: newSlug,
  });
}
