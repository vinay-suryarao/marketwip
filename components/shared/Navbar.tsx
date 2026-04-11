"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutUser } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";

const LogoComponent = ({ textClassName = "text-xl" }: { textClassName?: string }) => (
  <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
    <div className="relative w-[38px] h-[30px] flex-shrink-0">
      {/* Monitor outline */}
      <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 w-full h-full">
        <rect x="2" y="3" width="20" height="15" rx="2" />
        <path d="M7 22h10" />
        <path d="M12 18v4" />
      </svg>
      {/* Charts inside Monitor */}
      <div className="absolute inset-x-2 bottom-3 flex items-end justify-between h-[10px] px-0.5">
        <div className="w-[4px] h-1.5 bg-[#8B22FF] rounded-sm"></div>
        <div className="w-[4px] h-2.5 bg-[#00F0FF] rounded-sm"></div>
        <div className="w-[4px] h-1 bg-[#34E0A1] rounded-sm"></div>
      </div>
      {/* Rupee Coin */}
      <div className="absolute left-[3px] top-[4px] w-4 h-4 bg-[#F3A623] rounded-full flex items-center justify-center shadow-sm">
        <span className="text-[10px] font-extrabold text-[#1A2552] leading-none ml-[0.5px]">₹</span>
      </div>
      {/* Trend Arrow */}
      <svg viewBox="0 0 24 24" fill="none" stroke="#F3A623" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[-5px] right-[-5px] w-6 h-6">
        <path d="M4 14l6-6 4 4 6-6" />
        <path d="M15 6h5v5" />
      </svg>
    </div>
    <span className={`text-white font-extrabold font-display tracking-tight whitespace-nowrap ${textClassName}`}>Market W.I.P</span>
  </div>
);



const links = [
  { href: "/", label: "Home" },
  { href: "/news", label: "Market News" },
  { href: "/about", label: "About Us" },
  { href: "/videos", label: "Videos" },
];

const tickerItems = [
  "NIFTY LIVE • Market sentiment updates every hour",
  "SENSEX WATCH • Real-time stock movement coverage",
  "EARNINGS ALERT • Track company results and guidance",
  "GLOBAL MARKETS • US, EU, and Asia impact on Indian stocks",
];

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = isAdmin
    ? [...links, { href: "/admin/dashboard", label: "Admin Dashboard" }]
    : user
      ? [...links, { href: "/dashboard", label: "Dashboard" }]
      : links;

  return (
    <header className="sticky top-0 z-50 border-b border-[#1A2552] bg-[#060B19]/80 shadow-sm backdrop-blur-xl">
      <div className="ticker-window border-b border-[#1A2552] bg-[#0A102E]/90 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-[#00F0FF]/90">
        <div className="ticker-track">
          {tickerItems.concat(tickerItems).map((item, index) => (
            <span key={`${item}-${index}`} className="inline-block">
              {item}
            </span>
          ))}
        </div>
      </div>

      <nav className="mx-auto w-full max-w-[1200px] px-4 py-3 md:px-8 md:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <LogoComponent textClassName="text-lg sm:text-[22px]" />
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#1A2552] bg-[#0A102E] text-white transition hover:border-[#4353FF] md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <span className="text-lg leading-none">{isMobileMenuOpen ? "×" : "≡"}</span>
          </button>

          <div className="hidden items-center gap-3 md:flex md:gap-6">
          <ul className="hidden items-center gap-6 text-[15px] font-bold text-[#8B95A5] md:flex">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <li key={link.href}>
                  <Link
                    className={`transition-all ${active
                        ? "text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                        : "hover:text-white"
                      }`}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                  {active && (
                    <div className="h-0.5 w-full bg-[#00F0FF] mt-1.5 rounded-full shadow-[0_0_10px_#00F0FF]"></div>
                  )}
                  {!active && (
                    <div className="h-0.5 w-full bg-transparent mt-1.5"></div>
                  )}
                </li>
              );
            })}
          </ul>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 hover:border-white/40"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-full bg-[#4353FF] px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(67,83,255,0.4)] transition hover:scale-105 active:scale-95 border border-[#4353FF] hover:bg-[#5C6EFF] hover:border-[#5C6EFF]"
                href="/signup"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {!isAdmin ? (
                <Link
                  className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 hover:border-white/40"
                  href="/wishlist"
                >
                  Wishlist
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => signOutUser()}
                className="rounded-full bg-[#4353FF] px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(67,83,255,0.4)] transition hover:scale-105 active:scale-95 border border-[#4353FF] hover:bg-[#5C6EFF]"
              >
                Logout
              </button>
            </div>
          )}
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={`mobile-chip-${link.href}`}
                href={link.href}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition ${
                  active
                    ? "border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF]"
                    : "border-[#1A2552] bg-[#0A102E] text-[#8B95A5] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-3 space-y-2 rounded-2xl border border-[#1A2552] bg-[#0A102E]/95 p-3 md:hidden">
            {!user ? (
              <>
                <Link
                  className="block rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                  href="/login"
                >
                  Login
                </Link>
                <Link
                  className="block rounded-xl border border-[#4353FF] bg-[#4353FF] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#5C6EFF]"
                  href="/signup"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {!isAdmin ? (
                  <Link
                    className="block rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                    href="/wishlist"
                  >
                    Wishlist
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="block w-full rounded-xl border border-[#4353FF] bg-[#4353FF] px-4 py-2.5 text-left text-sm font-bold text-white transition hover:bg-[#5C6EFF]"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        ) : null}
      </nav>
    </header>
  );
}
