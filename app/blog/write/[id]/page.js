import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getDraft } from "@/lib/supabase"
import PublishClient from "./PublishClient"

export const metadata = {
  title: "Publish Story | Avinash Raj",
  description: "Configure story cover image, subtitle, and topics before publishing.",
}

export default async function PublishPage({ params }) {
  const session = await auth()

  // Guard: Admin only
  if (!session?.user || session.user.role !== "admin") {
    redirect("/blog")
  }

  const { id } = await params
  if (!id) {
    redirect("/blog/write")
  }

  const draft = await getDraft(id)
  if (!draft) {
    redirect("/blog/write")
  }

  return <PublishClient draft={draft} user={session.user} />
}
