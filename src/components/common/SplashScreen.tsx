import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClick = () => {
    if (isExiting) return;
    setIsExiting(true);
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
        className="absolute top-1/2 left-1/2 min-w-[100vh] min-h-[100vw] -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover pointer-events-none"
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
