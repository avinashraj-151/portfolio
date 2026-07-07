export const metadata = {
    title: "Services",
    description:
        "Web app development, frontend development, backend APIs, database integration, realtime features, and performance improvements by Avinash Raj.",
    alternates: {
        canonical: "/services",
    },
}

const services = [
    {
        title: "Web App Development",
        description:
            "I build responsive and scalable web applications using React.js, Next.js, Node.js, and modern frontend tooling. From landing pages to full product flows, I focus on clean architecture and smooth user experience.",
    },
    {
        title: "Frontend Development",
        description:
            "I create responsive, polished interfaces with React.js, Next.js, Tailwind CSS, and component-driven design. My focus is on performance, clarity, and usability across devices.",
    },
    {
        title: "Backend Development & API Integration",
        description:
            "I build backend logic, server-side workflows, and REST APIs using Node.js and Express.js. I also integrate third-party services and connect frontend apps with reliable backend systems.",
    },
    {
        title: "Database Design & Integration",
        description:
            "I work with PostgreSQL, MongoDB, and Supabase to structure, store, and manage application data efficiently. I build database-driven applications with clean data flow and maintainable architecture.",
    },
    {
        title: "Realtime Features",
        description:
            "I build interactive product experiences such as realtime messaging, presence, and live updates for modern web applications.",
    },
    {
        title: "Performance & Product Improvements",
        description:
            "I improve application speed, UI responsiveness, and overall user experience by refining frontend performance, API flow, and product interactions.",
    },
]

const processSteps = [
    "Understand the product goal and user needs",
    "Plan a clean and scalable implementation",
    "Build the feature or product with clear communication",
    "Test, refine, and improve performance",
    "Deliver work that is practical, maintainable, and user-focused",
]

export default function Services() {
    return (
        <section
            aria-label="Services"
            className="flex flex-1 flex-col items-center px-6 pb-28 pt-16 sm:px-10 sm:pt-20"
        >
            <h1 className="text-center font-serif text-[clamp(3rem,12vw,6rem)] font-bold leading-none tracking-[-0.03em] text-neutral-950">
                Services
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-7 text-neutral-700 sm:mt-10 sm:text-base sm:leading-8">
                I help founders and businesses build fast, modern, and user-friendly web applications.
            </p>

            <div className="mt-14 w-full max-w-5xl sm:mt-16 lg:max-w-6xl">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(7rem,10rem)_1fr] sm:gap-x-14 lg:gap-x-24">
                    <h2 className="font-serif text-xl text-neutral-950 sm:text-2xl">
                        Offerings
                    </h2>

                    <ul className="space-y-8 sm:space-y-9">
                        {services.map((service) => (
                            <li key={service.title}>
                                <h3 className="text-base font-semibold text-neutral-950 sm:text-lg">
                                    {service.title}
                                </h3>
                                <p className="mt-2 text-sm leading-7 text-neutral-700 sm:text-base sm:leading-8">
                                    {service.description}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-6 border-t border-neutral-950/10 pt-14 sm:mt-16 sm:grid-cols-[minmax(7rem,10rem)_1fr] sm:gap-x-14 sm:pt-16 lg:gap-x-24">
                    <h2 className="font-serif text-xl text-neutral-950 sm:text-2xl">
                        Process
                    </h2>

                    <ul className="space-y-2.5 sm:space-y-3">
                        {processSteps.map((step) => (
                            <li
                                key={step}
                                className="flex gap-3 text-sm leading-7 text-neutral-950 sm:text-base sm:leading-8"
                            >
                                <span
                                    aria-hidden="true"
                                    className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neutral-950 sm:mt-3"
                                />
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-14 grid grid-cols-1 gap-6 border-t border-neutral-950/10 pt-14 sm:mt-16 sm:grid-cols-[minmax(7rem,10rem)_1fr] sm:gap-x-14 sm:pt-16 lg:gap-x-24">
                    <h2 className="font-serif text-xl text-neutral-950 sm:text-2xl">
                        Clients
                    </h2>

                    <p className="text-sm leading-7 text-neutral-950 sm:text-base sm:leading-8">
                        I work with startups, founders, and teams who need help building or improving web
                        products, dashboards, internal tools, and user-facing applications.
                    </p>
                </div>
            </div>
        </section>
    )
}
