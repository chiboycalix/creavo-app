"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import { useTour } from "@/context/TourContext"
import TourTooltip from "./tour-tooltips"
import TourOverlay from "./tour-overlay"


const Tour: React.FC = () => {
  const { steps, currentStep, isRunning, nextStep, prevStep, endTour, totalSteps, isLastStep } = useTour()

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [targetFound, setTargetFound] = useState(false)

  // Ref to track if we need to scroll
  const needsScrollRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (!isRunning || !isMounted) return

    const findTargetAndUpdateRect = () => {
      const currentStepData = steps[currentStep]
      if (!currentStepData) return false

      const targetElement = document.querySelector(currentStepData.target)
      if (!targetElement) {
        console.warn(`Tour target not found: ${currentStepData.target}`)
        return false
      }

      const rect = targetElement.getBoundingClientRect()

      // Skip if element has no dimensions (might be hidden)
      if (rect.width === 0 || rect.height === 0) {
        console.warn(`Tour target has no dimensions: ${currentStepData.target}`)
        return false
      }

      setTargetRect(rect)
      setTargetFound(true)

      // Calculate tooltip position based on placement
      // For sidebar items, we want the tooltip to appear to the right with the pointer on the left
      let top = 0
      let left = 0

      // For sidebar navigation items (right placement), position the tooltip to the right
      // with the pointer on the left side
      if (currentStepData.placement === "right" || currentStepData.placement === "left") {
        top = rect.top + rect.height / 2
        left = rect.right // Position at the right edge of the target
      } else if (currentStepData.placement === "top") {
        top = rect.top
        left = rect.left + rect.width / 2
      } else if (currentStepData.placement === "bottom") {
        top = rect.bottom
        left = rect.left + rect.width / 2
      }

      setTooltipPosition({ top, left })

      // Check if element is in viewport
      const isInViewport =
        rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth

      needsScrollRef.current = !isInViewport
      return true
    }

    // Try to find target immediately
    const found = findTargetAndUpdateRect()

    // If not found, retry a few times (helps with dynamically rendered elements)
    if (!found) {
      let attempts = 0
      const maxAttempts = 5
      const interval = setInterval(() => {
        attempts++
        if (findTargetAndUpdateRect() || attempts >= maxAttempts) {
          clearInterval(interval)
        }
      }, 500)

      return () => clearInterval(interval)
    }

    // Scroll element into view if needed
    if (needsScrollRef.current && targetFound) {
      const targetElement = document.querySelector(steps[currentStep].target)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }

    // Update on resize and scroll
    const handleUpdate = () => {
      findTargetAndUpdateRect()
    }

    window.addEventListener("resize", handleUpdate)
    window.addEventListener("scroll", handleUpdate)

    return () => {
      window.removeEventListener("resize", handleUpdate)
      window.removeEventListener("scroll", handleUpdate)
    }
  }, [isRunning, currentStep, steps, isMounted, targetFound])

  if (!isMounted || !isRunning) return null 

  return createPortal(
    <>
      {targetRect && <TourOverlay targetRect={targetRect} />}
      {targetRect && targetFound && (
        <TourTooltip
          content={steps[currentStep].content}
          onNext={nextStep}
          onPrev={prevStep}
          onClose={endTour}
          currentStep={currentStep}
          totalSteps={totalSteps}
          position={tooltipPosition}
          placement={steps[currentStep].placement}
          isLastStep={isLastStep}
        />
      )}
    </>,
    document.body,
  )
}

export default Tour
