"use client"

import type React from "react"
import { useTour } from "@/context/TourContext"

interface TourButtonProps {
  className?: string
}

const TourButton: React.FC<TourButtonProps> = ({ className = "" }) => {
  const { startTour } = useTour()

  return (
    <button
      onClick={() => {
        localStorage.removeItem("socialsTourDone")
        startTour()
      }}
      className={`px-4 py-2 bg-[#0b66c3] text-white rounded-md hover:bg-[#0a5cb0] transition-colors ${className}`}
    >
      Start Tour
    </button>
  )
}

export default TourButton
