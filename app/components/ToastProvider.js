"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"
import { Heart, LogIn, Info, X } from "lucide-react"

const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
})

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message, options = {}) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    const iconType = options.icon || "heart"
    const duration = options.duration || 3000

    setToast({
      id: Date.now(),
      message,
      icon: iconType,
    })

    timerRef.current = setTimeout(() => {
      setToast(null)
    }, duration)
  }, [])

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setToast(null)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed max-sm:bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-neutral-950/95 text-white shadow-2xl backdrop-blur-md border border-neutral-800/90 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 select-none tracking-normal"
        >
          {toast.icon === "heart" && (
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500 shrink-0" />
          )}
          {toast.icon === "login" && (
            <LogIn className="h-4 w-4 text-neutral-300 shrink-0" />
          )}
          {toast.icon === "info" && (
            <Info className="h-4 w-4 text-neutral-300 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={hideToast}
            className="ml-1 p-0.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  return context || { showToast: () => {}, hideToast: () => {} }
}
