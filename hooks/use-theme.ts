"use client"

import { useState, useEffect, useCallback } from "react"

export type Theme = "lain" | "aria"

const STORAGE_KEY = "wired-theme"

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("lain")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === "lain" || stored === "aria") {
      setThemeState(stored)
      document.documentElement.classList.remove("theme-lain", "theme-aria")
      document.documentElement.classList.add(`theme-${stored}`)
    }
    setIsHydrated(true)
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    if (newTheme === theme || isTransitioning) return

    setIsTransitioning(true)
    
    // Start disconnect animation
    document.body.classList.add("theme-disconnect")
    
    setTimeout(() => {
      // Change the theme
      document.documentElement.classList.remove("theme-lain", "theme-aria")
      document.documentElement.classList.add(`theme-${newTheme}`)
      localStorage.setItem(STORAGE_KEY, newTheme)
      setThemeState(newTheme)
      
      // Remove disconnect, add reconnect
      document.body.classList.remove("theme-disconnect")
      document.body.classList.add("theme-reconnect")
      
      setTimeout(() => {
        document.body.classList.remove("theme-reconnect")
        setIsTransitioning(false)
      }, 800)
    }, 600)
  }, [theme, isTransitioning])

  const toggleTheme = useCallback(() => {
    setTheme(theme === "lain" ? "aria" : "lain")
  }, [theme, setTheme])

  return {
    theme,
    setTheme,
    toggleTheme,
    isTransitioning,
    isHydrated,
    isLain: theme === "lain",
    isAria: theme === "aria",
  }
}
