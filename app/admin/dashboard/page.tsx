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
      <main className="mx-auto w-full max-w-300 flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10">
        {prompt ? <PromptToast message={prompt.message} tone={prompt.tone} /> : null}

        <section className="relative overflow-hidden rounded-2xl border border-[#d8e2f5] bg-[#ffffff] p-5 shadow-2xl sm:rounded-3xl sm:p-7">
          {/* Glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#2e7ac9] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d8e2f5] pb-5 relative z-10">
            <div>
              <h1 className="bg-linear-to-r from-[#102550] to-[#2d86cc] bg-clip-text text-3xl font-extrabold font-display text-transparent sm:text-4xl">Central Dashboard</h1>
              <p className="mt-2 text-sm text-[#6074a0] font-medium">Manage market posts, edit updates, and keep stock feeds current.</p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
              <Link href="/admin/fii-dii">
                <button className="rounded-xl border border-[#d8e2f5] bg-[#f6f9ff] px-5 py-2.5 text-sm font-bold tracking-wide text-[#2e7ac9] transition hover:bg-[#d8e2f5] hover:text-[#173462]">
                  FII/DII Activity
                </button>
              </Link>
              <Link href="/admin/ipo-dashboard">
                <button className="rounded-xl border border-[#d8e2f5] bg-[#f6f9ff] px-5 py-2.5 text-sm font-bold tracking-wide text-[#2e7ac9] transition hover:bg-[#d8e2f5] hover:text-[#173462]">
                  IPO Dashboard
                </button>
              </Link>
              <Link href="/admin/create-post">
                <button className="rounded-xl bg-[#2e7ac9] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(67,83,255,0.4)] transition hover:bg-[#3e8ed6] active:scale-95">
                  Add News Post
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3 relative z-10">
            <div className="rounded-2xl border border-[#d8e2f5] bg-[#f6f9ff]/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2e7ac9]">Total Posts</p>
              <p className="mt-1.5 text-3xl font-extrabold font-display text-[#173462]">{posts.length}</p>
            </div>
            <div className="rounded-2xl border border-[#d8e2f5] bg-[#f6f9ff]/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2e7ac9]">Latest Category</p>
              <p className="mt-1.5 text-lg font-bold text-[#173462]">{posts[0]?.category ?? "N/A"}</p>
            </div>
            <div className="rounded-2xl border border-[#d8e2f5] bg-[#f6f9ff]/50 p-5 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2e7ac9]">Recent Post Date</p>
              <p className="mt-1.5 text-lg font-bold text-[#173462]">
                {posts[0] ? new Date(posts[0].createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
        </section>

        <section className="relative mt-8 overflow-hidden rounded-2xl border border-[#d8e2f5] bg-[#ffffff] shadow-2xl sm:rounded-4xl">
          <div className="border-b border-[#d8e2f5] bg-[#f6f9ff]/50 px-7 py-5">
            <h2 className="text-xl font-bold font-display text-[#173462]">Manage Market News</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#ffffff]">
              <thead className="bg-[#f6f9ff]/50 backdrop-blur-md border-b border-[#d8e2f5]">
                <tr>
                  <th className="px-7 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-[#6074a0]">Title</th>
                  <th className="px-7 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-[#6074a0]">Category</th>
                  <th className="px-7 py-4 text-left text-[11px] font-bold uppercase tracking-widest text-[#6074a0]">Date</th>
                  <th className="px-7 py-4 text-center text-[11px] font-bold uppercase tracking-widest text-[#6074a0]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[15px] text-[#173462]">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id} className="border-b border-[#d8e2f5] transition hover:bg-[#d8e2f5]/40">
                      <td className="px-7 py-5 font-semibold">{post.title}</td>
                      <td className="px-7 py-5">
                        <span className="rounded-full bg-[#d8e2f5] px-3 py-1 text-xs font-bold text-[#2e7ac9]">{post.category}</span>
                      </td>
                      <td className="px-7 py-5 text-[#6074a0]">{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td className="px-7 py-5 text-center">
                        <Link href={`/admin/edit-post/${post.slug}`}>
                          <button className="mr-3 rounded-lg border border-[#d8e2f5] bg-[#f6f9ff] px-4 py-2 text-xs font-bold text-[#2e7ac9] transition hover:bg-[#d8e2f5]">
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
                    <td colSpan={4} className="py-10 text-center font-medium text-[#6074a0]">
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
