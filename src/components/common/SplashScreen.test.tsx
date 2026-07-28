import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SplashScreen } from "./SplashScreen";

type MockAudio = Pick<HTMLAudioElement, "loop" | "preload" | "volume" | "pause" | "play" | "removeAttribute" | "load">;

function createAudio(play: () => Promise<void>): MockAudio {
  return {
    loop: false,
    preload: "",
    volume: 1,
    play: vi.fn(play),
    pause: vi.fn(),
    removeAttribute: vi.fn(),
    load: vi.fn(),
  };
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("SplashScreen audio", () => {
  it("preloads and fades out audio when autoplay succeeds", () => {
    vi.useFakeTimers();
    const audio = createAudio(() => Promise.resolve());
    vi.spyOn(window, "Audio").mockImplementation(() => audio as HTMLAudioElement);
    const onComplete = vi.fn();

    render(<SplashScreen onComplete={onComplete} />);

    expect(audio.preload).toBe("auto");
    expect(audio.loop).toBe(true);
    expect(audio.play).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByTestId("splash-screen"));
    vi.advanceTimersByTime(800);

    expect(audio.volume).toBe(0);
    expect(audio.pause).toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("keeps splash usable when browser rejects autoplay", async () => {
    const blocked = new DOMException("User gesture is required", "NotAllowedError");
    const audio = createAudio(() => Promise.reject(blocked));
    vi.spyOn(window, "Audio").mockImplementation(() => audio as HTMLAudioElement);
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const onComplete = vi.fn();

    render(<SplashScreen onComplete={onComplete} />);

    await vi.waitFor(() => {
      expect(screen.getByTestId("splash-screen")).toHaveAttribute("data-audio-status", "unavailable");
    });
    expect(warning).toHaveBeenCalledWith("Splash audio could not autoplay:", "NotAllowedError: User gesture is required");

    fireEvent.click(screen.getByTestId("splash-screen"));
    expect(onComplete).not.toHaveBeenCalled();
  });
});
