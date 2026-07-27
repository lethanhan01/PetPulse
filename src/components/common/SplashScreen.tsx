import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Initialize and play audio
    const audio = new Audio('/water.wav');
    audio.loop = true;
    audioRef.current = audio;
    
    // Play with catch for autoplay policy
    audio.play().catch(error => {
      console.warn("Autoplay blocked by browser policy:", error);
    });

    return () => {
      document.body.style.overflow = "auto";
      // Cleanup audio
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleClick = () => {
    if (isExiting) return;
    setIsExiting(true);

    // Fade out audio over 800ms
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeDuration = 800; // ms
      const fadeSteps = 20;
      const fadeInterval = fadeDuration / fadeSteps;
      const volumeStep = audio.volume / fadeSteps;

      const fadeTimer = setInterval(() => {
        if (audio.volume > volumeStep) {
          audio.volume -= volumeStep;
        } else {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeTimer);
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
    >
      <video
        src="/meoboi.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-[100vh] min-h-[100vw] -translate-x-1/2 -translate-y-1/2 rotate-90 scale-[1.15] object-cover pointer-events-none"
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
