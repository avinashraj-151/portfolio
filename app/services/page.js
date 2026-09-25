import Image from "next/image"
import Link from "next/link"
import {
  Code2,
  Layers,
  Server,
  Database,
  Zap,
  Gauge,
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MessageSquare,
  Sparkles,
  Monitor,
  Smartphone,
  Bot,
  Palette,
} from "lucide-react"

export const metadata = {
  title: "Services",
  description:
    "Web app development, frontend engineering, backend APIs, database design, AI tools, and performance optimization by Avinash Raj.",
  alternates: {
    canonical: "/services",
  },
}

const services = [
  {
    title: "Web App Development",
    description:
      "End-to-end web application development using React, Next.js, and modern tooling. From MVPs to production-ready SaaS platforms with clean architecture, SEO, and buttery-smooth UX.",
    icon: Monitor,
    color: "text-blue-600 bg-blue-50 border-blue-200/60",
    features: ["Next.js App Router", "Server Components", "Responsive Design", "SEO Optimized"],
  },
  {
    title: "Frontend Engineering",
    description:
      "Pixel-perfect, responsive interfaces with React, Tailwind CSS, and component-driven design. Focus on performance, accessibility, and interactions that feel alive.",
    icon: Layers,
    color: "text-violet-600 bg-violet-50 border-violet-200/60",
    features: ["React & Next.js", "Tailwind CSS", "Micro-animations", "Cross-browser"],
  },
  {
    title: "Backend & API Development",
    description:
      "Robust server-side logic, RESTful APIs, authentication flows, and third-party integrations built with Node.js, Express, and scalable patterns.",
    icon: Server,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
    features: ["Node.js & Express", "REST APIs", "JWT Auth", "API Integrations"],
  },
  {
    title: "Database Architecture",
    description:
      "Clean data modeling, optimized queries, and reliable database-driven applications using PostgreSQL, MongoDB, and Supabase.",
    icon: Database,
    color: "text-amber-600 bg-amber-50 border-amber-200/60",
    features: ["PostgreSQL", "MongoDB", "Supabase", "Data Modeling"],
  },
  {
    title: "AI-Powered Tools",
    description:
      "Building intelligent features — AI coaching, document parsing, RAG pipelines, semantic search, and smart automation into web products.",
    icon: Bot,
    color: "text-pink-600 bg-pink-50 border-pink-200/60",
    features: ["AI Integration", "RAG Pipelines", "Smart Search", "Automation"],
  },
  {
    title: "Performance & Optimization",
    description:
      "Auditing and improving application speed, Core Web Vitals, bundle sizes, and user experience. Getting Lighthouse scores from 60 to 99+.",
    icon: Gauge,
    color: "text-rose-600 bg-rose-50 border-rose-200/60",
    features: ["Lighthouse 99+", "Bundle Optimization", "Lazy Loading", "Core Web Vitals"],
  },
]

const processSteps = [
  {
    step: "01",
    title: "Discovery & Planning",
    description: "Understand your product goals, user needs, and technical requirements. Map out the architecture and define a clear roadmap.",
  },
  {
    step: "02",
    title: "Design & Prototype",
    description: "Create clean, intuitive interfaces with modern design patterns. Iterate quickly with live prototypes and feedback loops.",
  },
  {
    step: "03",
    title: "Build & Ship",
    description: "Develop production-ready code with clean architecture, testing, and performance optimization. Ship with confidence.",
  },
  {
    step: "04",
    title: "Refine & Support",
    description: "Post-launch improvements, bug fixes, performance monitoring, and ongoing feature development as your product grows.",
  },
]

const techStack = [
  "React.js", "Next.js", "TypeScript", "Node.js", "Express.js",
  "Tailwind CSS", "PostgreSQL", "MongoDB", "Supabase", "Python",
  "C++", "Git & GitHub", "REST APIs", "JWT Auth", "Vercel",
]

const projects = [
  {
    title: "GateExam.org",
    description: "AI-powered GATE CSE prep platform with mock tests, syllabus tracking, and weak-topic detection.",
    image: "/project5.png",
    href: "https://gateexam.org",
  },
  {
    title: "RealCalculators",
    description: "40+ instant scientific and financial calculators with Resend email automation.",
    image: "/project1.png",
    href: "https://www.realcalculators.com/",
  },
  {
    title: "NextMatch",
    description: "Modern dating app with real-time chat, profile cards, and match flow built with Supabase.",
    image: "/project4.png",
    href: "https://nextmatch-kappa.vercel.app/",
  },
]

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export default function Services() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-20">

      {/* ─── HERO ─── */}
      <section aria-label="Services Introduction" className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-neutral-200 border-2 border-white shadow-md shrink-0">
            <Image
              src="/myimage.png"
              alt="Avinash Raj"
              fill
              sizes="96px"
              priority
              className="object-cover object-top"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Available for projects
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950">
              Services
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
              I help founders, startups, and businesses build{" "}
              <strong className="text-neutral-950 font-semibold">fast, modern, and scalable</strong>{" "}
              digital products. From concept to deployment — clean code, premium design, and real results.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SERVICES GRID ─── */}
      <section aria-label="Service Offerings" className="mt-14 sm:mt-16">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
            <Code2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              What I Build
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Full-stack engineering services
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <article
                key={service.title}
                className="group p-5 sm:p-6 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className={`inline-flex p-2.5 rounded-xl border shrink-0 ${service.color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-950">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap gap-1.5">
                  {service.features.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-50 text-neutral-600 border border-neutral-200/60"
                    >
                      <CheckCircle2 className="h-3 w-3 text-neutral-400" />
                      {feat}
                    </span>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section aria-label="My Process" className="mt-14 sm:mt-16">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="p-2 rounded-xl bg-violet-50 text-violet-600 border border-violet-200/60">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              How I Work
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              From idea to shipped product
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {processSteps.map((item) => (
            <div
              key={item.step}
              className="relative p-5 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm"
            >
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-100 absolute top-4 right-4 select-none">
                {item.step}
              </span>
              <div className="relative z-10">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white text-xs font-bold">
                  {item.step}
                </span>
                <h3 className="mt-3 text-sm sm:text-base font-bold text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section aria-label="Tech Stack" className="mt-14 sm:mt-16">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              Tech Stack
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Tools and technologies I work with daily
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-white text-neutral-700 ring-1 ring-black/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ─── FEATURED WORK ─── */}
      <section aria-label="Featured Work" className="mt-14 sm:mt-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <Palette className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                Featured Work
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Products I&apos;ve built and shipped
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[15px] font-bold text-neutral-950">{project.title}</h3>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
                  View <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-3">
                {project.description}
              </p>
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section aria-label="Get In Touch" className="mt-14 sm:mt-16">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-400">
                Ready to build?
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                Let&apos;s work together.
              </h2>
              <p className="text-sm text-neutral-400 mt-1.5 max-w-md">
                Have a project in mind? I&apos;d love to help you build something great. Reach out and let&apos;s discuss your requirements.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="mailto:avinashrajraj628@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 text-sm font-bold transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Me
              </a>
              <a
                href="https://github.com/avinashraj-151"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
