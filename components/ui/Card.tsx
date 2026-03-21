import { PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-[#1A2552] bg-[#0A102E] p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#4353FF]/50 hover:shadow-[0_20px_40px_rgba(67,83,255,0.15)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      <div className="relative z-10 flex h-full flex-col">
        {children}
      </div>
    </article>
  );
}
