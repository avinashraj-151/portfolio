import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { upsertDraft, getLatestDraft, listDrafts, publishDraft, deleteDraft } from "@/lib/supabase"

/**
 * GET /api/drafts — Load the latest draft or all drafts for the current user
 */
export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isAll = searchParams.get("all") === "true"
    const status = searchParams.get("status")

    if (isAll) {
      const drafts = await listDrafts(session.user.email, status || null)
      return NextResponse.json({ drafts })
    }

    const draft = await getLatestDraft(session.user.email)
    return NextResponse.json({ draft })
  } catch (err) {
    console.error("GET /api/drafts error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

/**
 * POST /api/drafts — Save / auto-save a draft
 * Body: { id?, title, blocks, tags }
 */
export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, subtitle, cover_image, blocks, tags, action } = body

    // Publish action
    if (action === "publish") {
      if (!id) {
        return NextResponse.json({ error: "Draft ID required to publish" }, { status: 400 })
      }
      const post = await publishDraft(id, { title, subtitle, cover_image, blocks, tags })
      if (!post) {
        return NextResponse.json({ error: "Failed to publish" }, { status: 500 })
      }
      return NextResponse.json({ post, published: true })
    }

    // Normal save / auto-save
    const draft = await upsertDraft({
      id: id || undefined,
      author_email: session.user.email,
      title,
      subtitle,
      cover_image,
      blocks,
      tags,
    })

    if (!draft) {
      return NextResponse.json({ error: "Failed to save draft" }, { status: 500 })
    }

    return NextResponse.json({ draft, saved: true })
  } catch (err) {
    console.error("POST /api/drafts error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

/**
 * DELETE /api/drafts?id=<id> — Delete a draft by ID
 */
export async function DELETE(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Draft ID required" }, { status: 400 })
    }

    const result = await deleteDraft(id, session.user.email)
    if (!result.success) {
      return NextResponse.json(result, { status: 403 })
    }

    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error("DELETE /api/drafts error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
