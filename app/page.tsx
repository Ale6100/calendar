import { ActualMonthView, Calendar, CalendarDatePickerTrigger, CalendarDayView, CalendarMonthView, CalendarNextTrigger, CalendarPrevTrigger, CalendarViewTrigger, CalendarWeekView } from "@/components/FullCalendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="">
      <Calendar
        events={[
          {
            id: "1",
            start: new Date("2025-02-14T09:00:00"),
            end: new Date("2025-02-14T14:00:00"),
            title: "event A",
          },
          {
            id: "2",
            start: new Date("2025-02-14T15:00:00"),
            end: new Date("2025-02-14T19:30:00"),
            title: "event B asd asd adas sad asd asd asd as",
          },
        ]}
      >
        <div className="py-6 flex flex-col">
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

            <CalendarDatePickerTrigger />

            <CalendarPrevTrigger>
              <ChevronLeft size={20} />
              <span className="sr-only">Anterior</span>
            </CalendarPrevTrigger>

            <CalendarNextTrigger>
              <ChevronRight size={20} />
              <span className="sr-only">Siguiente</span>
            </CalendarNextTrigger>
          </div>

          <div className="flex-1 px-6">
            <ActualMonthView />
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
          </div>
        </div>
      </Calendar>
    </main>
  );
}
