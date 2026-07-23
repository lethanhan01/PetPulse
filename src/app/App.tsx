import { AppProvider, useApp } from "./lib/store";
import { Shell } from "./components/Shell";
import { Landing } from "./components/guest/Landing";
import { Login, Register, Forgot } from "./components/guest/Auth";
import { Dashboard } from "./components/user/Dashboard";
import { Community } from "./components/user/Community";
import { Pets } from "./components/user/Pets";
import { PetDetail } from "./components/user/PetDetail";
import { AIChecker } from "./components/user/AIChecker";
import { Subscription, Checkout } from "./components/user/Subscription";
import { Profile } from "./components/user/Profile";
import { AdminDashboard, AdminUsers, AdminPets, AdminSubs, AdminModeration } from "./components/admin/Admin";

function Router() {
  const { theme, view, authed } = useApp();

  const guest =
    view === "login" ? <Login /> :
    view === "register" ? <Register /> :
    view === "forgot" ? <Forgot /> :
    <Landing />;

  const isGuestView = ["landing", "login", "register", "forgot"].includes(view) || !authed;

  const inner = () => {
    switch (view) {
      case "dashboard": return <Dashboard />;
      case "community": return <Community />;
      case "pets": return <Pets />;
      case "petDetail": return <PetDetail />;
      case "ai": return <AIChecker />;
      case "subscription": return <Subscription />;
      case "checkout": return <Checkout />;
      case "profile":
      case "adminProfile": return <Profile />;
      case "adminDashboard": return <AdminDashboard />;
      case "adminUsers": return <AdminUsers />;
      case "adminPets": return <AdminPets />;
      case "adminSubs": return <AdminSubs />;
      case "adminModeration": return <AdminModeration />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {isGuestView ? guest : <Shell>{inner()}</Shell>}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
