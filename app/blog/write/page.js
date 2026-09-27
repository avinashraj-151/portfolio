import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getLatestDraft, getDraft, getPost } from "@/lib/supabase"
import WriteBlogClient from "./WriteBlogClient"

export const metadata = {
  title: "Write a Blog | Avinash Raj",
  description: "Admin editorial interface to compose, preview, and publish blog articles.",
}

export default async function WriteBlogPage({ searchParams }) {
  const session = await auth()

  // Guard: Admin only
  if (!session?.user || session.user.role !== "admin") {
    redirect("/blog")
  }

  const sParams = await searchParams
  const draftId = sParams?.draftId || sParams?.id
  const postId = sParams?.postId
  const isNew = sParams?.new === "true"

  let draft = null

  if (isNew) {
    // Start completely new story
    draft = {
      id: crypto.randomUUID(),
      title: "",
      blocks: [],
      tags: [],
      isNew: true,
    }
  } else if (draftId) {
    try {
      draft = await getDraft(draftId)
    } catch (err) {
      console.error("Failed to load draft by id:", err)
    }
  } else if (postId) {
    try {
      const post = await getPost(postId)
      if (post) {
        if (post.draft_id) {
          draft = await getDraft(post.draft_id)
        }
        if (!draft) {
          draft = {
            id: post.draft_id || crypto.randomUUID(),
            title: post.title || "",
            blocks: post.blocks || [],
            tags: post.tags || [],
            subtitle: post.subtitle || "",
            cover_image: post.cover_image || "",
          }
        }
      }
    } catch (err) {
      console.error("Failed to load post for editing:", err)
    }
  }

  // Fallback: Check for author's latest draft if not explicitly starting new
  if (!draft && !isNew) {
    try {
      draft = await getLatestDraft(session.user.email)
    } catch (err) {
      console.error("Failed to load draft:", err)
    }
  }

  return <WriteBlogClient user={session.user} initialDraft={draft} />
}
