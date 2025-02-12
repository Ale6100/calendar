'use client'
 
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
 
import '@schedule-x/theme-default/dist/index.css'
import { useEffect } from "react";
 
function CalendarApp() {
  const plugins = [createEventsServicePlugin()]
 
  const calendar = useNextCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2025-02-12 10:00',
        end: '2025-02-12 21:00',
        description: 'Description of event 1',
      },
      {
        id: '2',
        title: 'Event 2',
        start: '2025-02-12 09:00',
        end: '2025-02-12 13:00',
        description: 'Description of event 2',
      },
    ],
    locale: 'es-AR',
    weekOptions: {
      nDays: 5,
    },
    isResponsive: true,
    callbacks: {
      onClickDate(date) {
        console.log('onClickDate', date) // e.g. 2024-01-01
      },
    }

  }, plugins)
 
  useEffect(() => {
    // get all events
    calendar?.eventsService.getAll();
  }, [])
 
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default CalendarApp
