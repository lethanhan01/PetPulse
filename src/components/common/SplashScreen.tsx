import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-start pt-[10vh] bg-black cursor-pointer overflow-hidden"
      onClick={onComplete}
    >
      <video
        src="/meoboi.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-w-[100vh] min-h-[100vw] -translate-x-1/2 -translate-y-1/2 rotate-90 object-cover pointer-events-none"
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
