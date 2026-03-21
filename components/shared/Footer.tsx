import Link from "next/link";

const LogoComponent = ({ textClassName = "text-xl" }: { textClassName?: string }) => (
    <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="relative w-[48px] h-[38px] flex-shrink-0">
            {/* Monitor outline */}
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute inset-0 w-full h-full">
                 <rect x="2" y="3" width="20" height="15" rx="2" />
                 <path d="M7 22h10" />
                 <path d="M12 18v4" />
            </svg>
            {/* Charts inside Monitor */}
            <div className="absolute inset-x-2.5 bottom-3.5 flex items-end justify-between h-[12px] px-0.5">
                <div className="w-[5px] h-2 bg-[#8B22FF] rounded-sm"></div>
                <div className="w-[5px] h-3 bg-[#00F0FF] rounded-sm"></div>
                <div className="w-[5px] h-1.5 bg-[#34E0A1] rounded-sm"></div>
            </div>
            {/* Rupee Coin */}
            <div className="absolute left-[3px] top-[4px] w-5 h-5 bg-[#F3A623] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-[12px] font-extrabold text-[#1A2552] leading-none ml-[0.5px]">₹</span>
            </div>
            {/* Trend Arrow */}
            <svg viewBox="0 0 24 24" fill="none" stroke="#F3A623" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="absolute top-[-6px] right-[-6px] w-7 h-7">
                <path d="M4 14l6-6 4 4 6-6" />
                <path d="M15 6h5v5" />
            </svg>
        </div>
        <span className={`text-white font-extrabold font-display tracking-tight whitespace-nowrap ${textClassName}`}>Market W.I.P</span>
    </div>
);



const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/videos", label: "Videos" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-[#1A2552] bg-[#060B19]/80 backdrop-blur-xl text-[#8B95A5]">
      <section className="mx-auto grid w-full max-w-[1200px] gap-8 px-6 py-12 md:grid-cols-3 md:px-8">
        <div>
          <div className="mb-4">
            <LogoComponent textClassName="text-3xl" />
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#8B95A5]">
            Where market awareness meets action. Track your wishlist tags, get updates, and manage news with a clear workflow.
          </p>
        </div>

        <div className="md:pl-10">
          <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm font-bold">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link className="transition-colors hover:text-[#00F0FF]" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-bold text-white mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-[#8B95A5] font-medium">
            <li className="flex items-center gap-3">
               <span className="w-8 h-8 rounded-full bg-[#1A2552] flex items-center justify-center text-[#00F0FF]">✉</span>
               marketwip1@gmail.com
            </li>
            <li className="flex items-center gap-3">
               <span className="w-8 h-8 rounded-full bg-[#1A2552] flex items-center justify-center text-[#C100FF]">📍</span>
               Kalyan, Maharashtra
            </li>
            <li className="flex items-center gap-3">
               <span className="w-8 h-8 rounded-full bg-[#1A2552] flex items-center justify-center text-[#34E0A1]">⏱</span>
               Response within 24h
            </li>
          </ul>
        </div>
      </section>

      <div className="border-t border-[#1A2552] py-6 text-center text-sm font-bold tracking-wide text-[#8B95A5]">
        © {new Date().getFullYear()} Market W.I.P. All rights reserved.
      </div>
    </footer>
  );
}
