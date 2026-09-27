"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession, signIn } from "next-auth/react"
import { useToast } from "@/app/components/ToastProvider"
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  Send,
  ChevronUp,
  MinusCircle,
  PlusCircle,
  X,
  Trash2,
  LogIn,
} from "lucide-react"

/* ─────────────────────────────────────────────────────────────
   PREMIUM CUSTOM TOOLTIP COMPONENT
   Smooth micro-animations, dark pill, zero layout shift
   ───────────────────────────────────────────────────────────── */
function Tooltip({ children, text, position = "top", className = "" }) {
  if (!text) return children

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
  }

  return (
    <div className={`relative group/tooltip inline-flex items-center justify-center ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute ${positionClasses[position]} z-50 flex items-center justify-center opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-150 ease-out`}
      >
        <div className="relative px-2.5 py-1 rounded-md bg-neutral-900/95 text-white text-[11px] font-medium leading-none tracking-tight shadow-md shadow-black/25 border border-neutral-700/60 whitespace-nowrap select-none">
          {text}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   AVATAR COLOR HASH HELPER (Tailored to portfolio theme)
   ───────────────────────────────────────────────────────────── */
function getAvatarColor(name = "") {
  const colors = [
    "bg-amber-100 text-amber-900 border-amber-300/80 shadow-2xs",
    "bg-sky-100 text-sky-900 border-sky-300/80 shadow-2xs",
    "bg-purple-100 text-purple-900 border-purple-300/80 shadow-2xs",
    "bg-emerald-100 text-emerald-900 border-emerald-300/80 shadow-2xs",
    "bg-rose-100 text-rose-900 border-rose-300/80 shadow-2xs",
    "bg-indigo-100 text-indigo-900 border-indigo-300/80 shadow-2xs",
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

/* ─────────────────────────────────────────────────────────────
   RECURSIVE COMMENT TREE HELPERS
   ───────────────────────────────────────────────────────────── */
function countAllComments(list) {
  if (!Array.isArray(list)) return 0
  return list.reduce((acc, c) => acc + 1 + countAllComments(c.replies || []), 0)
}

function addReplyRecursively(list, targetId, newReply) {
  return list.map((c) => {
    if (c.id === targetId) {
      return {
        ...c,
        replies: [...(c.replies || []), newReply],
      }
    }
    if (Array.isArray(c.replies) && c.replies.length > 0) {
      return {
        ...c,
        replies: addReplyRecursively(c.replies, targetId, newReply),
      }
    }
    return c
  })
}

function toggleLikeRecursively(list, targetId) {
  return list.map((c) => {
    if (c.id === targetId) {
      const userLiked = !c.userLiked
      return {
        ...c,
        userLiked,
        likes: userLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 0) - 1),
      }
    }
    if (Array.isArray(c.replies) && c.replies.length > 0) {
      return {
        ...c,
        replies: toggleLikeRecursively(c.replies, targetId),
      }
    }
    return c
  })
}

function deleteCommentRecursively(list, targetId) {
  if (!Array.isArray(list)) return []
  return list
    .filter((c) => c.id !== targetId)
    .map((c) => {
      if (Array.isArray(c.replies) && c.replies.length > 0) {
        return {
          ...c,
          replies: deleteCommentRecursively(c.replies, targetId),
        }
      }
      return c
    })
}

/* ─────────────────────────────────────────────────────────────
   THREADED COMMENT NODE (Portfolio Theme Styled)
   ───────────────────────────────────────────────────────────── */
function CommentNode({
  comment,
  depth = 0,
  replyingToId,
  setReplyingToId,
  onAddReply,
  onToggleLike,
  onDeleteComment,
  session,
  myCommentIds,
}) {
  const { showToast } = useToast()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [replyText, setReplyText] = useState("")

  const hasReplies = Array.isArray(comment.replies) && comment.replies.length > 0
  const isReplying = replyingToId === comment.id
  const isAuthor = comment.author === "Avinash Raj" || comment.isAuthor
  const avatarColor = getAvatarColor(comment.author)

  const currentUserName = session?.user?.name || ""
  const currentUserEmail = session?.user?.email ? session.user.email.toLowerCase().trim() : ""

  // STRICT OWNERSHIP:
  // A user can ONLY delete their own comment.
  // 1. Must be authenticated (session?.user is required).
  // 2. Must match the comment's author email or be in myCommentIds,
  //    or if seed author comment, only if logged in as avinashraj151@gmail.com.
  const isOwn = Boolean(
    session?.user && (
      (currentUserEmail && comment.authorEmail && comment.authorEmail.toLowerCase().trim() === currentUserEmail) ||
      (myCommentIds && myCommentIds.has(comment.id)) ||
      (comment.isAuthor && currentUserEmail === "avinashraj151@gmail.com")
    )
  )

  const handleSubmitReply = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    onAddReply(comment.id, replyText.trim())
    setReplyText("")
    setReplyingToId(null)
  }

  return (
    <div className="relative group/node text-sm">
      {/* Top Header & Content */}
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div className="relative shrink-0 mt-0.5">
          {comment.avatar ? (
            <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-white shadow-2xs">
              <Image
                src={comment.avatar}
                alt={comment.author}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border ${avatarColor}`}
            >
              {(comment.author || "U")[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Comment Body & Actions */}
        <div className="flex-1 min-w-0">
          {/* Author Header */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-neutral-950 tracking-tight">{comment.author}</span>
            {isAuthor && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-950 text-white tracking-wider uppercase shadow-2xs">
                Author
              </span>
            )}
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-400 text-[11px] font-medium">{comment.date}</span>
          </div>

          {/* Comment Text */}
          <div className="mt-1.5 text-xs sm:text-[14px] leading-relaxed text-neutral-800 font-normal">
            {comment.text}
          </div>

          {/* Action Row: Upvote & Reply (No card, clean minimal design) */}
          <div className="flex items-center gap-3 mt-2 text-xs">
            {/* Love / Like Button */}
            <button
              type="button"
              onClick={() => {
                if (!session?.user) {
                  showToast("Please log in to like")
                  return
                }
                onToggleLike(comment.id)
              }}
              className="flex items-center gap-1.5 py-0.5 text-xs font-semibold cursor-pointer group/like select-none transition-colors"
              aria-label={comment.userLiked ? "Unlike" : "Love this"}
            >
              <Heart
                className={`h-4 w-4 stroke-[1.8] transition-all duration-200 active:scale-125 ${
                  comment.userLiked
                    ? "fill-rose-500 text-rose-500 scale-105"
                    : "text-neutral-400 group-hover/like:text-rose-500 group-hover/like:scale-110"
                }`}
              />
              <span
                className={`tabular-nums transition-colors ${
                  comment.userLiked ? "text-rose-600 font-bold" : "text-neutral-500 group-hover/like:text-rose-600"
                }`}
              >
                {comment.likes || 0}
              </span>
            </button>

            {/* Reply Button — No card */}
            <button
              type="button"
              onClick={() => {
                if (!session?.user) {
                  showToast("Please log in to reply", { icon: "login" })
                  return
                }
                if (isReplying) {
                  setReplyingToId(null)
                } else {
                  setReplyingToId(comment.id)
                }
              }}
              className="flex items-center gap-1.5 py-0.5 text-xs font-medium text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer group/reply select-none"
            >
              <MessageSquare className="h-3.5 w-3.5 stroke-[1.8] transition-transform group-hover/reply:scale-110" />
              <span>Reply</span>
            </button>

            {/* Delete Button (Only for author's own response) */}
            {isOwn && (
              <button
                type="button"
                onClick={() => onDeleteComment && onDeleteComment(comment.id)}
                className="flex items-center gap-1.5 py-0.5 text-xs font-medium text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer group/delete select-none"
                aria-label="Delete comment"
              >
                <Trash2 className="h-3.5 w-3.5 stroke-[1.8] transition-transform group-hover/delete:scale-110" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {/* Inline Reply Form */}
          {isReplying && (
            <form
              onSubmit={handleSubmitReply}
              className="mt-3.5 p-3.5 rounded-2xl border border-neutral-200/90 bg-neutral-50/90 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="flex items-center justify-between pb-2 text-xs text-neutral-500">
                <span>
                  Replying to <strong className="text-neutral-900 font-semibold">@{comment.author}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setReplyingToId(null)}
                  className="h-5 w-5 rounded-full hover:bg-neutral-200/80 flex items-center justify-center text-neutral-400 hover:text-neutral-800 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                autoFocus
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="w-full text-xs sm:text-sm bg-white p-3 rounded-xl border border-neutral-200 outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/5 resize-none text-neutral-900 transition-all leading-relaxed"
              />
              <div className="flex items-center justify-end gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={() => setReplyingToId(null)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-neutral-600 hover:bg-neutral-200/70 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Reply</span>
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nested Replies: Collapsed Button in clean row */}
      {hasReplies && isCollapsed && (
        <div className="mt-2.5 ml-4 sm:ml-5 flex items-center">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            aria-label="Expand replies"
            className="h-6 w-6 rounded-full bg-white border border-neutral-300 shadow-2xs hover:border-neutral-600 hover:bg-neutral-50 flex items-center justify-center text-neutral-600 hover:text-neutral-950 transition-all cursor-pointer z-10 active:scale-90"
          >
            <PlusCircle className="h-4 w-4 text-neutral-700" />
          </button>
        </div>
      )}

      {/* Nested Replies: Expanded Branch Line */}
      {hasReplies && !isCollapsed && (
        <div className="relative ml-4 pl-4 sm:pl-5 border-l-[1.5px] border-neutral-200/90 hover:border-neutral-400 transition-colors mt-3.5 space-y-4">
          {/* Collapse Button on the tree branch line */}
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            aria-label="Collapse replies"
            className="absolute -left-[11px] top-1.5 h-5 w-5 rounded-full bg-white border border-neutral-200 shadow-2xs hover:border-neutral-600 hover:bg-neutral-50 flex items-center justify-center text-neutral-500 hover:text-neutral-950 transition-all cursor-pointer z-10 active:scale-90"
          >
            <MinusCircle className="h-3.5 w-3.5 text-neutral-500" />
          </button>

          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              replyingToId={replyingToId}
              setReplyingToId={setReplyingToId}
              onAddReply={onAddReply}
              onToggleLike={onToggleLike}
              onDeleteComment={onDeleteComment}
              session={session}
              myCommentIds={myCommentIds}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN STORY CLIENT COMPONENT
   ───────────────────────────────────────────────────────────── */
export default function BlogPostClient({
  post,
  readingTime,
  dateStr,
  initialComments = [],
  initialLikes = 0,
  initialIsLiked = false,
}) {
  const { data: session } = useSession()
  const { showToast } = useToast()

  // Likes state directly synced with Supabase
  const [likes, setLikes] = useState(() => initialLikes)
  const [isLiked, setIsLiked] = useState(() => initialIsLiked)
  const [isLiking, setIsLiking] = useState(false)

  // Threaded Comments state (Initialized from Supabase database)
  const [comments, setComments] = useState(() => {
    if (Array.isArray(initialComments) && initialComments.length > 0) {
      return initialComments
    }
    return []
  })
  const [newComment, setNewComment] = useState("")
  const [replyingToId, setReplyingToId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [myCommentIds, setMyCommentIds] = useState(() => new Set())

  // Live sync like status when user authenticates client-side
  useEffect(() => {
    if (session?.user?.email && post?.id) {
      fetch(`/api/posts/like?postId=${encodeURIComponent(post.id)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            setLikes(data.likes)
            setIsLiked(data.isLiked)
          }
        })
        .catch(() => {})
    }
  }, [session?.user?.email, post?.id])

  // Share url
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
    }
  }, [])

  const handleLike = async () => {
    if (!session?.user) {
      showToast("Please log in to like")
      return
    }
    if (isLiking) return
    setIsLiking(true)

    // Optimistic toggle
    const prevLikes = likes
    const prevIsLiked = isLiked
    const nextIsLiked = !isLiked
    const nextLikes = nextIsLiked ? likes + 1 : Math.max(0, likes - 1)

    setIsLiked(nextIsLiked)
    setLikes(nextLikes)

    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      })
      const data = await res.json()
      if (data && data.success) {
        setLikes(data.likes)
        setIsLiked(data.isLiked)
      } else {
        // Revert on error
        setLikes(prevLikes)
        setIsLiked(prevIsLiked)
      }
    } catch (err) {
      console.error("Failed to toggle like:", err)
      setLikes(prevLikes)
      setIsLiked(prevIsLiked)
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.share) {
          await navigator.share({
            title: post.title,
            text: post.subtitle || post.title,
            url: window.location.href,
          })
          return
        }
      } catch {
        // Fallback to clipboard
      }

      try {
        await navigator.clipboard.writeText(window.location.href)
      } catch {
        // fallback
      }
    }
  }

  const handleScrollToComments = () => {
    const el = document.getElementById("comments")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!session?.user) {
      showToast("Please log in to leave a response", { icon: "login" })
      return
    }
    const trimmed = newComment.trim()
    if (!trimmed || isSubmitting) return

    const authorName = session?.user?.name || "Reader"
    const authorAvatar = session?.user?.image || ""
    const authorEmail = session?.user?.email || ""
    const isPostAuthor = Boolean(
      session?.user?.name === "Avinash Raj" ||
      (session?.user?.email && (session?.user?.email === post.author_email || session?.user?.email === "avinashraj151@gmail.com"))
    )

    const tempId = `c_${Date.now()}`
    const optimisticNode = {
      id: tempId,
      author: authorName,
      avatar: authorAvatar,
      authorEmail,
      date: "Just now",
      text: trimmed,
      likes: 0,
      userLiked: false,
      isAuthor: isPostAuthor,
      replies: [],
    }

    setComments((prev) => [optimisticNode, ...prev])
    setMyCommentIds((prev) => new Set([...prev, tempId]))
    setNewComment("")
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          postId: post.id,
          author: authorName,
          avatar: authorAvatar,
          authorEmail,
          text: trimmed,
          isAuthor: isPostAuthor,
        }),
      })
      const data = await res.json()
      if (data.success) {
        if (data.comment?.id) {
          setMyCommentIds((prev) => new Set([...prev, data.comment.id]))
        }
        if (Array.isArray(data.comments)) {
          setComments(data.comments)
        }
      }
    } catch (err) {
      console.error("Failed to post comment to database:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddReply = async (targetCommentId, text) => {
    if (!session?.user) {
      showToast("Please log in to reply", { icon: "login" })
      return
    }
    const trimmed = text.trim()
    if (!trimmed) return

    const authorName = session?.user?.name || "Reader"
    const authorAvatar = session?.user?.image || ""
    const authorEmail = session?.user?.email || ""
    const isPostAuthor = Boolean(
      session?.user?.name === "Avinash Raj" ||
      (session?.user?.email && (session?.user?.email === post.author_email || session?.user?.email === "avinashraj151@gmail.com"))
    )

    const tempReplyId = `r_${Date.now()}`
    const optimisticReply = {
      id: tempReplyId,
      author: authorName,
      avatar: authorAvatar,
      authorEmail,
      date: "Just now",
      text: trimmed,
      likes: 0,
      userLiked: false,
      isAuthor: isPostAuthor,
      parentId: targetCommentId,
      replies: [],
    }

    setComments((prev) => addReplyRecursively(prev, targetCommentId, optimisticReply))
    setMyCommentIds((prev) => new Set([...prev, tempReplyId]))

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          postId: post.id,
          parentId: targetCommentId,
          author: authorName,
          avatar: authorAvatar,
          authorEmail,
          text: trimmed,
          isAuthor: isPostAuthor,
        }),
      })
      const data = await res.json()
      if (data.success) {
        if (data.comment?.id) {
          setMyCommentIds((prev) => new Set([...prev, data.comment.id]))
        }
        if (Array.isArray(data.comments)) {
          setComments(data.comments)
        }
      }
    } catch (err) {
      console.error("Failed to post reply to database:", err)
    }
  }

  const handleToggleLike = async (targetCommentId) => {
    if (!session?.user) {
      showToast("Please log in to like")
      return
    }
    setComments((prev) => toggleLikeRecursively(prev, targetCommentId))

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "like",
          postId: post.id,
          commentId: targetCommentId,
        }),
      })
    } catch (err) {
      console.error("Failed to sync like with database:", err)
    }
  }

  const handleDeleteComment = async (targetCommentId) => {
    if (!session?.user) {
      showToast("Please log in to delete a comment")
      return
    }

    const prevComments = comments

    // Optimistic removal from UI immediately
    setComments((prev) => deleteCommentRecursively(prev, targetCommentId))
    setMyCommentIds((prev) => {
      const next = new Set(prev)
      next.delete(targetCommentId)
      return next
    })

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          postId: post.id,
          commentId: targetCommentId,
        }),
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.comments)) {
        setComments(data.comments)
      } else if (!data.success) {
        // Rollback if server rejects unauthorized delete
        setComments(prevComments)
        showToast(data.error || "You can only delete your own comments", { icon: "info" })
      }
    } catch (err) {
      console.error("Failed to delete comment:", err)
      setComments(prevComments)
    }
  }


  // Count total comments including all nested replies
  const totalCommentsCount = countAllComments(comments)

  // Extract metadata
  const meta = Array.isArray(post.blocks) ? post.blocks.find((b) => b.type === "meta") : null
  const coverImage =
    post.cover_image ||
    meta?.cover_image ||
    post.blocks?.find((b) => b.type === "image")?.url ||
    ""
  const subtitle = post.subtitle || meta?.subtitle || ""
  const tags = Array.isArray(post.tags) && post.tags.length > 0 ? post.tags : []

  return (
    <div className="w-full min-h-screen bg-transparent text-neutral-900">
      {/* ─────────────────────────────────────────────────────────────
          LEFT VERTICAL FLOATING ACTION BAR
          All icons mathematically aligned on the exact same vertical axis (x = 20px)
          ───────────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col items-start gap-7 fixed left-6 sm:left-8 lg:left-12 xl:left-16 2xl:left-24 top-36 z-30 select-none">
        {/* 1. Back Arrow */}
        <div className="flex items-center h-10">
          <Link
            href="/blog"
            aria-label="Back to stories"
            className="group flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 transition-all duration-200 active:scale-90"
          >
            <ArrowLeft className="h-5 w-5 stroke-[1.75] transition-transform duration-200 group-hover:-translate-x-0.5" />
          </Link>
        </div>

        {/* 2. Heart / Likes */}
        <button
          type="button"
          onClick={handleLike}
          className="group flex items-center h-10 cursor-pointer"
          aria-label="Like story"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 group-hover:text-rose-500 group-hover:bg-rose-50 transition-all duration-200 active:scale-90">
            <Heart
              className={`h-5 w-5 stroke-[1.75] transition-transform duration-200 group-hover:scale-110 ${
                isLiked ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
          </div>
          <span
            className={`pl-1 pr-2 text-sm font-semibold tabular-nums select-none transition-colors ${
              isLiked ? "text-rose-600 font-bold" : "text-neutral-500 group-hover:text-neutral-900"
            }`}
          >
            {likes}
          </span>
        </button>

        {/* 3. Speech Bubble / Comments */}
        <button
          type="button"
          onClick={handleScrollToComments}
          className="group flex items-center h-10 cursor-pointer"
          aria-label="View comments"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 group-hover:text-neutral-900 group-hover:bg-neutral-200/60 transition-all duration-200 active:scale-90">
            <MessageSquare className="h-5 w-5 stroke-[1.75] group-hover:text-neutral-900 group-hover:scale-110 transition-all" />
          </div>
          <span className="pl-1 pr-2 text-sm font-semibold tabular-nums text-neutral-500 group-hover:text-neutral-900 select-none transition-colors">
            {totalCommentsCount}
          </span>
        </button>

        {/* 4. Share Icon */}
        <div className="relative flex items-center h-10">
          <button
            type="button"
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 transition-all duration-200 active:scale-90 cursor-pointer"
            aria-label="Share story"
          >
            <Share2 className="h-5 w-5 stroke-[1.75]" />
          </button>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          CENTERED MAIN ARTICLE COLUMN
          Clean, modern sans-serif article matching portfolio theme
          ───────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[720px] px-4 sm:px-6 pt-10 sm:pt-14 pb-28">
        <article className="w-full min-w-0">
          {/* Mobile Top Navigation & Action Row (Visible only on small screens) */}
          <div className="md:hidden flex items-center justify-between pb-4 mb-4 border-b border-neutral-200/80">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>

            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={handleLike}
                className="flex items-center gap-1 text-neutral-500"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isLiked ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
                <span className="font-semibold">{likes}</span>
              </button>
              <button
                type="button"
                onClick={handleScrollToComments}
                className="flex items-center gap-1 text-neutral-500"
              >
                <MessageSquare className="h-4 w-4" />
                <span className="font-semibold">{totalCommentsCount}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="text-neutral-500"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-3 select-none flex-wrap font-sans">
            <Link href="/" className="hover:text-neutral-800 transition-colors">
              Avinash Raj
            </Link>
            <span className="text-neutral-300">›</span>
            <Link href="/blog" className="hover:text-neutral-800 transition-colors">
              Posts
            </Link>
            <span className="text-neutral-300">›</span>
            <span className="text-neutral-600 truncate max-w-[240px] sm:max-w-md font-normal">
              {post.title}
            </span>
          </nav>

          {/* Title — Clean, bold SANS-SERIF font */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-neutral-950 font-sans leading-[1.2]">
            {post.title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-2.5 text-lg sm:text-xl text-neutral-500 font-normal leading-relaxed font-sans">
              {subtitle}
            </p>
          )}

          {/* Author Row with Right-Aligned Social Share Icons */}
          <div className="flex items-center justify-between mt-5 mb-7">
            {/* Author info (Left) */}
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden bg-neutral-100 ring-1 ring-black/5 shrink-0">
                <Image
                  src="/myimage.png"
                  alt="Avinash Raj"
                  fill
                  sizes="44px"
                  className="object-cover object-top"
                />
              </div>
              <div>
                <p className="font-semibold text-neutral-900 text-sm sm:text-base leading-tight">
                  Avinash Raj
                </p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                  <span>{dateStr}</span>
                  <span>•</span>
                  <span>{readingTime} min read</span>
                </div>
              </div>
            </div>

            {/* Social Share Icons */}
            <div className="flex items-center gap-2">
              {/* Facebook */}
              <Tooltip text="Share on Facebook">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/80 border border-neutral-200/60 shadow-2xs transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2v3.98h2v8.01z" />
                  </svg>
                </a>
              </Tooltip>

              {/* X / Twitter */}
              <Tooltip text="Share on X">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/80 border border-neutral-200/60 shadow-2xs transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </Tooltip>

              {/* LinkedIn */}
              <Tooltip text="Share on LinkedIn">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/80 border border-neutral-200/60 shadow-2xs transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                  </svg>
                </a>
              </Tooltip>
            </div>
          </div>

          {/* Centered Featured Cover Image */}
          {coverImage && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl mb-8 border border-neutral-200/80 shadow-2xs bg-neutral-100">
              <Image
                src={coverImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 720px"
                quality={85}
                className="object-cover"
              />
            </div>
          )}

          {/* Story Body Content */}
          <div className="mt-8 space-y-6 font-sans">
            {Array.isArray(post.blocks) && post.blocks.length > 0 ? (
              post.blocks
                .filter((b) => {
                  if (!b) return false
                  if (b.type === "meta" || b.type === "likes" || b.type === "comments") return false
                  return true
                })
                .map((block) => {
                  if (block.type === "paragraph") {
                    if (!block.content?.trim()) return null
                    return (
                      <div
                        key={block.id}
                        dangerouslySetInnerHTML={{ __html: block.content }}
                        className="prose prose-neutral max-w-none text-[17px] sm:text-[18px] leading-[1.8] text-neutral-800 font-normal font-sans prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-950 prose-headings:mt-8 prose-headings:mb-3 prose-p:my-4 prose-ul:my-4 prose-li:my-1"
                      />
                    )
                  }

                  if (block.type === "heading" || block.type === "h2") {
                    return (
                      <h2
                        key={block.id}
                        className="text-2xl sm:text-3xl font-bold font-sans text-neutral-950 mt-10 mb-3 tracking-tight"
                      >
                        {block.content}
                      </h2>
                    )
                  }

                  if (block.type === "image" && (block.url || block.src)) {
                    const imgUrl = block.url || block.src
                    return (
                      <figure key={block.id || imgUrl} className="my-8">
                        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50 shadow-2xs">
                          <Image
                            src={imgUrl}
                            alt={block.caption || post.title || "Story illustration"}
                            width={1200}
                            height={675}
                            sizes="(max-width: 768px) 100vw, 720px"
                            quality={85}
                            loading="lazy"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="text-center text-xs text-neutral-500 mt-2.5 font-sans font-medium">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )
                  }

                  if (block.type === "quote") {
                    return (
                      <blockquote
                        key={block.id}
                        className="border-l-3 border-neutral-950 pl-5 my-6 text-neutral-800 font-sans text-lg leading-relaxed font-medium"
                      >
                        {block.content}
                      </blockquote>
                    )
                  }

                  if (block.type === "code") {
                    return (
                      <pre
                        key={block.id}
                        className="bg-neutral-900 text-neutral-100 p-4 sm:p-5 rounded-xl text-xs sm:text-sm overflow-x-auto my-6 font-mono leading-relaxed"
                      >
                        <code>{block.content}</code>
                      </pre>
                    )
                  }

                  if (block.type === "divider") {
                    return (
                      <div
                        key={block.id}
                        className="text-center text-neutral-300 tracking-[0.5em] my-8 font-sans"
                      >
                        • • •
                      </div>
                    )
                  }

                  return null
                })
            ) : (
              <div className="text-[17px] sm:text-[18px] leading-[1.8] text-neutral-800 whitespace-pre-line font-sans font-normal">
                {post.subtitle || "No content available."}
              </div>
            )}
          </div>

          {/* Tags / Topics (Chips at bottom of post) */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-8 mt-10 border-t border-neutral-200/80">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-1">
                Topics:
              </span>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-200/70 text-neutral-700 hover:bg-neutral-300/70 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              RESPONSES / THREADED COMMENTS (Tailored to Portfolio Theme)
              ───────────────────────────────────────────────────────────── */}
          <section id="comments" className="mt-14 pt-8 border-t border-neutral-200/80 font-sans">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 font-sans">
                  Responses
                </h3>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-neutral-950 text-white px-2.5 text-xs font-bold shadow-2xs">
                  {totalCommentsCount}
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                Join the conversation
              </span>
            </div>

            {/* Top-Level Comment Composer (Only for logged-in users) */}
            {session?.user ? (
              <form onSubmit={handleAddComment} className="mb-8">
                <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm focus-within:border-neutral-950 focus-within:ring-2 focus-within:ring-neutral-950/5 transition-all duration-200">
                  {/* Current User Info Row */}
                  <div className="flex items-center gap-2.5 pb-3 mb-2 border-b border-neutral-100">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden bg-neutral-100 ring-1 ring-black/10 shrink-0">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="User"
                          fill
                          sizes="24px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-neutral-900 text-[10px] text-white font-bold">
                          {(session?.user?.name || "R")[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-500 font-medium">
                      Commenting as <strong className="text-neutral-900 font-semibold">{session?.user?.name || "Reader"}</strong>
                    </span>
                  </div>

                  {/* Textarea */}
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="What are your thoughts on this story?"
                    className="w-full text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none font-sans font-normal leading-relaxed"
                  />

                  {/* Bottom Bar with Markdown hint & Respond button */}
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-neutral-100">
                    <span className="text-[11px] text-neutral-400 font-medium">
                      Markdown supported
                    </span>
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white px-5 py-2 text-xs font-semibold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>{isSubmitting ? "Posting..." : "Respond"}</span>
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-8 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-4 text-xs text-neutral-500 font-sans select-none flex items-center justify-between">
                <span>Please log in to leave a response.</span>
              </div>
            )}

            {/* Threaded Comments Tree */}
            {comments.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400 font-sans select-none">
                No responses yet. Be the first to share your thoughts.
              </div>
            ) : (
              <div className="space-y-6 pt-3">
                {comments.map((comment) => (
                  <CommentNode
                    key={comment.id}
                    comment={comment}
                    depth={0}
                    replyingToId={replyingToId}
                    setReplyingToId={setReplyingToId}
                    onAddReply={handleAddReply}
                    onToggleLike={handleToggleLike}
                    onDeleteComment={handleDeleteComment}
                    session={session}
                    myCommentIds={myCommentIds}
                  />
                ))}
              </div>
            )}
          </section>

        </article>
      </div>
    </div>
  )
}
