"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  Home,
  FolderGit2,
  User,
  Award,
  Trophy,
  Sparkles,
  Mail,
  FileText,
} from "lucide-react"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/projects", icon: FolderGit2 },
  { label: "About", href: "/about", icon: User },
  { label: "Experience", href: "/experience", icon: Award },
  { label: "Achievements", href: "/achievements", icon: Trophy },
  { label: "Services", href: "/services", icon: Sparkles },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "Resume", href: "/resume", icon: FileText },
]

export default function GlassNavDock() {
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const itemRefs = useRef([])
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })

  useEffect(() => {
    const updateActivePill = () => {
      const activeIdx = navItems.findIndex((item) =>
        item.href === "/"
          ? pathname === "/"
          : pathname?.startsWith(item.href)
      )
      if (activeIdx !== -1 && itemRefs.current[activeIdx]) {
        const el = itemRefs.current[activeIdx]
        setPillStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        })
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }))
      }
    }

    updateActivePill()
    window.addEventListener("resize", updateActivePill)
    return () => window.removeEventListener("resize", updateActivePill)
  }, [pathname])

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 px-2 max-w-full sm:bottom-6 max-sm:bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="glass-dock flex items-center gap-1 rounded-full px-2.5 py-2 shadow-2xl max-w-[calc(100vw-1rem)] overflow-x-auto no-scrollbar sm:gap-2 sm:px-3.5 sm:py-2.5">
        {/* Profile Avatar */}
        <Link
          href="/"
          aria-label="Home profile"
          className="group relative flex shrink-0 items-center pl-0.5 pr-1 sm:pl-1 sm:pr-2"
        >
          <div className="glass-dock__avatar relative h-8 w-8 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
            <Image
              src="/myimage.png"
              alt="Avinash Raj"
              width={40}
              height={40}
              className="h-full w-full object-cover object-top"
            />
          </div>

          {/* Avatar Tooltip */}
          <span className="pointer-events-none absolute -top-11 left-1/2 z-30 whitespace-nowrap rounded-lg bg-neutral-900/90 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:opacity-100 -translate-x-1/2">
            Avinash Raj
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900/90" />
          </span>
        </Link>

        {/* Separator */}
        <div className="mx-0.5 h-4 w-px shrink-0 bg-neutral-300/70 sm:mx-1 sm:h-5" />

        {/* Navigation Items Container with Relative Positioning for Sliding Pill */}
        <div className="relative flex items-center gap-1 sm:gap-1.5">
          {/* Sliding Glass Active Pill Indicator */}
          <div
            className="glass-pill-active"
            style={{
              transform: `translateX(${pillStyle.left}px)`,
              width: `${pillStyle.width}px`,
              opacity: pillStyle.opacity,
            }}
          />

          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href)

            return (
              <div
                key={item.href}
                ref={(el) => (itemRefs.current[index] = el)}
                className="group relative flex items-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating Tooltip */}
                <span className="pointer-events-none absolute -top-11 left-1/2 z-30 whitespace-nowrap rounded-lg bg-neutral-900/90 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:opacity-100 -translate-x-1/2">
                  {item.label}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900/90" />
                </span>

                {/* Nav Link Pill */}
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative z-10 flex shrink-0 items-center justify-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ease-out sm:px-4 sm:py-2.5 ${
                    isActive
                      ? "text-white font-bold scale-[1.02]"
                      : "text-neutral-600 hover:-translate-y-0.5 hover:text-neutral-950"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 sm:h-[1.125rem] sm:w-[1.125rem] ${
                      hoveredIndex === index ? "scale-110" : ""
                    } ${isActive ? "text-white" : "text-neutral-600"}`}
                  />
                  <span className="hidden sm:inline whitespace-nowrap font-semibold">
                    {item.label}
                  </span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}


