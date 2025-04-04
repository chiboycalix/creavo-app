"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import EventForm, { type EventFormData } from "./EventForm"
import { baseUrl } from "@/utils/constant"
import Cookies from "js-cookie"

interface AddEventCardProps {
  isOpen: boolean
  onClose: () => void
  anchorRect?: DOMRect | null
  eventToEdit?: any
  onSubmit?: (eventData: EventFormData) => Promise<void>
}

const AddEventCard: React.FC<AddEventCardProps> = ({ isOpen, onClose, eventToEdit, onSubmit }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  // Add a click outside handler to close the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const handleSubmit = async (eventData: EventFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(eventData)
      } else {
        // Default submission logic
        const response = await fetch(`${baseUrl}/meetings/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: JSON.stringify(eventData),
        })

        if (!response.ok) throw new Error(`Error: ${response.statusText}`)
      }
      onClose()
    } catch (error) {
      console.error("Failed to create event:", error)
      alert("Failed to create event. Please try again.")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20">
          <motion.div
            ref={cardRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="h-full w-full max-w-md bg-white shadow-lg overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Event</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <EventForm eventToEdit={eventToEdit} onSubmit={handleSubmit} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddEventCard

