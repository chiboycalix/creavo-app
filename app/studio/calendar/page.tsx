'use client'
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import AddEventCard from '@/components/studio/calendar/AddEventCard';
import SelectedEventCard from '@/components/studio/calendar/SelectedEventCard';
import { Button } from '@/components/ui/button';
import { baseUrl } from "@/utils/constant";
import Cookies from 'js-cookie';

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  color: string;
  description?: string;
  location?: string;
  isAllDay?: boolean;
  isRepeating?: boolean;
  members?: string[];
}

interface ApiMeeting {
  id: number;
  userId: number;
  timezone: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isPaid: boolean;
  amount: number;
  currency: string | null;
  repeat: boolean;
  repeatType: string | null;
  meetingCode: string | null;
  participants?: Array<{ name: string }>;
  startTimeStr?: string;
  endTimeStr?: string;
  color?: string;
  location?: string;
  isAllDay?: boolean;
}

interface ApiResponse {
  data: {
    meetings: ApiMeeting[];
    meta: {
      page: number;
      limit: number;
      totalRows: number;
      totalPage: number;
    }
  };
  message: string;
  code: number;
  status: string;
  statusCode: number;
}

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedEventForTime, setSelectedEventForTime] = useState<CalendarEvent | null>(null);
  const [showEventsDetailsCard, setShowEventsDetailsCard] = useState(false);
  const [eventsDetailsAnchorRect, setEventsDetailsAnchorRect] = useState<DOMRect | null>(null);
  const [addEventAnchorRect, setAddEventAnchorRect] = useState<DOMRect | null>(null);
  const [showAddEventCard, setShowAddEventCard] = useState(false);
  const [meetings, setMeetings] = useState<CalendarEvent[]>([]);
  const [monthMeetings, setMonthMeetings] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const daysOfWeek = ["m", "t", "w", "t", "f", "s", "s"];
  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );

  useEffect(() => {
    fetchMonthMeetings();
  }, [currentMonth]);

  useEffect(() => {
    fetchMeetings();
  }, [selectedDay, currentMonth]);

  const fetchMonthMeetings = async () => {
    try {
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      
      const response = await fetch(
        `${baseUrl}/meetings/user-Meetings/list?page=1&limit=100&startDate=${firstDay.toISOString().split('T')[0]}&endDate=${lastDay.toISOString().split('T')[0]}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }
      // console.log(response)
      
      const responseData: ApiResponse = await response.json();
      const meetings = responseData.data.meetings;

      const formattedMeetings = meetings.map((meeting: ApiMeeting) => ({
        id: meeting.id,
        title: meeting.title,
        date: new Date(meeting.startTime),
        startTime: meeting.startTimeStr || formatTimeFromDate(new Date(meeting.startTime)),
        endTime: meeting.endTimeStr || formatTimeFromDate(new Date(meeting.endTime)),
        color: `bg-${meeting.color || "blue"}-200`,
        description: meeting.description,
        location: meeting.location,
        isAllDay: meeting.isAllDay,
        isRepeating: meeting.repeat,
        members: meeting.participants?.map(p => p.name) || [],
      }));

      setMonthMeetings(formattedMeetings);
    } catch (error) {
      console.error('Error fetching month meetings:', error);
      setMonthMeetings([]);
    }
  };

  const fetchMeetings = async () => {
    setIsLoading(true);
    try {
      const date = new Date(currentYear, currentMonth, selectedDay);
      const formattedDate = date.toISOString().split('T')[0];
      
      const response = await fetch(
        `${baseUrl}/meetings/user-Meetings/list?page=1&limit=10&date=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('accessToken')}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }
      
      const responseData: ApiResponse = await response.json();
      const meetings = responseData.data.meetings;

      const formattedMeetings = meetings.map((meeting: ApiMeeting) => ({
        id: meeting.id,
        title: meeting.title,
        date: new Date(meeting.startTime),
        startTime: meeting.startTimeStr || formatTimeFromDate(new Date(meeting.startTime)),
        endTime: meeting.endTimeStr || formatTimeFromDate(new Date(meeting.endTime)),
        color: `bg-${meeting.color || "red"}-200`,
        description: meeting.description,
        location: meeting.location,
        isAllDay: meeting.isAllDay,
        isRepeating: meeting.repeat,
        members: meeting.participants?.map(p => p.name) || [],
      }));

      // Filter meetings for the selected date only
      const filteredMeetings = formattedMeetings.filter(meeting => {
        const meetingDate = meeting.date;
        return (
          meetingDate.getDate() === selectedDay &&
          meetingDate.getMonth() === currentMonth &&
          meetingDate.getFullYear() === currentYear
        );
      });

      setMeetings(filteredMeetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setMeetings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeFromDate = (date: Date): string => {
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleAddEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setAddEventAnchorRect(buttonRect);
    setShowAddEventCard(true);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev === 0 ? 11 : prev - 1);
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => prev === 11 ? 0 : prev + 1);
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
    const days = [];

    // Previous month days
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthDays = getDaysInMonth(prevMonth, currentYear);
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        day: prevMonthDays - firstDayOfMonth + i + 1,
        currentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        currentMonth: false
      });
    }

    return days;
  };

  const getMonthName = (month: number) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month];
  };

  const getMeetingsForTimeSlot = (time: string) => {
    return meetings.filter(meeting => meeting.startTime.startsWith(time.split(':')[0]));
  };

  const hasEventsOnDay = (day: number) => {
    return monthMeetings.some(meeting => {
      const meetingDate = meeting.date;
      return (
        meetingDate.getDate() === day &&
        meetingDate.getMonth() === currentMonth &&
        meetingDate.getFullYear() === currentYear
      );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">Calendar</h1>
        <Button 
          onClick={handleAddEvent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          Add Event <PlusCircle className="w-4 h-4" />
        </Button>
      </header>

      <div className="flex flex-1">
        {/* Left sidebar */}
        <div className="w-[280px] border-r p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button onClick={goToPreviousMonth}>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-medium">{getMonthName(currentMonth)}</h2>
              <button onClick={goToNextMonth}>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {daysOfWeek.map((day, i) => (
                <div key={i} className="text-xs text-gray-500 uppercase">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    relative w-8 h-8 rounded-full flex items-center justify-center text-sm
                    ${day.currentMonth 
                      ? day.day === selectedDay 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-100'
                      : 'text-gray-300'
                    }
                  `}
                  onClick={() => day.currentMonth && setSelectedDay(day.day)}
                >
                  {day.day}
                  {day.currentMonth && hasEventsOnDay(day.day) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Upcoming events</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : meetings.length > 0 ? (
              <div className="space-y-3">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm">{meeting.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {meeting.startTime} - {meeting.endTime}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <img 
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDEwVjdDMjAgNS44OTU0MyAxOS4xMDQ2IDUgMTggNUg2QzQuODk1NDMgNSA0IDUuODk1NDMgNCA3VjEwTTIwIDEwVjE5QzIwIDIwLjEwNDYgMTkuMTA0NiAyMSAxOCAyMUg2QzQuODk1NDMgMjEgNCAyMC4xMDQ2IDQgMTlWMTBNMjAgMTBINE0xNiAzVjdNOCAzVjdNOCAxNUwxMSAxOE0xMSAxNUw4IDE4IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=" 
                  alt="No events" 
                  className="w-16 h-16 mb-4"
                />
                <p className="text-gray-500 text-sm">No upcoming events</p>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {`${selectedDay} ${getMonthName(currentMonth)} ${currentYear}`}
            </h2>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {timeSlots.map((time) => {
              const timeSlotMeetings = getMeetingsForTimeSlot(time);
              return (
                <div key={time} className="flex items-center">
                  <div className="w-16 text-sm text-gray-500">{time}</div>
                  <div className="flex-1 min-h-[3rem] border-t border-gray-100 relative">
                    {timeSlotMeetings.map(meeting => (
                      <div
                        key={meeting.id}
                        className={`absolute left-0 right-0 ${meeting.color} rounded p-2 m-1`}
                        style={{
                          top: '0',
                          minHeight: '2.5rem'
                        }}
                        onClick={() => {
                          setSelectedEventForTime(meeting);
                          setShowEventsDetailsCard(true);
                        }}
                      >
                        <h4 className="text-sm font-medium">{meeting.title}</h4>
                        <p className="text-xs text-gray-600">
                          {meeting.startTime} - {meeting.endTime}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAddEventCard && (
        <AddEventCard
          isOpen={showAddEventCard}
          onClose={() => setShowAddEventCard(false)}
          anchorRect={addEventAnchorRect}
        />
      )}
      
      {showEventsDetailsCard && selectedEventForTime && (
        <SelectedEventCard
          isOpen={showEventsDetailsCard}
          onClose={() => setShowEventsDetailsCard(false)}
          anchorRect={eventsDetailsAnchorRect}
          data={selectedEventForTime}
        />
      )}
    </div>
  );
};

export default Calendar;