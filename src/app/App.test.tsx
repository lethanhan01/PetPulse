import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the public landing page", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /hộ chiếu sức khỏe/i })).toBeInTheDocument();
  });
});
