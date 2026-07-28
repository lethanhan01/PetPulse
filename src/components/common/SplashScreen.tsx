import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const audio = new Audio('/water.wav');
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 1;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        setAudioUnavailable(true);
        const reason = error instanceof DOMException ? `${error.name}: ${error.message}` : error;
        console.warn("Splash audio could not autoplay:", reason);
      });
    }

    return () => {
      document.body.style.overflow = "auto";
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  const handleClick = () => {
    if (isExiting) return;
    setIsExiting(true);

    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeDuration = 800;
      const fadeSteps = 20;
      const fadeInterval = fadeDuration / fadeSteps;
      const volumeStep = audio.volume / fadeSteps;

      fadeTimerRef.current = setInterval(() => {
        if (audio.volume > volumeStep) {
          audio.volume -= volumeStep;
        } else {
          audio.volume = 0;
          audio.pause();
          if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }
      }, fadeInterval);
    }

    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-start pt-[10vh] cursor-pointer overflow-hidden transition-all duration-[800ms] ease-in-out ${isExiting ? 'opacity-0 scale-[1.15]' : 'opacity-100 scale-100'}`}
      style={{ background: "var(--gradient-page)" }}
      onClick={handleClick}
      data-testid="splash-screen"
      data-audio-status={audioUnavailable ? "unavailable" : "playing-or-pending"}
      aria-label={audioUnavailable ? "Màn hình chào, âm thanh không thể tự phát" : "Màn hình chào"}
    >
      <video
        src="/meoboi.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-[100vh] min-h-[100vw] -translate-x-1/2 -translate-y-1/2 rotate-90 scale-[1.15] md:scale-100 object-cover pointer-events-none"
      />

      {/* Gradient overlay to blend with landing page */}
      <div 
        className="absolute inset-0 pointer-events-none z-[5]" 
        style={{ background: "var(--gradient-page)", opacity: 0.25 }} 
      />

      <div className="relative z-10 p-4 mix-blend-overlay">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center tracking-tight">
          PetPulse
        </h1>
      </div>
      <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/90 animate-pulse text-sm md:text-base font-medium whitespace-nowrap drop-shadow-lg z-10 pointer-events-none">
        {t('home.splash.hint', 'Nhấp vào bất kỳ đâu để tiếp tục')}
      </p>
    </div>
  );
}
