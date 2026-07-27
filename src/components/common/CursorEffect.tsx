import { useEffect, useState, useRef } from "react";
import { PawPrint } from "lucide-react";
import { useApp } from "@/stores/app.store";
import { motion, AnimatePresence } from "motion/react";

type Footprint = {
  id: number;
  x: number;
  y: number;
  rotation: number;
};

export function CursorEffect() {
  const { cursorEffectEnabled } = useApp();
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const footprintId = useRef(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!cursorEffectEnabled) {
      setFootprints([]); // Clear existing
      return;
    }

    // Disable on touch devices
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };

      if (lastPos.current) {
        const dx = currentPos.x - lastPos.current.x;
        const dy = currentPos.y - lastPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Add a new footprint every 40 pixels
        if (distance > 40) {
          const rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          
          const newFootprint: Footprint = {
            id: footprintId.current++,
            x: currentPos.x,
            y: currentPos.y,
            rotation,
          };

          setFootprints((prev) => [...prev, newFootprint]);
          lastPos.current = currentPos;

          // Remove the footprint after 1.5 seconds
          setTimeout(() => {
            setFootprints((prev) => prev.filter((f) => f.id !== newFootprint.id));
          }, 1500);
        }
      } else {
        lastPos.current = currentPos;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorEffectEnabled]);

  if (!cursorEffectEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {footprints.map((footprint) => (
          <motion.div
            key={footprint.id}
            initial={{ opacity: 0.6, scale: 0.5 }}
            animate={{ opacity: 0.2, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute text-primary"
            style={{
              left: footprint.x,
              top: footprint.y,
              transform: `translate(-50%, -50%) rotate(${footprint.rotation}deg)`,
            }}
          >
            <PawPrint size={20} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
