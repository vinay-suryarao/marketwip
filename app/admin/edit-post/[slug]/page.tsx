'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getPostBySlug, updatePost } from '@/lib/services/postService';
import { NewsPost } from '@/types/post';
import AdminPostForm from '@/components/admin/AdminPostForm';
import AdminGate from '@/components/auth/AdminGate';
import PromptToast from '@/components/ui/PromptToast';
import { useTimedPrompt } from '@/hooks/useTimedPrompt';
import { toFriendlyAppErrorMessage } from '@/lib/helpers/userFacingError';

function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const [post, setPost] = useState<NewsPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setError('Post slug is missing.');
      return;
    }

    async function fetchPost() {
      try {
        const fetchedPost = await getPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post data.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  const handleUpdatePost = async (formData: FormData) => {
    if (!post) return;

    try {
      clearPrompt();
      // The AdminPostForm already handles image upload and returns the URL.
      // We just need to pass the form data to the update function.
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      const stockTag = formData.get('stockTag') as string;
      const category = formData.get('category') as string;
      const imageUrl = formData.get('imageUrl') as string;

      await updatePost(post.slug, {
        title,
        content,
        stockTag,
        category,
        imageUrl,
      });

      showPrompt('Post updated successfully.', 'success');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Error updating post:', err);
      showPrompt(toFriendlyAppErrorMessage(err, 'Failed to update post. Please try again.'), 'error');
    }
  };

  if (isLoading) {
    return <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">Loading post...</main>;
  }

  return (
    <AdminGate>
      <main className="mx-auto w-full max-w-[1200px] px-6 py-10 md:px-8">
        {error ? <PromptToast message={error} tone="error" /> : null}

        <div className="rounded-[2rem] border border-[#1A2552] bg-[#0A102E] p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-[#00F0FF] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#1A2552] pb-5 relative z-10">
            <div>
              <h1 className="text-3xl font-extrabold font-display text-white">Edit Post</h1>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-[#8B95A5]">Update content and keep your feed accurate.</p>
            </div>
            <Link
              href="/admin/dashboard"
              className="rounded-xl border border-[#1A2552] bg-[#060B19]/50 px-5 py-2.5 text-sm font-bold tracking-wide text-[#8B95A5] transition hover:bg-[#1A2552] hover:text-white"
            >
              Back to Dashboard
            </Link>
          </div>

          {post ? (
            <AdminPostForm
              onSubmit={handleUpdatePost}
              initialData={post}
              submitButtonText="Update Post"
            />
          ) : (
            <div className="py-10 text-center font-medium text-[#8B95A5]">Post data could not be loaded.</div>
          )}
        </div>

        {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}
      </main>
    </AdminGate>
  );
}

export default EditPostPage;
