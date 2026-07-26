import { ReactNode, useState, ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { useNavigate, useLocation } from "react-router";
import { Loader2 } from "lucide-react";

// ── Logo ──
export function Logo({ size = 28 }: { size?: number }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const handleClick = () => {
    if (pathname === "/") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    nav(pathname.startsWith("/admin") ? "/admin" : "/dashboard");
  };
  return (
    <button onClick={handleClick} className="flex items-center gap-2.5 border border-border rounded-xl px-3 py-1.5 cursor-pointer">
      <div className="rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30"
        style={{ width: size, height: size }}>
        <span style={{ fontSize: size * 0.65 }}>🐾</span>
      </div>
      <span className="font-heading font-bold text-primary" style={{ fontSize: size * 0.6 }}>PetPulse</span>
    </button>
  );
}

// ── Button ──
type BtnVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type BtnSize = "sm" | "md" | "lg";
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant; size?: BtnSize; icon?: ReactNode; iconRight?: boolean; loading?: boolean; block?: boolean;
}
export function Btn({ variant = "primary", size = "md", icon, iconRight, loading, block, children, className = "", disabled, ...rest }: BtnProps) {
  const sizes: Record<BtnSize, string> = {
    sm: "text-sm px-3 py-1.5 gap-1.5", md: "text-sm px-4 py-2.5 gap-2", lg: "text-base px-6 py-3 gap-2",
  };
  const variants: Record<BtnVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/25",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-80",
    outline: "border border-border text-foreground hover:bg-secondary",
    ghost: "text-foreground hover:bg-secondary",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  };
  return (
    <button disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${sizes[size]} ${variants[variant]} ${block ? "w-full" : ""} ${className}`}
      {...rest}>
      {loading && <Loader2 size={15} className="animate-spin" />}
      {icon && !iconRight && !loading && icon}
      {children}
      {icon && iconRight && icon}
    </button>
  );
}

// ── Badge ──
type BadgeV = "success" | "warning" | "danger" | "info" | "primary" | "neutral";
export function Badge({ v = "primary", children }: { v?: BadgeV; children: ReactNode }) {
  const map: Record<BadgeV, string> = {
    success: "bg-success-surface text-success-foreground border-success-border",
    warning: "bg-warning-surface text-warning-foreground border-warning-border",
    danger: "bg-destructive/10 text-destructive border-destructive/25",
    info: "bg-info-surface text-info-foreground border-info-border",
    primary: "bg-primary/10 text-primary border-primary/25",
    neutral: "bg-muted text-muted-foreground border-border",
  };
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${map[v]}`}>{children}</span>;
}

