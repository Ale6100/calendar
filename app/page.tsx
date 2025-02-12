import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
} from "@/components/FullCalendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="">
      <Calendar
        events={[
          {
            id: "1",
            start: new Date("2025-02-12T09:30:00Z"),
            end: new Date("2024-02-12T14:30:00Z"),
            title: "event A",
            color: "pink",
          },
          {
            id: "2",
            start: new Date("2025-02-14T10:00:00Z"),
            end: new Date("2025-02-14T10:30:00Z"),
            title: "event B",
            color: "blue",
          },
        ]}
      >
        <div className="h-dvh py-6 flex flex-col">
          <div className="flex px-6 items-center gap-2 mb-6">
            <CalendarViewTrigger view="week" className="aria-[current=true]:bg-accent">
              Semana
            </CalendarViewTrigger>
            <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">
              Día
            </CalendarViewTrigger>
            <CalendarViewTrigger view="month" className="aria-[current=true]:bg-accent">
              Mes
            </CalendarViewTrigger>

            <span className="flex-1" />

            <CalendarCurrentDate />

            <CalendarPrevTrigger>
              <ChevronLeft size={20} />
              <span className="sr-only">Anterior</span>
            </CalendarPrevTrigger>

            <CalendarTodayTrigger>Hoy</CalendarTodayTrigger>

            <CalendarNextTrigger>
              <ChevronRight size={20} />
              <span className="sr-only">Siguiente</span>
            </CalendarNextTrigger>
          </div>

          <div className="flex-1 overflow-auto px-6 relative">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
          </div>
        </div>
      </Calendar>
    </main>
  );
}
