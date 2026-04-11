'use client';

import React from 'react';
import FIIDIIActivityForm from '@/components/admin/FIIDIIActivityForm';
import AdminGate from '@/components/auth/AdminGate';
import Link from 'next/link';

function AdminFIIDIIPage() {
  return (
    <AdminGate>
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-[#1A2552] bg-[#0A102E] p-5 shadow-2xl sm:rounded-3xl sm:p-7 mb-8">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#4353FF] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div>
              <h1 className="bg-gradient-to-r from-white to-[#00F0FF] bg-clip-text text-3xl font-extrabold font-display text-transparent sm:text-4xl">
                FII/DII Activity
              </h1>
              <p className="mt-2 text-sm text-[#8B95A5] font-medium">
                Update daily FII and DII cash market activity data.
              </p>
            </div>
            <Link href="/admin/dashboard">
              <button className="rounded-xl border border-[#1A2552] bg-[#060B19] px-5 py-2.5 text-sm font-bold tracking-wide text-[#00F0FF] transition hover:bg-[#1A2552] hover:text-white">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </section>

        {/* Form */}
        <FIIDIIActivityForm />
      </main>
    </AdminGate>
  );
}

export default AdminFIIDIIPage;
