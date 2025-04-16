"use client"

import { useCallback } from "react"
import { useTour } from "@/context/TourContext"

export const useTourReset = (tourKey: string) => {
  const { startTour } = useTour()

  const resetTour = useCallback(() => {
    localStorage.removeItem(`${tourKey}Done`)
    startTour()
  }, [tourKey, startTour])

  return resetTour
}
