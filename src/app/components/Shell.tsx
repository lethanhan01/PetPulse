import { ReactNode, useState } from "react";
import { useApp, View } from "../lib/store";
import { Logo, HEAD } from "./kit";
import {
  Sun, Moon, Bell, Search, Menu, X, LogOut, LayoutDashboard, Users, PawPrint,
  Sparkles, Crown, User as UserIcon, CreditCard, Stethoscope, BarChart3, Shield, MessageSquare, ChevronDown,
} from "lucide-react";

const USER_NAV: { id: View; label: string; icon: ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { id: "pets", label: "Thú cưng của tôi", icon: <PawPrint size={17} /> },
  { id: "ai", label: "AI Symptom Checker", icon: <Sparkles size={17} /> },
  { id: "community", label: "Cộng đồng", icon: <MessageSquare size={17} /> },
  { id: "subscription", label: "Nâng cấp Premium", icon: <Crown size={17} /> },
  { id: "profile", label: "Hồ sơ cá nhân", icon: <UserIcon size={17} /> },
];
const ADMIN_NAV: { id: View; label: string; icon: ReactNode }[] = [
  { id: "adminDashboard", label: "Thống kê", icon: <BarChart3 size={17} /> },
  { id: "adminUsers", label: "Quản lý User", icon: <Users size={17} /> },
  { id: "adminPets", label: "Quản lý Pet", icon: <PawPrint size={17} /> },
  { id: "adminSubs", label: "Subscription", icon: <CreditCard size={17} /> },
  { id: "adminModeration", label: "Kiểm duyệt", icon: <Shield size={17} /> },
  { id: "adminProfile", label: "Hồ sơ Admin", icon: <UserIcon size={17} /> },
];

const NOTIS = [
  { t: "Nhắc lịch: Uống thuốc giun cho Mochi", s: "Hôm nay 08:00", icon: <Bell size={14} /> },
  { t: "Health Score của Luna tăng lên 95 điểm", s: "2 giờ trước", icon: <Stethoscope size={14} /> },
  { t: "Vaccine dại của Mochi đã được ghi nhận", s: "Hôm qua", icon: <PawPrint size={14} /> },
];

export function Shell({ children }: { children: ReactNode }) {
  const { role, view, navigate, theme, toggleTheme, logout, plan } = useApp();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const nav = role === "admin" ? ADMIN_NAV : USER_NAV;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="fixed inset-x-0 top-0 z-50 h-16 flex items-center gap-3 border-b border-border bg-background/90 backdrop-blur-md px-4 lg:px-6">
        <button className="lg:hidden p-2 rounded-lg hover:bg-secondary" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
        <Logo size={26} />
        {role === "admin" && <span className="hidden sm:block text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary ml-1">ADMIN</span>}
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center relative">
            <Search size={15} className="absolute left-3 text-muted-foreground" />
            <input placeholder="Tìm kiếm..." className="w-52 pl-9 pr-3 py-2 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full border border-border hover:bg-secondary" aria-label="Theme">
            {isDark ? <Sun size={16} className="text-accent" /> : <Moon size={16} className="text-primary" />}
          </button>
          <div className="relative">
            <button onClick={() => setNotiOpen(!notiOpen)} className="p-2 rounded-full border border-border hover:bg-secondary relative" aria-label="Notifications">
              <Bell size={16} className="text-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            {notiOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotiOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-border font-semibold text-sm" style={HEAD}>Thông báo</div>
                  {NOTIS.map((n, i) => (
                    <div key={i} className="flex gap-3 p-3 hover:bg-secondary/50 border-b border-border last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">{n.icon}</div>
                      <div><p className="text-sm text-foreground leading-tight">{n.t}</p><p className="text-xs text-muted-foreground mt-0.5">{n.s}</p></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{role === "admin" ? "AD" : "AN"}</div>
        </div>
      </header>

      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 z-40 border-r border-border bg-sidebar overflow-y-auto transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-3 flex flex-col h-full">
          <nav className="space-y-1 flex-1">
            {nav.map(s => (
              <button key={s.id} onClick={() => { navigate(s.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                  view === s.id || (s.id === "pets" && view === "petDetail")
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25"
                    : "text-sidebar-foreground hover:bg-secondary"}`}>
                <span className={view === s.id ? "" : "text-primary/70"}>{s.icon}</span>
                {s.label}
                {s.id === "subscription" && plan === "Freemium" && <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-primary">PRO</span>}
              </button>
            ))}
          </nav>
          {role === "user" && (
            <div className="rounded-2xl p-4 mb-2 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1D8B88,#2FE0DC)" }}>
              <Crown size={20} className="mb-2" />
              <p className="font-bold text-sm" style={HEAD}>Gói {plan}</p>
              <p className="text-xs text-white/85 mt-0.5 mb-3">{plan === "Premium" ? "Đã mở khóa mọi tính năng 🎉" : "Nâng cấp để mở khóa AI không giới hạn"}</p>
              {plan === "Freemium" && (
                <button onClick={() => navigate("subscription")} className="w-full py-1.5 rounded-lg bg-white text-primary text-xs font-semibold hover:bg-white/90">Nâng cấp</button>
              )}
            </div>
          )}
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={17} /> Đăng xuất
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
