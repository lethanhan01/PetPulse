import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.history.replaceState({}, "", "/");
});

describe("App", () => {
  it("renders the public landing page", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /hộ chiếu sức khỏe/i })).toBeInTheDocument();
  });

  it("shows 403 when a guest opens a protected URL", () => {
    window.history.replaceState({}, "", "/dashboard");
    render(<App />);

    expect(screen.getByText(/bạn không có quyền truy cập/i)).toBeInTheDocument();
  });

  it("shows 404 for an unknown URL", () => {
    window.history.replaceState({}, "", "/khong-ton-tai");
    render(<App />);

    expect(screen.getByText(/không tìm thấy trang/i)).toBeInTheDocument();
  });

  it("does not treat the scroll result as an effect cleanup function", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => ({ invalid: true }));
    const { unmount } = render(<App />);

    expect(() => unmount()).not.toThrow();

    scrollTo.mockRestore();
  });
});
