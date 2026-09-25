"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  Home,
  User,
  BookOpen,
  Briefcase,
} from "lucide-react"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Blog", href: "/blog", icon: BookOpen },
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

  const isHome = pathname === "/"

  return (
    <header
      className={`fixed max-sm:bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] max-sm:left-0 max-sm:right-0 max-sm:top-auto ${
        isHome ? "sm:absolute" : "sm:sticky"
      } sm:top-4 sm:bottom-auto z-50 w-full px-3 sm:px-6 pointer-events-none`}
    >
      <div className="glass-navbar pointer-events-auto mx-auto flex h-12 sm:h-13 w-fit items-center justify-center rounded-full bg-white backdrop-blur-xl px-2.5 sm:px-3 shadow-xl shadow-black/10 ring-1 ring-black/5">

        {/* Right: Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="relative flex items-center overflow-x-auto no-scrollbar max-w-[calc(100vw-40px)] sm:max-w-none"
        >
          <div className="relative flex items-center gap-0.5 sm:gap-1 py-1">
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
                  {/* Nav Link Pill */}
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative z-10 flex shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ease-out sm:px-3 sm:py-1.5 ${isActive
                      ? "text-neutral-950 font-bold"
                      : "text-neutral-600 hover:text-neutral-950"
                      }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 sm:h-4 sm:w-4 ${hoveredIndex === index ? "scale-110" : ""
                        } ${isActive ? "text-neutral-950" : "text-neutral-600"}`}
                    />
                    <span className="whitespace-nowrap font-medium text-xs">
                      {item.label}
                    </span>
                  </Link>
                </div>
              )
            })}
          </div>
        </nav>
      </div>
    </header>
  )
}


