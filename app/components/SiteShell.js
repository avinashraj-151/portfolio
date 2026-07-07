import Link from "next/link"
import GlassNavDock from "./GlassNavDock"

export default function SiteShell({ children }) {
  return (
    <div className="site-shell relative flex h-dvh flex-col overflow-hidden bg-neutral-50">
      <div aria-hidden="true" className="watermark-bg" />

      <header className="site-header relative z-30 shrink-0 bg-transparent px-6 text-center sm:px-10 sm:py-4">
        <p className="mx-auto max-w-md text-sm leading-6 text-neutral-600 sm:max-w-none sm:text-base">
          <span className="group inline-flex items-center font-medium text-neutral-950">
            <Link href="/">
              <span className="cursor-pointer transition-transform duration-300 ease-in-out group-hover:-translate-x-2">
                Avinash Raj
              </span>
            </Link>
            <span
              aria-hidden="true"
              className="inline-flex w-0 translate-x-1 overflow-hidden opacity-0 transition-all duration-300 ease-in-out group-hover:ml-1.5 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 shrink-0"
              >
                <path d="M2 10 H12" />
                <path d="M12 10 V15" />
                <path d="M9 12.5 L12 15.5 L15 12.5" />
              </svg>
            </span>
          </span>{" "}
          is a software Developer from India.
        </p>
      </header>

      <main className="site-main relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-transparent">
        {children}
      </main>

      <GlassNavDock />
    </div>
  )
}
