"use client"

import { usePathname } from "next/navigation"
import GlassNavDock from "./GlassNavDock"

export default function SiteShell({ children }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <div className="site-shell relative flex h-dvh flex-col overflow-hidden bg-neutral-50">
      <main
        className={`site-main relative z-10 flex min-h-0 flex-1 flex-col overscroll-contain bg-transparent ${
          isHome ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <GlassNavDock />
        {children}
      </main>
    </div>
  )
}
