"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutUser } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import BrandLogo from "@/components/shared/BrandLogo";
import LiveMarketTicker from "@/components/shared/LiveMarketTicker";

const links = [
  { href: "/", label: "Home" },
  { href: "/economic-calendar", label: "Economic Calendar" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/ipo-dashboard", label: "IPO Dashboard" },
];

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = isAdmin
    ? [...links, { href: "/admin/dashboard", label: "Admin" }]
    : user
      ? [...links, { href: "/dashboard", label: "Dashboard" }]
      : links;

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a3f7a] bg-[#0d1a47]/95 shadow-[0_14px_32px_rgba(5,11,34,0.45)] backdrop-blur-md">
      <div className="ticker-window border-b border-[#2a3f7a] bg-[#101f50] px-2.5 py-1.5 text-[10px] font-medium tracking-[0.09em] text-[#8fd9ff]">
        <LiveMarketTicker />
      </div>

      <nav className="mx-auto w-full max-w-310 px-4 py-3 md:px-8">
        <div className="flex items-center gap-4 md:gap-5">
          <Link href="/" className="mt-2 shrink-0">
            <BrandLogo className="h-12 w-12 object-cover scale-225" textClassName="text-2xl sm:text-3xl" priority />
          </Link>

          <ul className="hidden flex-1 items-center gap-1 md:flex lg:gap-2">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <li key={link.href}>
                  <Link
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition lg:px-3.5 ${
                      active
                        ? "bg-[#1a3172] text-[#8fe1ff]"
                        : "text-[#d8e4ff] hover:bg-[#142a63] hover:text-white"
                    }`}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            {!user ? (
              <>
                <Link
                  className="rounded-lg border border-[#3a518f] bg-[#13255c] px-4 py-2 text-sm font-semibold text-[#dce8ff] transition hover:border-[#5270ba] hover:bg-[#19306f]"
                  href="/login"
                >
                  Login
                </Link>
                <Link
                  className="rounded-lg border border-[#f3cb67] bg-[#e9b742] px-4 py-2 text-sm font-bold text-[#13204a] transition hover:bg-[#f2c95f]"
                  href="/signup"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {!isAdmin ? (
                  <Link
                    className="rounded-lg border border-[#3a518f] bg-[#13255c] px-4 py-2 text-sm font-semibold text-[#dce8ff] transition hover:border-[#5270ba] hover:bg-[#19306f]"
                    href="/wishlist"
                  >
                    Wishlist
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="rounded-lg border border-[#f3cb67] bg-[#e9b742] px-4 py-2 text-sm font-bold text-[#13204a] transition hover:bg-[#f2c95f]"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#3a518f] bg-[#13255c] text-white transition hover:bg-[#1a3172] md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            <span className="text-lg leading-none">{isMobileMenuOpen ? "×" : "≡"}</span>
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="mt-3 rounded-xl border border-[#2a3f7a] bg-[#101f50] p-3 md:hidden">
            <ul className="space-y-1.5">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <li key={`mobile-${link.href}`}>
                    <Link
                      href={link.href}
                      className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-[#1a3172] text-[#8fe1ff]"
                          : "text-[#d8e4ff] hover:bg-[#142a63] hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-3 border-t border-[#2a3f7a] pt-3">
              {!user ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    className="rounded-lg border border-[#3a518f] bg-[#13255c] px-4 py-2 text-center text-sm font-semibold text-[#dce8ff]"
                    href="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="rounded-lg border border-[#f3cb67] bg-[#e9b742] px-4 py-2 text-center text-sm font-bold text-[#13204a]"
                    href="/signup"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {!isAdmin ? (
                    <Link
                      className="block rounded-lg border border-[#3a518f] bg-[#13255c] px-4 py-2 text-center text-sm font-semibold text-[#dce8ff]"
                      href="/wishlist"
                    >
                      Wishlist
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => signOutUser()}
                    className="block w-full rounded-lg border border-[#f3cb67] bg-[#e9b742] px-4 py-2 text-center text-sm font-bold text-[#13204a]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
