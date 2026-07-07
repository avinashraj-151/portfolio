import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import SiteShell from "./components/SiteShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL("https://avinashraj.dev");

const siteDescription =
  "Avinash Raj is a software developer building fast, responsive web apps with React, Next.js, Node.js, Express, PostgreSQL, MongoDB, and Tailwind CSS.";

export const metadata = {
  metadataBase: siteUrl,
  applicationName: "Avinash Raj Portfolio",
  title: {
    default: "Avinash Raj | Software Developer",
    template: "%s | Avinash Raj",
  },
  description: siteDescription,
  keywords: [
    "Avinash Raj",
    "software developer",
    "full stack developer",
    "frontend developer",
    "React developer",
    "Next.js developer",
    "Node.js developer",
    "web app development",
    "portfolio",
  ],
  authors: [{ name: "Avinash Raj", url: siteUrl.toString() }],
  creator: "Avinash Raj",
  publisher: "Avinash Raj",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Avinash Raj Portfolio",
    title: "Avinash Raj | Software Developer",
    description: siteDescription,
    images: [
      {
        url: "/myimage.png",
        width: 1062,
        height: 877,
        alt: "Avinash Raj",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avinash Raj | Software Developer",
    description: siteDescription,
    creator: "@avinashraj61815",
    images: ["/myimage.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Avinash Raj",
  url: siteUrl.toString(),
  image: new URL("/myimage.png", siteUrl).toString(),
  jobTitle: "Software Developer",
  alumniOf: "Lovely Professional University",
  worksFor: {
    "@type": "Organization",
    name: "TechNova Solutions Private Limited",
  },
  knowsAbout: [
    "React.js",
    "Next.js",
    "Node.js",
    "Express.js",
    "Tailwind CSS",
    "PostgreSQL",
    "MongoDB",
    "REST APIs",
    "Web application development",
  ],
  sameAs: [
    "https://www.linkedin.com/in/avinashraj1/",
    "https://github.com/avinashraj-151",
    "https://x.com/avinashraj61815",
    "https://leetcode.com/u/avinashrajraj628/",
    "https://www.codechef.com/users/avinashraj1234",
    "https://www.geeksforgeeks.org/profile/avinashrajraj628",
    "https://www.hackerrank.com/profile/Avinashrajraj628",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full overflow-hidden overscroll-none antialiased`}
    >
      <body className="h-full overflow-hidden overscroll-none bg-neutral-50 font-sans text-neutral-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
