"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  Plus,
  Camera,
  Code2,
  Quote,
  Minus,
  Link2,
  X,
  CheckCircle2,
  Trash2,
  Bold,
  Italic,
  Heading1,
  Heading2,
  TextQuote,
  Code,
  Lock,
  Upload,
  ImagePlus,
  Loader2,
} from "lucide-react"

const DEFAULT_BLOCKS = [{ id: "b1", type: "paragraph", content: "" }]
const DEFAULT_TAGS = []

/**
 * Instant localStorage fallback — loads immediately on first paint.
 */
function getLocalDraft() {
  if (typeof window === "undefined") {
    return { title: "", blocks: DEFAULT_BLOCKS, tags: DEFAULT_TAGS, draftId: null }
  }
  try {
    const saved = localStorage.getItem("portfolio_story_draft")
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        title: parsed.title || "",
        blocks:
          parsed.blocks && parsed.blocks.length > 0
            ? parsed.blocks
            : DEFAULT_BLOCKS,
        tags: parsed.tags || DEFAULT_TAGS,
        draftId: parsed.draftId || null,
      }
    }
  } catch {
    // fallback
  }
  return { title: "", blocks: DEFAULT_BLOCKS, tags: DEFAULT_TAGS, draftId: null }
}

/**
 * Caret helper to move cursor to the very end of an element
 */
function setCaretToEnd(el) {
  if (!el) return
  el.focus()
  try {
    const selection = window.getSelection()
    if (!selection) return
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  } catch (err) {
    // fallback
  }
}

/**
 * Caret-preserving uncontrolled contentEditable paragraph block.
 * React does NOT overwrite the DOM on every keystroke, preventing cursor jumps!
 */
function BlockParagraph({
  block,
  index,
  isActive,
  onFocus,
  onChange,
  onKeyDown,
  blockRef,
}) {
  const elRef = useRef(null)
  const isComposingRef = useRef(false)
  const lastHtmlRef = useRef(block.content || "")

  useEffect(() => {
    if (blockRef) {
      blockRef(elRef.current)
    }
    return () => {
      if (blockRef) blockRef(null)
    }
  }, [blockRef])

  // Set initial content on mount
  useEffect(() => {
    if (elRef.current && block.content && elRef.current.innerHTML !== block.content) {
      elRef.current.innerHTML = block.content
      lastHtmlRef.current = block.content
    }
  }, []) // mount only

  // External update only (e.g. initial draft loaded from server, or reset)
  useEffect(() => {
    if (!elRef.current) return
    if (
      block.content !== lastHtmlRef.current &&
      elRef.current.innerHTML !== block.content
    ) {
      elRef.current.innerHTML = block.content || ""
      lastHtmlRef.current = block.content || ""
    }
  }, [block.content])

  const handleInput = (e) => {
    if (isComposingRef.current) return
    let html = e.currentTarget.innerHTML
    const text = e.currentTarget.textContent || ""
    // If completely empty or only trailing <br>, clear DOM so CSS :empty matches for placeholder
    if (text.trim() === "" && (html === "<br>" || html === "<div><br></div>" || html === "<p><br></p>")) {
      html = ""
      e.currentTarget.innerHTML = ""
    }
    lastHtmlRef.current = html
    onChange(html)
  }

  return (
    <div
      ref={elRef}
      data-blog-block="true"
      data-block-id={block.id}
      contentEditable
      suppressContentEditableWarning
      onCompositionStart={() => {
        isComposingRef.current = true
      }}
      onCompositionEnd={(e) => {
        isComposingRef.current = false
        handleInput(e)
      }}
      onFocus={onFocus}
      onInput={handleInput}
      onKeyDown={onKeyDown}
      data-placeholder={index === 0 ? "Tell your story..." : ""}
      className="w-full font-serif text-xl sm:text-[21px] text-neutral-800 outline-none border-none leading-[1.8] bg-transparent min-h-[1.8em] empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-300 empty:before:pointer-events-none focus:outline-none [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:font-sans [&_h2]:text-neutral-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:font-sans [&_h3]:text-neutral-900 [&_h3]:mt-4 [&_h3]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-900 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_a]:text-emerald-700 [&_a]:underline [&_a]:underline-offset-2 [&_code]:bg-neutral-100 [&_code]:text-neutral-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[0.9em] [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic"
    />
  )
}

