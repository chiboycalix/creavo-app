"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useTour } from "@/context/TourContext"

// This component helps debug tour issues
export const TourDebug: React.FC<{ tourKey?: string }> = ({ tourKey = "socialsTourProgress" }) => {
  const { steps, currentStep, isRunning, startTour } = useTour()
  const [elementStatus, setElementStatus] = useState<Record<string, boolean>>({})
  const [savedProgress, setSavedProgress] = useState<string | null>(null)

  useEffect(() => {
    // Check if all target elements exist in the DOM
    const checkElements = () => {
      const status: Record<string, boolean> = {}

      steps.forEach((step) => {
        const element = document.querySelector(step.target)
        status[step.target] = !!element
      })

      setElementStatus(status)

      // Get saved progress
      if (typeof window !== "undefined") {
        const progress = localStorage.getItem(tourKey)
        setSavedProgress(progress)
      }

      // Log debug info
      console.log("Tour Debug Info:", {
        isRunning,
        currentStep,
        elementStatus: status,
        steps,
        savedProgress,
      })
    }

    checkElements()

    // Check again after a delay to account for dynamic rendering
    const timer = setTimeout(checkElements, 2000)
    return () => clearTimeout(timer)
  }, [steps, currentStep, isRunning, tourKey, savedProgress])

  // Only show in development
  if (process.env.NODE_ENV !== "development") return null

  return (
    <div className="fixed bottom-4 right-4 z-[10001] bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-sm">
      <h3 className="font-bold mb-2">Tour Debug</h3>
      <p className="mb-2">Running: {isRunning ? "Yes" : "No"}</p>
      <p className="mb-2">
        Current Step: {currentStep + 1} of {steps.length}
      </p>

      <div className="mb-2">
        <p className="font-semibold">Saved Progress:</p>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-20">
          {savedProgress || "No saved progress"}
        </pre>
      </div>

      <div className="mb-2">
        <p className="font-semibold">Target Elements:</p>
        <ul className="text-sm">
          {Object.entries(elementStatus).map(([selector, exists]) => (
            <li key={selector} className={exists ? "text-green-600" : "text-red-600"}>
              {selector}: {exists ? "Found" : "Not Found"}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            localStorage.removeItem(tourKey)
            window.location.reload()
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Reset & Reload
        </button>

        <button onClick={() => startTour()} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
          Start Tour
        </button>
      </div>
    </div>
  )
}

export default TourDebug
