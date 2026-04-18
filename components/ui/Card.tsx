import { PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#d8e2f5] bg-white p-6 shadow-[0_10px_24px_rgba(24,58,120,0.09)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b6c8ef] hover:shadow-[0_16px_30px_rgba(24,58,120,0.14)]">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#56b8ff]/8 via-transparent to-[#f3c85e]/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative z-10 flex h-full flex-col">
        {children}
      </div>
    </article>
  );
}
