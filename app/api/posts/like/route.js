import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { togglePostLike, getPostLikeStatus } from "@/lib/supabase"

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

    const session = await auth()
    const userEmail = session?.user?.email || null

    const status = await getPostLikeStatus(postId, userEmail)
    return NextResponse.json(
      { success: true, ...status },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0, must-revalidate",
        },
      }
    )
  } catch (err) {
    console.error("API GET /api/posts/like error:", err)
    return NextResponse.json(
      { success: false, error: "Failed to fetch like status" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Please sign in with Google to like this story." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { postId } = body

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Missing postId" },
        { status: 400 }
      )
    }

    const result = await togglePostLike(postId, session.user.email)
    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error("API POST /api/posts/like error:", err)
    return NextResponse.json(
      { success: false, error: err.message || "Failed to toggle like" },
      { status: 500 }
    )
  }
}
