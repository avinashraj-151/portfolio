import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  GraduationCap,
  Trophy,
  Award,
  Code2,
  Terminal,
  ArrowUpRight,
  Mail,
  Sparkles,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Database,
  Layers,
  Globe,
} from "lucide-react"
import { codingProfiles } from "../data/codingProfiles"

export const metadata = {
  title: "About",
  description:
    "Learn about Avinash Raj — Software Developer, creator of GateExam.org, GATE 2025 qualifier, Computer Science graduate from LPU, and full-stack engineer.",
  alternates: {
    canonical: "/about",
  },
}

function GithubIcon({ className = "w-4 h-4" }) {
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

function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37z" />
    </svg>
  )
}

function XIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const stats = [
  {
    number: "GATE 2025",
    label: "Qualified in CSE",
    detail: "National competitive exam",
    icon: Award,
    color: "text-amber-600 bg-amber-50 border-amber-200/60",
  },
  {
    number: "600+",
    label: "DSA Problems Solved",
    detail: "LeetCode, CodeChef, GFG",
    icon: Code2,
    color: "text-blue-600 bg-blue-50 border-blue-200/60",
  },
  {
    number: "3★",
    label: "CodeChef Rating",
    detail: "Competitive Programmer",
    icon: Trophy,
    color: "text-violet-600 bg-violet-50 border-violet-200/60",
  },
  {
    number: "5★",
    label: "HackerRank Gold",
    detail: "C++, Python & SQL",
    icon: Terminal,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200/60",
  },
]

const achievements = [
  {
    title: "GATE 2025 Qualified in Computer Science",
    category: "Competitive Exam",
    description:
      "Successfully cracked the prestigious Graduate Aptitude Test in Engineering (GATE CSE 2025), demonstrating strong fundamentals in algorithms, OS, DBMS, computer networks, and theory of computation.",
    badge: "GATE 2025",
    icon: Award,
  },
  {
    title: "600+ Data Structures & Algorithms Solved",
    category: "Problem Solving",
    description:
      "Solved 600+ problems across LeetCode, CodeChef, and GeeksforGeeks covering trees, dynamic programming, graphs, binary search, and system design principles.",
    badge: "600+ Solved",
    icon: Code2,
  },
  {
    title: "CodeChef 3-Star Programmer",
    category: "Competitive Coding",
    description:
      "Achieved a 3-star rating on CodeChef through consistent contest participation and timed algorithmic problem solving.",
    badge: "3★ Star",
    icon: Trophy,
    href: "https://www.codechef.com/users/avinashraj1234",
  },
  {
    title: "LeetCode Contest Rating: 1517",
    category: "Competitive Coding",
    description:
      "Active participant in LeetCode weekly and bi-weekly algorithmic contests with an established contest rating of 1517.",
    badge: "1517 Rating",
    icon: Terminal,
    href: "https://leetcode.com/u/avinashrajraj628/",
  },
  {
    title: "GeeksforGeeks Institute Rank: #58",
    category: "Academic Ranking",
    description:
      "Ranked #58 overall in the university institute leaderboard on GeeksforGeeks with comprehensive problem-solving submissions.",
    badge: "Rank #58",
    icon: GraduationCap,
    href: "https://www.geeksforgeeks.org/profile/avinashrajraj628",
  },
  {
    title: "HackerRank 5-Star in C++, Python & SQL",
    category: "Language Certifications",
    description:
      "Earned 5-star gold badges across core programming languages and database query design on HackerRank.",
    badge: "5★ Gold",
    icon: CheckCircle2,
    href: "https://www.hackerrank.com/profile/Avinashrajraj628",
  },
]

const experiences = [
  {
    role: "Full-Stack Developer & Creator",
    company: "GateExam.org",
    period: "2025 – Present",
    status: "Currently Building",
    description:
      "Architecting and developing GateExam.org — an AI-powered prep hub and mock exam platform for GATE CSE aspirants featuring interactive syllabus tracking, weak-topic detection, and real exam-like PYQ mock tests.",
    website: "https://gateexam.org",
    skills: ["Next.js", "React", "Node.js", "Tailwind CSS", "AI Coaching Tools", "PostgreSQL"],
  },
  {
    role: "Software Development Intern",
    company: "TechNova Solutions Private Limited, Noida",
    period: "06/2025 – 06/2026",
    status: "Completed",
    description:
      "Worked with the Software Development Team on designing, developing, testing, and maintaining scalable web applications. Developed frontend features with React and Next.js, built REST APIs with Node.js/Express, and managed PostgreSQL & MongoDB databases.",
    website: null,
    skills: ["React.js", "Next.js", "Express.js", "REST APIs", "PostgreSQL", "MongoDB", "Agile"],
  },
]

