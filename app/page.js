import Image from "next/image"

export default function Home() {
  return (
    <section
      aria-label="Avinash Raj — Portfolio"
      className="relative flex flex-1 min-h-0 items-end justify-center overflow-hidden bg-transparent"
    >
      <div className="hero-scale relative z-10 flex h-full w-full items-end justify-center">
        <Image
          src="/myimage.png"
          alt="Avinash Raj"
          width={960}
          height={1280}
          priority
          className="block h-full w-auto max-w-full object-contain object-bottom"
        />
      </div>
    </section>
  )
}
