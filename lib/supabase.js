import { createClient } from "@supabase/supabase-js"
import { cache } from "react"

// In-memory cache for ultra-fast repeated reads (TTL: 30 seconds)
let postsListCache = { data: null, timestamp: 0 }
const singlePostCache = new Map()
const POST_CACHE_TTL = 30 * 1000

export function clearBlogCache() {
  postsListCache = { data: null, timestamp: 0 }
  singlePostCache.clear()
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Upserts a user in the Supabase 'users' table identified by unique email.
 * - Prevents duplicate user accounts across repeated sign-ins.
 * - Updates last active timestamp and avatar/username without overwriting custom roles.
 */
export async function upsertUser({ id, email, username, image, role = "user" }) {
  if (!supabaseUrl || !supabaseKey || !email) {
    return null
  }

  try {
    // 1. Check if user already exists by email to prevent duplicates
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (checkError) {
      console.error("Supabase check user error:", checkError.message)
    }

    if (existingUser) {
      // User already exists! Preserve their existing id, created_at, and custom role (e.g. 'admin')
      const updateData = {
        username: username || existingUser.username,
        image: image || existingUser.image,
        updated_at: new Date().toISOString(),
      }

      const { data: updated, error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("email", email)
        .select()
        .maybeSingle()

      if (updateError) {
        console.error("Supabase user update error:", updateError.message)
        return existingUser
      }

      return updated || existingUser
    }

    // 2. New user registration: insert fresh record
    const insertData = {
      id: id || crypto.randomUUID(),
      email,
      username: username || email.split("@")[0] || "User",
      image: image || "",
      role: role || "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: inserted, error: insertError } = await supabase
      .from("users")
      .insert(insertData)
      .select()
      .maybeSingle()

    if (insertError) {
      console.error("Supabase user insert error:", insertError.message)
      return null
    }

    return inserted
  } catch (err) {
    console.error("Failed to upsert user in Supabase:", err)
    return null
  }
}

/**
 * Fetches user profile from Supabase by email.
 */
export async function getUserByEmail(email) {
  if (!email || !supabaseUrl || !supabaseKey) return null

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (error) {
      console.error("Error fetching user by email from Supabase:", error.message)
      return null
    }

    return data
  } catch (err) {
    console.error("Failed to get user by email:", err)
    return null
  }
}

/**
 * Fetches user profile from Supabase by ID.
 */
export async function getUser(id) {
  if (!id || !supabaseUrl || !supabaseKey) return null

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching user by ID from Supabase:", error.message)
      return null
    }

    return data
  } catch (err) {
    console.error("Failed to get user:", err)
    return null
  }
}

// ═══════════════════════════════════════════════════════════════
//  BLOG DRAFTS
// ═══════════════════════════════════════════════════════════════

/**
 * Upserts a blog draft in the 'drafts' table.
 * If a draft with the given ID exists, it updates it.
 * Otherwise, it creates a new draft.
 */
