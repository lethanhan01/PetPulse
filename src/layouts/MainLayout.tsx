import { ReactNode, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import { Logo } from "@/components/common/kit";
import { Navbar } from "@/components/Navbar/Navbar";
import { MOCK_NOTIFICATIONS, MOCK_ADMIN_NOTIFICATIONS } from "@/mocks";
import { getAccountInitials } from "@/services/user.service";
import { Sun, Moon, Bell, Menu, X, LogOut, LayoutDashboard, Users, PawPrint, Sparkles, Crown, User as UserIcon, CreditCard, Stethoscope, BarChart3, Shield, MessageSquare } from "lucide-react";

type NavItem = { to: string; label: string; icon: ReactNode; end?: boolean };
const USER_NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { to: "/pets", label: "Thú cưng của tôi", icon: <PawPrint size={17} /> },
  { to: "/ai-checker", label: "AI Symptom Checker", icon: <Sparkles size={17} /> },
  { to: "/community", label: "Cộng đồng", icon: <MessageSquare size={17} /> },
  { to: "/my-posts", label: "Bài viết của tôi", icon: <MessageSquare size={17} /> },
  { to: "/subscription", label: "Nâng cấp Premium", icon: <Crown size={17} /> },
  { to: "/profile", label: "Hồ sơ cá nhân", icon: <UserIcon size={17} /> },
];
const ADMIN_NAV: NavItem[] = [
  { to: "/admin", label: "Thống kê", icon: <BarChart3 size={17} />, end: true },
  { to: "/admin/users", label: "Quản lý User", icon: <Users size={17} /> },
  { to: "/admin/pets", label: "Quản lý Pet", icon: <PawPrint size={17} /> },
  { to: "/admin/subscriptions", label: "Subscription", icon: <CreditCard size={17} /> },
  { to: "/admin/moderation", label: "Kiểm duyệt", icon: <Shield size={17} /> },
  { to: "/admin/profile", label: "Hồ sơ Admin", icon: <UserIcon size={17} /> },
];
const notificationIcon: Record<string, ReactNode> = { event: <Bell size={14} />, health: <Stethoscope size={14} />, vaccine: <PawPrint size={14} />, moderation: <Shield size={14} /> };

export function MainLayout() {
  const { role, theme, toggleTheme, logout, plan, activeAccount } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const nav = role === "admin" ? ADMIN_NAV : USER_NAV;
  const isDark = theme === "dark";
  const notifs = role === "admin" ? MOCK_ADMIN_NOTIFICATIONS : MOCK_NOTIFICATIONS;
  const logOut = () => { logout(); navigate("/"); };

  return <div className="min-h-screen bg-background text-foreground">
    <Navbar><div className="w-full h-full flex items-center gap-3 border-b border-border bg-background/90 backdrop-blur-md px-4 lg:px-6">
      <button className="lg:hidden p-2 rounded-lg hover:bg-secondary" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
      <Logo size={26} />
      {role === "admin" && <span className="hidden sm:block text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary ml-1">ADMIN</span>}
      <div className="ml-auto flex items-center gap-2">
        <button onClick={toggleTheme} className="w-9 h-9 rounded-full border border-border hover:bg-secondary flex items-center justify-center" aria-label="Theme">{isDark ? <Sun size={16} className="text-accent" /> : <Moon size={16} className="text-primary" />}</button>
        <div className="relative"><button onClick={() => setNotiOpen(!notiOpen)} className="w-9 h-9 rounded-full border border-border hover:bg-secondary flex items-center justify-center relative" aria-label="Notifications"><Bell size={16} />{notifs.some(n => !n.read) && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />}</button>
          {notiOpen && <><div className="fixed inset-0 z-40" onClick={() => setNotiOpen(false)} /><div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"><div className="p-3 border-b border-border font-semibold text-sm">Thông báo</div>{notifs.map(n => <div key={n.id} className="flex gap-3 p-3 hover:bg-secondary/50 border-b border-border last:border-0"><div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">{notificationIcon[n.kind]}</div><div><p className="text-sm text-foreground leading-tight">{n.title}</p><p className="text-xs text-muted-foreground mt-0.5">{n.subtitle}</p></div></div>)}</div></>}
        </div>
        <div className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)} className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary overflow-hidden hover:ring-2 hover:ring-ring transition-all" title={activeAccount?.name}>
            {activeAccount?.avatar?.startsWith?.("data:") ? <img src={activeAccount.avatar} alt="" className="w-full h-full object-cover" /> : <span>{getAccountInitials(activeAccount)}</span>}
          </button>
          {profileOpen && <><div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} /><div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="px-3 py-2.5 text-sm font-semibold border-b border-border">{activeAccount?.name}</div>
            <button onClick={() => { navigate(role === "admin" ? "/admin/profile" : "/profile"); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors text-left"><UserIcon size={15} /> Hồ sơ cá nhân</button>
            <button onClick={() => { logOut(); setProfileOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors text-left text-destructive"><LogOut size={15} /> Đăng xuất</button>
          </div></>}
        </div>
      </div>
    </div></Navbar>
    {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
    <aside className={`fixed top-16 left-0 bottom-0 w-64 z-40 border-r border-border bg-sidebar overflow-y-auto transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}><div className="p-3 flex flex-col h-full"><nav className="space-y-1 flex-1">{nav.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setOpen(false)} className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${isActive ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25" : "text-sidebar-foreground hover:bg-secondary"}`}><span>{item.icon}</span>{item.label}{item.to === "/subscription" && plan === "Free" && <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-primary">PRO</span>}</NavLink>)}</nav>
      {role === "user" && <div className="rounded-2xl p-4 mb-2 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}><Crown size={20} className="mb-2" /><p className="font-bold text-sm">Gói {plan}</p><p className="text-xs text-white/85 mt-0.5 mb-3">{plan === "Premium" ? "Đã mở khóa mọi tính năng 🎉" : "Nâng cấp để mở khóa AI không giới hạn"}</p>{plan === "Free" && <button onClick={() => navigate("/subscription")} className="w-full py-1.5 rounded-lg bg-white text-primary text-xs font-semibold hover:bg-white/90">Nâng cấp</button>}</div>}
      <button onClick={logOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"><LogOut size={17} /> Đăng xuất</button></div></aside>
    <main className="lg:ml-64 pt-16 min-h-screen"><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Outlet /></div></main>
  </div>;
}
