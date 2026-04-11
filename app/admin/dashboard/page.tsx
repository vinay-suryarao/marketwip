'use client';

import React from 'react';
import { usePosts } from '@/hooks/usePosts';
import { deletePost } from '@/lib/services/postService';
import Link from 'next/link';
import AdminGate from '@/components/auth/AdminGate';
import PromptToast from '@/components/ui/PromptToast';
import { useTimedPrompt } from '@/hooks/useTimedPrompt';
import { toFriendlyAppErrorMessage } from '@/lib/helpers/userFacingError';

function AdminDashboardPage() {
  const { posts, isLoading } = usePosts();
  const { prompt, showPrompt, clearPrompt } = useTimedPrompt(4000);

  const handleDelete = async (postId: string, postTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the post "${postTitle}"?`)) {
      try {
        clearPrompt();
        await deletePost(postId);
        showPrompt('Post deleted successfully.', 'success');
      } catch (err) {
        console.error('Error deleting post:', err);
        showPrompt(toFriendlyAppErrorMessage(err, 'Failed to delete post. Please try again.'), 'error');
      }
    }
  };

  if (isLoading) {
    return <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">Loading posts...</main>;
  }

  return (
    <AdminGate>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10">
        {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

        <section className="relative overflow-hidden rounded-2xl border border-[#1A2552] bg-[#0A102E] p-5 shadow-2xl sm:rounded-3xl sm:p-7">
          {/* Glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#4353FF] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1A2552] pb-5 relative z-10">
            <div>
              <h1 className="bg-gradient-to-r from-white to-[#00F0FF] bg-clip-text text-3xl font-extrabold font-display text-transparent sm:text-4xl">Central Dashboard</h1>
              <p className="mt-2 text-sm text-[#8B95A5] font-medium">Manage market posts, edit updates, and keep stock feeds current.</p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
              <Link href="/admin/fii-dii">
                <button className="rounded-xl border border-[#1A2552] bg-[#060B19] px-5 py-2.5 text-sm font-bold tracking-wide text-[#00F0FF] transition hover:bg-[#1A2552] hover:text-white">
                  FII/DII Activity
                </button>
              </Link>
              <Link href="/admin/videos">
                <button className="rounded-xl border border-[#1A2552] bg-[#060B19] px-5 py-2.5 text-sm font-bold tracking-wide text-[#00F0FF] transition hover:bg-[#1A2552] hover:text-white">
                  Manage Videos
                </button>
              </Link>
              <Link href="/admin/create-post">
                <button className="rounded-xl bg-[#4353FF] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(67,83,255,0.4)] transition hover:bg-[#5C6EFF] active:scale-95">
                  Add News Post
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3 relative z-10">
            <div className="rounded-2xl border border-[#1A2552] bg-[#060B19]/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#00F0FF]">Total Posts</p>
              <p className="mt-1.5 text-3xl font-extrabold font-display text-white">{posts.length}</p>
            </div>
            <div className="rounded-2xl border border-[#1A2552] bg-[#060B19]/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#00F0FF]">Latest Category</p>
              <p className="mt-1.5 text-lg font-bold text-white">{posts[0]?.category ?? "N/A"}</p>
            </div>
            <div className="rounded-2xl border border-[#1A2552] bg-[#060B19]/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#00F0FF]">Recent Post Date</p>
              <p className="mt-1.5 text-lg font-bold text-white">
                {posts[0] ? new Date(posts[0].createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </section>

        <section className="relative mt-8 overflow-hidden rounded-2xl border border-[#1A2552] bg-[#0A102E] shadow-2xl sm:rounded-[2rem]">
          <div className="border-b border-[#1A2552] bg-[#060B19]/50 px-7 py-5">
            <h2 className="text-xl font-bold font-display text-white">Manage Market News</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#0A102E]">
              <thead className="bg-[#060B19]/50 backdrop-blur-md border-b border-[#1A2552]">
                <tr>
                  <th className="px-7 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-[#8B95A5]">Title</th>
                  <th className="px-7 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-[#8B95A5]">Category</th>
                  <th className="px-7 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-[#8B95A5]">Date</th>
                  <th className="px-7 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-[#8B95A5]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-white text-[15px]">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id} className="border-b border-[#1A2552] transition hover:bg-[#1A2552]/40">
                      <td className="px-7 py-5 font-semibold">{post.title}</td>
                      <td className="px-7 py-5">
                        <span className="rounded-full bg-[#1A2552] px-3 py-1 text-xs font-bold text-[#34E0A1]">{post.category}</span>
                      </td>
                      <td className="px-7 py-5 text-[#8B95A5]">{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td className="px-7 py-5 text-center">
                        <Link href={`/admin/edit-post/${post.slug}`}>
                          <button className="mr-3 rounded-lg border border-[#1A2552] bg-[#060B19] px-4 py-2 text-xs font-bold text-[#00F0FF] transition hover:bg-[#1A2552]">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="rounded-lg bg-[#FF5B79]/10 border border-[#FF5B79]/50 px-4 py-2 text-xs font-bold text-[#FF5B79] transition hover:bg-[#FF5B79] hover:text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center font-medium text-[#8B95A5]">
                      No posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AdminGate>
  );
}

export default AdminDashboardPage;
