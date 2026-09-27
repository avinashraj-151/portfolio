"use client"

import { usePathname } from "next/navigation"
import GlassNavDock from "./GlassNavDock"
import TopProgressBar from "./TopProgressBar"
import { ToastProvider } from "./ToastProvider"

export default function SiteShell({ children }) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const isWritePage = pathname?.startsWith("/blog/write")

  return (
    <ToastProvider>
      <div
        className={`site-shell relative flex h-dvh flex-col overflow-hidden ${
          isWritePage ? "bg-white" : "bg-neutral-50"
        }`}
      >
        <TopProgressBar />
        <main
          className={`site-main relative z-10 flex min-h-0 flex-1 flex-col overscroll-contain overflow-x-hidden ${
            isHome || isWritePage ? "overflow-y-hidden" : "overflow-y-auto"
          } bg-transparent`}
        >
          {!isWritePage && <GlassNavDock />}
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}

