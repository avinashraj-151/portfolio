"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  X,
  Upload,
  ImagePlus,
  Loader2,
  CheckCircle2,
  Trash2,
  Sparkles,
  Globe,
  Tag as TagIcon,
  HelpCircle,
  ExternalLink,
} from "lucide-react"

const PRESET_TOPICS = [
  "Engineering",
  "Next.js",
  "Web Development",
  "Artificial Intelligence",
  "Architecture",
  "React",
  "GATE CSE",
  "System Design",
]

function extractInitialSubtitle(draft) {
  if (draft?.subtitle) return draft.subtitle
  const meta = Array.isArray(draft?.blocks) ? draft.blocks.find((b) => b.type === "meta") : null
  if (meta?.subtitle) return meta.subtitle
  const firstP = Array.isArray(draft?.blocks)
    ? draft.blocks.find((b) => b.type === "paragraph" && b.content && b.content.trim())
    : null
  if (firstP?.content) {
    const plain = firstP.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    return plain.slice(0, 140)
  }
  return ""
}

function extractInitialCover(draft) {
  if (draft?.cover_image) return draft.cover_image
  const meta = Array.isArray(draft?.blocks) ? draft.blocks.find((b) => b.type === "meta") : null
  if (meta?.cover_image) return meta.cover_image
  const firstImg = Array.isArray(draft?.blocks)
    ? draft.blocks.find((b) => b.type === "image" && b.url)
    : null
  return firstImg?.url || ""
}

