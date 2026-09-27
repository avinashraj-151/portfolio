"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  SquarePen,
  Trash2,
  ExternalLink,
  Heart,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Search,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react"
import { useToast } from "@/app/components/ToastProvider"

export default function StoriesClient({ initialDrafts = [], initialPosts = [], user }) {
  const [activeTab, setActiveTab] = useState("published") // 'published' | 'drafts'
  const [drafts, setDrafts] = useState(initialDrafts)
  const [posts, setPosts] = useState(initialPosts)
  const [searchQuery, setSearchQuery] = useState("")

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState(null) // { type: 'post' | 'draft', id, title }
  const [isDeleting, setIsDeleting] = useState(false)

  const { showToast } = useToast()

  // Filter based on search query
  const filteredDrafts = drafts.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Handle delete execution
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      const endpoint =
        deleteTarget.type === "post"
          ? `/api/posts?id=${encodeURIComponent(deleteTarget.id)}`
          : `/api/drafts?id=${encodeURIComponent(deleteTarget.id)}`

      const res = await fetch(endpoint, { method: "DELETE" })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete item")
      }

      if (deleteTarget.type === "post") {
        setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
        showToast("Story deleted successfully", { icon: "trash" })
      } else {
        setDrafts((prev) => prev.filter((d) => d.id !== deleteTarget.id))
        showToast("Draft deleted successfully", { icon: "trash" })
      }

      setDeleteTarget(null)
    } catch (err) {
      console.error("Delete error:", err)
      showToast(err.message || "Could not delete", { icon: "info" })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-transparent text-neutral-900 font-sans pb-24">
      {/* ── Header Container ── */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-14">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-3 select-none">
          <Link href="/" className="hover:text-neutral-800 transition-colors">
            Home
          </Link>
          <span className="text-neutral-300">›</span>
          <Link href="/blog" className="hover:text-neutral-800 transition-colors">
            Blog
          </Link>
          <span className="text-neutral-300">›</span>
          <span className="text-neutral-600">Your stories</span>
        </nav>

        {/* Title & Quick Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200/80">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 font-sans">
              Your stories
            </h1>
            <p className="mt-1 text-sm text-neutral-500 font-normal">
              Manage your drafts, publish, edit, or delete articles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/blog/write?new=true"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-neutral-800 hover:shadow-sm active:scale-95 cursor-pointer"
            >
              <SquarePen className="h-4 w-4" />
              <span>Write a story</span>
            </Link>
          </div>
        </div>

        {/* ── Tabs & Search Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-2 border-b border-neutral-200/60">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("published")}
              className={`pb-3 relative transition-colors cursor-pointer ${
                activeTab === "published"
                  ? "text-neutral-950 font-bold border-b-2 border-neutral-950 -mb-[1px]"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              <span>Published</span>
              <span className="ml-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 font-medium">
                {posts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("drafts")}
              className={`pb-3 relative transition-colors cursor-pointer ${
                activeTab === "drafts"
                  ? "text-neutral-950 font-bold border-b-2 border-neutral-950 -mb-[1px]"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              <span>Drafts</span>
              <span className="ml-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 font-medium">
                {drafts.length}
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 pb-2 sm:pb-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter stories..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 text-xs text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-neutral-400 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* ── Content Area ── */}
        <div className="mt-6">
          {/* ═══════════ TAB: PUBLISHED ═══════════ */}
          {activeTab === "published" && (
            <div>
              {filteredPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/40 p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-800">
                    {searchQuery ? "No matching published stories" : "No published stories yet"}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                    {searchQuery
                      ? "Try searching for a different keyword or topic."
                      : "When you publish drafts, they will appear here with live readers, comments, and like metrics."}
                  </p>
                  {!searchQuery && (
                    <Link
                      href="/blog/write?new=true"
                      className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                    >
                      <SquarePen className="h-3.5 w-3.5" />
                      <span>Write a story</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group transition-colors"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        {post.coverImage && (
                          <Link
                            href={`/blog/${post.id}`}
                            className="relative h-16 w-24 sm:h-20 sm:w-32 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shrink-0 block group/img"
                          >
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              sizes="128px"
                              className="object-cover transition-transform duration-300 group-hover/img:scale-105"
                            />
                          </Link>
                        )}

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/blog/${post.id}`}
                            className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-neutral-950 hover:underline line-clamp-1 block transition-colors"
                          >
                            {post.title}
                          </Link>

                          {post.subtitle && (
                            <p className="mt-1 text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                              {post.subtitle}
                            </p>
                          )}

                          {/* Metadata row */}
                          <div className="mt-2.5 flex items-center gap-3 text-xs text-neutral-400 flex-wrap">
                            <span>Published on {post.date}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-neutral-500">
                              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                              <span className="font-semibold text-neutral-700">{post.likes}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-neutral-500">
                              <MessageSquare className="h-3.5 w-3.5 text-neutral-400" />
                              <span className="font-semibold text-neutral-700">{post.comments}</span>
                            </span>

                            {post.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                                  {post.tags[0]}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        {/* View link */}
                        <Link
                          href={`/blog/${post.id}`}
                          aria-label="View live article"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                          title="View live post"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        {/* Edit post */}
                        <Link
                          href={`/blog/write?postId=${post.id}`}
                          aria-label="Edit article"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/70 transition-colors"
                          title="Edit article"
                        >
                          <SquarePen className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Link>

                        {/* Delete post */}
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              type: "post",
                              id: post.id,
                              title: post.title,
                            })
                          }
                          aria-label="Delete article"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════ TAB: DRAFTS ═══════════ */}
          {activeTab === "drafts" && (
            <div>
              {filteredDrafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/40 p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-800">
                    {searchQuery ? "No matching drafts" : "You have no drafts"}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                    {searchQuery
                      ? "No drafts found matching your search term."
                      : "Start typing a story in the editor. Your progress is continuously saved here automatically."}
                  </p>
                  {!searchQuery && (
                    <Link
                      href="/blog/write?new=true"
                      className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
                    >
                      <SquarePen className="h-3.5 w-3.5" />
                      <span>Write a draft</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {filteredDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group transition-colors"
                    >
                      {/* Left: Details */}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/blog/write?draftId=${draft.id}`}
                          className="text-base sm:text-lg font-bold text-neutral-900 hover:text-neutral-950 hover:underline line-clamp-1 block transition-colors"
                        >
                          {draft.title || "Untitled Draft"}
                        </Link>

                        <p className="mt-1 text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                          {draft.snippet}
                        </p>

                        <div className="mt-2.5 flex items-center gap-2 text-xs text-neutral-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Last edited {draft.date}</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        {/* Edit draft */}
                        <Link
                          href={`/blog/write?draftId=${draft.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/70 transition-colors"
                        >
                          <SquarePen className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Link>

                        {/* Publish draft */}
                        <Link
                          href={`/blog/write/${draft.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                        >
                          <span>Publish</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        {/* Delete draft */}
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              type: "draft",
                              id: draft.id,
                              title: draft.title || "Untitled Draft",
                            })
                          }
                          aria-label="Delete draft"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete draft"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-neutral-200/80 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-950">
                  Delete {deleteTarget.type === "post" ? "Story" : "Draft"}?
                </h3>
                <p className="text-xs text-neutral-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-neutral-900 font-semibold">
                &ldquo;{deleteTarget.title}&rdquo;
              </strong>
              ?
              {deleteTarget.type === "post" &&
                " This will permanently remove the article, comments, and likes from your portfolio."}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
