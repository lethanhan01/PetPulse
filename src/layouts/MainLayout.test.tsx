import { cleanup, createEvent, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "@/App";

const APP_STATE_KEY = "petpulse:app-state";
const SIDEBAR_SETTINGS_KEY = "petpulse.sidebar";

function renderDashboard(sidebarSettings?: unknown) {
  localStorage.setItem(APP_STATE_KEY, JSON.stringify({
    theme: "light", role: "user", plan: "Free", authed: true, activeAccountId: "U-1001",
  }));
  if (sidebarSettings !== undefined) localStorage.setItem(SIDEBAR_SETTINGS_KEY, JSON.stringify(sidebarSettings));
  window.history.replaceState({}, "", "/dashboard");
  return render(<App />);
}

describe("MainLayout sidebar", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(HTMLElement.prototype, "setPointerCapture", { configurable: true, value: () => undefined });
  });
  afterEach(() => {
    cleanup();
    localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  it("collapses to icon mode and persists the preference", async () => {
    renderDashboard();

    fireEvent.click(screen.getByRole("button", { name: "Thu gọn sidebar" }));

    expect(screen.getByRole("button", { name: "Mở rộng sidebar" })).toBeInTheDocument();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(SIDEBAR_SETTINGS_KEY) ?? "{}")).toMatchObject({ collapsed: true, width: 256 }));
  });

  it("keeps every navigation icon visible and linked when collapsed", () => {
    renderDashboard({ collapsed: true, width: 256 });
    const desktopSidebar = screen.getByTestId("desktop-sidebar");
    const links = within(desktopSidebar).getAllByRole("link");

    expect(links).toHaveLength(6);
    links.forEach(link => {
      const icon = within(link).getByTestId("sidebar-nav-icon");
      expect(icon).not.toHaveClass("hidden");
      expect(icon.querySelector("svg")).toBeInTheDocument();
      expect(link).toHaveAttribute("href");
    });
    expect(within(desktopSidebar).getByRole("link", { name: "Dashboard" })).toHaveClass("bg-primary");
  });

  it("renders independent desktop and mobile sidebar surfaces", () => {
    renderDashboard();
    const desktopSidebar = screen.getByTestId("desktop-sidebar");
    const mobileSidebar = screen.getByTestId("mobile-sidebar");

    expect(desktopSidebar).not.toHaveClass("-translate-x-full");
    expect(within(desktopSidebar).getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(mobileSidebar).toHaveClass("-translate-x-full");

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(mobileSidebar).toHaveClass("translate-x-0");
  });

  it("uses valid saved settings and resizes from the keyboard within limits", async () => {
    renderDashboard({ collapsed: false, width: 320 });
    const handle = screen.getByRole("separator", { name: "Điều chỉnh độ rộng sidebar" });

    expect(handle).toHaveAttribute("aria-valuenow", "320");
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(handle).toHaveAttribute("aria-valuenow", "336");
    fireEvent.keyDown(handle, { key: "End" });
    expect(handle).toHaveAttribute("aria-valuenow", "384");
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(handle).toHaveAttribute("aria-valuenow", "384");

    await waitFor(() => expect(JSON.parse(localStorage.getItem(SIDEBAR_SETTINGS_KEY) ?? "{}")).toMatchObject({ width: 384 }));
  });

  it("falls back to the default width when saved sidebar settings are invalid", () => {
    renderDashboard({ collapsed: "yes", width: 999 });

    expect(screen.getByRole("separator", { name: "Điều chỉnh độ rộng sidebar" })).toHaveAttribute("aria-valuenow", "256");
  });

  it("resizes by dragging and resets to the default width on double click", () => {
    renderDashboard({ collapsed: false, width: 320 });
    const handle = screen.getByRole("separator", { name: "Điều chỉnh độ rộng sidebar" });

    const pointerDown = createEvent.pointerDown(handle, { pointerId: 1 });
    Object.defineProperty(pointerDown, "clientX", { value: 300 });
    fireEvent(handle, pointerDown);
    const pointerMove = createEvent.pointerMove(handle, { pointerId: 1 });
    Object.defineProperty(pointerMove, "clientX", { value: 360 });
    fireEvent(handle, pointerMove);
    expect(handle).toHaveAttribute("aria-valuenow", "380");
    fireEvent.pointerUp(handle, { pointerId: 1 });
    fireEvent.doubleClick(handle);
    expect(handle).toHaveAttribute("aria-valuenow", "256");
  });
});
