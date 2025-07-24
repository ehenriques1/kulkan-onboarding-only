"use client"

import { useState, useCallback } from "react"

export type AnimationState = "idle" | "dissolving-out" | "sliding-in" | "transitioning"

export function useQuestionAnimation() {
  const [animationState, setAnimationState] = useState<AnimationState>("idle")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const transitionToNext = useCallback((callback: () => void) => {
    setIsTransitioning(true)
    setAnimationState("dissolving-out")

    // First phase: dissolve and slide out to left
    setTimeout(() => {
      callback()
      setAnimationState("sliding-in")
    }, 600)

    // Second phase: slide in from right
    setTimeout(() => {
      setAnimationState("idle")
      setIsTransitioning(false)
    }, 1200)
  }, [])

  const transitionToPrevious = useCallback((callback: () => void) => {
    setIsTransitioning(true)
    setAnimationState("dissolving-out")

    // Reverse animation for going back
    setTimeout(() => {
      callback()
      setAnimationState("sliding-in")
    }, 600)

    setTimeout(() => {
      setAnimationState("idle")
      setIsTransitioning(false)
    }, 1200)
  }, [])

  return {
    animationState,
    isTransitioning,
    transitionToNext,
    transitionToPrevious,
  }
}
