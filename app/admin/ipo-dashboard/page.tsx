"use client";

import Link from "next/link";
import AdminGate from "@/components/auth/AdminGate";
import IPODashboardForm from "@/components/admin/IPODashboardForm";

export default function AdminIPODashboardPage() {
  return (
    <AdminGate>
      <main className="mx-auto w-full max-w-300 flex-1 px-4 py-8 sm:px-6 md:px-8 md:py-10">
        <section className="relative mb-8 overflow-hidden rounded-2xl border border-[#d8e2f5] bg-[#ffffff] p-5 shadow-2xl sm:rounded-3xl sm:p-7">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2e7ac9] opacity-10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="bg-linear-to-r from-[#102550] to-[#2d86cc] bg-clip-text text-3xl font-extrabold font-display text-transparent sm:text-4xl">
                IPO Dashboard Update
              </h1>
              <p className="mt-2 text-sm font-medium text-[#6074a0]">
                Update active/upcoming and recent IPO tables. Latest publish reflects instantly on public IPO dashboard.
              </p>
            </div>
            <Link href="/admin/dashboard">
              <button className="rounded-xl border border-[#d8e2f5] bg-[#f6f9ff] px-5 py-2.5 text-sm font-bold tracking-wide text-[#2e7ac9] transition hover:bg-[#d8e2f5] hover:text-[#173462]">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </section>

        <IPODashboardForm />
      </main>
    </AdminGate>
  );
}
