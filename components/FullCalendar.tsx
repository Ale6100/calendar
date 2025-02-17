'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { Locale, addDays, addMonths, addWeeks, addYears, differenceInMinutes, format, isSameDay, isSameHour, isSameMonth, isToday, setHours, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { ReactNode, createContext, forwardRef, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar as CalendarBtn } from "@/components/ui/calendar"
import { capitalize } from '@/app/utils/format';
import { Tabs, TabsContent } from './ui/tabs';

const monthEventVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-primary',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      purple: 'bg-purple-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type View = 'no_view' | 'day' | 'week' | 'month' | 'year';

type ContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  locale: Locale;
  setEvents: (date: CalendarEvent[]) => void;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  enableHotkeys?: boolean;
  today: Date;
};

const Context = createContext<ContextType>({} as ContextType);

export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string; //! Lo voy a deprecar y reemplazar por la propiedad data
  // data: AppointmentsDB; //! Reemplazar por un tipado genérico. Actualmente sólo funciona para la tabla Appointments
  color?: VariantProps<typeof monthEventVariants>['variant'];
};

type CalendarProps = {
  children: ReactNode;
  defaultDate?: Date;
  events?: CalendarEvent[];
  view?: View;
  locale?: Locale;
  enableHotkeys?: boolean;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
};

const Calendar = ({
  children,
  defaultDate = new Date(),
  locale = es,
  enableHotkeys = true,
  view: _defaultMode = 'no_view',
  onEventClick,
  events: defaultEvents = [],
  onChangeView,
}: CalendarProps) => {
  const [view, setView] = useState<View>(_defaultMode);
  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);

  const changeView = (view: View) => {
    setView(view);
    onChangeView?.(view);
  };

  useHotkeys('m', () => changeView('month'), {
    enabled: enableHotkeys,
  });

  useHotkeys('w', () => changeView('week'), {
    enabled: enableHotkeys,
  });

  useHotkeys('y', () => changeView('year'), {
    enabled: enableHotkeys,
  });

  useHotkeys('d', () => changeView('day'), {
    enabled: enableHotkeys,
  });

  return (
    <Context.Provider
      value={{
        view,
        setView,
        date,
        setDate,
        events,
        setEvents,
        locale,
        enableHotkeys,
        onEventClick,
        onChangeView,
        today: new Date(),
      }}
    >
      <Tabs defaultValue="no_view">
        {children}
      </Tabs>
    </Context.Provider>
  );
};

export const useCalendar = () => useContext(Context);

const CalendarViewTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    view: View;
  }
>(({ children, view, ...props }, ref) => {
  const { setView, onChangeView } = useCalendar();

  return (
    <div
      {...props}
      onClick={() => {
        setView(view);
        onChangeView?.(view);
      }}
    >
      {children}
    </div>
  );
});
CalendarViewTrigger.displayName = 'CalendarViewTrigger';

const EventGroup = ({
  events,
  hour,
}: {
  events: CalendarEvent[];
  hour: Date;
}) => {
  return (
    <div className="h-20 border-t last:border-b relative">
      {events
        .filter(event => isSameHour(event.start, hour))
        .map(event => {
          const hoursDifference = differenceInMinutes(event.end, event.start) / 60;
          const startPosition = event.start.getMinutes() / 60;

          return (
            <div
              key={event.id}
              className={cn(
                'absolute border-2 border-blue-500 w-full rounded p-1',
              )}
              style={{
                top: `${startPosition * 100}%`,
                height: `${hoursDifference * 100}%`,
              }}
            >
              {event.title}
            </div>
          );
        })}
    </div>
  );
};

const ActualMonthView = () => {
  const { view, date } = useCalendar();

  if (view === 'no_view') return null;

  return (
    <div className="flex justify-center border-2 py-1">
      <p>{capitalize(format(date, 'MMMM', { locale: es}))}</p>
    </div>
  );
};

type CalendarNoViewProps = {
  children: ReactNode;
};

const CalendarNoView = ({ children }: CalendarNoViewProps) => {
  const { view } = useCalendar();

  if (view !== 'no_view') return null;

  return (
    <TabsContent value="no_view">
      { children }
    </TabsContent>
  )
}

