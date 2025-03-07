"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | null
  onSelect: (date: Date | null) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ date, onSelect, placeholder = "Select date", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    onSelect(selectedDate || null)
    // Only close the popover when a date is actually selected
    if (selectedDate) {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div
          className="calendar-wrapper"
          onClick={(e) => {
            // Prevent clicks inside the calendar from closing the popover
            e.stopPropagation()
          }}
        >
          <Calendar mode="single" selected={date || undefined} onSelect={handleSelect} initialFocus />
        </div>
      </PopoverContent>
    </Popover>
  )
}

