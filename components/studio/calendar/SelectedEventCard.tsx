"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, MoreVertical, Video, X, Plus, Copy, ExternalLink } from "lucide-react"
import Image from "next/image"
import { baseUrl } from "@/utils/constant"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type Member = {
  id: string
  name: string
  avatar?: string
}

type EventDetailsProps = {
  isOpen: boolean
  onClose: () => void
  anchorRect?: DOMRect | null
  data: any
}

const SelectedEventCard = ({ isOpen, onClose, data }: EventDetailsProps) => {
  const [fetchedData, setFetchedData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const linkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!data?.id) return
      setIsLoading(true)
      try {
        const response = await fetch(`${baseUrl}/meetings/${data.id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch event details: ${response.status}`)
        }

        const result = await response.json()
        setFetchedData(result.data.meeting)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event details")
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchEventDetails()
    }
  }, [data?.id, isOpen])

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not available"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  const formatTime = (startTimeString: string, endTimeString: string) => {
    if (!startTimeString || !endTimeString) return "Time not available"

    const startTime = new Date(startTimeString)
    const endTime = new Date(endTimeString)

    const formatOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    }

    return `${startTime.toLocaleTimeString("en-US", formatOptions)} - ${endTime.toLocaleTimeString("en-US", formatOptions)}`
  }

  const copyMeetingLink = () => {
    const codeToCopy = fetchedData?.meetingLink || fetchedData?.meetingCode

    if (codeToCopy) {
      navigator.clipboard
        .writeText(codeToCopy)
        .then(() => {
          toast.success("Link copied to clipboard")
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
          toast.error("Failed to copy meeting link")
        })
    } else {
      toast.error("No meeting link available")
    }
  }

  const joinMeeting = () => {
    if (fetchedData?.meetingLink) {
      window.open(fetchedData.meetingLink, "_blank")
      toast.success("Joining meeting")
    } else {
      toast.error("No meeting link available")
    }
  }

  if (isLoading) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 z-50 w-[28rem] bg-white shadow-2xl h-full overflow-y-auto"
          >
            <div className="p-6 flex justify-center items-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Loading event details...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  if (error) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 z-50 w-[28rem] bg-white shadow-2xl h-full overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg">Event Details</h2>
                <X size={18} onClick={onClose} className="cursor-pointer" />
              </div>
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <p className="text-red-600">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 right-0 z-50 w-[28rem] bg-white shadow-2xl h-full overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg">Event Details</h2>
              <X size={18} onClick={onClose} className="cursor-pointer" />
            </div>

            {/* Title with actions */}
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-xl font-medium pr-4">{fetchedData?.title || "Untitled Event"}</h1>
              <div className="flex space-x-2">
                <button className="text-blue-500">
                  <Edit size={18} />
                </button>
                <button>
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-1 mb-4">
              <div className="flex">
                <span className="w-16 font-medium">Date:</span>
                <span>{fetchedData?.startTime ? formatDate(fetchedData.startTime) : "Date not available"}</span>
              </div>
              <div className="flex">
                <span className="w-16 font-medium">Time:</span>
                <span>
                  {fetchedData?.startTime && fetchedData?.endTime
                    ? formatTime(fetchedData.startTime, fetchedData.endTime)
                    : "Time not available"}
                </span>
              </div>
              <div>
              <span> Timezone : {fetchedData.timezone} </span>
                <span>{fetchedData?.recurrence || "One Time"}</span>
              </div>
            </div>

            {/* Join Meeting Section */}
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <div className="flex items-start">
                <Video className="text-blue-500 mt-1 mr-3" size={20} />
                <div className="flex-1">
                  <div className="font-medium mb-1">Join meeting</div>
                  <div ref={linkRef} className="text-sm text-gray-700 mb-3 break-all">
                    {fetchedData?.meetingLink || fetchedData?.meetingCode || "No meeting link available"}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-100"
                      onClick={copyMeetingLink}
                      disabled={!fetchedData?.meetingLink && !fetchedData?.meetingCode}
                    >
                      <Copy size={14} className="mr-1" /> Copy Link
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={joinMeeting}
                      disabled={!fetchedData?.meetingLink}
                    >
                      <ExternalLink size={14} className="mr-1" /> Join
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Creation Details */}
            <div className="space-y-1 mb-6">
              <div className="flex">
                <span className="w-32 font-medium">Event Created by:</span>
                <span>{fetchedData?.createdBy?.name || "Unknown"}</span>
              </div>
              <div className="flex">
                <span className="w-32 font-medium">Date Created:</span>
                <span>{fetchedData?.createdAt ? formatDate(fetchedData.createdAt) : "Unknown date"}</span>
              </div>
            </div>

            {/* Participants Section */}
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-medium">Invited Members ({fetchedData?.participants?.length || 0})</h3>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus size={16} className="mr-1" /> Add Member
              </Button>
            </div>

            {/* Participants List */}
            {fetchedData?.participants && fetchedData.participants.length > 0 ? (
              <div className="space-y-3">
                {fetchedData.participants.map((participant: Member, index: number) => (
                  <div key={participant.id || index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        {participant.avatar ? (
                          <Image
                            src={participant.avatar || "/placeholder.svg"}
                            alt={participant.name}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {participant.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <span>{participant.name || "Unknown Participant"}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                No participants have been invited to this event
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SelectedEventCard

