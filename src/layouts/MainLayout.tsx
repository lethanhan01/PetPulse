import { type CSSProperties, type KeyboardEvent, type ReactNode, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import { Logo } from "@/components/common/kit";
import { Navbar } from "@/components/Navbar/Navbar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MOCK_NOTIFICATIONS, MOCK_ADMIN_NOTIFICATIONS } from "@/mocks";
import { getAccountInitials } from "@/services/user.service";
import { Sun, Moon, Bell, Menu, X, LogOut, LayoutDashboard, Users, PawPrint, Sparkles, Crown, User as UserIcon, CreditCard, Stethoscope, BarChart3, Shield, MessageSquare, ChevronsLeft, ChevronsRight } from "lucide-react";

const SIDEBAR_SETTINGS_KEY = "petpulse.sidebar";
const SIDEBAR_DEFAULT_WIDTH = 256;
const SIDEBAR_MIN_WIDTH = 208;
const SIDEBAR_MAX_WIDTH = 384;
const SIDEBAR_COLLAPSED_WIDTH = 72;

type SidebarSettings = { collapsed: boolean; width: number };

function getSidebarSettings(): SidebarSettings {
  if (typeof window === "undefined") return { collapsed: false, width: SIDEBAR_DEFAULT_WIDTH };
  try {
    const saved = JSON.parse(window.localStorage.getItem(SIDEBAR_SETTINGS_KEY) ?? "null") as Partial<SidebarSettings> | null;
    if (typeof saved?.collapsed === "boolean" && typeof saved.width === "number" && saved.width >= SIDEBAR_MIN_WIDTH && saved.width <= SIDEBAR_MAX_WIDTH) {
      return { collapsed: saved.collapsed, width: saved.width };
    }
  } catch {
    // Invalid saved preferences should never prevent the app from rendering.
  }
  return { collapsed: false, width: SIDEBAR_DEFAULT_WIDTH };
}

type NavItem = { to: string; label: string; icon: ReactNode; end?: boolean };
const USER_NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { to: "/pets", label: "Thú cưng của tôi", icon: <PawPrint size={17} /> },
  { to: "/ai-checker", label: "AI Symptom Checker", icon: <Sparkles size={17} /> },
  { to: "/community", label: "Cộng đồng", icon: <MessageSquare size={17} /> },
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
  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>(getSidebarSettings);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window === "undefined" || window.innerWidth >= 1024);
  const nav = role === "admin" ? ADMIN_NAV : USER_NAV;
  const isDark = theme === "dark";
  const notifs = role === "admin" ? MOCK_ADMIN_NOTIFICATIONS : MOCK_NOTIFICATIONS;
  const logOut = () => { logout(); navigate("/"); };
  const { collapsed, width } = sidebarSettings;
  const desktopSidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : width;
  const desktopSidebarStyle = { width: `${desktopSidebarWidth}px` } as CSSProperties;
  const mainStyle = { marginLeft: isDesktop ? `${desktopSidebarWidth}px` : 0 } as CSSProperties;
  const setSidebarWidth = (nextWidth: number) => setSidebarSettings(current => ({ ...current, width: Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, nextWidth)) }));
  const toggleSidebar = () => setSidebarSettings(current => ({ ...current, collapsed: !current.collapsed }));
  const resizeWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextWidth: number | undefined;
    if (event.key === "ArrowLeft") nextWidth = width - 16;
    if (event.key === "ArrowRight") nextWidth = width + 16;
    if (event.key === "Home") nextWidth = SIDEBAR_MIN_WIDTH;
    if (event.key === "End") nextWidth = SIDEBAR_MAX_WIDTH;
    if (nextWidth !== undefined) {
      event.preventDefault();
      setSidebarWidth(nextWidth);
    }
  };

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_SETTINGS_KEY, JSON.stringify(sidebarSettings));
  }, [sidebarSettings]);

  useEffect(() => {
    const updateViewport = () => setIsDesktop(window.innerWidth >= 1024);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const SidebarNavItem = ({ item, compact }: { item: NavItem; compact: boolean }) => {
    const link = <NavLink to={item.to} end={item.end} onClick={() => setOpen(false)} aria-label={item.label} className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${compact ? "justify-center px-2" : ""} ${isActive ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25" : "text-sidebar-foreground hover:bg-secondary"}`}><span data-testid="sidebar-nav-icon" aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center">{item.icon}</span><span className={compact ? "hidden" : ""}>{item.label}</span>{item.to === "/subscription" && plan === "Free" && <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-primary ${compact ? "hidden" : ""}`}>PRO</span>}</NavLink>;
    if (!compact) return link;
    return <Tooltip><TooltipTrigger asChild><span className="block w-full">{link}</span></TooltipTrigger><TooltipContent side="right" sideOffset={10}>{item.label}</TooltipContent></Tooltip>;
  };

  const SidebarLinks = ({ compact }: { compact: boolean }) => <>
    <nav className="space-y-1 flex-1">{nav.map(item => <SidebarNavItem key={item.to} item={item} compact={compact} />)}</nav>
    {role === "user" && !compact && <div className="rounded-2xl p-4 mb-2 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}><Crown size={20} className="mb-2" /><p className="font-bold text-sm">Gói {plan}</p><p className="text-xs text-white/85 mt-0.5 mb-3">{plan === "Premium" ? "Đã mở khóa mọi tính năng 🎉" : "Nâng cấp để mở khóa AI không giới hạn"}</p>{plan === "Free" && <button onClick={() => navigate("/subscription")} className="w-full py-1.5 rounded-lg bg-white text-primary text-xs font-semibold hover:bg-white/90">Nâng cấp</button>}</div>}
    {compact ? <Tooltip><TooltipTrigger asChild><button onClick={logOut} aria-label="Đăng xuất" className="w-full flex justify-center px-2 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"><LogOut size={17} /></button></TooltipTrigger><TooltipContent side="right" sideOffset={10}>Đăng xuất</TooltipContent></Tooltip> : <button onClick={logOut} aria-label="Đăng xuất" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"><LogOut size={17} /> Đăng xuất</button>}
  </>;

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
    <aside data-testid="desktop-sidebar" className={`hidden lg:flex fixed top-16 left-0 bottom-0 z-40 flex-col border-r border-border bg-sidebar ${isResizing ? "transition-none" : "transition-[width] duration-200"}`} style={desktopSidebarStyle}>
      <div className={`flex shrink-0 items-center p-3 pb-2 ${collapsed ? "justify-center" : "justify-end"}`}><Tooltip><TooltipTrigger asChild><button onClick={toggleSidebar} className="w-8 h-8 rounded-lg text-sidebar-foreground hover:bg-secondary flex items-center justify-center" aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}>{collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}</button></TooltipTrigger><TooltipContent side="right" sideOffset={8}>{collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}</TooltipContent></Tooltip></div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 pb-3"><SidebarLinks compact={collapsed} /></div>
      {!collapsed && <button type="button" className="absolute top-0 -right-2 h-full w-4 cursor-col-resize outline-none after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-transparent hover:after:bg-primary focus-visible:after:bg-primary" role="separator" aria-label="Điều chỉnh độ rộng sidebar" aria-orientation="vertical" aria-valuemin={SIDEBAR_MIN_WIDTH} aria-valuemax={SIDEBAR_MAX_WIDTH} aria-valuenow={width} onKeyDown={resizeWithKeyboard} onDoubleClick={() => setSidebarWidth(SIDEBAR_DEFAULT_WIDTH)} onPointerDown={event => { const handle = event.currentTarget; if (!Number.isFinite(event.clientX)) return; handle.setPointerCapture(event.pointerId); setIsResizing(true); const startX = event.clientX; const startWidth = width; const move = (moveEvent: PointerEvent) => { if (Number.isFinite(moveEvent.clientX)) setSidebarWidth(startWidth + moveEvent.clientX - startX); }; const end = () => { setIsResizing(false); handle.removeEventListener("pointermove", move); handle.removeEventListener("pointerup", end); handle.removeEventListener("pointercancel", end); }; handle.addEventListener("pointermove", move); handle.addEventListener("pointerup", end); handle.addEventListener("pointercancel", end); }} />}
    </aside>
    <aside data-testid="mobile-sidebar" className={`fixed top-16 left-0 bottom-0 w-64 z-40 border-r border-border bg-sidebar overflow-y-auto transition-transform duration-200 lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}><div className="p-3 flex flex-col h-full"><SidebarLinks compact={false} /></div></aside>
    <main className={`pt-16 min-h-screen ${isResizing ? "transition-none" : "transition-[margin] duration-200"}`} style={mainStyle}><div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Outlet /></div></main>
  </div>;
}
