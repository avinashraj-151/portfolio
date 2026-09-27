"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useMemo, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { useToast } from "@/app/components/ToastProvider"
import {
  Search,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
} from "lucide-react"

/* ──────────────────────────────────────────────
   VISUAL CARD PREVIEW
   Renders the real story cover image or an elegant
   themed gradient card with tag badge.
   ────────────────────────────────────────────── */

function PostVisual({ tag, tagExtra, coverImage, title, priority = false }) {
  const accentMap = {
    Engineering: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200/60" },
    "GATE CSE": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200/60" },
    AI: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200/60" },
    Product: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200/60" },
    Design: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200/60" },
    Architecture: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200/60" },
    "Next.js": { bg: "bg-neutral-100", text: "text-neutral-900", border: "border-neutral-300" },
  }

  const accent = accentMap[tag] || { bg: "bg-neutral-100", text: "text-neutral-700", border: "border-neutral-200/60" }

  // Real Story Cover Image
  if (coverImage) {
    return (
      <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/[0.04] transition-all duration-300 group-hover:scale-[1.01]">
        <Image
          src={coverImage}
          alt={title || "Blog cover"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          quality={80}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {tag && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/95 backdrop-blur-xs text-neutral-800 border border-black/5 shadow-2xs">
              {tag}
            </span>
            {tagExtra && (
              <span className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-900/80 text-white backdrop-blur-xs">
                {tagExtra}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  // Fallback Themed Visual Preview Box (if story has no cover image)
  return (
    <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200/80 ring-1 ring-black/[0.04] p-4 flex flex-col justify-between transition-all duration-300 group-hover:scale-[1.01]">
      {tag && (
        <div className="flex items-center gap-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${accent.bg} ${accent.text} border ${accent.border}`}>
            {tag}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between text-neutral-400 mt-auto">
        <BookOpen className="h-5 w-5 text-neutral-400" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Story</span>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   POST CARD — Navigates directly to /blog/[id]
   ────────────────────────────────────────────── */

function PostCard({ post, onLike, isLiked, priority = false }) {
  return (
    <Link
      href={`/blog/${post.slug || post.id}`}
      prefetch={true}
      className="group flex flex-col cursor-pointer"
    >
      {/* Visual Preview (Cover Image or Fallback) */}
      <PostVisual
        tag={post.tag}
        tagExtra={post.tagExtra}
        coverImage={post.coverImage}
        title={post.title}
        priority={priority}
      />

      {/* Meta row: date left, engagement right */}
      <div className="flex items-center justify-between mt-3 text-[11px] text-neutral-400">
        <time dateTime={post.date}>{post.date}</time>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onLike(post.id)
            }}
            className="flex items-center gap-1 hover:text-rose-500 transition-colors cursor-pointer"
            aria-label="Like"
          >
            <Heart
              className={`h-3.5 w-3.5 transition-transform active:scale-125 ${
                isLiked ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
            <span className="font-semibold">{post.likes || 0}</span>
          </button>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="font-semibold">{post.comments || 0}</span>
          </span>
        </div>
      </div>

      {/* Title — Clean, upright font (NO italic) */}
      <h3 className="mt-2 text-[15px] font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors leading-snug line-clamp-2 not-italic">
        {post.title}
      </h3>

      {/* Excerpt — Clean, normal upright font (NO italic) */}
      <p className="mt-1 text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed font-normal not-italic">
        {post.excerpt}
      </p>

      {/* Author */}
      <div className="mt-3 flex items-center gap-2">
        <div className="relative h-5 w-5 overflow-hidden rounded-md bg-amber-100 ring-1 ring-black/5 shrink-0">
          <Image
            src={post.authorImage || "/myimage.png"}
            alt={post.author || "Avinash Raj"}
            fill
            sizes="20px"
            className="object-cover object-top"
          />
        </div>
        <span className="text-xs font-semibold text-neutral-600 not-italic">{post.author || "Avinash Raj"}</span>
      </div>
    </Link>
  )
}

const upcomingTopics = [
  "Next.js Architecture",
  "Building GateExam.org",
  "GATE CSE Prep Strategy",
  "Full-Stack Engineering",
  "AI & LLM Tooling",
  "Micro-Interactions & UI",
]

/* ──────────────────────────────────────────────
   MAIN BLOG COMPONENT (Exclusively Real Posts)
   ────────────────────────────────────────────── */

export default function BlogClient({ initialPosts = [], isAdmin = false }) {
  const [posts, setPosts] = useState(initialPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [likedPosts, setLikedPosts] = useState(() => {
    const map = {}
    if (Array.isArray(initialPosts)) {
      initialPosts.forEach((p) => {
        if (p.isLiked) map[p.id] = true
      })
    }
    return map
  })

  const { data: session } = useSession()
  const { showToast } = useToast()

  // Live client-side sync to ensure newest published posts and like statuses appear immediately
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts)
          const newLikes = {}
          data.posts.forEach((p) => {
            if (p.isLiked) newLikes[p.id] = true
          })
          setLikedPosts(newLikes)
        }
      })
      .catch(() => {
        // Fallback to initialPosts
      })
  }, [session?.user?.email])

  const handleLike = async (id) => {
    if (!session?.user) {
      showToast("Please log in to like")
      return
    }

    const isCurrentlyLiked = Boolean(likedPosts[id])
    const nextIsLiked = !isCurrentlyLiked

    // Optimistic UI toggle
    setLikedPosts((prev) => ({ ...prev, [id]: nextIsLiked }))
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === id) {
          const delta = nextIsLiked ? 1 : -1
          return { ...p, likes: Math.max(0, (p.likes || 0) + delta) }
        }
        return p
      })
    )

    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: id }),
      })
      const data = await res.json()
      if (data && data.success) {
        setLikedPosts((prev) => ({ ...prev, [id]: data.isLiked }))
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === id ? { ...p, likes: data.likes } : p))
        )
      } else {
        // Revert on failure
        setLikedPosts((prev) => ({ ...prev, [id]: isCurrentlyLiked }))
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === id) {
              const delta = isCurrentlyLiked ? 1 : -1
              return { ...p, likes: Math.max(0, (p.likes || 0) + delta) }
            }
            return p
          })
        )
      }
    } catch (err) {
      console.error("Failed to like post:", err)
      setLikedPosts((prev) => ({ ...prev, [id]: isCurrentlyLiked }))
    }
  }

  // Derive categories strictly from real posts
  const availableCategories = useMemo(() => {
    const set = new Set()
    posts.forEach((p) => {
      if (p.category) set.add(p.category)
      if (p.tag) set.add(p.tag)
      if (Array.isArray(p.tags)) {
        p.tags.forEach((t) => set.add(t))
      }
    })
    return Array.from(set).filter(Boolean)
  }, [posts])

  // Featured Posts (top 3 real posts)
  const featuredPosts = useMemo(() => posts.slice(0, 3), [posts])

  // Latest Posts (real posts)
  const latestPosts = useMemo(() => posts.slice(0, 3), [posts])

  // Filtered Archive
  const filteredArchive = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q)) ||
        (post.tag && post.tag.toLowerCase().includes(q)) ||
        (Array.isArray(post.tags) && post.tags.some((t) => t.toLowerCase().includes(q)))

      const matchesCategory =
        !activeCategory ||
        post.category === activeCategory ||
        post.tag === activeCategory ||
        (Array.isArray(post.tags) && post.tags.includes(activeCategory))

      return matchesSearch && matchesCategory
    })
  }, [posts, searchQuery, activeCategory])

  const postsPerPage = 6
  const totalPages = Math.ceil(filteredArchive.length / postsPerPage) || 1
  const displayedPosts = filteredArchive.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-20">
      {/* ─── EMPTY STATE (When no published posts exist) ─── */}
      {posts.length === 0 ? (
        <div className="text-center max-w-2xl mx-auto py-16 sm:py-24 animate-in fade-in duration-300">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-800">
            <BookOpen className="h-6 w-6 stroke-[1.75]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 font-sans">
            No stories published yet
          </h2>

          <p className="mt-3 text-base sm:text-lg text-neutral-500 max-w-lg mx-auto leading-relaxed font-sans">
            I&apos;m currently writing in-depth essays, architectural breakdowns, and lessons learned building digital products.
          </p>

          {/* Upcoming Topic Tags */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
            {upcomingTopics.map((topic) => (
              <span
                key={topic}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200/60 transition-colors"
              >
                #{topic}
              </span>
            ))}
          </div>

          {/* Admin Action */}
          {isAdmin && (
            <div className="mt-9 flex justify-center">
              <Link
                href="/blog/write?new=true"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Write your first story</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* ─── REAL POSTS (In the exact clean structure) ─── */
        <>
          {/* ─── FEATURED POSTS ─── */}
          {featuredPosts.length > 0 && (
            <section aria-label="Featured Posts" className="mb-14 sm:mb-16">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950 not-italic">
                  Featured Posts
                </h2>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Top Picks
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                {featuredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    isLiked={!!likedPosts[post.id]}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ─── LATEST POSTS ─── */}
          {latestPosts.length > 0 && (
            <section aria-label="Latest Posts" className="mb-14 sm:mb-16">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-950 not-italic">
                  Latest Posts
                </h2>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Recently Published
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                {latestPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    isLiked={!!likedPosts[post.id]}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ─── ARCHIVE ─── */}
          <section aria-label="Archive" className="pt-10 border-t border-neutral-200/70">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mb-5 not-italic">
              Archive
            </h2>

            {/* Search */}
            <div className="relative w-full max-w-md mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search posts..."
                className="w-full pl-9 pr-9 py-2 rounded-xl bg-white ring-1 ring-black/5 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-neutral-950 transition-all not-italic"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setCurrentPage(1)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            {availableCategories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {availableCategories.map((cat) => {
                  const active = activeCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setActiveCategory(active ? null : cat)
                        setCurrentPage(1)
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer not-italic ${
                        active
                          ? "bg-neutral-950 text-white shadow-2xs"
                          : "bg-white text-neutral-600 ring-1 ring-black/5 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                })}
                {activeCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory(null)
                      setCurrentPage(1)
                    }}
                    className="text-xs font-semibold text-neutral-400 hover:text-neutral-700 ml-1 transition-colors cursor-pointer not-italic"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Post Grid */}
            {displayedPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                {displayedPosts.map((post, index) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    isLiked={!!likedPosts[post.id]}
                    priority={index < 3}
                  />
                ))}
              </div>
            ) : (
              <div className="py-14 text-center text-neutral-500 text-sm bg-white rounded-2xl ring-1 ring-black/5 shadow-2xs not-italic">
                No articles found matching &ldquo;{searchQuery || activeCategory}&rdquo;
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-1 text-xs font-medium select-none not-italic">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition cursor-pointer"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-0.5 px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition cursor-pointer"
                >
                  <ChevronLeft className="h-3 w-3" /> Back
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`h-8 w-8 rounded-lg font-bold transition cursor-pointer ${
                      currentPage === n
                        ? "bg-neutral-950 text-white shadow-2xs"
                        : "bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 shadow-2xs"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-0.5 px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition cursor-pointer"
                >
                  Next <ChevronRight className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-white ring-1 ring-black/5 text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition cursor-pointer"
                >
                  Last
                </button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