const CalendarDayView = () => {
  const { view, events, date } = useCalendar();

  if (view !== 'day') return null;

  const hours = [...Array(24)].map((_, i) => setHours(date, i));

  return (
    <TabsContent value="day">
      <div className="flex flex-col">
        <div className="flex bg-card border-b border-x-2 items-center">
          <span className="w-12 text-center text-sm text-muted-foreground">Hora</span>
          <div
              key={date.toString()}
              className='my-2 text-center flex-1 gap-1 text-sm text-muted-foreground flex items-center justify-center'
            >
              <span className={cn('', isToday(date) && 'text-primary font-semibold')}>
                {capitalize(format(date, "EEEE, dd/MM", { locale: es }))}
              </span>
            </div>
        </div>
        <div className='flex border-x-2 border-b-2'>
          <TimeTable />
          <div className="flex-1">
            {hours.map(hour => (
              <EventGroup key={hour.toString()} hour={hour} events={events} />
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

const CalendarWeekView = () => {
  const { view, date, events } = useCalendar();

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const weekDates = [];

    for (let i = 1; i < 6; i++) {
      const day = addDays(start, i);
      const hours = [...Array(24)].map((_, i) => setHours(day, i));
      weekDates.push(hours);
    }

    return weekDates;
  }, [date]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 1; i < 6; i++) {
      const result = addDays(startOfWeek(date, { weekStartsOn: 0 }), i);
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date]);

  if (view !== 'week') return null;

  return (
    <TabsContent value="week">
      <div className="flex flex-col">
        <div className="flex bg-card border-b border-x-2 items-center">
          <span className="w-12 text-center text-sm text-muted-foreground">Hora</span>
          {headerDays.map(date => (
            <div
              key={date.toString()}
              className='my-2 text-center flex-1 gap-1 text-sm text-muted-foreground flex items-center justify-center'
            >
              <span className={cn('', isToday(date) && 'text-primary font-semibold')}>
                {capitalize(format(date, "EEEE, dd/MM", { locale: es }))}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-1 border-x-2 border-b-2">
          <div className="w-fit">
            <TimeTable />
          </div>
          <div className="grid grid-cols-5 flex-1">
            {weekDates.map(hours => {
              return (
                <div
                  className='h-full text-sm text-muted-foreground border-l first:border-l-0'
                  key={hours[0].toString()}
                >
                  {hours.map(hour => (
                    <EventGroup
                      key={hour.toString()}
                      hour={hour}
                      events={events}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

const CalendarMonthView = () => {
  const { date, view, events } = useCalendar();

  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(), []);

  if (view !== 'month') return null;

  return (
    <TabsContent value="month">
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-7 gap-px border-x-2">
          {weekDays.map((day, i) => (
            <div
              key={day}
              className={cn(
                'my-2 text-center text-sm text-muted-foreground ',
                [0, 6].includes(i) && 'text-muted-foreground/50'
              )}
            >
              {day.at(0)}
            </div>
          ))}
        </div>
        <div className="grid flex-1 auto-rows-fr p-px grid-cols-7 gap-px">
          {monthDates.map(d => {
            const currentEvents = events.filter(event => isSameDay(event.start, d));

            return (
              <div
                className={cn(
                  'p-2 ring-1 text-sm ring-border flex flex-col gap-1',
                  !isSameMonth(date, d) && 'text-muted-foreground/50'
                )}
                key={d.toString()}
              >
                <div className="flex justify-center">
                  <span
                    className={cn(
                      'size-6 grid place-items-center text-xs rounded-full mb-1 sticky top-0',
                      isToday(d) && 'font-semibold text-primary'
                    )}
                  >
                    {format(d, 'd')}
                  </span>
                </div>

                {currentEvents.map(event => {
                  return (
                    <div
                      key={event.id}
                      className={cn("relative px-1 rounded text-sm flex items-center gap-1 text-white bg-blue-500")}
                    >
                      <span className="flex-1 truncate">{event.title}</span>
                      <span className='absolute right-1'>+2</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

    </TabsContent>
  );
};

const CalendarNextTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const next = useCallback(() => {
    if (view === 'day') {
      setDate(addDays(date, 1));
    } else if (view === 'week') {
      setDate(addWeeks(date, 1));
    } else if (view === 'month') {
      setDate(addMonths(date, 1));
    } else if (view === 'year') {
      setDate(addYears(date, 1));
    }
  }, [date, view, setDate]);

  useHotkeys('ArrowRight', () => next(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        next();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarNextTrigger.displayName = 'CalendarNextTrigger';

const CalendarDatePickerTrigger = () => {
  const { date, setDate } = useCalendar();

  const formattedDate = date ? capitalize(format(date, 'dd/MM/yyyy', { locale: es })) : <span></span>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-60 justify-between font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {formattedDate}
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarBtn
          locale={es}
          mode="single"
          selected={date}
          onSelect={(d: Date | undefined) => d ? setDate(d) : null}
          initialFocus
          disabled={(date) => date.getDay() === 0 || date.getDay() === 6}
        />
      </PopoverContent>
    </Popover>
  )
}

const CalendarPrevTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  useHotkeys('ArrowLeft', () => prev(), {
    enabled: enableHotkeys,
  });

  const prev = useCallback(() => {
    if (view === 'day') {
      setDate(subDays(date, 1));
    } else if (view === 'week') {
      setDate(subWeeks(date, 1));
    } else if (view === 'month') {
      setDate(subMonths(date, 1));
    } else if (view === 'year') {
      setDate(subYears(date, 1));
    }
  }, [date, view, setDate]);

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        prev();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarPrevTrigger.displayName = 'CalendarPrevTrigger';

const CalendarTodayTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, enableHotkeys, today } = useCalendar();

  useHotkeys('t', () => jumpToToday(), {
    enabled: enableHotkeys,
  });

  const jumpToToday = useCallback(() => {
    setDate(today);
  }, [today, setDate]);

  return (
    <Button
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        jumpToToday();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarTodayTrigger.displayName = 'CalendarTodayTrigger';

const CalendarCurrentDate = () => {
  const { date, view } = useCalendar();

  return (
    <time dateTime={date.toLocaleDateString()} className="tabular-nums">
      {format(date, view === 'day' ? 'dd MMMM yyyy' : 'MMMM yyyy')}
    </time>
  );
};

const TimeTable = () => {
  return (
    <div className="w-12 border-r">
      {Array.from(Array(24).keys()).map((hour) => {
        return (
          <div
            className="text-right text-xs text-muted-foreground/50 h-20 flex items-center justify-center border-b"
            key={hour}
          >
            <p className="">
              {hour === 24 ? 0 : hour}:00hs
            </p>
          </div>
        );
      })}
    </div>
  );
};

const getDaysInMonth = (date: Date) => {
  const startOfMonthDate = startOfMonth(date);
  const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
    weekStartsOn: 0,
  });

  let currentDate = startOfWeekForMonth;
  const calendar = [];

  while (calendar.length < 42) {
    calendar.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return calendar;
};

const generateWeekdays = () => {
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i);
    daysOfWeek.push(format(date, 'EEEEEE', { locale: es }).toLocaleUpperCase());
  }
  return daysOfWeek;
};

export {
  Calendar,
  CalendarCurrentDate,
  ActualMonthView,
  CalendarNoView,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarDatePickerTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView
};