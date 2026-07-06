import CodingProfilesSection from "../components/CodingProfilesSection"

const contactLinks = [
    {
        label: "Email",
        href: "mailto:avinashrajraj628@gmail.com",
        value: "avinashrajraj628@gmail.com",
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/avinashraj1/",
        value: "avinashraj1",
    },
    {
        label: "GitHub",
        href: "https://github.com/avinashraj-151",
        value: "avinashraj-151",
    },
    {
        label: "Twitter",
        href: "https://x.com/avinashraj61815",
        value: "@avinashraj61815",
    },
]

export default function About() {
    return (
        <section
            aria-label="About"
            className="flex flex-1 flex-col items-center px-6 pb-36 pt-6 sm:px-10 sm:pb-40 sm:pt-8"
        >
            <header className="flex min-h-[70vh] w-full flex-col items-center justify-center text-center text-neutral-950 sm:min-h-[76vh]">
                <h1 className="text-center font-serif not-italic uppercase leading-[0.78] tracking-[-0.05em]">
                    <span className="block text-[clamp(6.5rem,30vw,17rem)] font-semibold">
                        Avinash
                    </span>
                    <span className="block pl-[clamp(3.25rem,11vw,7rem)] text-[clamp(6.5rem,30vw,17rem)] font-semibold">
                        Raj
                    </span>
                </h1>
                <p className="mt-8 w-full text-center font-sans text-[0.65rem] font-normal uppercase tracking-[0.22em] sm:mt-10 sm:text-xs">
                    (software developer)
                </p>
            </header>

            <div className="mt-4 w-full max-w-5xl sm:mt-10 lg:max-w-6xl">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(7rem,10rem)_1fr] sm:gap-x-14 lg:gap-x-24">
                    <h2 className="font-serif text-xl text-neutral-950 sm:text-2xl">
                        Profile
                    </h2>
                    <div>
                        <p className="max-w-2xl text-left text-sm leading-7 text-neutral-950 sm:text-base sm:leading-8">
                            Born in Chaugama, Bihar in 2001. I graduated with a degree in
                            Computer Science and Engineering from Lovely Professional University, Jalandhar in 2024,
                            qualified GATE in 2025, and currently work as a software developer intern at TechNova
                            Solutions in Noida. I love writing code, building products, and turning ideas into things
                            people can actually use.
                        </p>

                        <ul className="mt-8 max-w-md space-y-2 sm:mt-10">
                            {contactLinks.map((link) => (
                                <li
                                    key={link.label}
                                    className="grid grid-cols-[5.5rem_1fr] items-baseline gap-x-6 text-sm sm:grid-cols-[6rem_1fr] sm:gap-x-10 sm:text-base"
                                >
                                    <span className="text-neutral-950">{link.label}</span>
                                    <a
                                        href={link.href}
                                        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                                        rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                                        aria-label={`${link.label}: ${link.value}`}
                                        className="text-neutral-950 transition-opacity hover:opacity-60"
                                    >
                                        {link.value}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <CodingProfilesSection className="mt-14 border-t border-neutral-950/10 pt-14 sm:mt-16 sm:pt-16" />
            </div>
        </section>
    )
}