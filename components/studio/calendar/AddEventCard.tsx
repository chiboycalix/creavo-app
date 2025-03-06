"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/check-box"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { SelectInput } from "@/components/Input/SelectInput"
import { baseUrl } from "@/utils/constant"
import Cookies from "js-cookie"

const colorOptions = [
  { label: "Green", value: "bg-green-200" },
  { label: "Red", value: "bg-red-200" },
  { label: "Blue", value: "bg-blue-200" },
  { label: "Yellow", value: "bg-yellow-200" },
  { label: "Purple", value: "bg-purple-200" },
  { label: "Pink", value: "bg-pink-200" },
  { label: "Indigo", value: "bg-indigo-200" },
  { label: "Teal", value: "bg-teal-200" },
  { label: "Orange", value: "bg-orange-200" },
]

const generateTimeOptions = () => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      options.push({ label: time, value: time })
    }
  }
  return options
}

const generateDateOptions = () => {
  const options = []
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`
    options.push({ label: formattedDate, value: date.toISOString() })
  }
  return options
}

interface AddEventCardProps {
  isOpen: boolean
  onClose: () => void
  anchorRect: DOMRect | null
  eventToEdit?: any
}

const AddEventCard: React.FC<AddEventCardProps> = ({ isOpen, onClose, eventToEdit }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isAllDay, setIsAllDay] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [location, setLocation] = useState("")
  const [color, setColor] = useState("bg-blue-200")
  const [members, setMembers] = useState<string[]>([])
  const [selectedMember, setSelectedMember] = useState("")
  const cardRef = useRef<HTMLDivElement>(null)
  const timeOptions = generateTimeOptions()
  const dateOptions = generateDateOptions()

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || "")
      setDescription(eventToEdit.description || "")
      setStartDate(eventToEdit.date || null)
      setEndDate(eventToEdit.date || null)
      setStartTime(eventToEdit.startTime || "")
      setEndTime(eventToEdit.endTime || "")
      setIsAllDay(eventToEdit.isAllDay || false)
      setIsRepeating(eventToEdit.isRepeating || false)
      setLocation(eventToEdit.location || "")
      setColor(eventToEdit.color || "bg-blue-200")
      setMembers(eventToEdit.members || [])
    }
  }, [eventToEdit])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const addMember = () => {
    if (selectedMember && !members.includes(selectedMember)) {
      setMembers([...members, selectedMember])
      setSelectedMember("")
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !startDate) {
      alert("Please enter all required fields.")
      return
    }
    try {
      const payload = {
        title,
        description,
        startTime: startDate.toISOString(),
        endTime: endDate ? endDate.toISOString() : startDate.toISOString(),
        startTimeStr: startTime,
        endTimeStr: endTime,
        isAllDay,
        isRepeating,
        location,
        timezone: "WAT",
        isPaid: false,
        internalParticipant: [{ email: "kennith8@gmail.com", isCoHost: false, isRequiredToPay: true }],
        externalParticipant: ["farex@hotmail.com", "timothyedibo@gmail.com"],
        includeWebinar: false,
        type: "SCHEDULED",
        participants: members.map((member) => ({ name: member })),
      }
      const response = await fetch(`${baseUrl}/meetings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error(`Error: ${response.statusText}`)
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

            <div className="p-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Event Description</h3>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter event description"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-md font-medium">Additional Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <SelectInput
                      value={startDate ? startDate.toISOString() : ""}
                      onChange={(value) => setStartDate(new Date(value))}
                      options={dateOptions}
                      selectTextClass="truncate"
                      className="w-full"
                    />
                    <SelectInput
                      value={startTime}
                      onChange={setStartTime}
                      options={timeOptions}
                      selectTextClass="truncate"
                      className="w-full"
                      // disabled={isAllDay}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <SelectInput
                      value={endDate ? endDate.toISOString() : ""}
                      onChange={(value) => setEndDate(new Date(value))}
                      options={dateOptions}
                      selectTextClass="truncate"
                      className="w-full"
                    />
                    <SelectInput
                      value={endTime}
                      onChange={setEndTime}
                      options={timeOptions}
                      selectTextClass="truncate"
                      className="w-full"
                      // disabled={isAllDay}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allDay"
                    checked={isAllDay}
                    onCheckedChange={(checked) => setIsAllDay(checked === true)}
                  />
                  <Label htmlFor="allDay">All Day</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="repeat"
                    checked={isRepeating}
                    onCheckedChange={(checked) => setIsRepeating(checked === true)}
                  />
                  <Label htmlFor="repeat">Repeat Event</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`w-8 h-8 rounded-full cursor-pointer ${option.value} ${
                        color === option.value ? "ring-2 ring-primary-600 ring-offset-2" : ""
                      }`}
                      onClick={() => setColor(option.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Event Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="The location can be a place or a URL"
                />
              </div>

              {/* Add Member */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Add Member</h3>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <SelectInput
                      value={selectedMember}
                      onChange={setSelectedMember}
                      options={[
                        { label: "John Doe", value: "John Doe" },
                        { label: "Jane Smith", value: "Jane Smith" },
                        { label: "Alex Johnson", value: "Alex Johnson" },
                      ]}
                      className="w-full"
                    />
                  </div>
                  <Button type="button" variant="outline" onClick={addMember} disabled={!selectedMember}>
                    Add
                  </Button>
                </div>

                {members.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {members.map((member, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{member}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setMembers(members.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white" onClick={handleSubmit}>
                SAVE
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddEventCard

