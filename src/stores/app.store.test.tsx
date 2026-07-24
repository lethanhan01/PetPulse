import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AppProvider, useApp } from "./app.store";

function Probe() {
  const { activeAccount, authed, pets, theme } = useApp();
  return <output>{`${authed}:${theme}:${activeAccount?.name}:${pets.length}`}</output>;
}

afterEach(() => localStorage.clear());

describe("AppProvider mock reset", () => {
  it("keeps session preferences but always reloads the seed pets", () => {
    localStorage.setItem("petpulse:app-state", JSON.stringify({
      theme: "dark", role: "user", plan: "Premium", authed: true, activeAccountId: "U-1001", pets: [],
    }));
    render(<AppProvider><Probe /></AppProvider>);
    expect(screen.getByText("true:dark:Nguyễn Văn An:10")).toBeInTheDocument();
  });
});
