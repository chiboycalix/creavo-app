"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState, useRef } from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { buttonVariants } from "@/components/ui/button"

interface DatePickerProps {
  date: Date | null
  onSelect: (date: Date | null) => void
  placeholder?: string
  className?: string
}

export function DatePickerSimple({ date, onSelect, placeholder = "Select date", className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onSelect(selectedDate)
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
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
            onClick={(e) => {
              // Prevent any click inside from closing the popover
              e.stopPropagation()
            }}
          >
            <DayPicker
              mode="single"
              selected={date || undefined}
              onSelect={handleSelect}
              showOutsideDays
              className="p-3"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-neutral-500 rounded-full w-9 font-normal text-[0.8rem] dark:text-neutral-400",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-neutral-100/50 [&:has([aria-selected])]:bg-neutral-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-neutral-800/50 dark:[&:has([aria-selected])]:bg-neutral-800",
                day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal aria-selected:opacity-100"),
                day_range_end: "day-range-end",
                day_selected:
                  "bg-neutral-900 text-neutral-50 hover:bg-neutral-900 hover:text-neutral-50 focus:bg-primary-900 focus:text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 dark:focus:bg-neutral-50 dark:focus:text-neutral-900",
                day_today: "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50",
                day_outside:
                  "day-outside text-neutral-500 aria-selected:bg-neutral-100/50 aria-selected:text-neutral-500 dark:text-neutral-400 dark:aria-selected:bg-neutral-800/50 dark:aria-selected:text-neutral-400",
                day_disabled: "text-neutral-500 opacity-50 dark:text-neutral-400",
                day_range_middle:
                  "aria-selected:bg-neutral-100 aria-selected:text-neutral-900 dark:aria-selected:bg-primary-800 dark:aria-selected:text-neutral-50",
                day_hidden: "invisible",
              }}
              onMonthChange={() => {
                // This prevents the popover from closing when changing months
                const timeoutId = setTimeout(() => {
                  if (containerRef.current) {
                    const navButtons = containerRef.current.querySelectorAll(".rdp-nav_button")
                    navButtons.forEach((button) => {
                      button.addEventListener(
                        "click",
                        (e) => {
                          e.stopPropagation()
                        },
                        { once: true },
                      )
                    })
                  }
                }, 0)
                return () => clearTimeout(timeoutId)
              }}
            />
            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
              <Button variant="default" className="w-full" onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

