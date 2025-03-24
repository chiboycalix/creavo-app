"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/check-box"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { SelectInput } from "@/components/Input/SelectInput"
import { baseUrl } from "@/utils/constant"
import Cookies from "js-cookie"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
// NOT: import { useDebounce } from "use-debounce"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Timezone {
  name: string
  description: string
}

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
  const [timezone, setTimezone] = useState("")
  const [color, setColor] = useState("bg-blue-200")
  const [timezones, setTimezones] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timeOptions = generateTimeOptions()
  const [isWebinar, setIsWebinar] = useState(false)
  const [participantSearch, setParticipantSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [internalParticipants, setInternalParticipants] = useState<any[]>([])
  const [externalParticipants, setExternalParticipants] = useState<string[]>([])
  const [newExternalEmail, setNewExternalEmail] = useState("")
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchTimezones = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${baseUrl}/meetings/timezones`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        })
        if (!response.ok) throw new Error("Failed to fetch timezones")
        const responseData = await response.json()

        // Check if response has data property and it's an array
        if (responseData.data && Array.isArray(responseData.data)) {
          // Extract only the name field from each timezone object
          const timezoneNames = responseData.data.map((tz: Timezone) => tz.name)
          setTimezones(timezoneNames)
        } else {
          setTimezones([])
          setError("Invalid timezone data received")
        }
      } catch (error) {
        console.error("Error fetching timezones:", error)
        setError("Failed to load timezones")
        setTimezones([])
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchTimezones()
    }
  }, [isOpen])

  useEffect(() => {
    const searchUsers = async (query: string) => {
      if (!query || query.length < 2) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`${baseUrl}/users/?username=${encodeURIComponent(query)}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        })

        if (!response.ok) throw new Error("Failed to search users")

        const data = await response.json()
        setSearchResults(data.data || [])
      } catch (error) {
        console.error("Error searching users:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set a new timeout for debouncing
    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(participantSearch)
    }, 500)

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [participantSearch])

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || "")
      setDescription(eventToEdit.description || "")
      setStartDate(eventToEdit.startTime ? new Date(eventToEdit.startTime) : null)
      setEndDate(eventToEdit.endTime ? new Date(eventToEdit.endTime) : null)

      setStartTime(
        eventToEdit.startTime
          ? new Date(eventToEdit.startTime).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
      )
      setEndTime(
        eventToEdit.endTime
          ? new Date(eventToEdit.endTime).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
      )

      setIsAllDay(eventToEdit.isAllDay || false)
      setIsRepeating(eventToEdit.isRepeating || false)
      setTimezone(eventToEdit.timezone || "")
      setColor(eventToEdit.color || "bg-blue-200")
      setIsWebinar(eventToEdit.includeWebinar || false)

      if (eventToEdit.internalParticipant) {
        setInternalParticipants(eventToEdit.internalParticipant)
      }

      if (eventToEdit.externalParticipant) {
        setExternalParticipants(eventToEdit.externalParticipant)
      }
    }
  }, [eventToEdit])

  // Add a click outside handler to close the timezone dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose()
      }

      // Close timezone dropdown when clicking outside of it
      const timezoneInput = document.querySelector('input[placeholder="Search timezone..."]')
      const timezoneDropdown = document.querySelector(".max-h-40.overflow-y-auto")
      if (
        timezoneInput &&
        timezoneDropdown &&
        !timezoneInput.contains(event.target as Node) &&
        !timezoneDropdown.contains(event.target as Node)
      ) {
        setIsTimezoneDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const filteredTimezones = searchQuery
    ? timezones.filter((tz) => tz.toLowerCase().includes(searchQuery.toLowerCase()))
    : timezones

  const handleSubmit = async () => {
    if (!title.trim() || !startDate || !timezone) {
      alert("Please enter all required fields.")
      return
    }

    try {
      const startDateTime = new Date(startDate)
      const endDateTime = new Date(endDate ?? startDate) // Default end date to start date if null

      if (startTime) {
        const [startHours, startMinutes] = startTime.split(":").map(Number)
        startDateTime.setHours(startHours, startMinutes, 0, 0)
      }
      if (endTime) {
        const [endHours, endMinutes] = endTime.split(":").map(Number)
        endDateTime.setHours(endHours, endMinutes, 0, 0)
      }

      // Convert to ISO 8601 format for submission
      const formattedStartTime = startDateTime.toISOString()
      const formattedEndTime = endDateTime.toISOString()

      const payload = {
        title,
        description,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        isAllDay,
        color,
        isRepeating,
        timezone,
        isPaid: false,
        type: "SCHEDULED",
        includeWebinar: isWebinar,
        ...(isWebinar && {
          internalParticipant: internalParticipants.map((p) => ({ email: p.email })),
          externalParticipant: externalParticipants,
        }),
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

  const addInternalParticipant = (user: any) => {
    if (!internalParticipants.some((p) => p.email === user.email)) {
      setInternalParticipants([...internalParticipants, user])
    }
    setParticipantSearch("")
    setSearchResults([])
  }

  const removeInternalParticipant = (email: string) => {
    setInternalParticipants(internalParticipants.filter((p) => p.email !== email))
  }

  const addExternalParticipant = () => {
    if (
      newExternalEmail &&
      !externalParticipants.includes(newExternalEmail) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newExternalEmail)
    ) {
      setExternalParticipants([...externalParticipants, newExternalEmail])
      setNewExternalEmail("")
    }
  }

  const removeExternalParticipant = (email: string) => {
    setExternalParticipants(externalParticipants.filter((e) => e !== email))
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
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => setStartDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="w-full border-primary-100 border-2 p-2 py-2.5 rounded"
                      placeholderText="Select Start Date"
                    />

                    <SelectInput
                      value={startTime}
                      onChange={setStartTime}
                      options={timeOptions}
                      selectTextClass="truncate"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => setEndDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="w-full border-primary-100 border-2 p-2 py-2.5 rounded"
                      placeholderText="Select End Date"
                    />
                    <SelectInput
                      value={endTime}
                      onChange={setEndTime}
                      options={timeOptions}
                      selectTextClass="truncate"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Modify the timezone selection div to include the dropdown toggle functionality */}
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <div className="relative">
                    <div className="relative mb-2">
                      <Input
                        type="text"
                        placeholder="Search timezone..."
                        value={searchQuery} // Always show what user types
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setTimezone("") // Clear selected timezone when typing
                          setIsTimezoneDropdownOpen(true)
                        }}
                        className="pl-10"
                        onFocus={() => setIsTimezoneDropdownOpen(true)}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    {isTimezoneDropdownOpen && (
                      <div className="absolute z-10 w-full max-h-40 overflow-y-auto border rounded-md bg-white shadow-md">
                        {isLoading ? (
                          <div className="p-2 text-center text-gray-500">Loading timezones...</div>
                        ) : error ? (
                          <div className="p-2 text-center text-red-500">{error}</div>
                        ) : filteredTimezones.length > 0 ? (
                          filteredTimezones.map((tz) => (
                            <div
                              key={tz}
                              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                                timezone === tz ? "bg-primary-50 text-primary-600" : ""
                              }`}
                              onClick={() => {
                                setTimezone(tz) // Store selected timezone
                                setSearchQuery(tz) // Display in input
                                setIsTimezoneDropdownOpen(false) // Close dropdown
                              }}
                            >
                              {tz}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-gray-500">No timezones found</div>
                        )}
                      </div>
                    )}
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="webinar"
                    checked={isWebinar}
                    onCheckedChange={(checked) => setIsWebinar(checked === true)}
                  />
                  <Label htmlFor="webinar">Video Conferencing </Label>
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
              {isWebinar && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Participants</h3>

                  {/* Internal participants search */}
                  <div className="space-y-2">
                    <Label htmlFor="participants">Add Internal Participants</Label>
                    <div className="relative">
                      <Input
                        id="participants"
                        value={participantSearch}
                        onChange={(e) => {
                          setParticipantSearch(e.target.value)
                          if (e.target.value.length > 0) {
                            setIsSearching(true)
                          }
                        }}
                        placeholder="Search by username or email"
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                      {/* Search results dropdown */}
                      {participantSearch.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto border rounded-md bg-white shadow-md">
                          {isSearching ? (
                            <div className="p-2 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="h-4 w-4 rounded-full border-2 border-primary-600 border-t-transparent animate-spin"></div>
                                <span className="text-gray-500">Searching...</span>
                              </div>
                            </div>
                          ) : searchResults.length > 0 ? (
                            searchResults.map((user) => (
                              <div
                                key={user.id}
                                className="p-2 flex items-center hover:bg-gray-100 cursor-pointer"
                                onClick={() => addInternalParticipant(user)}
                              >
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} />
                                  <AvatarFallback>{user.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.username}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-center text-gray-500">No users found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected internal participants */}
                  {internalParticipants.length > 0 && (
                    <div className="space-y-2">
                      <Label>Internal Participants</Label>
                      <div className="space-y-2">
                        {internalParticipants.map((participant) => (
                          <div
                            key={participant.email}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={participant.avatar || "/placeholder.svg?height=24&width=24"} />
                                <AvatarFallback>{participant.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span>{participant.email}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInternalParticipant(participant.email)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External participants */}
                  <div className="space-y-2">
                    <Label htmlFor="externalParticipant">Add External Participants</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="externalParticipant"
                        value={newExternalEmail}
                        onChange={(e) => setNewExternalEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                      <Button type="button" onClick={addExternalParticipant} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Selected external participants */}
                  {externalParticipants.length > 0 && (
                    <div className="space-y-2">
                      <Label>External Participants</Label>
                      <div className="space-y-2">
                        {externalParticipants.map((email) => (
                          <div key={email} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <span>{email}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExternalParticipant(email)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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