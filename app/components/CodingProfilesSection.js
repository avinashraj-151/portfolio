import { codingProfiles } from "../data/codingProfiles"

export default function CodingProfilesSection({ className = "" }) {
    return (
        <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-[minmax(7rem,10rem)_1fr] sm:gap-x-14 lg:gap-x-24 ${className}`}
        >
            <h2 className="text-center font-serif text-xl text-neutral-950 sm:text-left sm:text-2xl">
                Coding Profiles
            </h2>

            <ul className="mx-auto w-full max-w-md space-y-3 sm:mx-0 sm:max-w-lg">
                {codingProfiles.map((link) => (
                    <li
                        key={link.label}
                        className="grid grid-cols-[7.5rem_1fr] items-baseline gap-x-6 text-sm sm:grid-cols-[8.5rem_1fr] sm:gap-x-10 sm:text-base"
                    >
                        <span className="text-neutral-950">{link.label}</span>
                        <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${link.label}: ${link.value}`}
                            className="break-all text-neutral-950 transition-opacity hover:opacity-60 sm:break-normal"
                        >
                            {link.value}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
