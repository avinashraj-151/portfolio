import Link from "next/link"
import { Home, ArrowLeft, Briefcase, User, BookOpen } from "lucide-react"

export const metadata = {
  title: "404 — Page Not Found | Avinash Raj",
  description: "The page you're looking for doesn't exist or has been moved.",
}

const quickLinks = [
  { label: "Home", href: "/", icon: Home, desc: "Portfolio & projects" },
  { label: "About", href: "/about", icon: User, desc: "Background & skills" },
  { label: "Services", href: "/services", icon: Briefcase, desc: "What I build" },
  { label: "Blog", href: "/blog", icon: BookOpen, desc: "Articles & essays" },
]

export default function NotFound() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-36 pb-28 sm:pb-24 flex flex-col items-center text-center">
      {/* Large 404 Headline */}
      <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-neutral-950 font-mono">
        404
      </h1>

      <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
        Lost in digital space?
      </h2>

      <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed">
        The page you are looking for doesn&apos;t exist, was removed, or might have moved to another URL.
      </p>

      {/* Quick Navigation Cards */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
        {quickLinks.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 group-hover:bg-neutral-950 group-hover:text-white transition-colors">
                <Icon className="h-4 w-4" />
              </span>
              <span className="mt-2 text-xs font-bold text-neutral-900">
                {item.label}
              </span>
              <span className="text-[10px] text-neutral-500 mt-0.5">
                {item.desc}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Action CTA */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold shadow-xs transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Homepage
        </Link>
      </div>
    </div>
  )
}