// ── Card ──
export function Card({ children, className = "", hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <div className={`rounded-2xl border border-border bg-card shadow-sm ${hover ? "hover:shadow-lg hover:shadow-primary/8 transition-shadow" : ""} ${className}`}>{children}</div>;
}

// ── TrendChart (self-contained SVG, avoids recharts key warnings) ──
export function TrendChart({
  data, min, max, showXLabels = false, showArea = false, height = 128,
}: {
  data: { label: string; value: number }[];
  min?: number; max?: number; showXLabels?: boolean; showArea?: boolean; height?: number;
}) {
  const W = 300;
  const padL = 8, padR = 8, padT = 12;
  const padB = showXLabels ? 22 : 12;
  const chartH = height - padT - padB;
  const chartW = W - padL - padR;
  const n = data.length;
  const [hv, setHv] = useState(-1);

  if (n === 0) return (
    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Chưa có dữ liệu</div>
  );

  const values = data.map(d => d.value);
  const lo = min ?? Math.min(...values) - 5;
  const hi = max ?? Math.max(...values) + 5;
  const span = hi - lo || 1;
  const x = (i: number) => padL + (n <= 1 ? chartW / 2 : (i / (n - 1)) * chartW);
  const y = (v: number) => padT + chartH - ((v - lo) / span) * chartH;
  const pts = data.map((d, i) => `${x(i)},${y(d.value)}`);
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p}`).join(" ");
  const areaPath = n > 0
    ? `M${x(0)},${padT + chartH} L${pts.join(" L")} L${x(n - 1)},${padT + chartH} Z`
    : "";
  const gid = `tc-${Math.round(lo)}-${Math.round(hi)}-${n}`;
  const ttIdx = hv;
  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="w-full h-full" role="img" aria-label="Biểu đồ xu hướng">
        {showArea && (
          <>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            {n > 1 && <path d={areaPath} fill={`url(#${gid})`} />}
          </>
        )}
        <path d={linePath} fill="none" stroke="var(--chart-1)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => (
          <circle key={`pt-${i}`} cx={x(i)} cy={y(d.value)} r={hv === i ? 3.5 : 1.5} fill={hv === i ? "var(--card)" : "var(--chart-2)"} stroke="var(--chart-1)" strokeWidth={1.5} style={{ cursor: "pointer", transition: "r .12s" }} onMouseEnter={() => setHv(i)} onMouseLeave={() => setHv(-1)} />
        ))}
        {showXLabels && data.map((d, i) => {
          const anchor = i === 0 ? "start" : i === n - 1 ? "end" : "middle";
          const offset = i === 0 ? 2 : i === n - 1 ? -2 : 0;
          return <text key={`lbl-${i}`} x={x(i) + offset} y={height - 6} textAnchor={anchor} fontSize={9} fill="var(--muted-foreground)">
            {d.label.includes("-") ? d.label.slice(5) : d.label}
          </text>;
        })}
      </svg>
      {ttIdx >= 0 && (
        <div className="absolute pointer-events-none bg-popover text-popover-foreground text-xs px-2 py-1 rounded-md shadow-md border border-border z-50 whitespace-nowrap"
          style={{
            left: `${(x(ttIdx) / W) * 100}%`,
            top: `${(y(data[ttIdx].value) / height) * 100}%`,
            transform: "translate(-50%,calc(-100% - 8px))",
          }}
        >
          <span className="font-bold text-foreground">{data[ttIdx].value}</span>
        </div>
      )}
    </div>
  );
}

// ── BarChart (self-contained SVG) ──
export function BarChart({ data, height = 224, showXLabels = true }: {
  data: { label: string; value: number }[]; height?: number; showXLabels?: boolean;
}) {
  const W = 320;
  const padL = 8, padR = 8, padT = 24;
  const padB = showXLabels ? 22 : 12;
  const chartH = height - padT - padB;
  const chartW = W - padL - padR;
  const hi = Math.max(...data.map(d => d.value), 1);
  const n = data.length;
  const gap = 6;
  const bw = (chartW - gap * (n - 1)) / n;
  const [hv, setHv] = useState(-1);
  if (data.length === 0) return (
    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Chưa có dữ liệu</div>
  );
  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="w-full h-full" role="img" aria-label="Biểu đồ cột">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.9} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.95} />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const h = (d.value / hi) * chartH;
          const bx = padL + i * (bw + gap);
          const by = padT + chartH - h;
          return (
            <rect key={`bar-${i}`} x={bx} y={by} width={bw} height={h} rx={4}
              fill={hv === i ? "var(--chart-2)" : "url(#barGrad)"}
              style={{ cursor: "pointer", transition: "fill .12s" }}
              onMouseEnter={() => setHv(i)} onMouseLeave={() => setHv(-1)} />
          );
        })}
        {showXLabels && data.map((d, i) => (
          <text key={`blbl-${i}`} x={padL + i * (bw + gap) + bw / 2} y={height - 6} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            {d.label}
          </text>
        ))}
        {hv >= 0 && (
          <text x={padL + hv * (bw + gap) + bw / 2} y={padT + chartH - (data[hv].value / hi) * chartH - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            {data[hv].value}
          </text>
        )}
      </svg>
    </div>
  );
}

// ── Field ──
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; hint?: string;
}
export function Field({ label, error, hint, className = "", ...rest }: FieldProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}
      <input
        className={`w-full px-3 py-2.5 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring transition-all ${error ? "border-destructive" : "border-border"} ${className}`}
        {...rest} />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, className = "", ...rest }: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}
      <textarea className={`w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring transition-all ${className}`} {...rest} />
    </div>
  );
}

export function Select({ label, children, className = "", ...rest }: { label?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}
      <select className={`w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all ${className}`} {...rest}>{children}</select>
    </div>
  );
}

// ── Section title ──
export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="font-heading font-extrabold text-3xl text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Modal ──
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className={`bg-card rounded-2xl border border-border shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
          <h3 className="font-heading font-bold text-lg text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
