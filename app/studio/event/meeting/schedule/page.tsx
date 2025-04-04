"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EventForm from "@/components/_events/EventForm"
import { baseUrl } from "@/utils/constant"
import Cookies from "js-cookie"
import type { EventFormData } from "@/components/_events/EventForm"

export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (eventData: EventFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${baseUrl}/meetings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) throw new Error(`Error: ${response.statusText}`)

      toast.success("Event created successfully!")

      setTimeout(() => {
        router.push("/studio/calendar")
      }, 1000)

    } catch (error) {
      console.error("Failed to create event:", error)
      toast.error("Failed to create event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm onSubmit={handleSubmit} submitButtonText={isSubmitting ? "Saving..." : "Create Event"} />
        </CardContent>
      </Card>
    </div>
  )
}
