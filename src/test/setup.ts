import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import i18n from "@/i18n";

i18n.changeLanguage("vi");

Object.defineProperty(window, "scrollTo", { value: () => undefined, writable: true });

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}));
vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

// JSDOM does not implement ResizeObserver. Components that size their SVG
// charts from their container use it on mount, so provide the browser API's
// lifecycle surface for every test rather than duplicating mocks per suite.
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);
