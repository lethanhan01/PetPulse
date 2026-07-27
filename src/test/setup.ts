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
