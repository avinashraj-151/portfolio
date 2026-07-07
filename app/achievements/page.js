export const metadata = {
    title: "Achievements",
    description:
        "Avinash Raj's achievements include GATE 2025 qualification, 600+ DSA problems solved, CodeChef 3-star rating, and strong coding profiles.",
    alternates: {
        canonical: "/achievements",
    },
}

import { codingProfiles } from "../data/codingProfiles"

const profileByLabel = Object.fromEntries(
    codingProfiles.map((profile) => [profile.label, profile.href])
)

const achievements = [
    "GATE 2025 qualified in CSE",
    "Solved 600+ DSA problems",
    { text: "CodeChef 3★ programmer", href: profileByLabel.CodeChef },
    { text: "LeetCode contest rating: 1517", href: profileByLabel.LeetCode },
    {
        text: "GeeksforGeeks Best Institute Rank: 58",
        href: profileByLabel.GeeksforGeeks,
    },
    {
        text: "HackerRank 5★ in C++, Python, and SQL",
        href: profileByLabel.HackerRank,
    },
]

export default function Achievements() {
    return (
        <section
            aria-label="Achievements"
            className="flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-16 sm:px-10 sm:pt-20"
        >
            <h1 className="text-center font-serif text-[clamp(3rem,12vw,6rem)] font-bold leading-none tracking-[-0.03em] text-neutral-950">
                Achievements
            </h1>

            <div className="mt-10 w-full max-w-5xl sm:mt-12 lg:max-w-6xl">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(7rem,10rem)_1fr] sm:gap-x-14 lg:gap-x-24">
                    <h2 className="text-center font-serif text-xl text-neutral-950 sm:text-left sm:text-2xl">
                        Highlights
                    </h2>

                    <ul className="mx-auto w-full max-w-2xl space-y-3 sm:mx-0 sm:space-y-3.5">
                        {achievements.map((achievement) => {
                            const text =
                                typeof achievement === "string"
                                    ? achievement
                                    : achievement.text
                            const href =
                                typeof achievement === "string"
                                    ? undefined
                                    : achievement.href

                            return (
                                <li
                                    key={text}
                                    className="flex gap-3 text-sm leading-7 text-neutral-950 sm:text-base sm:leading-8"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-neutral-950 sm:mt-3"
                                    />
                                    {href ? (
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transition-opacity hover:opacity-60"
                                        >
                                            {text}
                                        </a>
                                    ) : (
                                        <span>{text}</span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </section>
    )
}
