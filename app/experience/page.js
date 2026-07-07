export const metadata = {
    title: "Experience",
    description:
        "Avinash Raj's software development experience with React, Next.js, Tailwind CSS, Node.js, Express, PostgreSQL, and MongoDB.",
    alternates: {
        canonical: "/experience",
    },
}

const experiences = [
    {
        period: "06/2025 – 06/2026",
        role: "Software Development Intern",
        company: "TechNova Solutions Private Limited, Noida",
        highlights: [
            "Worked with the Software Development Team on designing, developing, testing, and maintaining web-based applications.",
            "Developed front-end features using React.js, Next.js, and Tailwind CSS.",
            "Built and integrated REST APIs using Node.js and Express.js.",
            "Worked with databases including PostgreSQL and MongoDB.",
            "Implemented responsive user interfaces and improved application performance.",
            "Collaborated with cross-functional teams in an Agile environment.",
        ],
    },
]

export default function Experience() {
    return (
        <section
            aria-label="Experience"
            className="flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-16 sm:px-10 sm:pt-20"
        >
            <h1 className="text-center font-serif text-[clamp(3rem,12vw,6rem)] font-bold leading-none tracking-[-0.03em] text-neutral-950">
                Experience
            </h1>

            <ul className="mt-10 w-full max-w-3xl sm:mt-12">
                {experiences.map((experience) => (
                    <li key={experience.period}>
                        <article className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr] sm:gap-x-10">
                            <p className="whitespace-nowrap font-serif text-sm leading-6 text-neutral-950">
                                {experience.period}
                            </p>

                            <div>
                                <h2 className="text-base font-semibold text-neutral-950 sm:text-lg">
                                    {experience.role}
                                </h2>
                                <p className="mt-0.5 text-sm text-neutral-600 sm:text-base">
                                    {experience.company}
                                </p>

                                <ul className="mt-4 space-y-2">
                                    {experience.highlights.map((highlight) => (
                                        <li
                                            key={highlight}
                                            className="flex gap-2.5 text-sm leading-6 text-neutral-950"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-950"
                                            />
                                            <span>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
        </section>
    )
}
