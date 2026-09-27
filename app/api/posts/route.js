import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getPublishedPosts, slugify, extractPostLikes, togglePostLike, deletePost } from "@/lib/supabase"

export const dynamic = "force-dynamic"
export const revalidate = 0

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

export async function GET() {
  try {
    const session = await auth()
    const userEmail = session?.user?.email || null

    const rawPosts = await getPublishedPosts()
    const posts = (rawPosts || []).map((post) => {
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

    return NextResponse.json(
      { posts },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    )
  } catch (err) {
    console.error("GET /api/posts error:", err)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Please sign in with Google to perform this action." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action = "like", postId } = body

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Missing postId" },
        { status: 400 }
      )
    }

    if (action === "like") {
      const result = await togglePostLike(postId, session.user.email)
      if (!result.success) {
        return NextResponse.json(result, { status: 500 })
      }
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { success: false, error: `Unsupported action: ${action}` },
      { status: 400 }
    )
  } catch (err) {
    console.error("POST /api/posts error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process request" },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Please log in to delete a post." },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing post ID" },
        { status: 400 }
      )
    }

    const result = await deletePost(id, session.user.email)
    if (!result.success) {
      return NextResponse.json(result, { status: 403 })
    }

    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error("DELETE /api/posts error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete post" },
      { status: 500 }
    )
  }
}

