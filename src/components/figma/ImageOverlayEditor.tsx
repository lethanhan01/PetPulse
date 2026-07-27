import { forwardRef, useRef, useState, useCallback, useImperativeHandle, useEffect } from "react";
import { Type, X, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Overlay {
  id: string; text: string; x: number; y: number; color: string; fontSize: number;
}

const COLORS = ["rgb(255, 255, 255)", "rgb(0, 0, 0)", "rgb(255, 59, 48)", "rgb(0, 122, 255)", "rgb(52, 199, 89)", "rgb(255, 149, 0)", "rgb(175, 82, 222)"];

export type OverlayEditorHandle = { renderDataUrl: () => Promise<string>; getOverlays: () => Overlay[] };

export const ImageOverlayEditor = forwardRef<OverlayEditorHandle, {
  imageUrl: string; aspectRatio?: number; className?: string;
}>(({ imageUrl, aspectRatio, className = "" }, ref) => {
  const { t } = useTranslation();
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [containerW, setContainerW] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);
  const uidRef = useRef(0);
  const activeListeners = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) setContainerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => { ro.disconnect(); if (activeListeners.current) activeListeners.current(); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId || editingId) return;
      const active = overlays.find(o => o.id === selectedId);
      if (!active) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        remove(selectedId);
        return;
      }
      const step = e.shiftKey ? 5 : 1;
      if (e.key === "ArrowUp") { e.preventDefault(); update(selectedId, { y: Math.max(0, active.y - step) }); }
      if (e.key === "ArrowDown") { e.preventDefault(); update(selectedId, { y: Math.min(100, active.y + step) }); }
      if (e.key === "ArrowLeft") { e.preventDefault(); update(selectedId, { x: Math.max(0, active.x - step) }); }
      if (e.key === "ArrowRight") { e.preventDefault(); update(selectedId, { x: Math.min(100, active.x + step) }); }
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, editingId, overlays]);

  const addOverlay = () => {
    const id = `ov-${++uidRef.current}`;
    setOverlays(p => [...p, { id, text: t("community.composer.overlayDefault"), x: 50, y: 50, color: "rgb(255, 255, 255)", fontSize: 36 }]);
    setEditingId(id); setEditText(t("community.composer.overlayDefault")); setSelectedId(id);
  };

  const update = (id: string, patch: Partial<Overlay>) =>
    setOverlays(p => p.map(o => o.id === id ? { ...o, ...patch } : o));

  const remove = (id: string) => {
    setOverlays(p => p.filter(o => o.id !== id));
    if (editingId === id) setEditingId(null);
    if (selectedId === id) setSelectedId(null);
  };

  const startDrag = (e: React.MouseEvent, o: Overlay) => {
    if (editingId === o.id) return;
    e.stopPropagation();
    setSelectedId(o.id); setEditingId(null);
    const sx = e.clientX, sy = e.clientY, ox = o.x, oy = o.y;
    const onMove = (me: MouseEvent) => update(o.id, {
      x: Math.max(0, Math.min(100, ox + (me.clientX - sx) * 0.12)),
      y: Math.max(0, Math.min(100, oy + (me.clientY - sy) * 0.12)),
    });
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      if (activeListeners.current === cleanup) activeListeners.current = null;
    };
    const cleanup = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    activeListeners.current = cleanup;
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleWheel = (e: React.WheelEvent, o: Overlay) => {
    if (editingId === o.id) return;
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 4 : -4;
    update(o.id, { fontSize: Math.max(12, Math.min(120, o.fontSize + delta)) });
  };

  const startEdit = (o: Overlay) => {
    if (activeListeners.current) { activeListeners.current(); activeListeners.current = null; }
    setEditingId(o.id); setEditText(o.text); setSelectedId(o.id);
  };

  const confirmEdit = (id: string) => {
    update(id, { text: editText.trim() || t("community.composer.overlayDefault") });
    setEditingId(null);
  };

  const renderDataUrl = useCallback(async (): Promise<string> => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = reject; img.src = imageUrl; });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const displayW = containerRef.current?.offsetWidth ?? img.naturalWidth;
    const scale = img.naturalWidth / displayW;
    overlays.forEach(o => {
      const px = (o.x / 100) * canvas.width;
      const py = (o.y / 100) * canvas.height;
      const fs = Math.round(o.fontSize * scale);
      ctx.font = `bold ${fs}px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = Math.max(2, fs * 0.08);
      ctx.fillStyle = o.color;
      ctx.fillText(o.text, px, py);
      ctx.shadowBlur = 0;
    });
    return canvas.toDataURL("image/jpeg", 0.9);
  }, [imageUrl, overlays]);

  useImperativeHandle(ref, () => ({ renderDataUrl, getOverlays: () => overlays }), [renderDataUrl, overlays]);

  const active = selectedId ? overlays.find(o => o.id === selectedId) : null;
  const fontSizeScale = containerW / 300;

  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    if (!sliding || !active) return;
    const onMove = (e: MouseEvent) => {
      const rect = sliderRef.current?.getBoundingClientRect();
      if (!rect) return;
      const frac = 1 - (e.clientY - rect.top) / rect.height;
      update(active.id, { fontSize: Math.round(Math.max(12, Math.min(120, 12 + frac * (120 - 12)))) });
    };
    const onUp = () => setSliding(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [sliding, active]);

  return (
    <div className={className}>
      <div ref={containerRef} className="relative w-full mx-auto rounded-xl overflow-hidden bg-black/5"
        style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : {}}>
        <img src={imageUrl} alt="" className="w-full h-full object-contain pointer-events-none select-none" draggable={false} />
        {overlays.map(o => (
          <div key={o.id}
            onMouseDown={e => startDrag(e, o)}
            onWheel={e => handleWheel(e, o)}
            onClick={() => { if (editingId !== o.id) startEdit(o); }}
            className={`absolute cursor-move select-none px-1.5 py-0.5 rounded transition-shadow ${selectedId === o.id && editingId !== o.id ? "ring-2 ring-white/50" : ""}`}
            style={{
              left: `${o.x}%`, top: `${o.y}%`, transform: "translate(-50%, -50%)",
              color: o.color, fontSize: `${Math.round(o.fontSize * fontSizeScale)}px`,
              textShadow: "0 1px 6px rgba(0,0,0,0.6), 0 0 3px rgba(0,0,0,0.4)",
            }}>
            {editingId === o.id ? (
              <input autoFocus value={editText} onChange={e => setEditText(e.target.value)}
                onBlur={() => confirmEdit(o.id)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); e.currentTarget.blur(); } }}
                className="bg-transparent border-b-2 border-white/50 outline-none text-center font-bold min-w-[40px]"
                style={{ width: `${Math.max(40, editText.length * 14)}px` }} />
            ) : (
              <span className="font-bold whitespace-nowrap">{o.text}
                {selectedId === o.id && (
                  <button type="button" onClick={e => { e.stopPropagation(); startEdit(o); }}
                    className="inline-flex ml-1.5 align-middle p-0.5 rounded bg-white/20 hover:bg-white/30">
                    <Pencil size={10} />
                  </button>
                )}
              </span>
            )}
          </div>
        ))}
        {overlays.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white/30 text-xs">{t("community.composer.overlayHint")}</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-2 px-3">
          <button type="button" onClick={addOverlay} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
            <Type size={14} /> {t("community.composer.addText")}
          </button>
        </div>

        {active && (
          <div className="absolute top-2 right-2 z-10 flex flex-col items-center gap-1.5">
            <button type="button" onClick={() => remove(active.id)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white/70 hover:text-destructive hover:bg-black/70 transition-colors shadow">
              <X size={14} />
            </button>
            <div className="flex flex-col gap-1 bg-black/50 rounded-lg p-1.5 shadow">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => update(active.id, { color: c })}
                  className={`w-5 h-5 rounded-full border ${active.color === c ? "border-white ring-1 ring-white/50 scale-110" : "border-white/30"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="bg-black/50 rounded-lg px-2 py-1.5 flex flex-col items-center gap-1 shadow select-none">
              <div ref={sliderRef} onMouseDown={() => setSliding(true)}
                className="relative w-5 h-20 cursor-pointer">
                <div className="absolute inset-x-0 bottom-0 mx-auto w-1 bg-white/20 rounded-full" />
                <div className="absolute inset-x-0 bottom-0 mx-auto w-1 bg-white/60 rounded-full transition-all"
                  style={{ height: `${((active.fontSize - 12) / (120 - 12)) * 100}%` }} />
                <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-all"
                  style={{ bottom: `${((active.fontSize - 12) / (120 - 12)) * 100}%`, marginBottom: -7 }} />
              </div>
              <span className="text-[10px] text-white/70 font-medium">{active.fontSize}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