export async function upsertDraft({ id, author_email, title, subtitle, cover_image, blocks, tags, status = "draft" }) {
  if (!supabaseUrl || !supabaseKey || !author_email) return null

  try {
    const now = new Date().toISOString()

    // Embed subtitle and cover_image into blocks JSONB if provided
    let finalBlocks = blocks || []
    if (subtitle !== undefined || cover_image !== undefined) {
      const existingMeta = Array.isArray(finalBlocks) ? finalBlocks.find((b) => b.type === "meta") : null
      const metaBlock = {
        type: "meta",
        subtitle: subtitle !== undefined ? subtitle : existingMeta?.subtitle || "",
        cover_image: cover_image !== undefined ? cover_image : existingMeta?.cover_image || "",
      }
      finalBlocks = [metaBlock, ...(Array.isArray(finalBlocks) ? finalBlocks.filter((b) => b.type !== "meta") : [])]
    }

    // 1. Check if draft exists by explicit ID
    if (id) {
      const { data: existing } = await supabase
        .from("drafts")
        .select("id")
        .eq("id", id)
        .maybeSingle()

      if (existing) {
        const { data, error } = await supabase
          .from("drafts")
          .update({
            title: title || "",
            blocks: finalBlocks,
            tags: tags || [],
            status,
            updated_at: now,
          })
          .eq("id", id)
          .select()
          .maybeSingle()

        if (error) {
          console.error("Supabase draft update error:", error.message)
          return null
        }
        return data
      } else {
        // ID was explicitly provided but does not exist yet — insert with that exact ID
        const { data, error } = await supabase
          .from("drafts")
          .insert({
            id,
            author_email,
            title: title || "",
            blocks: finalBlocks,
            tags: tags || [],
            status,
            created_at: now,
            updated_at: now,
          })
          .select()
          .maybeSingle()

        if (error) {
          console.error("Supabase draft insert error:", error.message)
          return null
        }
        return data
      }
    }

    // 2. If no ID provided at all, check if author already has an active draft to reuse
    const { data: activeDraft } = await supabase
      .from("drafts")
      .select("id")
      .eq("author_email", author_email)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (activeDraft) {
      // Re-use and update the existing draft row
      const { data, error } = await supabase
        .from("drafts")
        .update({
          title: title || "",
          blocks: finalBlocks,
          tags: tags || [],
          status,
          updated_at: now,
        })
        .eq("id", activeDraft.id)
        .select()
        .maybeSingle()

      if (error) {
        console.error("Supabase draft update error:", error.message)
        return null
      }
      return data
    }

    // 3. Author has NO active draft at all — insert new draft with generated ID
    const draftId = crypto.randomUUID()
    const { data, error } = await supabase
      .from("drafts")
      .insert({
        id: draftId,
        author_email,
        title: title || "",
        blocks: finalBlocks,
        tags: tags || [],
        status,
        created_at: now,
        updated_at: now,
      })
      .select()
      .maybeSingle()

    if (error) {
      console.error("Supabase draft insert error:", error.message)
      return null
    }
    return data
  } catch (err) {
    console.error("Failed to upsert draft:", err)
    return null
  }
}

/**
 * Gets a specific draft by ID.
 */
export async function getDraft(id) {
  if (!id || !supabaseUrl || !supabaseKey) return null

  try {
    const { data, error } = await supabase
      .from("drafts")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (error) {
      console.error("Error fetching draft:", error.message)
      return null
    }
    return data
  } catch (err) {
    console.error("Failed to get draft:", err)
    return null
  }
}

/**
 * Gets the most recent draft for a user (by author email).
 */
export async function getLatestDraft(authorEmail) {
  if (!authorEmail || !supabaseUrl || !supabaseKey) return null

  try {
    const { data, error } = await supabase
      .from("drafts")
      .select("*")
      .eq("author_email", authorEmail)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("Error fetching latest draft:", error.message)
      return null
    }
    return data
  } catch (err) {
    console.error("Failed to get latest draft:", err)
    return null
  }
}

/**
 * Lists all drafts for a given author email, optionally filtered by status ('draft' or 'published').
 */