const skillCategories = [
  {
    title: "Frontend Engineering",
    icon: Layers,
    skills: ["React.js", "Next.js (App Router)", "JavaScript (ES6+)", "TypeScript", "Tailwind CSS", "HTML5 & Semantic Web", "Responsive Design", "Component-Driven Architecture"],
  },
  {
    title: "Backend & Systems",
    icon: Cpu,
    skills: ["Node.js", "Express.js", "RESTful API Design", "Authentication & JWT", "Server-Side Rendering (SSR)", "API Integration"],
  },
  {
    title: "Databases & Storage",
    icon: Database,
    skills: ["PostgreSQL", "MongoDB", "Supabase", "SQL Query Optimization", "Data Modeling", "Mongoose"],
  },
  {
    title: "Core & Methodologies",
    icon: Terminal,
    skills: ["Data Structures & Algorithms", "C++", "Python", "Git & GitHub", "Agile / Scrum", "Web Performance Optimization", "Problem Solving"],
  },
]

const education = [
  {
    degree: "B.Tech — Computer Science & Engineering",
    institution: "Lovely Professional University (LPU)",
    location: "Jalandhar, Punjab, India",
    period: "2020 – 2024",
    grade: "CGPA: 7.03",
    description:
      "Comprehensive coursework covering Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks, and Object-Oriented Programming.",
    highlight: "Graduated with 7.03 CGPA",
  },
  {
    degree: "Higher Secondary Education (Class XII — Science)",
    institution: "Marigold Public School",
    location: "Delhi, India",
    period: "2017 – 2019",
    grade: "Score: 64.2%",
    description:
      "Core focus on Physics, Chemistry, Mathematics (PCM), and Computer Science fundamentals.",
    highlight: "Science (PCM) Stream",
  },
]

const certifications = [
  {
    title: "Data Structures & Algorithms",
    issuer: "GeeksforGeeks",
    type: "DSA Specialization",
  },
  {
    title: "C++ Programming: Beginner to Advanced",
    issuer: "Udemy",
    type: "Programming Language",
  },
  {
    title: "Oracle SQL",
    issuer: "Udemy",
    type: "Database Query Design",
  },
]

