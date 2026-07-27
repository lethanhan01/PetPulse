import { type ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  start?: boolean;
};

export function AnimateIn({ children, delay = 0, duration = 800, once = true, className = "", start = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !start) return;
    let disposed = false;
    const frame = requestAnimationFrame(() => {
      if (disposed) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
      if (disposed) observer.disconnect();
    });
    return () => { disposed = true; cancelAnimationFrame(frame); };
  }, [once, start]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
