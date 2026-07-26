import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CheckCircle2, Moon, Sun } from "lucide-react";
import { Logo } from "@/components/common/kit";
import { useApp } from "@/stores/app.store";

export function AuthLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  return <div className="min-h-screen grid lg:grid-cols-2">
    <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden" style={{ background: isDark ? "radial-gradient(ellipse at 30% 40%, rgba(47,224,220,0.15), transparent 60%), var(--background)" : "linear-gradient(135deg,var(--primary) 0%,var(--accent) 60%,var(--chart-3) 100%)" }}>
      <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/90 hover:text-white text-sm w-fit"><ArrowLeft size={16} /> Về trang chủ</button>
      <div><span className="text-7xl">🐾</span><h2 className="font-extrabold text-5xl text-white mt-5 mb-4 leading-tight">Chào mừng đến PetPulse</h2><p className="text-white/85 text-xl max-w-md leading-relaxed">Hộ chiếu sức khỏe điện tử & chăm sóc thú cưng thông minh cho người trẻ yêu pet.</p></div>
      <div className="space-y-2">{["Health timeline & Health Score", "AI Symptom Checker", "Cộng đồng thú cưng"].map(text => <div key={text} className="flex items-center gap-2 text-white/90 text-sm"><CheckCircle2 size={16} /> {text}</div>)}</div>
    </div>
    <div className="flex flex-col p-6 sm:p-12 relative overflow-hidden"><div className="flex items-center justify-between mb-8 relative z-10"><div className="lg:hidden"><Logo /></div><button onClick={toggleTheme} className="ml-auto p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Toggle theme">{isDark ? <Sun size={16} className="text-accent" /> : <Moon size={16} className="text-primary" />}</button></div><div className="flex-1 flex items-center justify-center relative z-10"><div className="w-full max-w-sm">{children}</div></div><div aria-hidden className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }} /><div aria-hidden className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }} /></div>
  </div>;
}
