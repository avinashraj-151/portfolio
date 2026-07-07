import Image from "next/image"

export const metadata = {
  alternates: {
    canonical: "/",
  },
}

export default function Home() {
  return (
    <section
      aria-label="Avinash Raj — Portfolio"
      className="home-hero relative flex flex-1 min-h-0 items-end justify-center overflow-hidden bg-transparent"
    >
      <div className="hero-scale relative z-10 flex h-full w-full min-h-0 items-end justify-center">
        <div className="home-hero__portrait-frame h-full w-full sm:contents">
          <Image
            src="/myimage.png"
            alt="Avinash Raj, software developer"
            width={1062}
            height={877}
            priority
            sizes="(max-width: 639px) 100vw, 960px"
            className="home-hero__portrait block h-full w-auto max-w-full object-contain object-bottom"
          />
        </div>
      </div>
    </section>
  )
}
