import { auth } from "@/auth"
import { getPublishedPosts, slugify, extractPostLikes } from "@/lib/supabase"
import BlogClient from "./BlogClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata = {
  title: "Blog & Essays | Avinash Raj",
  description:
    "Articles on full-stack architecture, Next.js, building GateExam.org, cracking competitive CS exams, and product engineering by Avinash Raj.",
  alternates: {
    canonical: "/blog",
  },
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

export default async function BlogPage() {
  const session = await auth()
  const userEmail = session?.user?.email || null
  const isAdmin = session?.user?.role === "admin"

  const rawPosts = await getPublishedPosts()

  // Format real posts from Supabase database
  const realPosts = (rawPosts || []).map((post) => {
    const meta = Array.isArray(post.blocks) ? post.blocks.find((b) => b.type === "meta") : null
    const coverImage =
      post.cover_image ||
      meta?.cover_image ||
      post.blocks?.find((b) => b.type === "image")?.url ||
      ""
    const subtitle =
      post.subtitle ||
      meta?.subtitle ||
      post.blocks
        ?.find((b) => b.type === "paragraph" && b.content)
        ?.content?.replace(/<[^>]+>/g, " ")
        .trim()
        .slice(0, 160) ||
      ""
    const tags = Array.isArray(post.tags) && post.tags.length > 0 ? post.tags : ["Engineering"]
    const dateStr = post.published_at
      ? new Date(post.published_at).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "Recently"

    const { likes, isLiked } = extractPostLikes(post, userEmail)
    const comments = countCommentsInBlocks(post.blocks)

    return {
      id: post.id,
      slug: slugify(post.title || post.id),
      title: post.title || "Untitled Story",
      subtitle,
      excerpt: subtitle || "No summary provided.",
      coverImage,
      tags,
      tag: tags[0],
      tagExtra: tags.length > 1 ? `+${tags.length - 1}` : null,
      category: tags[0],
      date: dateStr,
      likes,
      isLiked,
      comments,
      author: "Avinash Raj",
      authorImage: "/myimage.png",
      blocks: post.blocks || [],
    }
  })

  return <BlogClient initialPosts={realPosts} isAdmin={isAdmin} />
}