export async function listDrafts(authorEmail, status = null) {
  if (!authorEmail || !supabaseUrl || !supabaseKey) return []

  try {
    let query = supabase
      .from("drafts")
      .select("*")
      .eq("author_email", authorEmail)
      .order("updated_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error listing drafts:", error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error("Failed to list drafts:", err)
    return []
  }
}

/**
 * Publishes a draft — updates the status to 'published' and updates/creates the post in the posts table.
 */
export async function publishDraft(id, updates = {}) {
  if (!id || !supabaseUrl || !supabaseKey) return null

  try {
    const now = new Date().toISOString()

    // Get the draft first
    const draft = await getDraft(id)
    if (!draft) return null

    const finalTitle = updates.title || draft.title || "Untitled Story"
    const finalTags = updates.tags || draft.tags || []
    const finalBlocks = updates.blocks || draft.blocks || []
    const finalSubtitle = updates.subtitle || ""
    const finalCover = updates.cover_image || ""

    // Attach metadata (subtitle, cover_image) into blocks so it's always preserved in JSONB
    const blocksWithMeta = Array.isArray(finalBlocks)
      ? [{ type: "meta", subtitle: finalSubtitle, cover_image: finalCover }, ...finalBlocks.filter((b) => b.type !== "meta")]
      : finalBlocks

    // Update draft status to published
    await supabase
      .from("drafts")
      .update({
        title: finalTitle,
        tags: finalTags,
        blocks: blocksWithMeta,
        status: "published",
        updated_at: now,
      })
      .eq("id", id)

    // Check if an existing post is already linked to this draft_id
    const { data: existingPost } = await supabase
      .from("posts")
      .select("id")
      .eq("draft_id", id)
      .maybeSingle()

    let data, error

    if (existingPost) {
      // Update existing post rather than inserting a duplicate
      const res = await supabase
        .from("posts")
        .update({
          title: finalTitle,
          blocks: blocksWithMeta,
          tags: finalTags,
          subtitle: finalSubtitle,
          cover_image: finalCover,
          status: "published",
          updated_at: now,
        })
        .eq("id", existingPost.id)
        .select()
        .maybeSingle()
      data = res.data
      error = res.error
    } else {
      // Insert new post
      const postPayload = {
        id: crypto.randomUUID(),
        draft_id: id,
        author_email: draft.author_email,
        title: finalTitle,
        blocks: blocksWithMeta,
        tags: finalTags,
        status: "published",
        published_at: now,
        created_at: now,
        updated_at: now,
      }

      const res = await supabase
        .from("posts")
        .insert({
          ...postPayload,
          subtitle: finalSubtitle,
          cover_image: finalCover,
        })
        .select()
        .maybeSingle()

      data = res.data
      error = res.error

      // Fallback if subtitle or cover_image columns are not yet in posts table
      if (error) {
        console.warn("Retrying post insert without direct subtitle/cover columns:", error.message)
        const fallback = await supabase
          .from("posts")
          .insert(postPayload)
          .select()
          .maybeSingle()
        data = fallback.data
        error = fallback.error
      }
    }

    if (error) {
      console.error("Error publishing post:", error.message)
      return null
    }
    clearBlogCache()
    return data
  } catch (err) {
    console.error("Failed to publish draft:", err)
    return null
  }
}

/**
 * Deletes a published post by ID, along with its comments and likes.
 * Only the author or an admin can delete the post.
 */
export async function deletePost(postId, requestingUserEmail) {
  if (!postId || !supabaseUrl || !supabaseKey) {
    return { success: false, error: "Missing post ID or configuration" }
  }

  try {
    const requestingUser = await getUserByEmail(requestingUserEmail)
    const isAdmin = requestingUser?.role === "admin"

    const { data: post, error: fetchErr } = await supabase
      .from("posts")
      .select("id, author_email, draft_id")
      .eq("id", postId)
      .maybeSingle()

    if (fetchErr || !post) {
      return { success: false, error: "Post not found" }
    }

    if (!isAdmin && post.author_email !== requestingUserEmail) {
      return { success: false, error: "Unauthorized to delete this post" }
    }

    // Delete associated comments
    try {
      await supabase.from("comments").delete().eq("post_id", postId)
    } catch (e) {
      console.warn("Could not delete from comments table:", e.message)
    }

    // Delete associated likes
    try {
      await supabase.from("post_likes").delete().eq("post_id", postId)
    } catch (e) {
      console.warn("Could not delete from post_likes table:", e.message)
    }

    // Delete post itself
    const { error: deleteErr } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)

    if (deleteErr) {
      return { success: false, error: deleteErr.message }
    }

    clearBlogCache()
    return { success: true }
  } catch (err) {
    console.error("Failed to delete post:", err)
    return { success: false, error: err.message || "Failed to delete post" }
  }
}

/**
 * Deletes a draft by ID.
 * Only the author or an admin can delete the draft.
 */
export async function deleteDraft(draftId, requestingUserEmail) {
  if (!draftId || !supabaseUrl || !supabaseKey) {
    return { success: false, error: "Missing draft ID or configuration" }
  }

  try {
    const requestingUser = await getUserByEmail(requestingUserEmail)
    const isAdmin = requestingUser?.role === "admin"

    const { data: draft, error: fetchErr } = await supabase
      .from("drafts")
      .select("id, author_email")
      .eq("id", draftId)
      .maybeSingle()

    if (fetchErr || !draft) {
      return { success: false, error: "Draft not found" }
    }

    if (!isAdmin && draft.author_email !== requestingUserEmail) {
      return { success: false, error: "Unauthorized to delete this draft" }
    }

    const { error: deleteErr } = await supabase
      .from("drafts")
      .delete()
      .eq("id", draftId)

    if (deleteErr) {
      return { success: false, error: deleteErr.message }
    }

    return { success: true }
  } catch (err) {
    console.error("Failed to delete draft:", err)
    return { success: false, error: err.message || "Failed to delete draft" }
  }
}

