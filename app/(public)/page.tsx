"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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
        <div className="relative w-full max-w-[500px] aspect-[4/5] mx-auto lg:ml-auto flex flex-col justify-end pb-10">
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
            <div className="relative z-10 w-full h-[320px] flex items-end justify-between px-4">
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
            <div className="relative z-20 w-[115%] -ml-[7.5%] h-[150px] bg-[#0A102E] border-t-2 border-r-2 border-[#1A2552] shadow-[0_-15px_60px_rgba(0,0,0,0.9)] rounded-t-2xl p-6 flex flex-col justify-between overflow-hidden">
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
                        <div className="w-[90px] h-[60px] relative mt-1 ml-2">
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
        <div ref={ref as any} className={`p-8 rounded-[2rem] text-center transition-all duration-500 hover:scale-[1.03] border ${highlight
            ? 'bg-gradient-to-b from-[#1A56FF]/20 to-[#0A102E] border-[#4353FF]/50 shadow-[0_8px_30px_-10px_rgba(67,83,255,0.4)]'
            : 'bg-[#0A102E] border-[#1A2552] shadow-xl'
            } ${inView ? animClass : 'opacity-0'}`}>
            <div className={`text-4xl sm:text-5xl font-extrabold font-display ${highlight ? 'text-[#00F0FF]' : 'text-white'}`}>
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
        <main className="flex flex-col flex-1 relative overflow-hidden font-sans selection:bg-[#4353FF]/50 selection:text-white pb-32">

            {/* NEON BACKGROUND ORBS */}
            <div className="absolute top-[-10%] left-[0%] w-[800px] h-[800px] bg-[#1A56FF] rounded-full mix-blend-screen filter blur-[180px] opacity-40 animate-pulse-slow pointer-events-none z-0"></div>
            <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-[#C100FF] rounded-full mix-blend-screen filter blur-[180px] opacity-30 animate-pulse-slow pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[60%] left-[-20%] w-[600px] h-[600px] bg-[#34E0A1] rounded-full mix-blend-screen filter blur-[180px] opacity-20 animate-pulse-slow pointer-events-none z-0" style={{ animationDelay: '4s' }}></div>

            {/* ═══ HERO SECTION ═══ */}
            <section className="relative z-10 px-6 pt-24 pb-32 mx-auto w-full max-w-[1300px] flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[90vh]">
                
                <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[#00F0FF] text-[13px] font-bold tracking-widest uppercase mb-10 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                        style={{ transform: `translateY(${scrollY * 0.1}px)`, opacity: Math.max(0, 1 - scrollY * 0.002) }}>
                        <span className="w-2.5 h-2.5 bg-[#C100FF] rounded-full animate-pulse shadow-[0_0_10px_#C100FF]"></span>
                        Market W.I.P Platform
                    </div>

                    <div style={{ transform: `translateY(${scrollY * 0.12}px)`, opacity: Math.max(0, 1 - scrollY * 0.0015) }}>
                        <h1 className="text-6xl sm:text-7xl lg:text-[5rem] font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#8B22FF] tracking-tight leading-tight mb-2">
                            Market News
                        </h1>
                        <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-extrabold font-display text-white tracking-tight pb-2">
                            Structured.
                        </h1>
                    </div>

                    <p className="text-lg sm:text-xl text-[#8B95A5] mt-6 max-w-[480px] font-medium leading-relaxed"
                        style={{ transform: `translateY(${scrollY * 0.1}px)`, opacity: Math.max(0, 1 - scrollY * 0.0015) }}>
                        Track stock-specific updates, filter by market categories, and stay aligned with important moves using our beautiful, noise-free dashboard.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-14"
                        style={{ transform: `translateY(${scrollY * 0.06}px)`, opacity: Math.max(0, 1 - scrollY * 0.0015) }}>
                        <Link href="/news" className="group rounded-full bg-[#4353FF] px-10 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(67,83,255,0.5)] transition hover:scale-105 hover:bg-[#5C6EFF]">
                            Get Started
                        </Link>
                        <Link href="#how-it-works" className="rounded-full border border-white/20 bg-transparent px-10 py-4 text-lg font-bold text-white transition hover:bg-white/5 hover:border-white/40 shadow-xl">
                            How it works?
                        </Link>
                    </div>
                </div>

                <div className="lg:w-1/2 w-full mt-16 lg:mt-0" style={{ transform: `translateY(${scrollY * 0.04}px)` }}>
                    <HeroVisuals />
                </div>
            </section>

            {/* ═══ THE PROBLEM STATS ═══ */}
            <section ref={crisisView.ref as any} className="relative z-10 px-6 py-24 mt-20">
                <div className="max-w-[1200px] mx-auto">
                    <div className={`text-center mb-16 transition-all duration-1000 ${crisisView.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white leading-tight">
                            Why Retail Misses Out
                        </h2>
                        <p className="text-[#8B95A5] font-medium mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
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
            <section ref={featuresView.ref as any} className="relative z-10 px-6 py-24 max-w-[1200px] mx-auto mt-10">
                <div className={`text-center mb-20 transition-all duration-1000 ${featuresView.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-4xl sm:text-6xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00F0FF] pb-2">
                        Everything You Need
                    </h2>
                    <p className="text-[#8B95A5] font-medium mt-4 text-lg">A unified, real-time dashboard for market headlines.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresView.inView && FEATURES.map((f, i) => (
                        <div
                            key={i}
                            className={`bg-[#0A102E] border border-[#1A2552] block p-10 rounded-[2.5rem] shadow-xl transition-all duration-500
                                ${i % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}
                        >
                            <div className="w-16 h-16 bg-[#1A2552] border border-[#4353FF]/30 rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-inner">
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-bold font-display text-white mb-3 tracking-wide">
                                {f.title}
                            </h3>
                            <p className="text-[16px] text-[#8B95A5] leading-relaxed font-medium">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>



            {/* ═══ HOW IT WORKS ═══ */}
            <section id="how-it-works" ref={stepsView.ref as any} className="relative z-10 px-6 py-32 max-w-[1200px] mx-auto border-t border-[#1A2552] bg-[#0A102E]/60 backdrop-blur-3xl rounded-[4rem] my-20 shadow-2xl">
                <div className={`text-center mb-24 transition-all duration-1000 ${stepsView.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-4xl sm:text-6xl font-extrabold font-display text-white">How It Works</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 relative">
                    <div className={`hidden sm:block absolute top-[4rem] left-[15%] right-[15%] h-1 bg-[linear-gradient(to_right,rgba(67,83,255,0),#4353FF,rgba(67,83,255,0))] transition-all duration-1500 ${stepsView.inView ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} style={{ transformOrigin: 'center' }}></div>
                    {stepsView.inView && STEPS.map((s, i) => (
                        <div key={i} className={`text-center relative group z-10 ${i % 2 === 0 ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}>
                            <div className="w-[8rem] h-[8rem] mx-auto bg-[#060B19] border-4 border-[#1A2552] rounded-[2.5rem] flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(67,83,255,0.2)] mb-8 relative z-20 group-hover:bg-gradient-to-br group-hover:from-[#C100FF] group-hover:to-[#4353FF] group-hover:border-transparent transition-all duration-500">
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
