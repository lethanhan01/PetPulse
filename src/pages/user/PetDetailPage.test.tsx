import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { AppProvider } from "@/stores/app.store";
import { PetDetail } from "./PetDetailPage";

function renderCalendar() {
  localStorage.setItem("petpulse:app-state", JSON.stringify({
    theme: "light", role: "user", plan: "Free", authed: true, activeAccountId: "U-1001",
  }));
  return render(
    <AppProvider>
      <MemoryRouter initialEntries={["/pets/PET-2026-001001?tab=calendar"]}>
        <Routes><Route path="/pets/:petId" element={<PetDetail />} /></Routes>
      </MemoryRouter>
    </AppProvider>,
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
});

describe("PetDetail care calendar", () => {
  it("renders a Monday-first month and navigates between months", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 25, 12));
    renderCalendar();

    expect(screen.getByRole("heading", { name: "Tháng 7 năm 2026" })).toBeInTheDocument();
    ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].forEach(day => expect(screen.getByText(day)).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Tháng sau" }));
    expect(screen.getByRole("heading", { name: "Tháng 8 năm 2026" })).toBeInTheDocument();
  });

  it("opens an event popover and updates its completion state", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 25, 12));
    renderCalendar();

    fireEvent.click(screen.getByRole("button", { name: "Xem sự kiện Uống thuốc giun ngày 2026-07-25" }));
    expect(screen.getByText("Hằng tuần")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hoàn thành" }));
    expect(screen.getByRole("button", { name: "Khôi phục" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Tháng sau" }));
    fireEvent.click(screen.getByRole("button", { name: "Xem sự kiện Uống thuốc giun ngày 2026-08-01" }));
    expect(screen.getByRole("button", { name: "Hoàn thành" })).toBeInTheDocument();
  });

  it("offers cancellation choices for a recurring event and hides only that occurrence", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 25, 12));
    renderCalendar();

    fireEvent.click(screen.getByRole("button", { name: "Xem sự kiện Uống thuốc giun ngày 2026-07-25" }));
    fireEvent.click(screen.getByRole("button", { name: "Hủy sự kiện Uống thuốc giun" }));
    expect(screen.getByRole("heading", { name: "Hủy sự kiện lặp lại" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hủy sự kiện ngày 2026-07-25" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hủy tất cả sự kiện lặp lại" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hủy sự kiện ngày 2026-07-25" }));
    expect(screen.queryByRole("button", { name: "Xem sự kiện Uống thuốc giun ngày 2026-07-25" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tháng sau" }));
    expect(screen.getByRole("button", { name: "Xem sự kiện Uống thuốc giun ngày 2026-08-01" })).toBeInTheDocument();
  });
});
