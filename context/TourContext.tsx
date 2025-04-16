"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface TourStep {
  target: string
  content: string
  placement: "top" | "right" | "bottom" | "left"
}

interface TourProgress {
  currentStep: number
  completed: boolean
}

interface TourContextType {
  steps: TourStep[]
  currentStep: number
  isRunning: boolean
  startTour: () => void
  endTour: () => void
  nextStep: () => void
  prevStep: () => void
  skipTour: () => void
  totalSteps: number
  isLastStep: boolean
}

const TourContext = createContext<TourContextType | undefined>(undefined)

interface TourProviderProps {
  children: ReactNode
  steps: TourStep[]
  tourKey: string
  autoStart?: boolean
  startDelay?: number
  forceStart?: boolean
  onComplete?: () => void
}

export const TourProvider: React.FC<TourProviderProps> = ({
  children,
  steps,
  tourKey,
  autoStart = true,
  startDelay = 10000,
  forceStart = false,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const totalSteps = steps.length
  const isLastStep = currentStep === totalSteps - 1

  // Load saved progress from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedProgress = localStorage.getItem(`${tourKey}Progress`)

      if (savedProgress) {
        const { currentStep: savedStep, completed } = JSON.parse(savedProgress) as TourProgress

        // If tour was completed, don't resume
        if (completed) {
          setIsRunning(false)
          return
        }

        // Resume from saved step
        setCurrentStep(savedStep)
      }
    } catch (error) {
      console.error("Error loading tour progress:", error)
    }
  }, [tourKey])

  // Save progress to localStorage whenever the current step changes
  useEffect(() => {
    if (typeof window === "undefined" || !isRunning) return

    const progress: TourProgress = {
      currentStep,
      completed: false,
    }

    localStorage.setItem(`${tourKey}Progress`, JSON.stringify(progress))
  }, [currentStep, isRunning, tourKey])

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    if (autoStart || forceStart) {
      const timer = setTimeout(() => {
        try {
          const savedProgress = localStorage.getItem(`${tourKey}Progress`)

          if (savedProgress) {
            const { completed } = JSON.parse(savedProgress) as TourProgress

            // Only start if not completed or force start is enabled
            if (!completed || forceStart) {
              console.log("Starting tour:", { steps, tourKey })
              setIsRunning(true)
            }
          } else if (forceStart) {
            // No saved progress but force start is enabled
            setIsRunning(true)
          } else {
            // No saved progress, start normally
            setIsRunning(true)
          }
        } catch (error) {
          console.error("Error checking tour progress:", error)
          setIsRunning(true)
        }
      }, startDelay)

      return () => clearTimeout(timer)
    }
  }, [autoStart, startDelay, tourKey, steps, forceStart])

  const startTour = () => {
    console.log("Manually starting tour")
    setCurrentStep(0)
    setIsRunning(true)

    // Reset progress
    const progress: TourProgress = {
      currentStep: 0,
      completed: false,
    }

    localStorage.setItem(`${tourKey}Progress`, JSON.stringify(progress))
  }

  const endTour = () => {
    setIsRunning(false)

    // Mark as completed in localStorage
    const progress: TourProgress = {
      currentStep,
      completed: true,
    }

    localStorage.setItem(`${tourKey}Progress`, JSON.stringify(progress))
  }

  const completeTour = () => {
    setIsRunning(false)

    // Mark as completed in localStorage
    const progress: TourProgress = {
      currentStep: totalSteps - 1,
      completed: true,
    }

    localStorage.setItem(`${tourKey}Progress`, JSON.stringify(progress))

    if (onComplete) {
      onComplete()
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const skipTour = () => {
    endTour()
  }

  return (
    <TourContext.Provider
      value={{
        steps,
        currentStep,
        isRunning,
        startTour,
        endTour,
        nextStep,
        prevStep,
        skipTour,
        totalSteps,
        isLastStep,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export const useTour = () => {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error("useTour must be used within a TourProvider")
  }
  return context
}
