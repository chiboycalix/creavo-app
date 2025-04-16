"use client"

import type React from "react"

interface TourOverlayProps {
  targetRect: DOMRect | null
}

const TourOverlay: React.FC<TourOverlayProps> = ({ targetRect }) => {
  if (!targetRect) return null

  // Create the spotlight effect by rendering 4 semi-transparent overlays
  // that cover everything except the target element
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Top overlay */}
      <div
        className="absolute bg-black/10 bg-opacity-50"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: targetRect.top + "px",
        }}
      />

      {/* Right overlay */}
      <div
        className="absolute bg-black/10 bg-opacity-50"
        style={{
          top: targetRect.top + "px",
          left: targetRect.left + targetRect.width + "px",
          right: 0,
          height: targetRect.height + "px",
        }}
      />

      {/* Bottom overlay */}
      <div
        className="absolute bg-black/10 bg-opacity-50"
        style={{
          top: targetRect.top + targetRect.height + "px",
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Left overlay */}
      <div
        className="absolute bg-black/10 bg-opacity-50"
        style={{
          top: targetRect.top + "px",
          left: 0,
          width: targetRect.left + "px",
          height: targetRect.height + "px",
        }}
      />

      {/* Highlight border around the target */}
      <div
        className="absolute  border-2 border-primary rounded-sm"
        style={{
          top: targetRect.top - 2 + "px",
          left: targetRect.left - 2 + "px",
          width: targetRect.width + 4 + "px",
          height: targetRect.height + 4 + "px",
        }}
      />
    </div>
  )
}

export default TourOverlay
