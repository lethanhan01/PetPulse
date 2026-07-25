import { describe, expect, it } from "vitest";
import type { CareEvent } from "@/types/app.types";
import { cancelEventOccurrence, eventOccursOn, eventsForDate, isEventCompletedOn, monthCalendarDays, toggleEventCompletion } from "./care-calendar";

const event = (repeat: CareEvent["repeat"], date = "2026-07-10"): CareEvent => ({
  id: repeat, title: "Sự kiện", date, time: "08:00", repeat, type: "Khám", done: false,
});

describe("care calendar", () => {
  it("builds a Monday-first calendar and pads the final week", () => {
    const days = monthCalendarDays(2026, 7);
    expect(days).toHaveLength(35);
    expect(days.slice(0, 2)).toEqual([null, null]);
    expect(days[2]).toEqual({ day: 1, date: "2026-07-01" });
    expect(days.at(-1)).toBeNull();
  });

  it("matches one-time, daily, and weekly events without showing dates before their start", () => {
    expect(eventOccursOn(event("Không lặp"), "2026-07-10")).toBe(true);
    expect(eventOccursOn(event("Không lặp"), "2026-07-11")).toBe(false);
    expect(eventOccursOn(event("Hằng ngày"), "2026-07-12")).toBe(true);
    expect(eventOccursOn(event("Hằng ngày"), "2026-07-09")).toBe(false);
    expect(eventOccursOn(event("Hằng tuần"), "2026-07-17")).toBe(true);
    expect(eventOccursOn(event("Hằng tuần"), "2026-07-16")).toBe(false);
  });

  it("returns every event occurring on a date", () => {
    expect(eventsForDate([event("Không lặp"), event("Hằng ngày")], "2026-07-10")).toHaveLength(2);
  });

  it("completes only the selected daily or weekly occurrence", () => {
    const daily = toggleEventCompletion(event("Hằng ngày"), "2026-07-12", "2026-07-12");
    expect(isEventCompletedOn(daily, "2026-07-12", "2026-07-12")).toBe(true);
    expect(isEventCompletedOn(daily, "2026-07-13", "2026-07-13")).toBe(false);

    const weekly = toggleEventCompletion(event("Hằng tuần"), "2026-07-17", "2026-07-17");
    expect(isEventCompletedOn(weekly, "2026-07-17", "2026-07-17")).toBe(true);
    expect(isEventCompletedOn(weekly, "2026-07-24", "2026-07-24")).toBe(false);
    expect(isEventCompletedOn(toggleEventCompletion(weekly, "2026-07-17", "2026-07-17"), "2026-07-17", "2026-07-17")).toBe(false);
  });

  it("treats a legacy completed repeating event as completed today only", () => {
    const legacy = { ...event("Hằng ngày"), done: true };
    expect(isEventCompletedOn(legacy, "2026-07-12", "2026-07-12")).toBe(true);
    expect(isEventCompletedOn(legacy, "2026-07-13", "2026-07-12")).toBe(false);
  });

  it("hides only a cancelled recurring occurrence", () => {
    const weekly = cancelEventOccurrence(event("Hằng tuần"), "2026-07-17");
    expect(eventsForDate([weekly], "2026-07-17")).toHaveLength(0);
    expect(eventsForDate([weekly], "2026-07-24")).toHaveLength(1);
  });
});
