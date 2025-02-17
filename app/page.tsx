import { ActualMonthView, Calendar, CalendarDatePickerTrigger, CalendarDayView, CalendarMonthView, CalendarNextTrigger, CalendarNoView, CalendarPrevTrigger, CalendarViewTrigger, CalendarWeekView } from "@/components/FullCalendar";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          <div className="flex px-6 items-center gap-3 mb-6">
            <TabsList className="flex gap-2">
              <TabsTrigger value="week" className='p-0'>
                <CalendarViewTrigger view="week" className="py-1 px-2">
                  Semana
                </CalendarViewTrigger>
              </TabsTrigger>

              <TabsTrigger value="day" className='p-0'>
                <CalendarViewTrigger view="day" className="py-1 px-2">
                  Día
                </CalendarViewTrigger>
              </TabsTrigger>

              <TabsTrigger value="month" className='p-0'>
                <CalendarViewTrigger view="month" className="py-1 px-2">
                  Mes
                </CalendarViewTrigger>
              </TabsTrigger>
              <TabsTrigger value="no_view" className='p-0'>
                <CalendarViewTrigger view="no_view" className="py-1 px-2">
                  Historial
                </CalendarViewTrigger>
              </TabsTrigger>
            </TabsList>

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
            <CalendarNoView>
              Acá va un componente personalizado en caso de que no se desee mostrar un calendario. Luego pienso poner una tabla como ejemplo.
            </CalendarNoView>
          </div>
        </div>
      </Calendar>
    </main>
  );
}
