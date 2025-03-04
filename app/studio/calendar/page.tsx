"use client";
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import SelectedEventCard from "@/components/studio/calendar/SelectedEventCard";
import AddEventCard from "@/components/studio/calendar/AddEventCard";
import { ChevronLeft, ChevronRight, Menu, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/Input/SelectInput";

const dummyEvents = [
  // January 1, 2025 (existing events)
  { id: 1, title: "Onboarding new staff", date: new Date(2025, 0, 1), startTime: "08:00", endTime: "09:00", color: "bg-green-200" },
  { id: 2, title: "Budget Review Class", date: new Date(2025, 0, 1), startTime: "09:00", endTime: "10:00", color: "bg-red-200" },
  { id: 3, title: "Ore Aisha", date: new Date(2025, 0, 1), startTime: "10:00", endTime: "12:00", color: "bg-yellow-200" },
  { id: 4, title: "Daily Standup", date: new Date(2025, 0, 1), startTime: "13:00", endTime: "14:00", color: "bg-purple-200" },

  // February 1–7, 2025 (5 events spread across the week)
  { id: 5, title: "Team Strategy Meeting", date: new Date(2025, 1, 1), startTime: "09:00", endTime: "10:30", color: "bg-blue-200" },
  { id: 6, title: "Product Launch Prep", date: new Date(2025, 1, 2), startTime: "10:00", endTime: "11:00", color: "bg-indigo-200" },
  { id: 7, title: "Client Feedback Session", date: new Date(2025, 1, 3), startTime: "14:00", endTime: "15:30", color: "bg-teal-200" },
  { id: 8, title: "Training Workshop", date: new Date(2025, 1, 5), startTime: "08:00", endTime: "09:30", color: "bg-orange-200" },
  { id: 9, title: "Weekly Review", date: new Date(2025, 1, 7), startTime: "15:00", endTime: "16:00", color: "bg-pink-200" },

  // March 1–14, 2025 (5 events spread across two weeks)
  { id: 10, title: "Q1 Performance Review", date: new Date(2025, 2, 1), startTime: "09:00", endTime: "10:30", color: "bg-green-200" },
  { id: 11, title: "Design Sprint Kickoff", date: new Date(2025, 2, 3), startTime: "10:00", endTime: "12:00", color: "bg-red-200" },
  { id: 12, title: "Marketing Campaign Planning", date: new Date(2025, 2, 7), startTime: "13:00", endTime: "14:30", color: "bg-yellow-200" },
  { id: 13, title: "Tech Infrastructure Update", date: new Date(2025, 2, 10), startTime: "11:00", endTime: "12:30", color: "bg-purple-200" },
  { id: 14, title: "User Testing Session", date: new Date(2025, 2, 14), startTime: "14:00", endTime: "15:00", color: "bg-blue-200" },
];

const currentYear = 2025;

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [selectedDay, setSelectedDay] = useState(2);

  const [selectedEventForTime, setSelectedEventForTime] = useState({})
  const [showEventsDetailsCard, setShowEventsDetailsCard] = useState(false)
  const [eventsDetailsAnchorRect, setEventsDetailsAnchorRect] = useState<DOMRect | null>(null);

  const [addEventAnchorRect, setAddEventAnchorRect] = useState<DOMRect | null>(null);
  const [showAddEventCard, setShowAddEventCard] = useState(false)

  const handleSetSelectdEvent = (event: React.MouseEvent<HTMLDivElement>, eventForTime: any) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setEventsDetailsAnchorRect(buttonRect);
    setShowEventsDetailsCard(true);
    setSelectedEventForTime(eventForTime)
  };

  const handleAddEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setAddEventAnchorRect(buttonRect);
    setShowAddEventCard(true);
  }

  const daysOfWeek = ["m", "t", "w", "t", "f", "s", "s"];

  const goToPreviousMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

    const prevMonthDays = [];
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevMonthYear);

    for (let i = 0; i < firstDayOfMonth; i++) {
      prevMonthDays.push({
        day: daysInPrevMonth - firstDayOfMonth + i + 1,
        currentMonth: false,
        nextMonth: false,
      });
    }

    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        currentMonth: true,
        nextMonth: false,
      });
    }

    const nextMonthDays = [];
    const totalDaysDisplayed = prevMonthDays.length + currentMonthDays.length;
    const remainingCells = 42 - totalDaysDisplayed;

    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push({
        day: i,
        currentMonth: false,
        nextMonth: true,
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

  const formatDayDisplay = (day: number) => {
    return `${day} ${getMonthName(currentMonth)} ${currentYear}`;
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, "0")}:00`
  );

  const days = generateCalendarDays();

  const getEventsForDay = (day: number) => {
    return dummyEvents.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
    );
  };

  const getUpcomingEvents = () => {
    const today = new Date(currentYear, currentMonth, selectedDay);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return dummyEvents.filter((event) => {
      const eventDate = event.date;
      return (
        (eventDate.getDate() === today.getDate() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()) ||
        (eventDate.getDate() === tomorrow.getDate() &&
          eventDate.getMonth() === tomorrow.getMonth() &&
          eventDate.getFullYear() === tomorrow.getFullYear())
      );
    });
  };

  const eventsForSelectedDay = getEventsForDay(selectedDay);
  const upcomingEvents = getUpcomingEvents();

  return (
    <ProtectedRoute
      requireAuth={true}
      requireVerification={true}
      requireProfileSetup={false}
    >
      <div className="flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="border-b border-gray-200 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="">Calendar</span>
          </div>
          <Button
            className="bg-primary-600 text-white flex items-center gap-1 px-6 py-1 rounded-md"
            onClick={handleAddEvent}
          >
            <span>Add Event</span>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </header>

        <div className="flex flex-1 bg-white">
          {/* Left Sidebar */}
          <div className="w-[350px] border-r border-gray-200 p-6">
            {/* Month selection header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPreviousMonth}
                disabled={currentMonth === 0}
                className={`p-1 rounded ${currentMonth === 0 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold">{getMonthName(currentMonth)}</h2>
              <button
                onClick={goToNextMonth}
                disabled={currentMonth === 11}
                className={`p-1 rounded ${currentMonth === 11 ? "text-gray-300" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 text-xs text-center mb-2">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="uppercase text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayEvents = getEventsForDay(day.day);
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    className={`relative w-8 h-8 flex items-center justify-center rounded-full text-sm cursor-pointer ${!day.currentMonth
                      ? "text-gray-300"
                      : day.day === selectedDay
                        ? "bg-primary-600 text-white"
                        : "hover:bg-gray-100"
                      }`}
                    onClick={() => day.currentMonth && setSelectedDay(day.day)}
                  >
                    {day.day}
                    {dayEvents.length > 0 && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Month selector dropdown */}
            <div className="mt-8 mb-6">
              <div className="relative">
                <SelectInput
                  value={currentMonth}
                  onChange={(value) => setCurrentMonth(Number(value))}
                  options={Array.from({ length: 12 }, (_, i) => ({
                    label: `${getMonthName(i)} ${currentYear}`,
                    value: i.toString()
                  }))}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Upcoming events</h3>
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="mb-2 p-2 bg-gray-100 rounded">
                    <p className="text-sm">
                      {event.title} - {event.startTime} to {event.endTime} ({getMonthName(event.date.getMonth())} {event.date.getDate()})
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="mb-3">
                    <svg width="46" height="45" viewBox="0 0 46 45" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <rect x="0.5" width="45" height="45" fill="url(#pattern0_1658_34056)" />
                      <defs>
                        <pattern id="pattern0_1658_34056" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use xlinkHref="#image0_1658_34056" transform="scale(0.0138889)" />
                        </pattern>
                        <image id="image0_1658_34056" width="72" height="72" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
                      </defs>
                    </svg>

                  </div>
                  <p className="text-gray-500 text-sm">No upcoming events</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <div className="flex items-center">
                <button className="p-1">
                  <Menu className="h-5 w-5 text-gray-500" />
                </button>
                <h2 className="text-xl font-semibold ml-2">{formatDayDisplay(selectedDay)}</h2>
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-160px)]">
              {timeSlots.map((time, index) => {
                const eventForTime = eventsForSelectedDay.find(
                  (event) => event.startTime === time
                );
                return (
                  <div key={index} className="flex border-b border-gray-100">
                    <div className="w-20 p-2 text-xs text-gray-500 text-right">{time}</div>
                    <div className="flex-1 h-16 border-l border-gray-200">
                      {eventForTime && (
                        <div
                          className={`h-full ${eventForTime.color} p-2 text-sm text-gray-800 cursor-pointer`}
                          onClick={(e) => handleSetSelectdEvent(e, eventForTime)}
                        >
                          {eventForTime.title}
                          <br />
                          {eventForTime.startTime} - {eventForTime.endTime}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {showAddEventCard && <AddEventCard
              isOpen={showAddEventCard}
              onClose={() => setShowAddEventCard(false)}
              anchorRect={addEventAnchorRect}
            />}
            {showEventsDetailsCard && <SelectedEventCard
              isOpen={showEventsDetailsCard}
              onClose={() => setShowEventsDetailsCard(false)}
              anchorRect={eventsDetailsAnchorRect}
              data={selectedEventForTime}
            />}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Calendar;