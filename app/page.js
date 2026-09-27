import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Mail,
  ArrowUpRight,
  GraduationCap,
  Calculator,
  Search,
  ClipboardList,
  Heart,
  Code2,
  Bot,
  Smartphone,
  Palette,
  ArrowDown,
  Briefcase,
} from "lucide-react"

export const metadata = {
  title: "Avinash Raj | Software Developer",
  description:
    "Building useful products and AI-powered tools. Full-stack web development, mobile apps, and UI/UX design.",
  alternates: {
    canonical: "/",
  },
}

function GithubIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

function LinkedinIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37z" />
    </svg>
  )
}

function XIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const whatIDo = [
  { label: "Web App Development", icon: Code2 },
  { label: "AI-Powered Tools", icon: Bot },
  { label: "Mobile App Development", icon: Smartphone },
  { label: "UI/UX & Product Prototyping", icon: Palette },
]

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/avinashraj-151",
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/avinashraj1/",
    icon: LinkedinIcon,
  },
  {
    label: "X",
    href: "https://x.com/avinashraj61815",
    icon: XIcon,
  },
  {
    label: "Email",
    href: "mailto:avinashrajraj628@gmail.com",
    icon: Mail,
  },
]

const projects = [
  {
    title: "GateExam",
    description: "AI prep coach for GATE CSE — syllabus, weak topics, mock exams.",
    image: "/project5.png",
    website: "https://gateexam.org",
    icon: GraduationCap,
    accent: "text-violet-600 bg-violet-50",
  },
  {
    title: "RealCalculators",
    description: "Instant scientific and financial tools, no account needed.",
    image: "/project1.png",
    website: "https://www.realcalculators.com/",
    icon: Calculator,
    accent: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "GitHub Finder",
    description: "Search GitHub users and repos in a clean dark UI.",
    image: "/project2.png",
    website: "https://githubusertracker.vercel.app/",
    icon: Search,
    accent: "text-neutral-800 bg-neutral-100",
  },
  {
    title: "TestSeries",
    description: "GATE-style mock tests with a real exam experience.",
    image: "/project3.png",
    website: "https://testseries-navy.vercel.app/",
    icon: ClipboardList,
    accent: "text-blue-600 bg-blue-50",
  },
  {
    title: "NextMatch",
    description: "Profile cards and match flow for a modern dating app.",
    image: "/project4.png",
    website: "https://nextmatch-kappa.vercel.app/",
    icon: Heart,
    accent: "text-rose-600 bg-rose-50",
  },
]

export default function Home() {
  return (
    <div className="home-split no-scrollbar relative z-0 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-5 sm:px-8 lg:flex-row lg:gap-14 lg:overflow-hidden lg:px-12 lg:pb-0 xl:gap-16 xl:px-16">
      {/* LEFT: identity stays put; padded so it sits below the overlay nav */}
      <aside className="flex w-full shrink-0 flex-col pt-8 sm:pt-28 lg:h-full lg:w-[340px] lg:overflow-hidden lg:pt-28 xl:w-[380px]">
        <div className="flex flex-col items-center lg:items-start">
          <div className="relative h-28 w-28 overflow-hidden rounded-full bg-neutral-200 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
            <Image
              src="/myimage.png"
              alt="Avinash Raj"
              fill
              sizes="144px"
              priority
              className="object-cover object-top"
            />
          </div>

          <h1 className="mt-5 text-center text-4xl font-extrabold leading-none tracking-tight text-neutral-950 sm:text-5xl lg:text-left">
            Avinash Raj
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium text-neutral-600 lg:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-neutral-400" />
              India
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for work
            </span>
          </div>

          <p className="mt-6 text-center text-lg font-semibold leading-snug text-neutral-950 lg:text-left">
            I build useful products and AI tools.
          </p>

          <p className="mt-5 max-w-sm text-center text-[15px] leading-relaxed text-neutral-600 lg:text-left">
            I help startups, founders, and businesses build fast, clean, and
            scalable digital products.
          </p>

          <div className="mt-6 w-full max-w-sm">
            <p className="text-center text-sm font-semibold text-neutral-950 lg:text-left">
              What I do
            </p>
            <ul className="mt-3 space-y-2">
              {whatIDo.map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.label}
                    className="flex items-center justify-center gap-2.5 text-sm font-medium text-neutral-700 lg:justify-start"
                  >
                    <Icon className="h-4 w-4 text-neutral-400" />
                    {item.label}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* CTA Buttons: Hire Me & Services */}
          <div className="mt-6 flex w-full max-w-sm items-center gap-2.5">
            <div className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white shadow-xs cursor-default select-none">
              <span>Hire Me</span>
              <ArrowDown className="h-4 w-4" />
            </div>
            <Link
              href="/services"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 shadow-2xs transition-colors hover:bg-neutral-50 active:scale-[0.98]"
            >
              <Briefcase className="h-4 w-4 text-neutral-500" />
              <span>Services</span>
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {socials.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    social.href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  aria-label={social.label}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950 text-white transition-colors hover:bg-neutral-800"
                >
                  <Icon className="h-6 w-6" />
                </a>
              )
            })}
          </div>
        </div>
      </aside>

      {/* RIGHT: product grid, scrolls on desktop */}
      <section
        aria-label="Projects"
        className="no-scrollbar mt-8 min-h-0 min-w-0 flex-1 lg:mt-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain"
      >
        <div className="grid grid-cols-1 gap-5 pb-24 sm:pb-4 sm:grid-cols-2 sm:gap-6 lg:pt-28 lg:pr-2 lg:pb-5">
          {projects.map((project, index) => {
            const Icon = project.icon
            return (
              <a
                key={project.title}
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <h2 className="truncate text-[15px] font-bold text-neutral-950">
                      {project.title}
                    </h2>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
                    View
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>

                <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-neutral-500">
                  {project.description}
                </p>

                <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100/70">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 640px) 100vw, 40vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}
