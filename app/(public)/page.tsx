"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import FIIDIIActivityDisplay from "@/components/shared/FIIDIIActivityDisplay";

/* ═══════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════ */

function useCountUp(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const start = performance.now();
                const step = (now: number) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }
        }, { threshold: 0.3 });
        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return { count, ref };
}

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return { ref, inView };
}

/* ═══════════════════════════════════════════════════════════
   HERO VISUALS (FLOATING ELEMENTS)
   ═══════════════════════════════════════════════════════════ */
function HeroVisuals() {
    return (
        <div className="relative mx-auto flex w-full max-w-[360px] aspect-[4/5] flex-col justify-end pb-4 sm:max-w-[500px] sm:pb-10 lg:ml-auto">
            {/* Top Light Rays (Volumetric Light) */}
            <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[200%] h-[100%] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(243,166,35,0)_0%,rgba(243,166,35,0.05)_40%,rgba(243,166,35,0.2)_50%,rgba(243,166,35,0.05)_60%,rgba(243,166,35,0)_100%)] blur-[40px] pointer-events-none z-0"></div>
            <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[100%] h-[100%] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(52,224,161,0)_0%,rgba(52,224,161,0.05)_45%,rgba(52,224,161,0.15)_50%,rgba(52,224,161,0.05)_55%,rgba(52,224,161,0)_100%)] blur-[20px] pointer-events-none z-0"></div>
            
            {/* Floating Geometric Symbols (Background) */}
            <div className="absolute top-1/4 left-8 w-5 h-5 border-[1.5px] border-[#34E0A1] rounded-sm rotate-12 opacity-80 animate-float-delayed drop-shadow-[0_0_8px_#34E0A1]"></div>
            <div className="absolute top-1/3 right-10 w-8 h-8 border-2 border-[#00F0FF] rounded-full opacity-60 animate-pulse-slow drop-shadow-[0_0_10px_#00F0FF]"></div>
            <div className="absolute top-1/2 left-2 w-3 h-3 bg-[#FFD166] rounded-full opacity-90 animate-float drop-shadow-[0_0_10px_#FFD166]"></div>
            <div className="absolute top-[60%] right-2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#C100FF] rotate-45 opacity-80 animate-float-delayed drop-shadow-[0_0_12px_#C100FF]"></div>
            <div className="absolute top-[10%] left-1/2 w-2 h-2 bg-white rounded-full opacity-50 animate-ping"></div>

            {/* Glowing Main Line Chart */}
            <div className="relative z-10 flex h-[250px] w-full items-end justify-between px-3 sm:h-[320px] sm:px-4">
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 400 320">
                    <defs>
                        <linearGradient id="lineGrad" x1="0" y1="1" x2="1" y2="0">
                            <stop offset="0%" stopColor="#FF5B79" />
                            <stop offset="50%" stopColor="#F3A623" />
                            <stop offset="100%" stopColor="#FFD166" />
                        </linearGradient>
                        <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id="glowHeavy" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="12" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="rgba(243,166,35,0.3)" />
                            <stop offset="100%" stopColor="rgba(243,166,35,0.0)" />
                        </linearGradient>
                    </defs>

                    {/* Vertical Bars */}
                    <g className="animate-[fade-in_2s_ease-out_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
                        <rect x="40" y="200" width="10" height="120" fill="url(#barGrad)" rx="2"/>
                        <rect x="100" y="140" width="10" height="180" fill="url(#barGrad)" rx="2"/>
                        <rect x="160" y="180" width="10" height="140" fill="url(#barGrad)" rx="2"/>
                        <rect x="220" y="100" width="10" height="220" fill="url(#barGrad)" rx="2"/>
                        <rect x="280" y="150" width="10" height="170" fill="url(#barGrad)" rx="2"/>
                        <rect x="340" y="60" width="10" height="260" fill="url(#barGrad)" rx="2"/>
                    </g>
                    
                    {/* The Line - Triple stroked for intense neon glow */}
                    <path 
                        d="M20,240 L45,200 L105,140 L165,180 L225,100 L285,150 L345,60" 
                        fill="none" 
                        stroke="url(#lineGrad)" 
                        strokeWidth="16" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        filter="url(#glowHeavy)"
                        className="animate-[dash_2s_ease-out_forwards] opacity-40"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        style={{ animationFillMode: 'forwards' }}
                    />
                    <path 
                        d="M20,240 L45,200 L105,140 L165,180 L225,100 L285,150 L345,60" 
                        fill="none" 
                        stroke="url(#lineGrad)" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        filter="url(#glowLight)"
                        className="animate-[dash_2s_ease-out_forwards]"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        style={{ animationFillMode: 'forwards' }}
                    />
                    <path 
                        d="M20,240 L45,200 L105,140 L165,180 L225,100 L285,150 L345,60" 
                        fill="none" 
                        stroke="#FFFFFF" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="animate-[dash_2s_ease-out_forwards]"
                        strokeDasharray="1000"
                        strokeDashoffset="1000"
                        style={{ animationFillMode: 'forwards' }}
                    />

                    {/* Arrow Up on specific peaks */}
                    <g className="animate-[fade-in_1s_ease-out_1.5s_forwards] opacity-0" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
                        {/* 1st Arrow */}
                        <path d="M93,140 L105,110 L117,140 Z" fill="none" stroke="#F3A623" strokeWidth="4" filter="url(#glowLight)" />
                        <path d="M105,110 L105,140" stroke="#F3A623" strokeWidth="4" />
                        
                        {/* 2nd Arrow (Main) */}
                        <path d="M325,60 L345,10 L365,60 Z" fill="none" stroke="#FFD166" strokeWidth="6" filter="url(#glowHeavy)" />
                        <path d="M345,10 L345,60" stroke="#FFD166" strokeWidth="6" />
                        <path d="M325,60 L345,10 L365,60 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                    </g>
                </svg>
            </div>

            {/* Bottom Dashboard Panel */}
            <div className="relative z-20 -ml-0 h-[130px] w-full overflow-hidden rounded-t-2xl border-r-2 border-t-2 border-[#1A2552] bg-[#0A102E] p-4 shadow-[0_-15px_60px_rgba(0,0,0,0.9)] sm:-ml-[7.5%] sm:h-[150px] sm:w-[115%] sm:p-6">
                {/* Subtle base glow inside the box */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#F3A623] blur-[60px] opacity-10 pointer-events-none"></div>

                <div className="w-full h-full flex justify-between relative z-10">
                    {/* Left stats block */}
                    <div className="flex gap-5 h-full">
                        <div className="flex flex-col gap-[3px] items-end justify-end text-[#8B95A5] text-[10px] font-bold pb-1 font-mono">
                            <span>1306</span>
                            <span>2.40</span>
                            <span>130.</span>
                            <span>23.6</span>
                            <span>080.</span>
                        </div>
                        {/* Mini Sparkline Bar Chart */}
                        <div className="flex items-end gap-1.5 h-full pb-2">
                            <div className="w-1.5 h-[30%] bg-[#8B95A5]/60 rounded-t-sm"></div>
                            <div className="w-1.5 h-[45%] bg-[#8B95A5]/60 rounded-t-sm"></div>
                            <div className="w-1.5 h-[65%] bg-[#34E0A1] rounded-t-sm shadow-[0_0_8px_#34E0A1]"></div>
                            <div className="w-1.5 h-[50%] bg-[#8B95A5]/60 rounded-t-sm"></div>
                            <div className="w-1.5 h-[80%] bg-[#FFD166] rounded-t-sm shadow-[0_0_8px_#FFD166]"></div>
                            <div className="w-1.5 h-[40%] bg-[#FF5B79] rounded-t-sm shadow-[0_0_8px_#FF5B79]"></div>
                            <div className="w-1.5 h-[20%] bg-[#FF5B79]/80 rounded-t-sm"></div>
                            <div className="w-1.5 h-[60%] bg-[#34E0A1] rounded-t-sm shadow-[0_0_8px_#34E0A1]"></div>
                        </div>
                        {/* Mini Sparkline Line Chart */}
                        <div className="relative mt-1 ml-2 h-[52px] w-[72px] sm:h-[60px] sm:w-[90px]">
                            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                                <path d="M0,40 L15,25 L30,45 L50,15 L65,35 L80,10 L100,5" fill="none" stroke="#00F0FF" strokeWidth="2.5" filter="url(#glowLight)"/>
                                <circle cx="100" cy="5" r="3" fill="#FFFFFF" stroke="#00F0FF" strokeWidth="2" filter="url(#glowLight)"/>
                            </svg>
                        </div>
                    </div>

                    {/* Right stats block */}
                    <div className="flex flex-col items-end gap-3 w-[45%] h-full pt-1">
                        <div className="flex justify-between w-full text-white/90 text-[11px] font-mono tracking-wider opacity-80">
                            <span>5109</span>
                            <span>12871</span>
                            <span>13911</span>
                            <span>1871</span>
                        </div>
                        <div className="flex justify-between w-[85%] text-[#F3A623] text-[13px] font-bold font-mono tracking-wider drop-shadow-[0_0_5px_rgba(243,166,35,0.8)] mt-1">
                            <span>1228</span>
                            <span>1338</span>
                            <span className="text-[#FF5B79]">1096</span>
                            <span>1205</span>
                        </div>
                        <div className="flex items-center justify-between w-full text-[#34E0A1] text-[11px] font-mono mt-auto border-t border-[#1A2552] pt-3 px-1">
                            <span>211</span>
                            <span>177</span>
                            <span>1951</span>
                            <span>223</span>
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#34E0A1] shadow-[0_0_8px_#34E0A1]"></div>
                        </div>
                    </div>
                </div>

                {/* Floating decor on bottom dashboard */}
                <div className="absolute top-4 right-1/4 w-5 h-5 border-[1.5px] border-[#F3A623] rounded-sm opacity-80 shadow-[0_0_8px_#F3A623]">
                   <div className="w-full h-full border border-[#F3A623] scale-50"></div>
                </div>
            </div>

            <style>{`
                @keyframes dash {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes fade-in {
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   ORIGINAL DATA
   ═══════════════════════════════════════════════════════════ */

const FEATURES = [
    { icon: '⚡', title: 'Realtime Feed', desc: 'Fresh market headlines instantly.' },
    { icon: '⭐', title: 'Stock Watchlist', desc: 'Track preferred stocks seamlessly.' },
    { icon: '📊', title: 'Market Snapshot', desc: 'Quickly scan sectors & top movers.' },
    { icon: '✉️', title: 'Instant Alerts', desc: 'Email notifications on watchlist matches.' },
    { icon: '🎯', title: 'Focused Coverage', desc: 'Avoid noise and act safely.' },
    { icon: '🔍', title: 'Fast Filtering', desc: 'Move from broad view to categories.' },
];

const STEPS = [
    { num: '01', title: 'Build Watchlist', desc: 'Enter the stocks you want to track.', icon: '⭐' },
    { num: '02', title: 'Engine Filters Noise', desc: 'Our system scans incoming headlines constantly.', icon: '⚙️' },
    { num: '03', title: 'Act on Updates', desc: 'You get notified the moment a match happens.', icon: '✉️' },
];



const CRISIS_STATS = [
    { value: 10000, suffix: '+', label: 'News Articles Daily (Noise)', highlight: true },
    { value: 60, suffix: '%', label: 'Retail Investors Miss Key Updates', highlight: false },
    { value: 24, suffix: '/7', label: 'Market Monitoring Engine', highlight: false },
    { value: 1, suffix: '', label: 'Unified Dashboard Needed', highlight: true },
];

const TESTIMONIAL_SCENARIOS = [
    {
        quote: 'Market W.I.P caught the Reliance Industries quarterly statement instantly while I was asleep. The email alert let me act on market open.',
        persona: 'Vikram, Investor',
        emoji: '📈',
    },
    {
        quote: 'Finally, a newsfeed that doesn\'t show me random meme coins or irrelevant PR. Only what I explicitly have on my watchlist.',
        persona: 'Meera, Day Trader',
        emoji: '🎯',
    },
    {
        quote: 'Filtering by Sector works flawlessly. I can isolate Automobile stocks when policy changes hit without searching all over.',
        persona: 'Karan, Equity Analyst',
        emoji: '📊',
    },
];

/* ─── Cards ─── */


function CrisisStatCard({ value, suffix, label, highlight, index, inView }: { value: number; suffix: string; label: string; highlight: boolean; index: number; inView: boolean }) {
    const { count, ref } = useCountUp(value, 2500);
    const animClass = index % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right';

    return (
        <div ref={ref as any} className={`rounded-[1.5rem] border p-5 text-center transition-all duration-500 hover:scale-[1.03] sm:rounded-[2rem] sm:p-8 ${highlight
            ? 'bg-gradient-to-b from-[#1A56FF]/20 to-[#0A102E] border-[#4353FF]/50 shadow-[0_8px_30px_-10px_rgba(67,83,255,0.4)]'
            : 'bg-[#0A102E] border-[#1A2552] shadow-xl'
            } ${inView ? animClass : 'opacity-0'}`}>
            <div className={`text-3xl font-extrabold font-display sm:text-5xl ${highlight ? 'text-[#00F0FF]' : 'text-white'}`}>
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-[15px] font-bold text-[#8B95A5] mt-4 leading-tight">{label}</div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
    const [scrollY, setScrollY] = useState(0);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const iv = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIAL_SCENARIOS.length), 5000);
        return () => clearInterval(iv);
    }, []);

    const featuresView = useInView(0.1);
    const stepsView = useInView(0.1);
    const crisisView = useInView(0.1);

    return (
        <main className="relative flex flex-1 flex-col overflow-hidden pb-20 font-sans selection:bg-[#4353FF]/50 selection:text-white sm:pb-32">

            {/* NEON BACKGROUND ORBS */}
            <div className="pointer-events-none absolute left-[-35%] top-[-5%] z-0 h-[420px] w-[420px] animate-pulse-slow rounded-full bg-[#1A56FF] opacity-40 mix-blend-screen blur-[140px] sm:left-[0%] sm:top-[-10%] sm:h-[800px] sm:w-[800px] sm:blur-[180px]"></div>
            <div className="pointer-events-none absolute right-[-35%] top-[20%] z-0 h-[380px] w-[380px] animate-pulse-slow rounded-full bg-[#C100FF] opacity-30 mix-blend-screen blur-[140px] sm:right-[-10%] sm:h-[700px] sm:w-[700px] sm:blur-[180px]" style={{ animationDelay: '2s' }}></div>
            <div className="pointer-events-none absolute left-[-35%] top-[62%] z-0 h-[360px] w-[360px] animate-pulse-slow rounded-full bg-[#34E0A1] opacity-20 mix-blend-screen blur-[140px] sm:left-[-20%] sm:h-[600px] sm:w-[600px] sm:blur-[180px]" style={{ animationDelay: '4s' }}></div>

            {/* ═══ HERO SECTION ═══ */}
            <section className="relative z-10 mx-auto flex w-full max-w-[1300px] flex-col items-center justify-between gap-10 px-4 pb-8 pt-12 sm:gap-16 sm:px-6 sm:pb-16 sm:pt-24 lg:min-h-[90vh] lg:flex-row">
                
                <div className="flex flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#00F0FF] text-[13px] font-bold tracking-widest uppercase mb-10 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                        style={{ transform: `translateY(${scrollY * 0.1}px)`, opacity: Math.max(0, 1 - scrollY * 0.002) }}>
                        <span className="w-2.5 h-2.5 bg-[#C100FF] rounded-full animate-pulse shadow-[0_0_10px_#C100FF]"></span>
                        Market W.I.P Platform
                    </div>

                            <div style={{ transform: `translateY(${scrollY * 0.12}px)`, opacity: Math.max(0, 1 - scrollY * 0.0015) }}>
                        <h1 className="mb-2 bg-gradient-to-r from-[#00F0FF] to-[#8B22FF] bg-clip-text text-5xl font-extrabold leading-tight tracking-tight text-transparent sm:text-7xl lg:text-[5rem]">
                            Market
                        </h1>
                        <h1 className="pb-2 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
                            Intelligence.
                        </h1>
                    </div>

                    <p className="mt-6 max-w-[480px] text-base font-medium leading-relaxed text-[#8B95A5] sm:text-xl"
                        style={{ transform: `translateY(${scrollY * 0.1}px)`, opacity: Math.max(0, 1 - scrollY * 0.0015) }}>
                        Track FII/DII activity, stay updated with stock-specific news, and make informed decisions with real-time market data.
                    </p>

                    <div className="mt-10 w-full"
                        style={{ transform: `translateY(${scrollY * 0.06}px)`, opacity: Math.max(0, 1 - scrollY * 0.0015) }}>
                        <Link href="/news" className="inline-block rounded-full bg-[#4353FF] px-10 py-3 text-center text-base font-bold text-white shadow-[0_0_30px_rgba(67,83,255,0.5)] transition hover:scale-105 hover:bg-[#5C6EFF] sm:py-4 sm:text-lg">
                            Explore News
                        </Link>
                    </div>
                </div>

                <div className="mt-6 w-full lg:mt-0 lg:w-1/2" style={{ transform: `translateY(${scrollY * 0.04}px)` }}>
                    <FIIDIIActivityDisplay />
                </div>
            </section>

            {/* ═══ THE PROBLEM STATS ═══ */}
            <section ref={crisisView.ref as any} className="relative z-10 px-4 py-12 sm:px-6 sm:py-20">
                <div className="max-w-[1200px] mx-auto">
                    <div className={`mb-12 text-center transition-all duration-1000 sm:mb-16 ${crisisView.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <h2 className="text-3xl font-extrabold font-display leading-tight text-white sm:text-5xl">
                            Why Retail Misses Out
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-[#8B95A5] sm:mt-6 sm:text-lg">
                            The internet produces too much noise. Finding the actual sector and company updates that affect your portfolio requires dedicated filtering tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CRISIS_STATS.map((stat, i) => (
                            <CrisisStatCard key={i} {...stat} index={i} inView={crisisView.inView} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES ═══ */}
            <section ref={featuresView.ref as any} className="relative z-10 mx-auto mt-10 max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
                <div className={`mb-12 text-center transition-all duration-1000 sm:mb-20 ${featuresView.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="bg-gradient-to-r from-white to-[#00F0FF] bg-clip-text pb-2 text-3xl font-extrabold font-display text-transparent sm:text-6xl">
                        Everything You Need
                    </h2>
                    <p className="mt-4 text-base font-medium text-[#8B95A5] sm:text-lg">A unified, real-time dashboard for market headlines.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresView.inView && FEATURES.map((f, i) => (
                        <div
                            key={i}
                            className={`block rounded-[1.5rem] border border-[#1A2552] bg-[#0A102E] p-6 shadow-xl transition-all duration-500 sm:rounded-[2.5rem] sm:p-10
                                ${i % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}
                        >
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#4353FF]/30 bg-[#1A2552] text-2xl shadow-inner sm:mb-8 sm:h-16 sm:w-16">
                                {f.icon}
                            </div>
                            <h3 className="mb-3 text-xl font-bold font-display tracking-wide text-white sm:text-2xl">
                                {f.title}
                            </h3>
                            <p className="text-[15px] font-medium leading-relaxed text-[#8B95A5] sm:text-[16px]">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>



            {/* ═══ HOW IT WORKS ═══ */}
            <section id="how-it-works" ref={stepsView.ref as any} className="relative z-10 mx-auto my-12 max-w-[1200px] rounded-[2rem] border-t border-[#1A2552] bg-[#0A102E]/60 px-4 py-16 shadow-2xl backdrop-blur-3xl sm:my-20 sm:rounded-[4rem] sm:px-6 sm:py-24 md:py-32">
                <div className={`mb-14 text-center transition-all duration-1000 sm:mb-24 ${stepsView.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-3xl font-extrabold font-display text-white sm:text-6xl">How It Works</h2>
                </div>

                <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-16">
                    <div className={`hidden sm:block absolute top-[4rem] left-[15%] right-[15%] h-1 bg-[linear-gradient(to_right,rgba(67,83,255,0),#4353FF,rgba(67,83,255,0))] transition-all duration-1500 ${stepsView.inView ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transformOrigin: 'center' }}></div>
                    {stepsView.inView && STEPS.map((s, i) => (
                        <div key={i} className={`text-center relative group z-10 ${i % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}>
                            <div className="relative z-20 mx-auto mb-6 flex h-[6.5rem] w-[6.5rem] items-center justify-center rounded-[2rem] border-4 border-[#1A2552] bg-[#060B19] text-4xl shadow-[0_0_30px_rgba(67,83,255,0.2)] transition-all duration-500 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-[#C100FF] group-hover:to-[#4353FF] sm:mb-8 sm:h-[8rem] sm:w-[8rem] sm:rounded-[2.5rem]">
                                <span className="relative z-10 drop-shadow-md">{s.icon}</span>
                            </div>
                            <div className="text-sm font-bold text-[#00F0FF] tracking-[0.2em] mb-4 uppercase">STEP {s.num}</div>
                            <h3 className="text-2xl font-bold font-display text-white mb-4">{s.title}</h3>
                            <p className="text-[15px] text-[#8B95A5] font-medium leading-relaxed max-w-[280px] mx-auto">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>



        </main>
    );
}
