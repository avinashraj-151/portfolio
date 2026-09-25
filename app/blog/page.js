import Link from "next/link"
import { Sparkles, ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react"

export const metadata = {
  title: "Blog ",
  description:
    "Articles on full-stack architecture, Next.js, building GateExam.org, cracking competitive CS exams, and product engineering by Avinash Raj. Coming soon.",
  alternates: {
    canonical: "/blog",
  },
}

const upcomingTopics = [
  "Next.js Architecture",
  "Building GateExam.org",
  "GATE CSE Prep Strategy",
  "Full-Stack Engineering",
  "AI & LLM Tooling",
  "Micro-Interactions & UI",
]

export default function BlogPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-36 pb-28 sm:pb-24 flex flex-col items-center text-center">

      {/* Center Icon Card */}
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-neutral-200/80 shadow-sm ring-1 ring-black/5">
        <BookOpen className="h-7 w-7 text-neutral-900" />
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950">
        Blog &amp; Essays
      </h1>

      {/* Description */}
      <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
        I&apos;m currently writing in-depth essays, architectural breakdowns, and lessons learned building digital products and cracking competitive exams.
      </p>

      {/* Upcoming Topic Tags */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-lg">
        {upcomingTopics.map((topic) => (
          <span
            key={topic}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white text-neutral-700 border border-neutral-200/80 shadow-2xs hover:border-neutral-300 transition-colors"
          >
            #{topic}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold shadow-xs transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold border border-neutral-200 shadow-2xs transition-colors"
        >
          Explore Services
          <ArrowUpRight className="h-4 w-4 text-neutral-500" />
        </Link>
      </div>
    </div>
  )
}