/**
 * Fetches all published posts from the 'posts' table with memory caching.
 */
export const getPublishedPosts = cache(async function getPublishedPosts() {
  if (!supabaseUrl || !supabaseKey) return []

  const now = Date.now()
  if (postsListCache.data && now - postsListCache.timestamp < POST_CACHE_TTL) {
    return postsListCache.data
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })

    if (error) {
      console.error("Error fetching published posts:", error.message)
      return postsListCache.data || []
    }
    const result = data || []
    postsListCache = { data: result, timestamp: now }
    return result
  } catch (err) {
    console.error("Failed to fetch published posts:", err)
    return postsListCache.data || []
  }
})

/**
 * Converts a title to an SEO-friendly URL slug.
 */
export function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Gets a single published post by ID or title slug.
 * Supports both UUID (/blog/d6c71718-...) and human-readable slugs (/blog/how-ai-is-changing-the-way-we-learn).
 * Uses React cache + in-memory cache for near-instant (0.1ms) resolution.
 */
export const getPost = cache(async function getPost(idOrSlug) {
  if (!idOrSlug || !supabaseUrl || !supabaseKey) return null

  const targetKey = String(idOrSlug).toLowerCase().trim()
  const now = Date.now()
  const cached = singlePostCache.get(targetKey)
  if (cached && now - cached.timestamp < POST_CACHE_TTL) {
    return cached.data
  }

  try {
    const isUuid = UUID_REGEX.test(idOrSlug)

    // 1. If it matches a UUID format, query directly by id
    if (isUuid) {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", idOrSlug)
        .eq("status", "published")
        .maybeSingle()

      if (!error && data) {
        singlePostCache.set(targetKey, { data, timestamp: now })
        return data
      }
    }

    // 2. Fetch published posts and match by slugify(title) or id
    const posts = await getPublishedPosts()
    const matched = posts.find((p) => {
      const s = slugify(p.title)
      return s === targetKey || p.id === idOrSlug
    })

    if (matched) {
      singlePostCache.set(targetKey, { data: matched, timestamp: now })
      return matched
    }

    return null
  } catch (err) {
    console.error("Failed to get post by id or slug:", err)
    return null
  }
})


/* ─────────────────────────────────────────────────────────────
   COMMENTS & REPLIES PERSISTENCE (Supabase Database)
   Dual-Storage Architecture:
   1. Primary: Dedicated 'comments' table in Supabase.
   2. Resilient Fallback: 'posts.blocks' ({ type: "comments" })
      persists immediately to the live 'posts' table.
   ───────────────────────────────────────────────────────────── */

export const defaultSeedComments = []

