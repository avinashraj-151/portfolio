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

export default function Contact() {
    return (
        <section
            aria-label="Contact"
            className="flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-16 sm:px-10 sm:pt-20"
        >
            <h1 className="text-center font-serif text-[clamp(3rem,12vw,6rem)] font-bold leading-none tracking-[-0.03em] text-neutral-950">
                Contact
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-7 text-neutral-700 sm:mt-10 sm:text-base sm:leading-8">
                Have a project in mind, a role to discuss, or just want to say hello? I&apos;d love to hear from you.
            </p>

            <div className="mt-12 w-full max-w-5xl sm:mt-14 lg:max-w-6xl">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-[minmax(7rem,10rem)_1fr] sm:gap-x-14 lg:gap-x-24">
                    <h2 className="text-center font-serif text-xl text-neutral-950 sm:text-left sm:text-2xl">
                        Reach
                    </h2>

                    <ul className="mx-auto w-full max-w-md space-y-3 sm:mx-0 sm:max-w-lg">
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
                                    className="break-all text-neutral-950 transition-opacity hover:opacity-60 sm:break-normal"
                                >
                                    {link.value}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <CodingProfilesSection className="mt-14 border-t border-neutral-950/10 pt-14 sm:mt-16 sm:pt-16" />
            </div>
        </section>
    )
}
