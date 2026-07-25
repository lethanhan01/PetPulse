import type { CareEvent } from "@/types/app.types";

export type CalendarDay = { date: string; day: number } | null;

function parts(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

export function formatLocalDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function todayLocalDate(now = new Date()) {
  return formatLocalDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function monthCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const leadingDays = (firstDay + 6) % 7; // Monday is the first column.
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: CalendarDay[] = [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => ({
      day: index + 1,
      date: formatLocalDate(year, month, index + 1),
    })),
  ];

  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function daysBetween(start: string, end: string) {
  const a = parts(start);
  const b = parts(end);
  return Math.round((Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day)) / 86_400_000);
}

export function eventOccursOn(event: CareEvent, date: string) {
  const difference = daysBetween(event.date, date);
  if (difference < 0) return false;
  if (event.repeat === "Hằng ngày") return true;
  if (event.repeat === "Hằng tuần") return difference % 7 === 0;
  return difference === 0;
}

export function eventsForDate(events: CareEvent[], date: string) {
  return events.filter(event => eventOccursOn(event, date) && !isEventCancelledOn(event, date));
}

export function isEventCancelledOn(event: CareEvent, date: string) {
  return event.repeat !== "Không lặp" && event.cancelledDates?.includes(date) === true;
}

export function cancelEventOccurrence(event: CareEvent, date: string): CareEvent {
  if (event.repeat === "Không lặp") return event;
  return { ...event, cancelledDates: [...new Set([...(event.cancelledDates ?? []), date])].sort() };
}

export function isEventCompletedOn(event: CareEvent, date: string, today = todayLocalDate()) {
  if (event.repeat === "Không lặp") return event.done;
  if (event.completedDates) return event.completedDates.includes(date);
  // Compatibility with the old event-wide `done` flag: treat it as today's completion only.
  return event.done && date === today && eventOccursOn(event, date);
}

export function toggleEventCompletion(event: CareEvent, date: string, today = todayLocalDate()): CareEvent {
  if (event.repeat === "Không lặp") return { ...event, done: !event.done };

  const completedDates = new Set(event.completedDates ?? []);
  if (!event.completedDates && event.done && eventOccursOn(event, today)) completedDates.add(today);
  if (completedDates.has(date)) completedDates.delete(date);
  else completedDates.add(date);

  return { ...event, done: false, completedDates: [...completedDates].sort() };
}
