"use client"

import Image from "next/image"
import { useState, useMemo } from "react"
import {
  Search,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

/* ──────────────────────────────────────────────
   VISUAL CARD PREVIEWS
   Each card gets a unique illustration that sits
   inside a subtle neutral preview box — matching
   the project cards on the Home page.
   ────────────────────────────────────────────── */

function PostVisual({ visual, tag, tagExtra }) {
  // Accent colour map — soft pastels matching the About page
  const accentMap = {
    Marketing:  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200/60" },
    Product:    { bg: "bg-violet-50",   text: "text-violet-700",  border: "border-violet-200/60" },
    Audience:   { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200/60" },
    Personal:   { bg: "bg-rose-50",     text: "text-rose-700",    border: "border-rose-200/60" },
    Mindset:    { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200/60" },
    Design:     { bg: "bg-pink-50",     text: "text-pink-700",    border: "border-pink-200/60" },
  }

  const accent = accentMap[tag] || accentMap.Product

  return (
    <div
      className={`relative h-44 sm:h-48 w-full overflow-hidden rounded-xl p-4 flex items-center justify-center select-none transition-all duration-300 group-hover:scale-[1.01] ${
        visual.type === "stripe"
          ? "bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 text-white"
          : "bg-neutral-100/80 ring-1 ring-black/[0.04] text-neutral-800"
      }`}
    >
      {/* Floating Category Pills — soft pastel, NOT bright yellow */}
      {tag && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${accent.bg} ${accent.text} border ${accent.border}`}>
            {tag}
          </span>
          {tagExtra && (
            <span className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200/60">
              {tagExtra}
            </span>
          )}
        </div>
      )}

      {/* 1. REVENUE / USER GROWTH CHART */}
      {visual.type === "revenue-chart" && (
        <div className="w-full h-full pt-2 flex flex-col justify-between">
          <div className="flex justify-end items-start pr-1">
            <div className="text-right">
              <span className="text-[11px] font-extrabold text-neutral-800 font-mono block leading-none">
                {visual.metricTop || "$3,002,144"}
              </span>
              <div className="flex items-center justify-end gap-1 text-[9px] text-neutral-400 font-medium mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block" />
                <span>{visual.metricLabel || "Revenue"}</span>
                <span className="text-neutral-300">All time</span>
              </div>
            </div>
          </div>
          <div className="w-full h-24 relative mt-auto">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`rg-${visual.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="25" x2="300" y2="25" stroke="#e5e7eb" strokeDasharray="2 4" strokeWidth="0.5" />
              <line x1="0" y1="55" x2="300" y2="55" stroke="#e5e7eb" strokeDasharray="2 4" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#e5e7eb" strokeDasharray="2 4" strokeWidth="0.5" />
              <path d="M 0,82 C 40,82 70,80 100,74 C 130,68 160,78 185,58 C 210,38 230,15 240,65 C 248,82 258,60 270,40 C 280,24 290,12 300,32 L 300,90 L 0,90 Z" fill={`url(#rg-${visual.id})`} />
              <path d="M 0,82 C 40,82 70,80 100,74 C 130,68 160,78 185,58 C 210,38 230,15 240,65 C 248,82 258,60 270,40 C 280,24 290,12 300,32" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <circle cx="300" cy="32" r="3" fill="#2563eb" />
            </svg>
          </div>
        </div>
      )}

      {/* 2. ONLINE LIVE COUNTER */}
      {visual.type === "online-counter" && (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-neutral-500 text-sm font-medium mb-1">
            <span>Online</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
            {visual.count || "1,347"}
          </span>
          {visual.sub && (
            <span className="text-[11px] text-neutral-400 font-medium mt-1">{visual.sub}</span>
          )}
        </div>
      )}

      {/* 3. DARK NOTIFICATION STACK */}
      {visual.type === "stripe" && (
        <div className="w-full h-full flex flex-col justify-end gap-2.5 pt-2">
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5 flex items-center gap-2.5 backdrop-blur-sm">
            <div className="h-7 w-7 rounded-lg bg-[#635bff] flex items-center justify-center font-bold text-white text-xs shrink-0">S</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[10px] text-neutral-300"><span className="font-bold text-white">Stripe</span><span>3:30 AM</span></div>
              <p className="text-[11px] font-semibold text-white truncate">You received a payment of $49.00!</p>
            </div>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5 flex items-center gap-2.5 backdrop-blur-sm">
            <div className="h-7 w-7 rounded-lg bg-[#635bff] flex items-center justify-center font-bold text-white text-xs shrink-0">S</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[10px] text-neutral-300"><span className="font-bold text-white">Stripe</span><span>12:55 AM</span></div>
              <p className="text-[11px] font-semibold text-white truncate">You received a payment of $75.13!</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. BRAND AVATAR PEEKING UP */}
      {visual.type === "trustmrr" && (
        <div className="w-full h-full relative flex flex-col items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-lg font-extrabold text-neutral-800 tracking-tight">
            <span className="text-blue-500 text-xl">★</span>
            <span>{visual.title || "TrustMRR"}</span>
          </div>
          <div className="relative w-24 h-20 overflow-hidden mt-auto -mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-white shadow-sm mx-auto">
              <Image src="/myimage.png" alt="Avinash" fill sizes="96px" className="object-cover object-top" />
            </div>
          </div>
        </div>
      )}

      {/* 5. EXPONENTIAL GROWTH CURVE */}
      {visual.type === "saas-mrr" && (
        <div className="w-full h-full flex items-center justify-between pt-6">
          <div className="w-4/5 h-28 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 240 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0,85 C 60,84 100,82 140,70 C 180,56 200,30 240,6 L 240,90 L 0,90 Z" fill="url(#sg)" />
              <path d="M 0,85 C 60,84 100,82 140,70 C 180,56 200,30 240,6" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
              <circle cx="240" cy="6" r="3" fill="#7c3aed" />
            </svg>
          </div>
          <div className="flex flex-col justify-between h-20 text-[9px] text-neutral-400 font-mono text-right pl-2">
            <span>$20K</span><span>$15K</span><span>$10K</span><span>$5K</span>
          </div>
        </div>
      )}

      {/* 6. PIE CHART */}
      {visual.type === "pie-expenditures" && (
        <div className="w-full h-full flex flex-col items-center justify-center pt-1">
          <span className="text-[9px] font-semibold tracking-wider text-neutral-400 uppercase mb-2">Expenditures 2025</span>
          <div className="flex items-center gap-4">
            <svg className="h-24 w-24 -rotate-90 shrink-0" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="15.915" fill="#f8fafc" />
              <circle cx="20" cy="20" r="15.915" fill="none" stroke="#22c55e" strokeWidth="7" strokeDasharray="45 55" strokeDashoffset="0" />
              <circle cx="20" cy="20" r="15.915" fill="none" stroke="#eab308" strokeWidth="7" strokeDasharray="25 75" strokeDashoffset="-45" />
              <circle cx="20" cy="20" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="7" strokeDasharray="18 82" strokeDashoffset="-70" />
              <circle cx="20" cy="20" r="15.915" fill="none" stroke="#ec4899" strokeWidth="7" strokeDasharray="12 88" strokeDashoffset="-88" />
            </svg>
            <div className="flex flex-col gap-1 text-[9px] font-medium text-neutral-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />Product</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-yellow-500" />Server/AI</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Fees</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pink-500" />Marketing</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. FAKE VS REAL */}
      {visual.type === "fake-vs-real" && (
        <div className="w-full h-full flex items-center justify-around pt-5">
          <div className="relative w-5/12 h-24 flex flex-col items-center justify-center">
            <span className="absolute -top-2 px-1.5 py-0.5 rounded-full border border-rose-300 text-rose-600 font-bold text-[8px] tracking-wider rotate-[-6deg] bg-rose-50">FAKE</span>
            <svg className="w-full h-16" viewBox="0 0 100 50"><path d="M 5,45 C 30,44 60,35 95,8" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 3" /></svg>
          </div>
          <div className="h-16 w-px bg-neutral-200" />
          <div className="relative w-5/12 h-24 flex flex-col items-center justify-center">
            <span className="absolute -top-2 px-1.5 py-0.5 rounded-full border border-emerald-300 text-emerald-600 font-bold text-[8px] tracking-wider rotate-[4deg] bg-emerald-50">REAL</span>
            <span className="text-[9px] text-neutral-400 font-mono mb-1">$20,378</span>
            <svg className="w-full h-16" viewBox="0 0 100 50"><path d="M 5,45 L 20,20 L 35,42 L 50,15 L 65,35 L 80,10 L 95,25" fill="none" stroke="#22c55e" strokeWidth="2" /></svg>
          </div>
        </div>
      )}

      {/* 8. POLAROIDS */}
      {visual.type === "polaroids" && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute -rotate-12 bg-white p-1 pb-3 shadow-sm ring-1 ring-black/5 rounded w-16 h-20 flex items-center justify-center"><div className="w-full h-12 bg-neutral-100 flex items-center justify-center text-sm rounded-sm">🏕️</div></div>
          <div className="absolute rotate-6 translate-x-3 bg-white p-1 pb-3 shadow-md ring-1 ring-black/5 rounded w-18 h-22 flex items-center justify-center z-10"><div className="w-full h-14 bg-neutral-900 text-white flex items-center justify-center text-[10px] font-mono font-bold rounded-sm">BUILD</div></div>
          <div className="absolute -rotate-3 -translate-x-5 bg-white p-1 pb-3 shadow-xs ring-1 ring-black/5 rounded w-14 h-18 flex items-center justify-center"><div className="w-full h-10 bg-neutral-50 flex items-center justify-center text-sm rounded-sm">💻</div></div>
        </div>
      )}

      {/* 9. GROWTH WITH ANNOTATIONS */}
      {visual.type === "annotations" && (
        <div className="w-full h-full relative flex items-center justify-center pt-4">
          <svg className="w-full h-24 overflow-visible" viewBox="0 0 280 90">
            <path d="M 10,80 Q 70,78 120,60 T 200,35 T 260,10" fill="none" stroke="#8b5cf6" strokeWidth="2" />
          </svg>
          <span className="absolute top-4 left-8 text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">🌱 repositioning</span>
          <span className="absolute top-10 left-20 text-[8px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">🌱 new onboarding</span>
          <span className="absolute bottom-5 left-32 text-[8px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">🌱 plugin</span>
          <span className="absolute bottom-1 right-6 text-[8px] font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200/60">🌱 shareable</span>
        </div>
      )}

      {/* 10. RAINBOW BRIDGE */}
      {visual.type === "rainbow-road" && (
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-7 bg-neutral-500 rounded-l flex items-center justify-center"><div className="w-full border-t border-dashed border-neutral-300" /></div>
          <div className="absolute w-32 h-20 border-t-[6px] border-r-[6px] border-rose-300 rounded-tr-full rotate-[-18deg]">
            <div className="w-full h-full border-t-[6px] border-r-[6px] border-amber-300 rounded-tr-full mt-[-6px] mr-[-6px]">
              <div className="w-full h-full border-t-[6px] border-r-[6px] border-emerald-300 rounded-tr-full mt-[-6px] mr-[-6px]">
                <div className="w-full h-full border-t-[6px] border-r-[6px] border-blue-300 rounded-tr-full mt-[-6px] mr-[-6px]" />
              </div>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 text-xl opacity-60">☁️</div>
        </div>
      )}

      {/* 11. VIDEO CELEBRATION */}
      {visual.type === "video-celebration" && (
        <div className="w-full h-full relative bg-neutral-900 rounded-lg overflow-hidden flex flex-col items-center justify-center">
          <span className="text-white text-[9px] font-bold tracking-wider absolute top-2 left-2 z-10 bg-black/50 px-2 py-0.5 rounded">BEST DECISION</span>
          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-neutral-600 shadow-md">
            <Image src="/myimage.png" alt="Avinash" fill sizes="56px" className="object-cover object-top" />
          </div>
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">7:07</span>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-around text-xs opacity-30">🎉 ✨ 🎊</div>
        </div>
      )}

      {/* 12. DREAMERS VS BUILDERS */}
      {visual.type === "comic-seed-tree" && (
        <div className="w-full h-full flex items-center justify-around px-3">
          <div className="flex flex-col items-center"><div className="text-3xl">🌱</div><span className="text-[10px] font-semibold text-neutral-400 mt-1">Dreamer</span></div>
          <div className="h-14 w-px bg-neutral-200" />
          <div className="flex flex-col items-center"><div className="text-3xl">🌳</div><span className="text-[10px] font-bold text-emerald-600 mt-1">Builder</span></div>
        </div>
      )}

      {/* 13. TOP 0.1% STAR */}
      {visual.type === "mario-star" && (
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl drop-shadow transition-transform hover:scale-110">⭐</div>
          <span className="mt-2 text-[10px] font-bold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200/60">TOP 0.1% MINDSET</span>
        </div>
      )}

      {/* 14. GATEEXAM TERMINAL */}
      {visual.type === "gateexam-coach" && (
        <div className="w-full max-w-[240px] bg-neutral-900 rounded-xl p-3 text-[11px] font-mono text-neutral-400 shadow-md ring-1 ring-white/5">
          <div className="flex items-center justify-between text-[10px] mb-1.5 border-b border-neutral-800 pb-1.5">
            <span className="text-blue-400 font-bold">GateExam.org</span>
            <span className="text-emerald-400 font-bold">Top 1%</span>
          </div>
          <p className="text-emerald-400">$ npx start-gate-coach</p>
          <p className="text-neutral-500 mt-1">// AI mock evaluation</p>
          <p className="text-emerald-400 font-bold mt-1">Score: 84.5 / 100 ✓</p>
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────
   POST CARD — no card wrapper, content flows
   openly: visual preview → meta → title → excerpt
   → author. Exactly like Marc Lou's blog layout.
   ────────────────────────────────────────────── */

function PostCard({ post, onLike, isLiked, onOpenPost }) {
  return (
    <article
      className="group flex flex-col cursor-pointer"
      onClick={() => onOpenPost(post)}
    >
      {/* Top Visual Box */}
      <PostVisual visual={post.visual} tag={post.tag} tagExtra={post.tagExtra} />

      {/* Meta row: date left, engagement right */}
      <div className="flex items-center justify-between mt-3 text-[11px] text-neutral-400">
        <time dateTime={post.date}>{post.date}</time>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onLike(post.id) }}
            className="flex items-center gap-1 hover:text-rose-500 transition-colors"
            aria-label="Like"
          >
            <Heart className={`h-3.5 w-3.5 transition-transform active:scale-125 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            <span className="font-semibold">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="font-semibold">{post.comments}</span>
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-2 text-[15px] font-bold text-neutral-950 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="mt-1 text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed">
        {post.excerpt}
      </p>

      {/* Author */}
      <div className="mt-3 flex items-center gap-2">
        <div className="relative h-5 w-5 overflow-hidden rounded-md bg-amber-100 ring-1 ring-black/5 shrink-0">
          <Image src="/myimage.png" alt={post.author || "Avinash Raj"} fill sizes="20px" className="object-cover object-top" />
        </div>
        <span className="text-xs font-semibold text-neutral-600">{post.author || "Avinash Raj"}</span>
      </div>
    </article>
  )
}

/* ──────────────────────────────────────────────
   POST DATA
   ────────────────────────────────────────────── */

const featuredPostsData = [
  {
    id: "fp-1",
    title: "I've made $3M with my 36 startups",
    excerpt: "My 10-year solopreneur story.",
    content: "Ten years ago, I had zero revenue and dozens of abandoned GitHub repos.\n\nBuilding 36 startups taught me one truth: distribution and building in public beat isolated perfection every time.\n\n1. Validate before writing 10,000 lines of code.\n2. Build lightweight MVPs that solve one acute pain.\n3. Document the entire process publicly.",
    date: "Sep 08, 2026", likes: 2, comments: 2, tag: "Marketing", tagExtra: "+2", category: "Marketing", author: "Avinash Raj",
    visual: { type: "revenue-chart", id: "fp1", metricTop: "$3,002,144", metricLabel: "Revenue" },
  },
  {
    id: "fp-2",
    title: "31 Principles of a Viral Product",
    excerpt: "What I've learned from 5 years of building startups in public, watching hundreds of launches make $0, and a few reach millions...",
    content: "Most people launch a product and pray.\n\nViral products have word-of-mouth loops engineered directly into the UI.\n\n• Make the output inherently shareable.\n• Reduce time-to-value to under 15 seconds.\n• Turn status symbols into badges users want to display.",
    date: "Jun 09, 2026", likes: 5, comments: 3, tag: "Product", category: "Product", author: "Avinash Raj",
    visual: { type: "online-counter", count: "1,347", sub: "builders learning live" },
  },
  {
    id: "fp-3",
    title: "How to get your 1st customer",
    excerpt: "If you have 0 audience and $0 for marketing, here are 4 strategies I used to get customers for all my startups.",
    content: "When you have zero followers, leverage existing ponds.\n\n• Direct cold DM value drops (never pitch upfront).\n• Answer hyper-specific Reddit & Twitter questions.\n• Launch micro tools on Product Hunt with demo videos.\n• Offer free onboarding for video testimonials.",
    date: "Apr 06, 2024", likes: 16, comments: 9, tag: "Audience", tagExtra: "+1", category: "Audience", author: "Avinash Raj",
    visual: { type: "stripe" },
  },
]

const latestPostsData = [
  {
    id: "lp-1",
    title: "I've made $3M with my 36 startups",
    excerpt: "My 10-year solopreneur story.",
    content: "A detailed breakdown of revenue streams, failed products, and what finally worked.",
    date: "Sep 08, 2026", likes: 2, comments: 2, tag: "Marketing", tagExtra: "+2", category: "Marketing", author: "Avinash Raj",
    visual: { type: "revenue-chart", id: "lp1", metricTop: "$3,002,144", metricLabel: "Revenue" },
  },
  {
    id: "lp-2",
    title: "I vibe-coded $330K in 9 months",
    excerpt: "And had no idea where I was going all along.",
    content: "Vibe-coding is shipping at the speed of thought using AI tools without letting over-engineering paralyse you.\n\nI built TrustMRR in days, validated with real revenue, and iterated based on customer feedback.",
    date: "Sep 01, 2026", likes: 2, comments: 1, tag: "Product", category: "Product", author: "Avinash Raj",
    visual: { type: "trustmrr", title: "TrustMRR" },
  },
  {
    id: "lp-3",
    title: "31 Principles of a Viral Product",
    excerpt: "What I've learned from 5 years of building startups in public, watching hundreds of launches...",
    content: "The 31 psychological hooks that make software products spread organically.",
    date: "Jun 09, 2026", likes: 5, comments: 3, tag: "Product", category: "Product", author: "Avinash Raj",
    visual: { type: "online-counter", count: "1,347", sub: "builders learning live" },
  },
]

const archivePostsData = [
  { id: "ar-1", title: "I've made $3M with my 36 startups", excerpt: "My 10-year solopreneur story.", date: "Sep 08, 2026", likes: 2, comments: 2, tag: "Marketing", tagExtra: "+2", category: "Marketing", author: "Avinash Raj", visual: { type: "revenue-chart", id: "ar1", metricTop: "$3,002,144", metricLabel: "Revenue" } },
  { id: "ar-2", title: "I vibe-coded $330K in 9 months", excerpt: "And had no idea where I was going all along.", date: "Sep 01, 2026", likes: 2, comments: 1, tag: "Product", category: "Product", author: "Avinash Raj", visual: { type: "trustmrr", title: "TrustMRR" } },
  { id: "ar-3", title: "31 Principles of a Viral Product", excerpt: "What I've learned from 5 years of building startups in public...", date: "Jun 09, 2026", likes: 5, comments: 3, tag: "Product", category: "Product", author: "Avinash Raj", visual: { type: "online-counter", count: "1,347" } },
  { id: "ar-4", title: "I grew a SaaS to $1M", excerpt: "It took 512 days. Here are 3 lessons I wish I knew earlier.", date: "Mar 10, 2026", likes: 7, comments: 4, tag: "Marketing", tagExtra: "+1", category: "Marketing", author: "Avinash Raj", visual: { type: "saas-mrr" } },
  { id: "ar-5", title: "I made $1,032,000 in 2025", excerpt: "A recap of 2025 as an entrepreneur.", date: "Jan 04, 2026", likes: 4, comments: 6, tag: "Personal", category: "Personal", author: "Avinash Raj", visual: { type: "pie-expenditures" } },
  { id: "ar-6", title: "I made an app in 24 hours and $20,378 the next day", excerpt: "The mini-story behind my recent viral startup.", date: "Nov 15, 2025", likes: 5, comments: 5, tag: "Marketing", tagExtra: "+2", category: "Marketing", author: "Avinash Raj", visual: { type: "fake-vs-real" } },
  { id: "ar-7", title: "I've been a loser most of my life", excerpt: "The wind only blew right after 28 years of failures.", date: "Oct 11, 2025", likes: 2, comments: 7, tag: "Mindset", tagExtra: "+1", category: "Mindset", author: "Avinash Raj", visual: { type: "polaroids" } },
  { id: "ar-8", title: "How I grew my SaaS to $5K MRR", excerpt: "6 lessons I wish I knew earlier.", date: "Sep 13, 2025", likes: 4, comments: 5, tag: "Marketing", tagExtra: "+1", category: "Marketing", author: "Avinash Raj", visual: { type: "annotations" } },
  { id: "ar-9", title: "Scratch your own itch", excerpt: "Stop chasing \"smart\" ideas. Follow your curiosity.", date: "Sep 05, 2025", likes: 3, comments: 3, tag: "Mindset", category: "Mindset", author: "Avinash Raj", visual: { type: "rainbow-road" } },
  { id: "ar-10", title: "200k followers, $5K MRR, 5.6% body fat", excerpt: "And a new project I just shipped.", date: "Aug 30, 2025", likes: 1, comments: 1, tag: "Personal", category: "Personal", author: "Avinash Raj", visual: { type: "video-celebration" } },
  { id: "ar-11", title: "Dreamers vs. Builders", excerpt: "The only thing between you and success is execution.", date: "Aug 23, 2025", likes: 2, comments: 1, tag: "Mindset", category: "Mindset", author: "Avinash Raj", visual: { type: "comic-seed-tree" } },
  { id: "ar-12", title: "You're already in the top 0.1%", excerpt: "And you probably don't even realize it.", date: "Aug 10, 2025", likes: 4, comments: 4, tag: "Mindset", tagExtra: "+1", category: "Mindset", author: "Avinash Raj", visual: { type: "mario-star" } },
  { id: "ar-13", title: "How I Built GateExam.org: An AI Prep Coach", excerpt: "From syllabus tracking to real-time mock tests with Next.js and pgvector.", date: "Jul 28, 2025", likes: 42, comments: 8, tag: "Product", tagExtra: "+2", category: "Product", author: "Avinash Raj", visual: { type: "gateexam-coach" } },
  { id: "ar-14", title: "Designing Delightful Interfaces with Micro-Interactions", excerpt: "Subtle physics, buttery spring transitions, and products that feel alive.", date: "Jun 14, 2025", likes: 19, comments: 6, tag: "Design", category: "Design", author: "Avinash Raj", visual: { type: "annotations" } },
  { id: "ar-15", title: "Cracking GATE CSE 2025: Strategy & Routine", excerpt: "What I learned preparing for core CS subjects while writing code daily.", date: "May 20, 2025", likes: 35, comments: 11, tag: "Mindset", category: "Mindset", author: "Avinash Raj", visual: { type: "online-counter", count: "GATE", sub: "2025 — Qualified in CSE" } },
]

const filterCategories = ["Audience", "Marketing", "Mindset", "Product", "Design", "Personal"]

/* ──────────────────────────────────────────────
   MAIN BLOG COMPONENT
   ────────────────────────────────────────────── */

export default function BlogClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [likedPosts, setLikedPosts] = useState({})
  const [activeModalPost, setActiveModalPost] = useState(null)

  const handleLike = (id) => setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }))

  const filteredArchive = useMemo(() => {
    return archivePostsData.filter((post) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q) || post.tag.toLowerCase().includes(q)
      const matchesCategory = !activeCategory || post.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  const postsPerPage = 6
  const totalPages = Math.ceil(filteredArchive.length / postsPerPage) || 1
  const displayedPosts = filteredArchive.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-20">
      {/* ─── HEADER ─── */}


      {/* ─── FEATURED POSTS ─── */}
      <section aria-label="Featured Posts" className="mb-14 sm:mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">Featured Posts</h2>
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Top Picks</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {featuredPostsData.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} isLiked={!!likedPosts[post.id]} onOpenPost={setActiveModalPost} />
          ))}
        </div>
      </section>

      {/* ─── LATEST POSTS ─── */}
      <section aria-label="Latest Posts" className="mb-14 sm:mb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950">Latest Posts</h2>
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Recently Published</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {latestPostsData.map((post) => (
            <PostCard key={post.id} post={post} onLike={handleLike} isLiked={!!likedPosts[post.id]} onOpenPost={setActiveModalPost} />
          ))}
        </div>
      </section>

      {/* ─── ARCHIVE ─── */}
      <section aria-label="Archive" className="pt-10 border-t border-neutral-200/70">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mb-5">Archive</h2>

        {/* Search */}
        <div className="relative w-full max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            placeholder="Search posts..."
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-white ring-1 ring-black/5 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setCurrentPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {filterCategories.map((cat) => {
            const active = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(active ? null : cat); setCurrentPage(1) }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  active
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "bg-white text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                {cat}
              </button>
            )
          })}
          {activeCategory && (
            <button onClick={() => { setActiveCategory(null); setCurrentPage(1) }} className="text-xs font-semibold text-neutral-400 hover:text-neutral-700 ml-1 transition-colors">
              Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {displayedPosts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} isLiked={!!likedPosts[post.id]} onOpenPost={setActiveModalPost} />
            ))}
          </div>
        ) : (
          <div className="py-14 text-center text-neutral-500 text-sm bg-white rounded-2xl ring-1 ring-black/5 shadow-sm">
            No articles found matching &ldquo;{searchQuery}&rdquo;
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-1 text-xs font-medium select-none">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition">First</button>
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center gap-0.5 px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition">
              <ChevronLeft className="h-3 w-3" /> Back
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setCurrentPage(n)} className={`h-8 w-8 rounded-lg font-bold transition ${currentPage === n ? "bg-neutral-950 text-white shadow-sm" : "bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 shadow-sm"}`}>{n}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="inline-flex items-center gap-0.5 px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition">
              Next <ChevronRight className="h-3 w-3" />
            </button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition">Last</button>
          </div>
        )}
      </section>

      {/* ─── POST DETAIL MODAL ─── */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setActiveModalPost(null)}>
          <div className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-2xl ring-1 ring-black/5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActiveModalPost(null)} className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors" aria-label="Close"><X className="h-5 w-5" /></button>

            <div className="mb-6"><PostVisual visual={activeModalPost.visual} tag={activeModalPost.tag} tagExtra={activeModalPost.tagExtra} /></div>

            <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
              <span>{activeModalPost.date}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => handleLike(activeModalPost.id)} className="flex items-center gap-1 hover:text-rose-500 transition-colors">
                  <Heart className={`h-4 w-4 ${likedPosts[activeModalPost.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                  <span>{activeModalPost.likes + (likedPosts[activeModalPost.id] ? 1 : 0)}</span>
                </button>
                <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /><span>{activeModalPost.comments}</span></span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 leading-tight">{activeModalPost.title}</h2>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
              <div className="relative h-6 w-6 rounded-md overflow-hidden bg-amber-100 ring-1 ring-black/5 shrink-0">
                <Image src="/myimage.png" alt={activeModalPost.author || "Avinash Raj"} fill sizes="24px" className="object-cover object-top" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-900">{activeModalPost.author || "Avinash Raj"}</p>
                <p className="text-[10px] text-neutral-400">Founder &amp; Builder</p>
              </div>
            </div>

            <div className="mt-6 text-sm sm:text-base leading-relaxed text-neutral-600 whitespace-pre-line">
              {activeModalPost.content || activeModalPost.excerpt}
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <button onClick={() => handleLike(activeModalPost.id)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${likedPosts[activeModalPost.id] ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"}`}>
                <Heart className={`h-4 w-4 ${likedPosts[activeModalPost.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                {likedPosts[activeModalPost.id] ? "Liked!" : "Like this post"}
              </button>
              <button onClick={() => setActiveModalPost(null)} className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-950 text-white hover:bg-neutral-800 transition-colors">Done Reading</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