export default function PublishClient({ draft, user }) {
  const router = useRouter()

  // Story Metadata States
  const [title, setTitle] = useState(draft?.title || "Untitled Story")
  const [subtitle, setSubtitle] = useState(() => extractInitialSubtitle(draft))
  const [coverImage, setCoverImage] = useState(() => extractInitialCover(draft))
  const [tags, setTags] = useState(Array.isArray(draft?.tags) ? draft.tags : [])
  const [tagInput, setTagInput] = useState("")

  // UI / Status States
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)
  const [publishError, setPublishError] = useState("")

  const fileInputRef = useRef(null)

  // Find all images already present in the story blocks
  const storyImages = Array.isArray(draft?.blocks)
    ? draft.blocks.filter((b) => b.type === "image" && b.url)
    : []

  // Add a topic tag
  const handleAddTag = (tagToAdd) => {
    const clean = (tagToAdd || tagInput).trim().replace(/^#/, "")
    if (!clean) return
    if (tags.length >= 5) {
      alert("You can add up to 5 topics per story.")
      return
    }
    if (!tags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setTags([...tags, clean])
    }
    setTagInput("")
  }

  const handleKeyDownTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  // Cover image file upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingCover(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image")
      }

      setCoverImage(data.url)
    } catch (err) {
      console.error("Cover upload error:", err)
      setUploadError(err.message || "Failed to upload image")
    } finally {
      setIsUploadingCover(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Publish Story
  const handlePublishNow = async () => {
    if (!title.trim()) {
      alert("Please enter a story title.")
      return
    }

    setIsPublishing(true)
    setPublishError("")

    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draft.id,
          title: title.trim(),
          subtitle: subtitle.trim(),
          cover_image: coverImage,
          tags,
          blocks: draft.blocks || [],
          action: "publish",
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.published) {
        throw new Error(data.error || "Failed to publish story")
      }

      setPublishSuccess(true)

      // Clean local storage draft so user doesn't see old published draft in editor
      try {
        localStorage.removeItem("portfolio_story_draft")
      } catch {
        // ignore
      }

      // Redirect after showing celebration
      setTimeout(() => {
        router.push("/blog")
      }, 1600)
    } catch (err) {
      console.error("Publish error:", err)
      setPublishError(err.message || "An error occurred while publishing. Please try again.")
      setIsPublishing(false)
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-white overflow-hidden text-neutral-900 select-text">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP APP NAVBAR (Fixed Header with Scrollbar strictly BELOW)
          ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between border-b border-neutral-100 bg-white/95 px-4 sm:px-8 backdrop-blur-xs">
        {/* Left: Branding & Story Status */}
        <div className="flex items-center gap-3">
          <Link
            href="/blog/write"
            className="group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to editor</span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-neutral-200" />
          <span className="hidden sm:inline-block text-xs text-neutral-400">
            Publish preview for <strong className="text-neutral-700 font-semibold">{user?.name || "Avinash Raj"}</strong>
          </span>
        </div>

        {/* Right: Close X */}
        <div className="flex items-center gap-3">
          <Link
            href="/blog/write"
            aria-label="Close publish view"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. SCROLLABLE CONTENT BODY (Scrollbar starts strictly below navbar)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto">
        <main className="mx-auto max-w-4xl px-4 sm:px-8 py-8 sm:py-12">
          {/* Success Banner */}
          {publishSuccess ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 sm:p-12 text-center animate-in zoom-in-95 duration-300">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-950 font-serif">
                Story Published!
              </h2>
              <p className="mt-2 text-sm text-emerald-700 max-w-md mx-auto">
                Your story is now live and public on Avinash Raj&apos;s blog. Redirecting you to the blog...
              </p>
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 text-xs font-semibold shadow-xs transition-colors"
                >
                  Go to Blog now
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* ─────────────────────────────────────────────────────────
                  LEFT COLUMN (cols 1-7): STORY PREVIEW (Cover & Subtitle)
                  ───────────────────────────────────────────────────────── */}
              <div className="lg:col-span-7 flex flex-col space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-950">
                    Story Preview
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Customize how your story appears in card grids, search results, and social cards.
                  </p>
                </div>

                {/* 1. Cover Image Box */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                      <ImagePlus className="h-3.5 w-3.5 text-neutral-500" />
                      Cover Image
                    </label>
                    {coverImage && (
                      <button
                        type="button"
                        onClick={() => setCoverImage("")}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    )}
                  </div>

                  {coverImage ? (
                    <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 shadow-2xs">
                      {/* Image Preview */}
                      <Image
                        src={coverImage}
                        alt="Story Cover Preview"
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                      />

                      {/* Hover Overlay Button to Change */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingCover}
                          className="rounded-full bg-white/95 hover:bg-white text-neutral-900 px-4 py-1.5 text-xs font-medium shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Empty Cover Dropzone */
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingCover}
                      className="group flex aspect-[16/9] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/60 p-6 text-center transition-all hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer"
                    >
                      {isUploadingCover ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-7 w-7 animate-spin text-neutral-600" />
                          <span className="text-xs font-medium text-neutral-600">
                            Compressing &amp; uploading WebP cover...
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-2xs border border-neutral-200/80 group-hover:scale-105 transition-transform">
                            <ImagePlus className="h-5 w-5 text-neutral-500" />
                          </div>
                          <span className="text-xs font-semibold text-neutral-800">
                            Upload a high-resolution cover image
                          </span>
                          <span className="text-[11px] text-neutral-400 mt-1">
                            Recommended: 16:9 ratio (PNG, JPG, WebP up to 10MB)
                          </span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {uploadError && (
                    <p className="mt-1.5 text-xs text-red-500">{uploadError}</p>
                  )}

                  {/* Story Images Selector (if there are images already in the story) */}
                  {storyImages.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[11px] font-medium text-neutral-500 mb-1.5">
                        Or pick an image already in your story:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {storyImages.map((img, i) => (
                          <button
                            key={img.id || i}
                            type="button"
                            onClick={() => setCoverImage(img.url)}
                            className={`relative h-14 w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                              coverImage === img.url
                                ? "border-[#1a8917] ring-2 ring-[#1a8917]/20 scale-105"
                                : "border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={img.url}
                              alt="Story thumbnail"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            {coverImage === img.url && (
                              <div className="absolute top-0.5 right-0.5 bg-[#1a8917] text-white rounded-full p-0.5">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Story Title Field */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1">
                    Story Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter story title..."
                    className="w-full font-serif text-lg font-bold text-neutral-950 border-b border-neutral-200 focus:border-neutral-900 pb-1.5 outline-none transition-colors placeholder:text-neutral-300"
                  />
                </div>

                {/* 3. Subtitle Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-neutral-800">
                      Story Subtitle / Excerpt
                    </label>
                    <span className="text-[10px] text-neutral-400">
                      {subtitle.length}/140 chars recommended
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Write a clear, compelling summary to hook your readers..."
                    className="w-full text-xs sm:text-sm text-neutral-700 leading-relaxed border-b border-neutral-200 focus:border-neutral-900 py-1.5 outline-none resize-none transition-colors placeholder:text-neutral-300"
                  />
                </div>

                {/* Note */}
                <p className="text-[11px] text-neutral-400 leading-relaxed rounded-lg bg-neutral-50 p-3 border border-neutral-100">
                  <strong className="text-neutral-600">Note:</strong> Changes here only customize how your story preview appears in feeds and cards. Your full story content remains untouched.
                </p>
              </div>

              {/* ─────────────────────────────────────────────────────────
                  RIGHT COLUMN (cols 8-12): TOPICS & PUBLISH
                  ───────────────────────────────────────────────────────── */}
              <div className="lg:col-span-5 flex flex-col space-y-6 lg:border-l lg:border-neutral-100 lg:pl-10">
                {/* Author Info */}
                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user?.name || "Author"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <span>{(user?.name || "A")[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500">Publishing to:</p>
                      <h4 className="text-sm font-bold text-neutral-950">
                        {user?.name || "Avinash Raj"}
                      </h4>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500">
                    <Globe className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Visibility: <strong>Public</strong> (Anyone can view)</span>
                  </div>
                </div>

                {/* Topics / Tags Section */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-neutral-900 flex items-center gap-1.5">
                      <TagIcon className="h-3.5 w-3.5 text-neutral-500" />
                      Topics
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      {tags.length}/5 topics added
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-3 leading-normal">
                    Add or change topics so readers know what your story is about.
                  </p>

                  {/* Input with Add button */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDownTag}
                      disabled={tags.length >= 5}
                      placeholder={tags.length >= 5 ? "Limit reached (5/5)" : "Add a topic and press Enter..."}
                      className="flex-1 rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-900 transition-colors disabled:bg-neutral-100"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      disabled={!tagInput.trim() || tags.length >= 5}
                      className="rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 px-3.5 py-2 text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Selected Tags */}
                  <div className="flex flex-wrap gap-1.5 min-h-[32px] mb-4">
                    {tags.length === 0 ? (
                      <span className="text-xs text-neutral-400 italic">No topics added yet.</span>
                    ) : (
                      tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800 ring-1 ring-neutral-200/70"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-neutral-400 hover:text-neutral-800 cursor-pointer ml-0.5 transition-colors"
                            aria-label={`Remove tag ${tag}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Quick Suggested Topics */}
                  <div>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                      Suggested Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_TOPICS.map((topic) => {
                        const isSelected = tags.some((t) => t.toLowerCase() === topic.toLowerCase())
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => !isSelected && handleAddTag(topic)}
                            disabled={isSelected || tags.length >= 5}
                            className={`rounded-full px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-neutral-100 text-neutral-400 cursor-default"
                                : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                            }`}
                          >
                            {isSelected ? `✓ ${topic}` : `+ ${topic}`}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Publish Error */}
                {publishError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                    {publishError}
                  </div>
                )}

                {/* Publish Button & Actions */}
                <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handlePublishNow}
                    disabled={isPublishing || publishSuccess}
                    className="w-full rounded-full bg-[#1a8917] hover:bg-[#156d12] active:scale-[0.99] disabled:opacity-50 text-white py-3 px-6 text-sm font-semibold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Publishing now...</span>
                      </>
                    ) : publishSuccess ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-white" />
                        <span>Published!</span>
                      </>
                    ) : (
                      <span>Publish now</span>
                    )}
                  </button>

                  <Link
                    href="/blog/write"
                    className="w-full text-center text-xs font-medium text-neutral-500 hover:text-neutral-900 py-1 transition-colors"
                  >
                    Cancel &amp; return to editor
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
