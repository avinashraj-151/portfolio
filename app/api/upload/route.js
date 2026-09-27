import { NextResponse } from "next/server"
import { auth } from "@/auth"
import sharp from "sharp"
import { supabase } from "@/lib/supabase"
import fs from "fs/promises"
import path from "path"

// Max file size: 10MB raw input
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Helper to save optimized image to local public/uploads directory
 */
async function saveLocally(buffer, fileName) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "blog")
  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, fileName)
  await fs.writeFile(filePath, buffer)
  return {
    url: `/uploads/blog/${fileName}`,
    path: `local:${fileName}`,
  }
}

/**
 * POST /api/upload — Upload, compress, and store an image.
 * Tries Supabase Storage ("images" bucket) first;
 * If bucket is missing or unconfigured, gracefully falls back to local storage (public/uploads/blog).
 */
export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Supported: JPEG, PNG, WebP, GIF, AVIF" },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      )
    }

    const originalSize = file.size
    const buffer = Buffer.from(await file.arrayBuffer())

    // ── Compress & optimize with Sharp ──
    let optimized
    try {
      let pipeline = sharp(buffer)
      const metadata = await pipeline.metadata()
      const maxWidth = 1600
      const maxHeight = 1200

      // Resize if image exceeds max dimensions
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        pipeline = pipeline.resize(maxWidth, maxHeight, {
          fit: "inside",
          withoutEnlargement: true,
        })
      }

      // Convert to WebP with high-efficiency quality
      optimized = await pipeline
        .webp({ quality: 82, effort: 4 })
        .toBuffer()
    } catch (err) {
      console.error("Image compression error:", err)
      optimized = buffer
    }

    const timestamp = Date.now()
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[^a-zA-Z0-9_-]/g, "_") // sanitize
      .substring(0, 50)
    const baseFileName = `${timestamp}_${sanitizedName}.webp`
    const storagePath = `blog/${session.user.email.split("@")[0]}/${baseFileName}`

    let finalUrl = ""
    let finalPath = ""
    let storageType = "supabase"

    // ── 1. Attempt upload to Supabase Storage ──
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(storagePath, optimized, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: false,
        })

      if (!error && data?.path) {
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(data.path)
        finalUrl = publicUrlData.publicUrl
        finalPath = data.path
        storageType = "supabase"
      } else {
        // Fallback to local storage if bucket not found or storage error
        console.warn(`Supabase Storage upload note (${error?.message || "unknown"}), saving locally...`)
        const local = await saveLocally(optimized, baseFileName)
        finalUrl = local.url
        finalPath = local.path
        storageType = "local"
      }
    } catch (supabaseErr) {
      console.warn("Supabase Storage unavailable, saving locally...", supabaseErr.message)
      const local = await saveLocally(optimized, baseFileName)
      finalUrl = local.url
      finalPath = local.path
      storageType = "local"
    }

    const compressionRatio = ((1 - optimized.length / originalSize) * 100).toFixed(1)

    return NextResponse.json({
      url: finalUrl,
      path: finalPath,
      storageType,
      originalSize,
      compressedSize: optimized.length,
      compressionRatio: `${compressionRatio}%`,
    })
  } catch (err) {
    console.error("POST /api/upload error:", err)
    return NextResponse.json({ error: "Internal error processing upload" }, { status: 500 })
  }
}

/**
 * DELETE /api/upload — Remove an image from Supabase Storage or local storage
 * Body: { path }
 */
export async function DELETE(request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { path: filePath } = await request.json()
    if (!filePath) {
      return NextResponse.json({ error: "No path provided" }, { status: 400 })
    }

    if (filePath.startsWith("local:")) {
      const localFileName = filePath.replace(/^local:/, "")
      const localFilePath = path.join(process.cwd(), "public", "uploads", "blog", localFileName)
      try {
        await fs.unlink(localFilePath)
      } catch (err) {
        console.warn("Local file delete warning:", err.message)
      }
      return NextResponse.json({ deleted: true, storageType: "local" })
    }

    // Otherwise delete from Supabase storage
    const { error } = await supabase.storage.from("images").remove([filePath])
    if (error) {
      console.error("Supabase storage delete error:", error.message)
    }

    return NextResponse.json({ deleted: true, storageType: "supabase" })
  } catch (err) {
    console.error("DELETE /api/upload error:", err)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
