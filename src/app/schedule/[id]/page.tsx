'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '~/trpc/react';

interface Event {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface Person {
  id: number;
  name: string;
  availability: { startTime: string; endTime: string }[];
}

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getWeek = (startDate: Date) => {
  const week = [];
  for (let i = 0; i < 7; i++) {
    week.push(addDays(startDate, i));
  }
  return week;
};

export default function SchedulePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const week = getWeek(currentDate);

  const { data: meetingData, isLoading: isMeetingLoading, isError: isMeetingError } = api.meetings.getMeetingsByGroup.useQuery(
    { groupId: Number(id) },
    {
      enabled: !!id,
    }
  );

  const { data: peopleData, isLoading: isPeopleLoading, isError: isPeopleError } = api.members.getUsersByGroup.useQuery(
    { groupId: Number(id) },
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (meetingData) {
      const filteredEvents = meetingData
        .map((meeting: any, index: number) => {
          const eventDate = new Date(meeting.start);
          if (week.some((day) => day.toDateString() === eventDate.toDateString())) {
            return {
              id: index,
              name: meeting.meetingName || 'Untitled Meeting',
              startTime: meeting.start || '',
              endTime: meeting.end || '',
            };
          }
        })
        .filter(Boolean);

      setEvents(filteredEvents as Event[]);
    }
  }, [meetingData, currentDate]);

  const handlePrevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const getAvailability = (personId: number, day: Date) => {
    const person = peopleData?.find((person: any) => person.userId === personId);
    return person?.availability.filter((a: any) => new Date(a.start).toDateString() === day.toDateString());
  };

  if (isMeetingLoading || isPeopleLoading) return <div className="text-center">Loading schedule...</div>;
  if (isMeetingError || isPeopleError) return <div className="text-center text-red-500">Failed to load schedule.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link href={'/dashboard'}>Dashboard</Link>
      <h1 className="text-3xl font-bold text-center mb-6">Schedule for Group {id}</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button onClick={handlePrevWeek} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Previous Week
        </button>
        <button onClick={handleNextWeek} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Next Week
        </button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {week.map((day, index) => (
          <div
            key={index}
            className="p-4 bg-white shadow-md rounded-md hover:bg-gray-100"
            onMouseEnter={() => setHoveredDay(day)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            <Day date={day} events={events.filter((event) => new Date(event.startTime).toDateString() === day.toDateString())} />
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">People</h2>
      <ul className="grid grid-cols-2 gap-4">
        {peopleData?.map((person: any) => {
          const availability = hoveredDay ? getAvailability(person.userId, hoveredDay) : null;

          return (
            <li key={person.userId} className="p-4 bg-gray-100 rounded-md">
              <p className="font-medium">
                {person.displayName}
                {availability && availability.length > 0 && (
                  <span className="ml-2 text-green-500">
                    ({availability[0]!.start} - {availability[0]!.end})
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface Event {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface DayProps {
  date: Date;
  events: Event[];
}

function Day({ date, events }: DayProps) {
  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-2">{date.toDateString()}</h3>
      <ul>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id} className="mb-4">
              <p className="font-medium">{event.name}</p>
              <p className="text-gray-600">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No events for this day.</p>
        )}
      </ul>
    </div>
  );
}