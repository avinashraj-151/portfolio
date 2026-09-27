import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { listDrafts, getPublishedPosts, extractPostLikes } from "@/lib/supabase"
import StoriesClient from "./StoriesClient"

export const metadata = {
  title: "Your Stories | Avinash Raj",
  description: "Manage drafts, edit, and delete published blog posts.",
}

function countCommentsInBlocks(blocks) {
  if (!Array.isArray(blocks)) return 0
  const commentBlock = blocks.find((b) => b && b.type === "comments")
  if (!commentBlock || !Array.isArray(commentBlock.comments)) return 0

  function countTree(list) {
    let count = 0
    for (const item of list) {
      count += 1
      if (Array.isArray(item.replies) && item.replies.length > 0) {
        count += countTree(item.replies)
      }
    }
    return count
  }
  return countTree(commentBlock.comments)
}

export default async function StoriesPage() {
  const session = await auth()

  // Guard: Admin only
  if (!session?.user || session.user.role !== "admin") {
    redirect("/blog")
  }

  // 1. Fetch unpublished drafts
  const allDrafts = await listDrafts(session.user.email)
  const drafts = (allDrafts || [])
    .filter((d) => d.status === "draft")
    .map((draft) => {
      // Find first paragraph text for snippet
      const firstP = Array.isArray(draft.blocks)
        ? draft.blocks.find((b) => b && b.type === "paragraph" && b.content)
        : null
      const snippet = firstP?.content
        ? firstP.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 140)
        : ""

      const dateStr = draft.updated_at
        ? new Date(draft.updated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recently"

      return {
        id: draft.id,
        title: draft.title || "Untitled Draft",
        snippet: snippet || "No content written yet.",
        tags: Array.isArray(draft.tags) ? draft.tags : [],
        updated_at: draft.updated_at,
        date: dateStr,
        status: draft.status,
      }
    })

  // 2. Fetch published posts
  const rawPosts = await getPublishedPosts()
  const posts = (rawPosts || []).map((post) => {
    const meta = Array.isArray(post.blocks) ? post.blocks.find((b) => b.type === "meta") : null
    const coverImage =
      post.cover_image ||
      meta?.cover_image ||
      post.blocks?.find((b) => b && b.type === "image")?.url ||
      ""
    const subtitle =
      post.subtitle ||
      meta?.subtitle ||
      post.blocks
        ?.find((b) => b && b.type === "paragraph" && b.content)
        ?.content?.replace(/<[^>]+>/g, " ")
        .trim()
        .slice(0, 160) ||
      ""
    const dateStr = post.published_at
      ? new Date(post.published_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recently"

    const { likes } = extractPostLikes(post)
    const comments = countCommentsInBlocks(post.blocks)

    return {
      id: post.id,
      draft_id: post.draft_id,
      title: post.title || "Untitled Story",
      subtitle,
      coverImage,
      tags: Array.isArray(post.tags) ? post.tags : [],
      date: dateStr,
      published_at: post.published_at,
      likes,
      comments,
      status: post.status,
    }
  })

  return <StoriesClient initialDrafts={drafts} initialPosts={posts} user={session.user} />
}
