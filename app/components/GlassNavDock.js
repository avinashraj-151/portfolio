"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Achievements", href: "/achievements" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
]

const ArrowIcon = ({ direction }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    {direction === "left" ? (
      <path d="M12 4 L6 10 L12 16" />
    ) : (
      <path d="M8 4 L14 10 L8 16" />
    )}
  </svg>
)

export default function GlassNavDock() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState("right")
  const current = navItems[activeIndex]

  const handlePrevious = () => {
    setSlideDirection("left")
    setActiveIndex((index) =>
      index === 0 ? navItems.length - 1 : index - 1
    )
  }

  const handleNext = () => {
    setSlideDirection("right")
    setActiveIndex((index) =>
      index === navItems.length - 1 ? 0 : index + 1
    )
  }

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 sm:bottom-8"
    >
      <div className="glass-dock flex items-center gap-3 rounded-4xl py-2 pl-2 pr-3 sm:gap-4 sm:py-2.5 sm:pl-2.5 sm:pr-4">
        <div className="glass-dock__avatar relative h-11 w-11 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12">
          <Image
            src="/myimage.png"
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div className="glass-dock__label-wrap relative shrink-0 overflow-hidden">
          <span
            aria-hidden="true"
            className="invisible block px-1 text-sm font-semibold uppercase tracking-[0.18em] sm:text-base"
          >
            Achievements
          </span>
          <Link
            key={activeIndex}
            href={current.href}
            aria-current={current.label === "Home" ? "page" : undefined}
            className={`glass-dock__label glass-dock__label--${slideDirection} absolute inset-0 flex items-center justify-center px-1 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-950 sm:text-base`}
          >
            {current.label}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-label="Previous section"
            onClick={handlePrevious}
            className="cursor-pointer glass-dock__arrow flex h-9 w-9 items-center justify-center rounded-full text-neutral-950 sm:h-10 sm:w-10"
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            type="button"
            aria-label="Next section"
            onClick={handleNext}
            className="cursor-pointer glass-dock__arrow flex h-9 w-9 items-center justify-center rounded-full text-neutral-950 sm:h-10 sm:w-10"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div>
    </nav>
  )
}
