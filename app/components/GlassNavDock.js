"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import {
  Home,
  User,
  BookOpen,
  Briefcase,
  LogIn,
  LogOut,
  SquarePen,
} from "lucide-react"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Blog", href: "/blog", icon: BookOpen },
]

export default function GlassNavDock() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const itemRefs = useRef([])
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

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
      className={`fixed max-sm:bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] max-sm:left-0 max-sm:right-0 max-sm:top-auto ${isHome ? "sm:absolute" : "sm:sticky"
        } sm:top-4 sm:bottom-auto z-50 w-full px-3 sm:px-6 pointer-events-none`}
    >
      <div className="relative mx-auto w-fit pointer-events-auto" ref={menuRef}>
        <div className="glass-navbar flex h-12 sm:h-13 w-fit items-center justify-center rounded-full bg-white backdrop-blur-xl px-3 sm:px-3.5 shadow-xl shadow-black/10 ring-1 ring-black/5">

          {/* Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="relative flex items-center overflow-x-auto no-scrollbar max-w-[calc(100vw-120px)] sm:max-w-none"
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

          {/* Divider */}
          <div
            className="mx-2 h-4 w-px bg-neutral-200/90 shrink-0 sm:mx-2.5"
            aria-hidden="true"
          />

          {/* Authentication Control */}
          {session?.user ? (
            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              aria-label="User profile menu"
              aria-expanded={userMenuOpen}
              className={`relative flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 cursor-pointer items-center justify-center rounded-full p-[2px] transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${userMenuOpen
                  ? "bg-neutral-950 shadow-xs"
                  : "bg-neutral-950/20 hover:bg-neutral-950/40"
                }`}
            >
              <div className="relative h-full w-full overflow-hidden rounded-full bg-neutral-100 flex items-center justify-center">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User avatar"}
                    width={34}
                    height={34}
                    unoptimized
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <span className="text-xs font-bold text-neutral-800">
                    {(session.user.name || "U")[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google")}
              className="relative z-10 flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-neutral-900 px-2.5 py-1.5 text-xs font-semibold tracking-wide text-white shadow-xs transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-neutral-800 hover:shadow-sm active:scale-[0.98] sm:px-3.5 sm:py-1.5"
            >
              <LogIn className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap font-medium text-xs">
                Login
              </span>
            </button>
          )}
        </div>

        {/* User Dropdown Menu - perfectly floating outside glass-navbar */}
        {userMenuOpen && session?.user && (
          <div className="absolute right-0 sm:top-full sm:mt-2.5 max-sm:bottom-full max-sm:mb-2.5 w-64 rounded-2xl bg-white p-3.5 shadow-2xl shadow-black/15 ring-1 ring-black/10 backdrop-blur-2xl transition-all duration-200 border border-neutral-100/90 z-50">
            {/* Header with Avatar & Details */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 bg-neutral-100 flex items-center justify-center">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    fill
                    unoptimized
                    className="object-cover object-center"
                  />
                ) : (
                  <span className="text-sm font-bold text-neutral-900">
                    {(session.user.name || "U")[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-neutral-950">
                  {session.user.name || "User"}
                </p>
                <p className="truncate text-[11px] text-neutral-500">
                  {session.user.email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-2.5 space-y-1.5">
              {session.user.role === "admin" && (
                <>
                  <Link
                    href="/blog/stories"
                    onClick={() => setUserMenuOpen(false)}
                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-800 transition-all duration-200 hover:bg-neutral-200/80 active:scale-[0.98]"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-neutral-600 transition-colors group-hover:text-neutral-900" />
                    <span>Stories</span>
                  </Link>

                  <Link
                    href="/blog/write?new=true"
                    onClick={() => setUserMenuOpen(false)}
                    className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-neutral-950 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:bg-neutral-800 hover:shadow-sm active:scale-[0.98]"
                  >
                    <SquarePen className="h-3.5 w-3.5 text-neutral-300 transition-colors group-hover:text-white" />
                    <span>Write</span>
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false)
                  signOut()
                }}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-rose-50/80 px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100/80 active:scale-[0.98]"
              >
                <LogOut className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}


