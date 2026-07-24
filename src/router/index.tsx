import { useEffect, type ReactNode } from "react";
import { Route, Routes, useLocation } from "react-router";
import { useApp } from "@/stores/app.store";
import type { Role } from "@/types/app.types";
import { MainLayout } from "@/layouts/MainLayout";
import { CommunityProvider } from "@/stores/community.store";
import { Landing } from "@/pages/guest/HomePage";
import { Login } from "@/pages/guest/LoginPage";
import { Register } from "@/pages/guest/RegisterPage";
import { Forgot } from "@/pages/guest/ForgotPasswordPage";
import { Dashboard } from "@/pages/user/DashboardPage";
import { Community } from "@/pages/user/CommunityPage";
import { Pets } from "@/pages/user/PetsPage";
import { PetDetail } from "@/pages/user/PetDetailPage";
import { AIChecker } from "@/pages/user/AICheckerPage";
import { Subscription } from "@/pages/user/SubscriptionPage";
import { Checkout } from "@/pages/user/CheckoutPage";
import { Profile } from "@/pages/user/ProfilePage";
import { AdminDashboard, AdminModeration, AdminPets, AdminSubs, AdminUsers } from "@/pages/admin/AdminPages";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname, search]);
  return null;
}

function StatusPage({ code, title, description }: { code: string; title: string; description: string }) {
  return <main className="min-h-screen grid place-items-center bg-background px-6 text-center"><div><p className="text-6xl font-extrabold text-primary">{code}</p><h1 className="mt-4 text-2xl font-bold text-foreground">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></div></main>;
}

function Forbidden() { return <StatusPage code="403" title="Bạn không có quyền truy cập" description="Hãy đăng nhập bằng tài khoản có quyền phù hợp để mở trang này." />; }
function NotFound() { return <StatusPage code="404" title="Không tìm thấy trang" description="Đường dẫn này không tồn tại hoặc dữ liệu bạn cần đã bị xoá." />; }
function Protected({ role, children }: { role: Role; children: ReactNode }) {
  const { authed, role: currentRole } = useApp();
  return authed && currentRole === role ? <>{children}</> : <Forbidden />;
}

export function AppRouter() {
  const { theme } = useApp();
  return <div className={theme === "dark" ? "dark" : ""}><div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}><ScrollToTop /><CommunityProvider><Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<Forgot />} />
    <Route element={<Protected role="user"><MainLayout /></Protected>}>
      <Route path="/dashboard" element={<Dashboard />} /><Route path="/pets" element={<Pets />} /><Route path="/pets/:petId" element={<PetDetail />} /><Route path="/ai-checker" element={<AIChecker />} /><Route path="/community" element={<Community />} /><Route path="/subscription" element={<Subscription />} /><Route path="/checkout" element={<Checkout />} /><Route path="/profile" element={<Profile />} />
    </Route>
    <Route element={<Protected role="admin"><MainLayout /></Protected>}>
      <Route path="/admin" element={<AdminDashboard />} /><Route path="/admin/users" element={<AdminUsers />} /><Route path="/admin/pets" element={<AdminPets />} /><Route path="/admin/subscriptions" element={<AdminSubs />} /><Route path="/admin/moderation" element={<AdminModeration />} /><Route path="/admin/profile" element={<Profile />} />
    </Route>
    <Route path="/403" element={<Forbidden />} /><Route path="*" element={<NotFound />} />
  </Routes></CommunityProvider></div></div>;
}
