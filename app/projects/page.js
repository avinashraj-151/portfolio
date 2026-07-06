import Image from "next/image"

const projects = [
  {
    title: "RealCalculators",
    description: "Smart calculator platform with instant scientific and financial tools.",
    image: "/project1.png",
    website: "https://www.realcalculators.com/",
    github: null,
  },
  {
    title: "GitHub Finder",
    description: "Search GitHub profiles and explore repositories in a clean dark UI.",
    image: "/project2.png",
    website: "https://githubusertracker.vercel.app/",
    github: "https://github.com/avinashraj-151/githubusertracker",
  },
  {
    title: "TestSeries",
    description: "GATE exam mock test platform with a real exam-like experience.",
    image: "/project3.png",
    website: "https://testseries-navy.vercel.app/",
    github: null,
  },
  {
    title: "NextMatch",
    description: "Modern dating app landing page with profile cards and match flow.",
    image: "/project4.png",
    website: "https://nextmatch-kappa.vercel.app/",
    github: "https://github.com/avinashraj-151/nextmatch",
  },
]

export default function Projects() {
  return (
    <section
      aria-label="Projects"
      className="flex flex-1 flex-col items-center px-6 pb-28 pt-16 sm:px-10 sm:pt-20"
    >
      <h1 className="text-center font-serif text-[clamp(3rem,12vw,6rem)] font-bold leading-none tracking-[-0.03em] text-neutral-950">
        Projects
      </h1>

      <ul className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-8 sm:mt-14 sm:gap-10">
        {projects.map((project) => (
          <li key={project.title}>
            <article className="group overflow-hidden rounded-3xl bg-white/40 ring-1 ring-neutral-950/8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)] transition-shadow duration-300 hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.4)]">
              <div className="relative aspect-video overflow-hidden bg-neutral-200">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={960}
                  height={540}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-neutral-950/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:gap-4">
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/40 bg-white/90 px-5 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-white sm:px-6 sm:py-2.5"
                  >
                    Website
                  </a>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/25 bg-neutral-950/80 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-950 sm:px-6 sm:py-2.5"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>

              <div className="px-5 py-4 sm:px-6 sm:py-5">
                <h2 className="text-lg font-semibold text-neutral-950 sm:text-xl">
                  {project.title}
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-neutral-600">
                  {project.description}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