function formatRelativeTime(dateString) {
  if (!dateString) return "Just now"
  const now = new Date()
  const past = new Date(dateString)
  const diffMs = now - past
  if (isNaN(diffMs)) return "Just now"
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 60) return "Just now"
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`
  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function buildTreeFromFlatList(list) {
  const map = new Map()
  const roots = []

  list.forEach((item) => {
    map.set(item.id, {
      id: item.id,
      author: item.author_name || item.author || "Reader",
      avatar: item.author_avatar || item.avatar || "",
      authorEmail: item.author_email || item.authorEmail || "",
      date: formatRelativeTime(item.created_at),
      text: item.text || "",
      likes: item.likes || 0,
      userLiked: false,
      isAuthor: Boolean(
        item.is_author ||
          item.author === "Avinash Raj" ||
          item.author_name === "Avinash Raj"
      ),
      parentId: item.parent_id || null,
      replies: [],
    })
  })

  list.forEach((item) => {
    const node = map.get(item.id)
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id).replies.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

function insertReplyIntoTree(tree, parentId, newComment) {
  return tree.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        replies: [...(node.replies || []), newComment],
      }
    }
    if (Array.isArray(node.replies) && node.replies.length > 0) {
      return {
        ...node,
        replies: insertReplyIntoTree(node.replies, parentId, newComment),
      }
    }
    return node
  })
}

function toggleLikeInTree(tree, targetId) {
  return tree.map((node) => {
    if (node.id === targetId) {
      const userLiked = !node.userLiked
      return {
        ...node,
        userLiked,
        likes: userLiked ? (node.likes || 0) + 1 : Math.max(0, (node.likes || 0) - 1),
      }
    }
    if (Array.isArray(node.replies) && node.replies.length > 0) {
      return {
        ...node,
        replies: toggleLikeInTree(node.replies, targetId),
      }
    }
    return node
  })
}

/**
 * Fetches threaded comments for a blog post from Supabase.
 */
export async function getPostComments(postId) {
  if (!postId || !supabaseUrl || !supabaseKey) return defaultSeedComments

  try {
    // 1. Try querying 'comments' table
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    if (!error && Array.isArray(data) && data.length > 0) {
      return buildTreeFromFlatList(data)
    }

    // 2. Fallback: Query 'posts' blocks
    const { data: post, error: postErr } = await supabase
      .from("posts")
      .select("blocks")
      .eq("id", postId)
      .maybeSingle()

    if (!postErr && post && Array.isArray(post.blocks)) {
      const commentBlock = post.blocks.find((b) => b.type === "comments")
      if (commentBlock && Array.isArray(commentBlock.comments) && commentBlock.comments.length > 0) {
        return commentBlock.comments
      }
    }

    return defaultSeedComments
  } catch (err) {
    console.error("Failed to fetch post comments:", err)
    return defaultSeedComments
  }
}

/**
 * Adds a new comment or threaded reply for a blog post.
 */
export async function addPostComment(postId, { parentId = null, author = "Reader", avatar = "", authorEmail = "", text = "", isAuthor = false }) {
  if (!postId || !text.trim() || !supabaseUrl || !supabaseKey) {
    return { success: false, error: "Missing required comment data" }
  }

  const cleanText = text.trim()
  const cleanAuthor = author.trim() || "Reader"
  const cleanEmail = (authorEmail || "").trim()
  const nowIso = new Date().toISOString()
  const isPostAuthor = Boolean(isAuthor || cleanAuthor === "Avinash Raj")

  try {
    // 1. Try inserting into 'comments' table
    const newId = crypto.randomUUID()
    const { data: tableData, error: tableErr } = await supabase
      .from("comments")
      .insert({
        id: newId,
        post_id: postId,
        parent_id: parentId || null,
        author_name: cleanAuthor,
        author_avatar: avatar || "",
        author_email: cleanEmail,
        is_author: isPostAuthor,
        text: cleanText,
        likes: 0,
        created_at: nowIso,
        updated_at: nowIso,
      })
      .select()
      .maybeSingle()

    if (!tableErr && tableData) {
      const allComments = await getPostComments(postId)
      return { success: true, comment: tableData, comments: allComments }
    }

    // 2. Fallback: Store into 'posts.blocks'
    const { data: post, error: postErr } = await supabase
      .from("posts")
      .select("blocks")
      .eq("id", postId)
      .maybeSingle()

    if (postErr || !post) {
      return { success: false, error: "Post not found for comment storage" }
    }

    let blocks = Array.isArray(post.blocks) ? [...post.blocks] : []
    let commentBlockIndex = blocks.findIndex((b) => b.type === "comments")
    let currentComments = commentBlockIndex >= 0 && Array.isArray(blocks[commentBlockIndex].comments)
      ? blocks[commentBlockIndex].comments
      : [...defaultSeedComments]

    const newCommentNode = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      author: cleanAuthor,
      avatar: avatar || "",
      authorEmail: cleanEmail,
      date: "Just now",
      text: cleanText,
      likes: 0,
      userLiked: false,
      isAuthor: isPostAuthor,
      parentId: parentId || null,
      replies: [],
    }

    let updatedComments = []
    if (parentId) {
      updatedComments = insertReplyIntoTree(currentComments, parentId, newCommentNode)
    } else {
      updatedComments = [newCommentNode, ...currentComments]
    }

    if (commentBlockIndex >= 0) {
      blocks[commentBlockIndex] = { type: "comments", comments: updatedComments }
    } else {
      blocks.push({ type: "comments", comments: updatedComments })
    }

    const { error: updateErr } = await supabase
      .from("posts")
      .update({ blocks, updated_at: nowIso })
      .eq("id", postId)

    if (updateErr) {
      console.error("Failed to update post blocks comments:", updateErr.message)
      return { success: false, error: updateErr.message }
    }

    return {
      success: true,
      comment: newCommentNode,
      comments: updatedComments,
    }
  } catch (err) {
    console.error("Error in addPostComment:", err)
    return { success: false, error: err.message || "Failed to add comment" }
  }
}

/**
 * Toggles like on a comment and updates Supabase.
 */
export async function togglePostCommentLike(postId, commentId) {
  if (!postId || !commentId || !supabaseUrl || !supabaseKey) {
    return { success: false, error: "Missing required parameters" }
  }

  try {
    // 1. Try 'comments' table
    const { data: existing, error: getErr } = await supabase
      .from("comments")
      .select("likes")
      .eq("id", commentId)
      .maybeSingle()

    if (!getErr && existing) {
      const newLikes = Math.max(0, (existing.likes || 0) + 1)
      const { data: updated, error: updErr } = await supabase
        .from("comments")
        .update({ likes: newLikes, updated_at: new Date().toISOString() })
        .eq("id", commentId)
        .select()
        .maybeSingle()

      if (!updErr) {
        return { success: true, likes: newLikes }
      }
    }

    // 2. Fallback: Update 'posts.blocks'
    const { data: post, error: postErr } = await supabase
      .from("posts")
      .select("blocks")
      .eq("id", postId)
      .maybeSingle()

    if (postErr || !post || !Array.isArray(post.blocks)) {
      return { success: false, error: "Post not found" }
    }

    let blocks = [...post.blocks]
    let commentBlockIndex = blocks.findIndex((b) => b.type === "comments")
    if (commentBlockIndex < 0) {
      return { success: false, error: "Comments block not found" }
    }

    const updatedComments = toggleLikeInTree(blocks[commentBlockIndex].comments || [], commentId)
    blocks[commentBlockIndex] = { type: "comments", comments: updatedComments }

    await supabase
      .from("posts")
      .update({ blocks, updated_at: new Date().toISOString() })
      .eq("id", postId)

    return { success: true, comments: updatedComments }
  } catch (err) {
    console.error("Error toggling comment like:", err)
    return { success: false, error: err.message || "Failed to toggle like" }
  }
}

function deleteCommentFromTree(tree, targetId) {
  if (!Array.isArray(tree)) return []
  return tree
    .filter((node) => node.id !== targetId)
    .map((node) => {
      if (Array.isArray(node.replies) && node.replies.length > 0) {
        return {
          ...node,
          replies: deleteCommentFromTree(node.replies, targetId),
        }
      }
      return node
    })
}

/**
 * Deletes a comment and its threaded replies from Supabase.
 * Strictly verifies that the requesting user authored the comment.
 */
export async function deletePostComment(postId, commentId, requestingUserEmail = null) {
  if (!postId || !commentId || !supabaseUrl || !supabaseKey) {
    return { success: false, error: "Missing required parameters" }
  }

  const cleanRequestEmail = (requestingUserEmail || "").toLowerCase().trim()
  if (!cleanRequestEmail) {
    return { success: false, error: "Please log in to delete a comment." }
  }

  try {
    // 1. Try checking and deleting from 'comments' table
    const { data: existingTableComment } = await supabase
      .from("comments")
      .select("id, author_email, is_author")
      .eq("id", commentId)
      .maybeSingle()

    if (existingTableComment) {
      const ownerEmail = (existingTableComment.author_email || "").toLowerCase().trim()
      const isOwner = ownerEmail === cleanRequestEmail || (existingTableComment.is_author && cleanRequestEmail === "avinashraj151@gmail.com")

      if (!isOwner) {
        return { success: false, error: "You can only delete your own comments." }
      }

      const { error: delErr } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)

      if (!delErr) {
        // Also delete any child replies
        await supabase
          .from("comments")
          .delete()
          .eq("parent_id", commentId)

        const allComments = await getPostComments(postId)
        return { success: true, comments: allComments }
      }
    }

    // 2. Fallback: Delete from 'posts.blocks'
    const { data: post, error: postErr } = await supabase
      .from("posts")
      .select("id, blocks")
      .eq("id", postId)
      .maybeSingle()

    if (postErr || !post || !Array.isArray(post.blocks)) {
      return { success: false, error: "Post not found" }
    }

    let blocks = [...post.blocks]
    let commentBlockIndex = blocks.findIndex((b) => b && b.type === "comments")
    if (commentBlockIndex < 0) {
      return { success: false, error: "Comments block not found" }
    }

    function findCommentNode(nodes, targetId) {
      if (!Array.isArray(nodes)) return null
      for (const n of nodes) {
        if (n.id === targetId) return n
        if (Array.isArray(n.replies)) {
          const res = findCommentNode(n.replies, targetId)
          if (res) return res
        }
      }
      return null
    }

    const targetNode = findCommentNode(blocks[commentBlockIndex].comments || [], commentId)
    if (targetNode) {
      const nodeOwnerEmail = (targetNode.authorEmail || "").toLowerCase().trim()
      const isOwner = nodeOwnerEmail === cleanRequestEmail || (targetNode.isAuthor && cleanRequestEmail === "avinashraj151@gmail.com")

      if (!isOwner) {
        return { success: false, error: "You can only delete your own comments." }
      }
    }

    const updatedComments = deleteCommentFromTree(blocks[commentBlockIndex].comments || [], commentId)
    blocks[commentBlockIndex] = { type: "comments", comments: updatedComments }

    await supabase
      .from("posts")
      .update({ blocks, updated_at: new Date().toISOString() })
      .eq("id", postId)

    return { success: true, comments: updatedComments }
  } catch (err) {
    console.error("Error deleting comment:", err)
    return { success: false, error: err.message || "Failed to delete comment" }
  }
}

/* ─────────────────────────────────────────────────────────────
   POST LIKES PERSISTENCE (Supabase Database)
   Dual-Storage Architecture:
   1. Primary: Dedicated 'post_likes' table and 'posts.likes' column.
   2. Resilient Fallback: 'posts.blocks' ({ type: "likes", count, users })
      persisting immediately to the live 'posts' table in Supabase.
   ───────────────────────────────────────────────────────────── */

/**
 * Extracts like count and user liked status from a post record.
 */
export function extractPostLikes(post, userEmail = null) {
  if (!post) return { likes: 0, isLiked: false }

  const blocks = Array.isArray(post.blocks) ? post.blocks : []
  const likesBlock = blocks.find((b) => b && b.type === "likes")
  const users = Array.isArray(likesBlock?.users) ? likesBlock.users : []

  const cleanEmail = userEmail ? userEmail.toLowerCase().trim() : null
  const isLiked = Boolean(cleanEmail && users.includes(cleanEmail))

  let count = 0
  if (likesBlock && typeof likesBlock.count === "number") {
    count = likesBlock.count
  } else if (users.length > 0) {
    count = users.length
  } else if (typeof post.likes === "number") {
    count = post.likes
  }

  return {
    likes: Math.max(0, count),
    isLiked,
  }
}

/**
 * Gets live like status and count for a post from Supabase.
 */
export async function getPostLikeStatus(postId, userEmail = null) {
  if (!postId || !supabaseUrl || !supabaseKey) {
    return { likes: 0, isLiked: false }
  }

  try {
    const cleanEmail = userEmail ? userEmail.toLowerCase().trim() : null

    // Resolve post by ID or slug if needed
    let targetPostId = postId
    if (!UUID_REGEX.test(postId)) {
      const found = await getPost(postId)
      if (found) targetPostId = found.id
    }

    // 1. Check if post_likes table is available
    const { count, error: countErr } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", targetPostId)

    if (!countErr && typeof count === "number") {
      let isLiked = false
      if (cleanEmail) {
        const { data: userLike } = await supabase
          .from("post_likes")
          .select("id")
          .eq("post_id", targetPostId)
          .eq("user_email", cleanEmail)
          .maybeSingle()
        isLiked = Boolean(userLike)
      }
      return { likes: count, isLiked }
    }

    // 2. Fallback: Query 'posts' blocks
    const { data: post, error: postErr } = await supabase
      .from("posts")
      .select("id, blocks")
      .eq("id", targetPostId)
      .maybeSingle()

    if (!postErr && post) {
      return extractPostLikes(post, cleanEmail)
    }

    return { likes: 0, isLiked: false }
  } catch (err) {
    console.error("Failed to get post like status:", err)
    return { likes: 0, isLiked: false }
  }
}

/**
 * Toggles a user's like for a blog post in Supabase.
 */
export async function togglePostLike(postId, userEmail) {
  if (!postId || !userEmail || !supabaseUrl || !supabaseKey) {
    return { success: false, error: "Missing postId or userEmail" }
  }

  const cleanEmail = userEmail.toLowerCase().trim()

  try {
    // Resolve post by ID or slug if needed
    let targetPostId = postId
    if (!UUID_REGEX.test(postId)) {
      const found = await getPost(postId)
      if (found) targetPostId = found.id
    }

    // 1. Try relational post_likes table
    let tableUpdated = false
    let finalIsLiked = false
    let finalCount = 0

    const { data: existingRow, error: checkErr } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", targetPostId)
      .eq("user_email", cleanEmail)
      .maybeSingle()

    if (!checkErr) {
      if (existingRow) {
        // Already liked: remove it
        await supabase
          .from("post_likes")
          .delete()
          .eq("id", existingRow.id)
        finalIsLiked = false
      } else {
        // Not liked: add it
        await supabase
          .from("post_likes")
          .insert({
            id: crypto.randomUUID(),
            post_id: targetPostId,
            user_email: cleanEmail,
            created_at: new Date().toISOString(),
          })
        finalIsLiked = true
      }

      const { count } = await supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", targetPostId)

      if (typeof count === "number") {
        finalCount = count
        tableUpdated = true
      }
    }

    // 2. Resilient fallback & sync with posts.blocks
    const { data: post, error: postErr } = await supabase
      .from("posts")
      .select("id, blocks")
      .eq("id", targetPostId)
      .maybeSingle()

    if (postErr || !post) {
      if (tableUpdated) {
        return { success: true, likes: finalCount, isLiked: finalIsLiked }
      }
      return { success: false, error: "Post not found" }
    }

    let blocks = Array.isArray(post.blocks) ? [...post.blocks] : []
    let likesIndex = blocks.findIndex((b) => b && b.type === "likes")
    let currentUsers = likesIndex >= 0 && Array.isArray(blocks[likesIndex].users)
      ? [...blocks[likesIndex].users]
      : []

    if (!tableUpdated) {
      const alreadyLiked = currentUsers.includes(cleanEmail)
      if (alreadyLiked) {
        currentUsers = currentUsers.filter((u) => u !== cleanEmail)
        finalIsLiked = false
      } else {
        currentUsers.push(cleanEmail)
        finalIsLiked = true
      }
      finalCount = currentUsers.length
    } else {
      // Sync users array with relational status
      if (finalIsLiked && !currentUsers.includes(cleanEmail)) {
        currentUsers.push(cleanEmail)
      } else if (!finalIsLiked && currentUsers.includes(cleanEmail)) {
        currentUsers = currentUsers.filter((u) => u !== cleanEmail)
      }
    }

    const updatedLikesBlock = {
      type: "likes",
      count: finalCount,
      users: currentUsers,
    }

    if (likesIndex >= 0) {
      blocks[likesIndex] = updatedLikesBlock
    } else {
      blocks.push(updatedLikesBlock)
    }

    const nowIso = new Date().toISOString()
    const { error: updateErr } = await supabase
      .from("posts")
      .update({ blocks, updated_at: nowIso })
      .eq("id", targetPostId)

    if (updateErr) {
      console.error("Failed to update post blocks for likes:", updateErr.message)
      if (!tableUpdated) {
        return { success: false, error: updateErr.message }
      }
    }

    clearBlogCache()
    return {
      success: true,
      likes: finalCount,
      isLiked: finalIsLiked,
    }
  } catch (err) {
    console.error("Error in togglePostLike:", err)
    return { success: false, error: err.message || "Failed to toggle like" }
  }
}


