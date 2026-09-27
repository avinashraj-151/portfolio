"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function TopProgressBarInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const timerRef = useRef(null)
  const completeTimerRef = useRef(null)

  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current)

    setIsVisible(true)
    setProgress(20)

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev + 0.3 <= 95 ? prev + 0.3 : prev
        }
        if (prev >= 75) {
          return prev + Math.random() * 2 + 0.5
        }
        if (prev >= 50) {
          return prev + Math.random() * 4 + 1
        }
        return prev + Math.random() * 12 + 4
      })
    }, 150)
  }

  const completeProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setProgress(100)
    completeTimerRef.current = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        setProgress(0)
      }, 250)
    }, 250)
  }

  // Complete progress on pathname or searchParams change
  useEffect(() => {
    if (isVisible) {
      completeProgress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  // Global click interception to trigger progress bar before navigation
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      // Skip non-navigational links
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.href)
        if (targetUrl.origin !== window.location.origin) return

        // Same location check
        if (
          targetUrl.pathname === window.location.pathname &&
          targetUrl.search === window.location.search
        ) {
          return
        }

        // Start progress immediately
        startProgress()
      } catch {
        // ignore invalid URL
      }
    }

    const handleCustomStart = () => startProgress()
    const handleCustomComplete = () => completeProgress()

    document.addEventListener("click", handleClick, { capture: true })
    window.addEventListener("start-top-progress", handleCustomStart)
    window.addEventListener("stop-top-progress", handleCustomComplete)

    return () => {
      document.removeEventListener("click", handleClick, { capture: true })
      window.removeEventListener("start-top-progress", handleCustomStart)
      window.removeEventListener("stop-top-progress", handleCustomComplete)
      if (timerRef.current) clearInterval(timerRef.current)
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current)
    }
  }, [])

  if (!isVisible && progress === 0) return null

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none transition-opacity duration-200 ease-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Sleek black progress bar matching portfolio theme */}
      <div
        className="h-[2.5px] bg-neutral-950 shadow-[0_1px_8px_rgba(0,0,0,0.35),0_0_2px_rgba(0,0,0,0.5)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  )
}

export default function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <TopProgressBarInner />
    </Suspense>
  )
}
