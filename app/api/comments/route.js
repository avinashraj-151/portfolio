import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { getPostComments, addPostComment, togglePostCommentLike, deletePostComment } from "@/lib/supabase"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Missing postId query parameter" },
        { status: 400 }
      )
    }

    const comments = await getPostComments(postId)
    return NextResponse.json(
      { success: true, comments },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    )
  } catch (err) {
    console.error("API GET /api/comments error:", err)
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to comment or like." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action = "add", postId } = body

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Missing postId" },
        { status: 400 }
      )
    }

    if (action === "add") {
      const { parentId, text } = body
      if (!text || !text.trim()) {
        return NextResponse.json(
          { success: false, error: "Comment text cannot be empty" },
          { status: 400 }
        )
      }

      const authorName = session.user.name || body.author || "Reader"
      const authorAvatar = session.user.image || body.avatar || ""
      const authorEmail = session.user.email || body.authorEmail || ""
      const isAuthor = Boolean(
        authorName === "Avinash Raj" ||
        authorEmail === "avinashraj151@gmail.com"
      )

      const result = await addPostComment(postId, {
        parentId,
        author: authorName,
        avatar: authorAvatar,
        authorEmail,
        text,
        isAuthor,
      })

      if (!result.success) {
        return NextResponse.json(result, { status: 500 })
      }

      return NextResponse.json(result)
    }

    if (action === "like") {
      const { commentId } = body
      if (!commentId) {
        return NextResponse.json(
          { success: false, error: "Missing commentId" },
          { status: 400 }
        )
      }

      const result = await togglePostCommentLike(postId, commentId)
      return NextResponse.json(result)
    }

    if (action === "delete") {
      const { commentId } = body
      if (!commentId) {
        return NextResponse.json(
          { success: false, error: "Missing commentId" },
          { status: 400 }
        )
      }

      const result = await deletePostComment(postId, commentId, session.user.email)
      if (!result.success) {
        const status = result.error?.includes("only delete your own") ? 403 : 500
        return NextResponse.json(result, { status })
      }
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { success: false, error: `Unsupported action: ${action}` },
      { status: 400 }
    )
  } catch (err) {
    console.error("API POST /api/comments error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const commentId = searchParams.get("commentId")

    if (!postId || !commentId) {
      return NextResponse.json(
        { success: false, error: "Missing postId or commentId" },
        { status: 400 }
      )
    }

    const result = await deletePostComment(postId, commentId, session.user.email)
    if (!result.success) {
      const status = result.error?.includes("only delete your own") ? 403 : 500
      return NextResponse.json(result, { status })
    }
    return NextResponse.json(result)
  } catch (err) {
    console.error("API DELETE /api/comments error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    )
  }
}

