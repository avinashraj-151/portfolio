import { auth } from "@/auth"
import { getPost, getPostComments, getPostLikeStatus } from "@/lib/supabase"
import { notFound } from "next/navigation"
import BlogPostClient from "./BlogPostClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata({ params }) {
  const { id } = await params
  const post = await getPost(id)
  if (!post) {
    return { title: "Story Not Found | Avinash Raj" }
  }

  const meta = Array.isArray(post.blocks) ? post.blocks.find((b) => b.type === "meta") : null
  const subtitle = post.subtitle || meta?.subtitle || "Story by Avinash Raj"

  return {
    title: `${post.title} | Avinash Raj`,
    description: subtitle,
  }
}

export default async function BlogPostPage({ params }) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  const session = await auth()
  const userEmail = session?.user?.email || null

  const [initialComments, likeStatus] = await Promise.all([
    getPostComments(post.id),
    getPostLikeStatus(post.id, userEmail),
  ])

  const initialLikes = likeStatus?.likes ?? 0
  const initialIsLiked = likeStatus?.isLiked ?? false

  // Estimate reading time from text content
  const totalWords = Array.isArray(post.blocks)
    ? post.blocks
        .filter((b) => b.content)
        .map((b) => b.content.replace(/<[^>]+>/g, " "))
        .join(" ")
        .split(/\s+/).length
    : 100
  const readingTime = Math.max(1, Math.ceil(totalWords / 200))

  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently"

  return (
    <BlogPostClient
      post={post}
      readingTime={readingTime}
      dateStr={dateStr}
      initialComments={initialComments}
      initialLikes={initialLikes}
      initialIsLiked={initialIsLiked}
    />
  )
}

