import CodingProfilesSection from "../components/CodingProfilesSection"

export default function Resume() {
    return (
        <section
            aria-label="Resume"
            className="flex flex-1 flex-col items-center px-6 pb-28 pt-16 sm:px-10 sm:pt-20"
        >
            <h1 className="text-center font-serif text-[clamp(3rem,12vw,6rem)] font-bold leading-none tracking-[-0.03em] text-neutral-950">
                Resume
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-7 text-neutral-700 sm:mt-10 sm:text-base sm:leading-8">
                My latest CV — view below or download a copy.
            </p>

            {/* <div className="mt-10 w-full max-w-4xl overflow-hidden rounded-3xl bg-white/40 ring-1 ring-neutral-950/8 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)] sm:mt-12">
                <iframe
                    src="/avinashrajcv.pdf"
                    title="Avinash Raj Resume"
                    className="h-[min(72vh,900px)] w-full border-0 bg-white"
                />
            </div> */}

            <a
                href="/avinashrajcv.pdf"
                download="avinashrajcv.pdf"
                className="mt-8 rounded-full border border-neutral-950/15 bg-white/60 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-white sm:mt-10"
            >
                Download PDF
            </a>

            <div className="mt-14 w-full max-w-5xl sm:mt-16 lg:max-w-6xl">
                <CodingProfilesSection className="border-t border-neutral-950/10 pt-14 sm:pt-16" />
            </div>
        </section>
    )
}