export default function WriteBlogClient({ user, initialDraft }) {
  // Priority: server-provided draft > localStorage fallback
  const serverDraft = initialDraft ? {
    title: initialDraft.isNew ? "" : (initialDraft.title || ""),
    blocks: initialDraft.blocks && initialDraft.blocks.length > 0 ? initialDraft.blocks : DEFAULT_BLOCKS,
    tags: initialDraft.tags && initialDraft.tags.length > 0 ? initialDraft.tags : DEFAULT_TAGS,
    draftId: initialDraft.id || null,
  } : null

  const [localDraft] = useState(getLocalDraft)
  const startDraft = initialDraft?.isNew ? serverDraft : (serverDraft || localDraft)

  const router = useRouter()

  const [title, setTitle] = useState(startDraft.title)
  const [blocks, setBlocks] = useState(startDraft.blocks)
  const [activeBlockId, setActiveBlockId] = useState(startDraft.blocks[0]?.id || "b1")
  const [openToolsId, setOpenToolsId] = useState(null)
  const [tags, setTags] = useState(startDraft.tags)
  const [tagInput, setTagInput] = useState("")
  const [isSaved, setIsSaved] = useState(true)
  const [saveStatus, setSaveStatus] = useState("saved") // "saved" | "saving" | "error"
  const [isNavigatingToPublish, setIsNavigatingToPublish] = useState(false)
  const [uploadingBlockId, setUploadingBlockId] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const isFirstMount = useRef(true)
  const draftIdRef = useRef(startDraft.draftId)
  const saveTimerRef = useRef(null)
  const titleRef = useRef(null)
  const blockRefs = useRef({})
  const editorRef = useRef(null)

  // ── Floating toolbar state ──
  const [floatingToolbar, setFloatingToolbar] = useState({
    visible: false,
    blockId: null,
    x: 0,
    y: 0,
    bold: false,
    italic: false,
    h2: false,
    h3: false,
    quote: false,
  })

  // Handle text selection for floating toolbar — ONLY inside contentEditable blog blocks
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()
    if (
      !selection ||
      selection.isCollapsed ||
      !selection.rangeCount ||
      selection.toString().trim() === ""
    ) {
      setFloatingToolbar((prev) => (prev.visible ? { ...prev, visible: false } : prev))
      return
    }

    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer
    const element =
      container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement

    // Must be inside an editable content block with data-blog-block (NEVER on title, tags, or modal)
    const blockEl = element?.closest("[data-blog-block]")
    if (!blockEl || !editorRef.current || !editorRef.current.contains(blockEl)) {
      setFloatingToolbar((prev) => (prev.visible ? { ...prev, visible: false } : prev))
      return
    }

    const blockId = blockEl.getAttribute("data-block-id")
    const rect = range.getBoundingClientRect()
    const editorRect = editorRef.current.getBoundingClientRect()

    const rawX = rect.left + rect.width / 2 - editorRect.left
    const rawY = rect.top - editorRect.top - 54

    // Clamp X so toolbar doesn't clip outside editor boundaries
    const toolbarWidth = 320
    const minX = toolbarWidth / 2 + 10
    const maxX = editorRect.width - toolbarWidth / 2 - 10
    const clampedX = Math.max(minX, Math.min(maxX, rawX))

    const blockVal = document.queryCommandValue("formatBlock") || ""
    const isH2 = blockVal.toLowerCase().includes("h2")
    const isH3 = blockVal.toLowerCase().includes("h3")
    const isQuote = blockVal.toLowerCase().includes("blockquote")

    setFloatingToolbar({
      visible: true,
      blockId,
      x: clampedX,
      y: Math.max(10, rawY),
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      h2: isH2,
      h3: isH3,
      quote: isQuote,
    })
  }, [])

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange)
    return () => document.removeEventListener("selectionchange", handleSelectionChange)
  }, [handleSelectionChange])

  // Inline formatting commands with DOM-to-state synchronization
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value)
    const blockId = floatingToolbar.blockId
    if (blockId && blockRefs.current[blockId]) {
      const newHtml = blockRefs.current[blockId].innerHTML
      updateBlockContent(blockId, newHtml)
    }
    setTimeout(() => {
      setFloatingToolbar((prev) => ({
        ...prev,
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
      }))
    }, 10)
    setIsSaved(false)
  }

  const applyHeading = (level) => {
    const blockId = floatingToolbar.blockId
    const currentTag = document.queryCommandValue("formatBlock") || ""
    if (currentTag.toLowerCase().includes(level)) {
      document.execCommand("formatBlock", false, "<p>")
    } else {
      document.execCommand("formatBlock", false, `<${level}>`)
    }
    if (blockId && blockRefs.current[blockId]) {
      const newHtml = blockRefs.current[blockId].innerHTML
      updateBlockContent(blockId, newHtml)
    }
    setTimeout(() => {
      const blockVal = document.queryCommandValue("formatBlock") || ""
      setFloatingToolbar((prev) => ({
        ...prev,
        h2: blockVal.toLowerCase().includes("h2"),
        h3: blockVal.toLowerCase().includes("h3"),
        quote: blockVal.toLowerCase().includes("blockquote"),
      }))
    }, 10)
    setIsSaved(false)
  }

  const applyQuote = () => {
    const blockId = floatingToolbar.blockId
    const currentTag = document.queryCommandValue("formatBlock") || ""
    if (currentTag.toLowerCase().includes("blockquote")) {
      document.execCommand("formatBlock", false, "<p>")
    } else {
      document.execCommand("formatBlock", false, "<blockquote>")
    }
    if (blockId && blockRefs.current[blockId]) {
      const newHtml = blockRefs.current[blockId].innerHTML
      updateBlockContent(blockId, newHtml)
    }
    setTimeout(() => {
      const blockVal = document.queryCommandValue("formatBlock") || ""
      setFloatingToolbar((prev) => ({
        ...prev,
        quote: blockVal.toLowerCase().includes("blockquote"),
        h2: blockVal.toLowerCase().includes("h2"),
        h3: blockVal.toLowerCase().includes("h3"),
      }))
    }, 10)
    setIsSaved(false)
  }

  const applyCode = () => {
    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) return
    const blockId = floatingToolbar.blockId
    const range = selection.getRangeAt(0)
    
    const container = range.commonAncestorContainer
    const codeParent = (container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement)?.closest("code")
    if (codeParent) {
      const parent = codeParent.parentNode
      while (codeParent.firstChild) {
        parent.insertBefore(codeParent.firstChild, codeParent)
      }
      parent.removeChild(codeParent)
    } else {
      const text = selection.toString()
      document.execCommand("insertHTML", false, `<code>${text}</code>`)
    }
    if (blockId && blockRefs.current[blockId]) {
      const newHtml = blockRefs.current[blockId].innerHTML
      updateBlockContent(blockId, newHtml)
    }
    setIsSaved(false)
  }

  const applyLink = () => {
    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) return
    const savedRange = selection.getRangeAt(0).cloneRange()
    const blockId = floatingToolbar.blockId

    const url = prompt("Enter URL (e.g. https://example.com):")
    if (url && url.trim()) {
      selection.removeAllRanges()
      selection.addRange(savedRange)
      const fullUrl = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`
      document.execCommand("createLink", false, fullUrl)
      if (blockId && blockRefs.current[blockId]) {
        const newHtml = blockRefs.current[blockId].innerHTML
        updateBlockContent(blockId, newHtml)
      }
      setIsSaved(false)
    }
  }

  // ── Image upload with compression ──
  const handleImageUpload = async (blockId, file) => {
    if (!file) return

    // Validate on client
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Supported: JPEG, PNG, WebP, GIF, AVIF")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File too large. Maximum 10MB.")
      return
    }

    setUploadingBlockId(blockId)
    setUploadProgress(10)

    try {
      const formData = new FormData()
      formData.append("file", file)

      setUploadProgress(30)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      setUploadProgress(80)

      if (res.ok) {
        const data = await res.json()
        setUploadProgress(100)

        // Update block with the uploaded image URL and metadata
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  url: data.url,
                  storagePath: data.path,
                  originalSize: data.originalSize,
                  compressedSize: data.compressedSize,
                  compressionRatio: data.compressionRatio,
                }
              : b
          )
        )
        setIsSaved(false)

        setTimeout(() => {
          setUploadingBlockId(null)
          setUploadProgress(0)
        }, 600)
      } else {
        const err = await res.json()
        alert(err.error || "Upload failed")
        setUploadingBlockId(null)
        setUploadProgress(0)
      }
    } catch (err) {
      console.error("Image upload error:", err)
      alert("Failed to upload image. Please try again.")
      setUploadingBlockId(null)
      setUploadProgress(0)
    }
  }

  // Delete uploaded image from Supabase Storage
  const handleDeleteImage = async (blockId) => {
    const block = blocks.find((b) => b.id === blockId)
    if (block?.storagePath) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: block.storagePath }),
        })
      } catch (err) {
        console.error("Failed to delete image from storage:", err)
      }
    }
    // Clear the image from the block
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? { ...b, url: "", storagePath: null, originalSize: null, compressedSize: null, compressionRatio: null }
          : b
      )
    )
    setIsSaved(false)
  }

  // Format file size
  const formatBytes = (bytes) => {
    if (!bytes) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }


  // Auto-resize title textarea
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto"
      titleRef.current.style.height = `${Math.max(68, titleRef.current.scrollHeight)}px`
    }
  }, [title])

  // ── Debounced auto-save to Supabase + localStorage ──
  const saveDraft = useCallback(async (currentTitle, currentBlocks, currentTags) => {
    const hasContent = currentTitle || currentBlocks.some((b) => b.content || b.code || b.quote)
    if (!hasContent) return

    // 1. Instant localStorage save
    try {
      localStorage.setItem(
        "portfolio_story_draft",
        JSON.stringify({
          title: currentTitle,
          blocks: currentBlocks,
          tags: currentTags,
          draftId: draftIdRef.current,
          updatedAt: Date.now(),
        })
      )
    } catch {
      // ignore
    }

    // 2. Save to Supabase via API
    setSaveStatus("saving")
    try {
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draftIdRef.current,
          title: currentTitle,
          blocks: currentBlocks,
          tags: currentTags,
        }),
      })

      if (res.ok) {
        const { draft } = await res.json()
        if (draft?.id) {
          draftIdRef.current = draft.id
          // Sync draftId back to localStorage
          try {
            const local = localStorage.getItem("portfolio_story_draft")
            if (local) {
              const parsed = JSON.parse(local)
              parsed.draftId = draft.id
              localStorage.setItem("portfolio_story_draft", JSON.stringify(parsed))
            }
          } catch {
            // ignore
          }
        }
        setSaveStatus("saved")
        setIsSaved(true)
      } else {
        setSaveStatus("error")
      }
    } catch (err) {
      console.error("Auto-save error:", err)
      setSaveStatus("error")
      // localStorage already saved — data is safe
      setIsSaved(true)
    }
  }, [])

  // Watch for changes and trigger debounced save
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    setIsSaved(false)
    setSaveStatus("saving")

    // Clear previous timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    // Debounce: save after 1.5s of inactivity
    saveTimerRef.current = setTimeout(() => {
      saveDraft(title, blocks, tags)
    }, 1500)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [title, blocks, tags, saveDraft])

  const handleTitleChange = (e) => {
    setIsSaved(false)
    setTitle(e.target.value)
  }


  // Handle keyboard navigation in paragraph blocks
  const handleKeyDown = (e, index, block) => {
    if (e.key === "Enter" && !e.shiftKey && block.type === "paragraph") {
      e.preventDefault()
      const newId = `b_${crypto.randomUUID()}`
      const newBlock = { id: newId, type: "paragraph", content: "" }
      const nextBlocks = [...blocks]
      nextBlocks.splice(index + 1, 0, newBlock)
      setBlocks(nextBlocks)
      setActiveBlockId(newId)
      setOpenToolsId(null)
      setIsSaved(false)

      setTimeout(() => {
        const nextEl = blockRefs.current[newId]
        if (nextEl) {
          nextEl.focus()
        }
      }, 20)
    } else if (
      e.key === "Backspace" &&
      block.type === "paragraph" &&
      (!block.content || block.content.trim() === "" || blockRefs.current[block.id]?.textContent.trim() === "") &&
      blocks.length > 1
    ) {
      e.preventDefault()
      const prevBlock = blocks[index - 1]
      const nextBlocks = blocks.filter((b) => b.id !== block.id)
      setBlocks(nextBlocks)
      if (prevBlock) {
        setActiveBlockId(prevBlock.id)
        setTimeout(() => {
          const prevEl = blockRefs.current[prevBlock.id]
          if (prevEl) {
            setCaretToEnd(prevEl)
          }
        }, 20)
      }
      setIsSaved(false)
    }
  }

  const updateBlockContent = (id, newContent) => {
    setIsSaved(false)
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, content: newContent } : b))
    )
  }

  const updateBlockField = (id, field, value) => {
    setIsSaved(false)
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    )
  }

  // Transform or insert a block via (+) tool menu
  const convertBlockType = (blockId, type) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b
        switch (type) {
          case "code":
            return { id: b.id, type: "code", code: "", language: "javascript" }
          case "quote":
            return { id: b.id, type: "quote", quote: "", author: "" }
          case "image":
            return { id: b.id, type: "image", url: "", caption: "" }
          case "divider":
            return { id: b.id, type: "divider" }
          default:
            return { id: b.id, type: "paragraph", content: "" }
        }
      })
    )
    setOpenToolsId(null)
    setIsSaved(false)
  }

  const deleteBlock = (id) => {
    if (blocks.length <= 1) {
      setBlocks([{ id: `b_${crypto.randomUUID()}`, type: "paragraph", content: "" }])
      return
    }
    setBlocks((prev) => prev.filter((b) => b.id !== id))
    setIsSaved(false)
  }

  // Add / remove topic tags
  const handleAddTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().replace(/^#/, "")
      if (!tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  // Navigate to dedicated [id] publish page (Cover, Subtitle, Topics, Publish)
  const handleGoToPublish = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your story before proceeding to publish.")
      titleRef.current?.focus()
      return
    }

    setIsNavigatingToPublish(true)

    try {
      // 1. Force save the latest draft state to the database
      const res = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: draftIdRef.current || undefined,
          title,
          blocks,
          tags,
        }),
      })

      let targetDraftId = draftIdRef.current
      if (res.ok) {
        const data = await res.json()
        if (data.draft?.id) {
          targetDraftId = data.draft.id
          draftIdRef.current = data.draft.id
          try {
            const local = localStorage.getItem("portfolio_story_draft")
            if (local) {
              const parsed = JSON.parse(local)
              parsed.draftId = data.draft.id
              localStorage.setItem("portfolio_story_draft", JSON.stringify(parsed))
            }
          } catch {}
        }
      }

      if (targetDraftId) {
        router.push(`/blog/write/${targetDraftId}`)
      } else {
        alert("Could not prepare draft for publishing. Please try again.")
        setIsNavigatingToPublish(false)
      }
    } catch (err) {
      console.error("Error preparing publish:", err)
      alert("Could not connect to server. Please try again.")
      setIsNavigatingToPublish(false)
    }
  }

  // Click anywhere on empty canvas to focus the editor
  const handleCanvasClick = (e) => {
    if (
      e.target === editorRef.current ||
      e.target.getAttribute("data-editor-canvas") === "true"
    ) {
      const lastBlock = blocks[blocks.length - 1]
      if (lastBlock && lastBlock.type === "paragraph") {
        const el = blockRefs.current[lastBlock.id]
        if (el) {
          setCaretToEnd(el)
          setActiveBlockId(lastBlock.id)
        }
      } else {
        const newId = `b_${crypto.randomUUID()}`
        setBlocks((prev) => [...prev, { id: newId, type: "paragraph", content: "" }])
        setActiveBlockId(newId)
        setTimeout(() => {
          const el = blockRefs.current[newId]
          if (el) el.focus()
        }, 20)
      }
    }
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVBAR (Full width, fixed at top, NO scrollbar beside it!)
          ───────────────────────────────────────────────────────────── */}
      <header className="shrink-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-100 bg-white px-6 sm:px-10">
        {/* Left: Company / Brand Name, Draft, Saved */}
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="flex items-center gap-1 group transition-opacity hover:opacity-80"
          >
            {/* Brand Name in exact bold serif font */}
            <span className="font-serif text-[28px] font-black tracking-[-0.03em] text-neutral-950 select-none">
              Avinash Raj
            </span>
          </Link>

          <span className="text-sm text-neutral-500 font-normal ml-2">
            Draft
          </span>

          <span className={`text-sm font-normal ml-2 flex items-center gap-1.5 transition-colors duration-300 ${
            saveStatus === "saving" ? "text-neutral-400" : saveStatus === "error" ? "text-amber-500" : "text-neutral-500"
          }`}>
            {saveStatus === "saving" && (
              <span className="inline-block h-2 w-2 rounded-full border border-neutral-400 border-t-transparent animate-spin" />
            )}
            {saveStatus === "saved" && isSaved && (
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            )}
            {saveStatus === "error" && (
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
            )}
            {saveStatus === "saving" ? "Saving..." : saveStatus === "error" ? "Offline saved" : "Saved"}
          </span>
        </div>

        {/* Right: Publish Button + Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleGoToPublish}
            disabled={isNavigatingToPublish}
            className="rounded-full bg-[#1a8917] hover:bg-[#156d12] px-3.5 py-1 text-xs font-medium text-white transition-colors cursor-pointer shadow-none active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isNavigatingToPublish ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Preparing...</span>
              </>
            ) : (
              <span>Publish</span>
            )}
          </button>

          {/* User Avatar */}
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 bg-neutral-100">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "Avatar"}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-neutral-900 text-xs font-bold text-white">
                {(user?.name || "A")[0]?.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. SCROLLABLE WRITING CANVAS (Scrollbar starts strictly BELOW the navbar!)
          ───────────────────────────────────────────────────────────── */}
      <div
        className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden scroll-smooth"
        onClick={handleCanvasClick}
        data-editor-canvas="true"
      >
        <main
          ref={editorRef}
          className="relative mx-auto max-w-[740px] px-6 sm:px-8 pt-12 sm:pt-16 pb-48 min-h-full cursor-text"
        >
        {/* ─────────────────────────────────────────────────────────
            FLOATING INLINE FORMATTING TOOLBAR
            Appears ONLY above selected text in content blocks.
            Matches screenshot media_1790471624287.png exactly.
            ───────────────────────────────────────────────────────── */}
        {floatingToolbar.visible && (
          <div
            className="absolute z-50 flex items-center rounded-lg bg-[#242424] shadow-2xl px-2 py-1 gap-0.5 select-none transition-opacity duration-150 animate-in fade-in zoom-in-95 ring-1 ring-white/10"
            style={{
              left: `${floatingToolbar.x}px`,
              top: `${floatingToolbar.y}px`,
              transform: "translateX(-50%)",
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* Bold */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat("bold")}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                floatingToolbar.bold
                  ? "bg-white/20 text-[#2dd4bf]"
                  : "text-neutral-200 hover:text-white hover:bg-white/10"
              }`}
              title="Bold"
            >
              <span className="font-serif font-bold text-base leading-none">B</span>
            </button>

            {/* Italic */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFormat("italic")}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                floatingToolbar.italic
                  ? "bg-white/20 text-[#2dd4bf]"
                  : "text-neutral-200 hover:text-white hover:bg-white/10"
              }`}
              title="Italic"
            >
              <span className="font-serif italic text-base leading-none">i</span>
            </button>

            {/* Link */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={applyLink}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Add link"
            >
              <Link2 className="h-4 w-4" />
            </button>

            {/* Separator */}
            <div className="w-px h-5 bg-neutral-700 mx-1" />

            {/* Heading 1 (Large T) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyHeading("h2")}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                floatingToolbar.h2
                  ? "bg-white/20 text-[#2dd4bf]"
                  : "text-neutral-200 hover:text-white hover:bg-white/10"
              }`}
              title="Large title"
            >
              <span className="font-serif font-bold text-lg leading-none">T</span>
            </button>

            {/* Heading 2 (Small T) */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyHeading("h3")}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                floatingToolbar.h3
                  ? "bg-white/20 text-[#2dd4bf]"
                  : "text-neutral-200 hover:text-white hover:bg-white/10"
              }`}
              title="Small title"
            >
              <span className="font-serif font-medium text-sm leading-none">T</span>
            </button>

            {/* Quote */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={applyQuote}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors cursor-pointer ${
                floatingToolbar.quote
                  ? "bg-white/20 text-[#2dd4bf]"
                  : "text-neutral-200 hover:text-white hover:bg-white/10"
              }`}
              title="Quote"
            >
              <span className="font-serif text-lg leading-none font-bold">“</span>
            </button>

            {/* Inline Code */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={applyCode}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Inline code"
            >
              <Code className="h-4 w-4" />
            </button>

            {/* Separator */}
            <div className="w-px h-5 bg-neutral-700 mx-1" />

            {/* Private/Member Lock */}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => alert("Story audience visibility option will be applied upon publishing.")}
              className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Audience visibility"
            >
              <Lock className="h-3.5 w-3.5" />
            </button>

            {/* Downward triangle pointer pointing at selected text */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-[#242424] rotate-45 rounded-[1px] border-r border-b border-white/10" />
          </div>
        )}

        {/* Title Input */}
        <div className="mb-6">
          <textarea
            ref={titleRef}
            rows={1}
            value={title}
            onChange={handleTitleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                const firstBlock = blocks[0]
                if (firstBlock && blockRefs.current[firstBlock.id]) {
                  blockRefs.current[firstBlock.id].focus()
                  setActiveBlockId(firstBlock.id)
                }
              }
            }}
            placeholder="Title"
            className="w-full font-serif text-5xl sm:text-[54px] font-normal text-neutral-900 placeholder:text-neutral-300 outline-none border-none resize-none leading-[1.2] tracking-tight bg-transparent overflow-hidden min-h-[68px] pt-1"
          />
        </div>

        {/* Dynamic Story Blocks */}
        <div className="space-y-4" data-editor-canvas="true">
          {blocks.map((block, index) => {
            const isBlockActive = activeBlockId === block.id
            const isBlockEmpty =
              block.type === "paragraph" &&
              (!block.content || block.content.trim() === "" || block.content === "<br>")
            const showPlusOnLine = isBlockActive && isBlockEmpty
            const isToolsOpen = openToolsId === block.id

            return (
              <div key={block.id} className="relative group">
                {/* ──────────────────────────────────────────────
                    Medium Floating (+) Inserter Button
                    Directly on the left of the active empty line
                    ────────────────────────────────────────────── */}
                {showPlusOnLine && (
                  <div className="absolute -left-12 sm:-left-14 top-1 flex items-center gap-2 z-20">
                    <button
                      type="button"
                      onClick={() => setOpenToolsId(isToolsOpen ? null : block.id)}
                      title="Add an item"
                      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-all duration-200 ${
                        isToolsOpen
                          ? "rotate-45 border-neutral-800 bg-neutral-900 text-white"
                          : "border-neutral-300 text-neutral-500 hover:border-neutral-800 hover:text-neutral-900 bg-white"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>

                    {/* Pop-out tool options */}
                    {isToolsOpen && (
                      <div className="flex items-center gap-1.5 rounded-full bg-white p-1 shadow-lg ring-1 ring-black/10 border border-neutral-100 animate-in fade-in slide-in-from-left-2 duration-150">
                        <button
                          type="button"
                          title="Add an image"
                          onClick={() => convertBlockType(block.id, "image")}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-emerald-700 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          title="Add a code block"
                          onClick={() => convertBlockType(block.id, "code")}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-emerald-700 transition-colors"
                        >
                          <Code2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          title="Add a quote"
                          onClick={() => convertBlockType(block.id, "quote")}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-emerald-700 transition-colors"
                        >
                          <Quote className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          title="Add a divider"
                          onClick={() => convertBlockType(block.id, "divider")}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100 hover:text-emerald-700 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ──────────────────────────────────────────────
                    Block Content Rendering (Uncontrolled for Caret Stability)
                    ────────────────────────────────────────────── */}
                {block.type === "paragraph" && (
                  <BlockParagraph
                    block={block}
                    index={index}
                    isActive={isBlockActive}
                    blockRef={(el) => (blockRefs.current[block.id] = el)}
                    onFocus={() => setActiveBlockId(block.id)}
                    onChange={(newHtml) => updateBlockContent(block.id, newHtml)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                  />
                )}

                {block.type === "code" && (
                  <div className="relative my-4 rounded-xl bg-neutral-950 p-4 font-mono text-xs text-emerald-400">
                    <button
                      type="button"
                      onClick={() => deleteBlock(block.id)}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="pb-2 text-[11px] text-neutral-500">
                      {"// Code block (JavaScript)"}
                    </div>
                    <textarea
                      rows={4}
                      value={block.code || ""}
                      onChange={(e) => updateBlockField(block.id, "code", e.target.value)}
                      placeholder="// Write or paste code here..."
                      className="w-full bg-transparent font-mono text-xs text-emerald-400 outline-none border-none resize-y"
                    />
                  </div>
                )}

                {block.type === "quote" && (
                  <div className="relative my-4 border-l-4 border-neutral-900 pl-4 py-1">
                    <button
                      type="button"
                      onClick={() => deleteBlock(block.id)}
                      className="absolute top-1 right-1 text-neutral-300 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <textarea
                      rows={2}
                      value={block.quote || ""}
                      onChange={(e) => updateBlockField(block.id, "quote", e.target.value)}
                      placeholder="Enter quote here..."
                      className="w-full bg-transparent font-serif italic text-xl sm:text-2xl text-neutral-800 placeholder:text-neutral-400 outline-none border-none resize-none"
                    />
                  </div>
                )}

                {block.type === "image" && (
                  <div className="relative my-6">
                    {/* No image yet — show upload zone */}
                    {!block.url ? (
                      <div
                        className="relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 px-6 py-12 transition-colors hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer group"
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.add("border-emerald-400", "bg-emerald-50/30")
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove("border-emerald-400", "bg-emerald-50/30")
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.remove("border-emerald-400", "bg-emerald-50/30")
                          const droppedFile = e.dataTransfer.files?.[0]
                          if (droppedFile) handleImageUpload(block.id, droppedFile)
                        }}
                        onClick={() => {
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = "image/jpeg,image/png,image/webp,image/gif,image/avif"
                          input.onchange = (e) => {
                            const selectedFile = e.target.files?.[0]
                            if (selectedFile) handleImageUpload(block.id, selectedFile)
                          }
                          input.click()
                        }}
                      >
                        {/* Delete block button */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); deleteBlock(block.id) }}
                          className="absolute top-3 right-3 text-neutral-300 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        {/* Uploading state */}
                        {uploadingBlockId === block.id ? (
                          <>
                            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                            <p className="text-sm font-medium text-neutral-600">Compressing & uploading...</p>
                            <div className="w-48 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-neutral-200 shadow-sm group-hover:border-emerald-300 group-hover:shadow-md transition-all">
                              <ImagePlus className="h-6 w-6 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-semibold text-neutral-700">
                                Click to upload or drag & drop
                              </p>
                              <p className="text-xs text-neutral-400 mt-1">
                                JPEG, PNG, WebP, GIF • Max 10MB • Auto-compressed
                              </p>
                            </div>
                          </>
                        )}

                        {/* URL paste option */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-px w-8 bg-neutral-200" />
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider">or paste URL</span>
                          <div className="h-px w-8 bg-neutral-200" />
                        </div>
                        <input
                          type="url"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            if (e.target.value) {
                              updateBlockField(block.id, "url", e.target.value)
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="w-full max-w-xs rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 placeholder:text-neutral-300 outline-none focus:border-neutral-400 text-center"
                        />
                      </div>
                    ) : (
                      /* Image preview with controls */
                      <div className="group/img">
                        <div className="relative overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/5">
                          <Image
                            src={block.url}
                            alt={block.caption || "Uploaded image"}
                            width={740}
                            height={480}
                            unoptimized
                            className="w-full h-auto object-cover"
                          />

                          {/* Overlay controls */}
                          <div className="absolute inset-0 flex items-start justify-end gap-2 p-3 opacity-0 group-hover/img:opacity-100 transition-opacity">
                            {/* Replace image */}
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.createElement("input")
                                input.type = "file"
                                input.accept = "image/jpeg,image/png,image/webp,image/gif,image/avif"
                                input.onchange = (ev) => {
                                  const f = ev.target.files?.[0]
                                  if (f) handleImageUpload(block.id, f)
                                }
                                input.click()
                              }}
                              className="flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-1.5 text-xs text-white hover:bg-black/90 transition-colors cursor-pointer"
                            >
                              <Upload className="h-3.5 w-3.5" />
                              Replace
                            </button>

                            {/* Delete image */}
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(block.id)}
                              className="flex items-center gap-1.5 rounded-lg bg-rose-600/90 backdrop-blur-sm px-3 py-1.5 text-xs text-white hover:bg-rose-700 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>

                            {/* Delete entire block */}
                            <button
                              type="button"
                              onClick={() => deleteBlock(block.id)}
                              className="flex items-center gap-1.5 rounded-lg bg-black/70 backdrop-blur-sm px-2.5 py-1.5 text-xs text-white hover:bg-black/90 transition-colors cursor-pointer"
                              title="Remove block"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Caption input */}
                        <input
                          type="text"
                          value={block.caption || ""}
                          onChange={(e) => updateBlockField(block.id, "caption", e.target.value)}
                          placeholder="Type caption for image (optional)"
                          className="w-full bg-transparent text-xs text-neutral-500 placeholder:text-neutral-400 text-center outline-none mt-2 py-1"
                        />

                        {/* Compression info */}
                        {block.compressedSize && (
                          <p className="text-center text-[10px] text-neutral-400 mt-0.5">
                            {formatBytes(block.originalSize)} → {formatBytes(block.compressedSize)}{" "}
                            <span className="text-emerald-500 font-medium">({block.compressionRatio} smaller)</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {block.type === "divider" && (
                  <div className="relative my-8 py-2 flex items-center justify-center gap-3 text-neutral-400">
                    <button
                      type="button"
                      onClick={() => deleteBlock(block.id)}
                      className="absolute right-0 text-neutral-300 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xl tracking-[0.5em] font-serif">• • •</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  </div>
)
}
