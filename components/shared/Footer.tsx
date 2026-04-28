import Link from "next/link";
import Script from "next/script";
import BrandLogo from "@/components/shared/BrandLogo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-[#2a3f7a] bg-[#0d1a47] text-[#c8d7f8] shadow-[0_-12px_32px_rgba(4,9,30,0.4)]">
      <section className="mx-auto grid w-full max-w-310 gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 md:px-8 md:py-12">
        <div>
          <div className="mb-4">
            <BrandLogo className="h-16 w-16 object-cover scale-225" textClassName="text-2xl sm:text-3xl" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#b9caef]">
            Stay ahead with market updates, watchlist-driven insights, and clean dashboards designed for fast decisions.
          </p>
        </div>

        <div className="md:pl-10">
          <h4 className="mb-5 text-lg font-bold text-white">Quick Links</h4>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm font-semibold md:block md:space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link className="text-[#d7e4ff] transition-colors hover:text-[#8fdfff]" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-lg font-bold text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-[#c3d2f3]">
            <li className="rounded-lg border border-[#2f4683] bg-[#13245d] px-3 py-2">marketwip1@gmail.com</li>
            <li className="rounded-lg border border-[#2f4683] bg-[#13245d] px-3 py-2">Kalyan, Maharashtra</li>
            <li className="rounded-lg border border-[#2f4683] bg-[#13245d] px-3 py-2">Support response within 24h</li>
          </ul>
        </div>
      </section>

      <div className="border-t border-[#2a3f7a] py-6 text-center text-sm font-semibold text-[#c8d7f8]">
        <p>© {new Date().getFullYear()} Market W.I.P. All rights reserved.</p>
        <Link href="/privacy-policy" className="mt-2 inline-block text-[#8fdfff] transition-colors hover:text-white">
          Privacy Policy
        </Link>
      </div>

      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-93RL5XKD6E');`}
      </Script>
    </footer>
  );
}