export default function About() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-20">
      {/* HERO / BIO HEADER */}
      <section aria-label="Introduction" className="text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Avatar */}
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-3xl overflow-hidden bg-neutral-200 border-2 border-white shadow-md shrink-0">
            <Image
              src="/myimage.png"
              alt="Avinash Raj"
              fill
              sizes="128px"
              priority
              className="object-cover object-top"
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Available for work & freelance
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                <MapPin className="h-3 w-3 text-neutral-500" />
                Bihar, India
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950">
              Avinash Raj
            </h1>
            <p className="text-base sm:text-lg font-medium text-neutral-600 mt-1">
              Software Developer & Full-Stack Builder
            </p>

            <p className="mt-4 text-sm sm:text-base text-neutral-700 leading-relaxed max-w-3xl">
              Born in Bihar in 2001. Graduated with a B.Tech in Computer Science and Engineering from{" "}
              <strong className="text-neutral-950 font-semibold">Lovely Professional University</strong> (2024), qualified{" "}
              <strong className="text-neutral-950 font-semibold">GATE CSE 2025</strong>, and currently building{" "}
              <strong className="text-neutral-950 font-semibold">GateExam.org</strong>. I love architecting robust digital products, solving algorithmic challenges, and shipping high-performance web applications.
            </p>

            {/* Quick Hero Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a
                href="mailto:avinashrajraj628@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold shadow-xs transition-colors"
              >
                <Mail className="h-4 w-4" />
                Email Me
              </a>
              <a
                href="https://github.com/avinashraj-151"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold border border-neutral-200 shadow-2xs transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS CARDS */}
      <section aria-label="Key Stats" className="mt-10 sm:mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex flex-col p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex p-2 rounded-xl border ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-950">
                  {stat.number}
                </span>
                <span className="text-xs sm:text-sm font-bold text-neutral-800 mt-0.5">
                  {stat.label}
                </span>
                <span className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
                  {stat.detail}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* CURRENT WORK & EXPERIENCE */}
      <section aria-label="Experience & Work" className="mt-14 sm:mt-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
              <Briefcase className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                Experience & Building
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Products built and engineering roles
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {experiences.map((exp) => (
            <article
              key={exp.company}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-sm hover:border-neutral-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-950">
                      {exp.role}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {exp.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-semibold text-neutral-700">
                      {exp.company}
                    </span>
                    {exp.website && (
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Visit <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-neutral-500 shrink-0">
                  {exp.period}
                </span>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {exp.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-neutral-100">
                {exp.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-md bg-neutral-50 text-neutral-600 border border-neutral-200/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS SECTION */}
      <section aria-label="Achievements" className="mt-14 sm:mt-16">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              Key Achievements
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Competitive coding milestones, certifications, and national exam
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      {item.category}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-neutral-600 shrink-0" />
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.href && (
                  <div className="mt-4 pt-3 border-t border-neutral-100">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View Profile / Proof <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* TECHNICAL SKILLS */}
      <section aria-label="Skills & Expertise" className="mt-14 sm:mt-16">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60">
            <Code2 className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              Technical Stack & Skills
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Core technologies, frameworks, and engineering tools
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skillCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <div
                key={cat.title}
                className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4 text-neutral-500" />
                  <h3 className="text-sm font-bold text-neutral-900">
                    {cat.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-block px-2.5 py-1 text-xs font-medium rounded-lg bg-neutral-50 text-neutral-700 border border-neutral-200/70"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CODING PROFILES SECTION */}
      <section aria-label="Coding Profiles" className="mt-14 sm:mt-16">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <Terminal className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              Coding Profiles
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Track record across competitive programming and developer platforms
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {codingProfiles.map((profile) => (
            <a
              key={profile.label}
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all"
            >
              <div>
                <span className="text-xs font-medium text-neutral-500 block">
                  {profile.label}
                </span>
                <span className="text-sm font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  {profile.value}
                </span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
            </a>
          ))}
        </div>
      </section>

      {/* EDUCATION & CERTIFICATIONS */}
      <section aria-label="Education" className="mt-14 sm:mt-16">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              Education & Certifications
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Academic qualifications and professional certifications from my resume
            </p>
          </div>
        </div>

        {/* Degrees */}
        <div className="space-y-4">
          {education.map((item) => (
            <div
              key={item.degree}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-xs hover:border-neutral-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-950">
                      {item.degree}
                    </h3>
                    {/* <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {item.grade}
                    </span> */}
                  </div>
                  <p className="text-sm font-semibold text-neutral-700 mt-0.5">
                    {item.institution} <span className="text-neutral-400 font-normal">• {item.location}</span>
                  </p>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-500 shrink-0">
                  {item.period}
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Certifications Sub-grid */}
        <div className="mt-6 pt-6 border-t border-neutral-200/70">
          <h3 className="text-sm font-bold text-neutral-950 mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-neutral-500" />
            Certifications & Training
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {certifications.map((cert) => (
              <div
                key={cert.title}
                className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs"
              >
                <span className="text-[11px] font-semibold text-neutral-400 block uppercase tracking-wider">
                  {cert.type}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mt-0.5">
                  {cert.title}
                </h4>
                <span className="text-xs text-neutral-500 font-medium mt-1 inline-block">
                  {cert.issuer}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GET IN TOUCH / FOOTER CARD */}
      <section aria-label="Contact" className="mt-14 sm:mt-16">
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Let&apos;s build something great together.
            </h2>
            <p className="text-sm text-neutral-400 mt-1.5 max-w-lg">
              Whether you have an interesting project, full-time role, freelance opportunity, or just want to connect — my inbox is always open.
            </p>
            <div className="flex items-center gap-3 mt-4 text-neutral-400">
              <a
                href="https://github.com/avinashraj-151"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-white transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/avinashraj1/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-white transition-colors"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/avinashraj61815"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="hover:text-white transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href="mailto:avinashrajraj628@gmail.com"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-950 text-sm font-bold shadow-sm transition-colors"
            >
              <Mail className="h-4 w-4" />
              Email Me
            </a>
            <a
              href="https://github.com/avinashraj-151"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold transition-colors"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
