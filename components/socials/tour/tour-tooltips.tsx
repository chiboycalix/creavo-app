"use client"

import type React from "react"
import { X } from "lucide-react"

interface TourTooltipProps {
  content: string
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  currentStep: number
  totalSteps: number
  position: { top: number; left: number }
  placement: "top" | "right" | "bottom" | "left"
  isLastStep: boolean
}

const TourTooltip: React.FC<TourTooltipProps> = ({
  content,
  onNext,
  onPrev,
  onClose,
  currentStep,
  totalSteps,
  position,
  placement,
  isLastStep,
}) => {
  // Calculate tooltip position and arrow placement based on the target element position
  const getTooltipStyles = () => {
    const { top, left } = position
    const offset = 25 // Distance from the target element

    const tooltipStyles: React.CSSProperties = {
      position: "absolute",
      zIndex: 10000,
    }

    // For sidebar items, we always want the tooltip to appear to the right
    // with the pointer on the left side pointing to the navigation item
    if (placement === "right" || placement === "left") {
      // Position the tooltip to the right of the nav item
      tooltipStyles.top = `${top}px`
      tooltipStyles.left = `${left + offset}px`
      tooltipStyles.transform = "translateY(-50%)"
      return tooltipStyles
    }

    // For other placements (top/bottom), use standard positioning
    switch (placement) {
      case "top":
        tooltipStyles.bottom = `calc(100% - ${top}px + ${offset}px)`
        tooltipStyles.left = `${left}px`
        tooltipStyles.transform = "translateX(-50%)"
        break
      case "bottom":
        tooltipStyles.top = `${top + offset}px`
        tooltipStyles.left = `${left}px`
        tooltipStyles.transform = "translateX(-50%)"
        break
    }

    return tooltipStyles
  }

  const tooltipStyles = getTooltipStyles()

  return (
    <div
      className={`bg-white w-[600px] rounded-lg shadow-xl p-6   relative ${
        placement === "left" || placement === "right"
          ? "tooltip-left"
          : placement === "top"
            ? "tooltip-top"
            : "tooltip-bottom"
      }`}
      style={tooltipStyles}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        aria-label="Close tour"
      >
        <X size={20} />
      </button>

      {/* Content */}
      <div className="text-lg font-normal mb-8 mt-2">{content}</div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          Step {currentStep + 1} of {totalSteps}
        </div>

        <button
          onClick={onNext}
          className={`px-6 py-2 rounded-md  bg-[#0b66c3] hover:bg-[#0a5cb0] text-white font-medium`}
          aria-label={isLastStep ? "Complete tour" : "Next step"}
        >
          {isLastStep ? "Done" : "Next"}
        </button>
      </div>

      {/* CSS for the triangular pointer */}
      <style jsx global>{`
        /* Left pointer (for right placement) - this is what you want for sidebar */
        .tooltip-left::before {
          content: '';
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 10px 10px 10px 0;
          border-style: solid;
          border-color: transparent white transparent transparent;
          filter: drop-shadow(-3px 0px 2px rgba(0, 0, 0, 0.1));
        }
        
        /* Top pointer */
        .tooltip-top::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 0 10px 10px 10px;
          border-style: solid;
          border-color: transparent transparent white transparent;
          filter: drop-shadow(0px -3px 2px rgba(0, 0, 0, 0.1));
        }
        
        /* Bottom pointer */
        .tooltip-bottom::before {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px 10px 0 10px;
          border-style: solid;
          border-color: white transparent transparent transparent;
          filter: drop-shadow(0px 3px 2px rgba(0, 0, 0, 0.1));
        }
      `}</style>
    </div>
  )
}

export default TourTooltip
