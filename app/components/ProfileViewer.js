"use client"

import Link from "next/link"
import { useState } from "react"
import ProfileBackButton from "./ProfileBackButton"

export default function ProfileViewer({ profile }) {
    const [showFallback, setShowFallback] = useState(false)

    const handleIframeError = () => {
        setShowFallback(true)
    }

    return (
        <div className="profile-viewer relative flex min-h-full flex-1 flex-col bg-neutral-100">
            <ProfileBackButton />

            {!showFallback ? (
                <iframe
                    src={profile.href}
                    title={`${profile.label} profile`}
                    onError={handleIframeError}
                    className="profile-viewer__frame min-h-[calc(100dvh-5rem)] w-full flex-1 border-0 bg-white"
                />
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-24 text-center">
                    <p className="max-w-md text-sm leading-7 text-neutral-700 sm:text-base sm:leading-8">
                        {profile.label} cannot be embedded here. Open the profile directly
                        in your browser instead.
                    </p>

                    <a
                        href={profile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 rounded-full border border-neutral-950/15 bg-white/60 px-6 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-white"
                    >
                        Open {profile.label}
                    </a>
                </div>
            )}

            <noscript>
                <div className="flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-24 text-center">
                    <p className="text-sm text-neutral-700 sm:text-base">
                        JavaScript is required to view this profile.
                    </p>
                    <Link
                        href={profile.href}
                        className="mt-8 rounded-full border border-neutral-950/15 bg-white/60 px-6 py-2.5 text-sm font-semibold text-neutral-950"
                    >
                        Open {profile.label}
                    </Link>
                </div>
            </noscript>
        </div>
    )
}
