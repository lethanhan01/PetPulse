import { useState } from "react";
import { useApp } from "../../lib/store";
import { Btn, Logo, Field, HEAD } from "../kit";
import { Eye, EyeOff, ArrowLeft, Sun, Moon, CheckCircle2, Shield, User as UserIcon } from "lucide-react";

function AuthShell({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme, navigate } = useApp();
  const isDark = theme === "dark";
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: isDark
          ? "radial-gradient(ellipse at 30% 40%, rgba(47,224,220,0.15), transparent 60%), #0A1E1E"
          : "linear-gradient(135deg,#1D8B88 0%,#2FE0DC 60%,#78E3FD 100%)" }}>
        <button onClick={() => navigate("landing")} className="flex items-center gap-2 text-white/90 hover:text-white text-sm w-fit">
          <ArrowLeft size={16} /> Về trang chủ
        </button>
        <div>
          <span className="text-5xl">🐾</span>
          <h2 className="font-extrabold text-4xl text-white mt-4 mb-3" style={HEAD}>Chào mừng đến PawPulse</h2>
          <p className="text-white/85 text-lg max-w-md">Hộ chiếu sức khỏe điện tử & chăm sóc thú cưng thông minh cho người trẻ yêu pet.</p>
        </div>
        <div className="space-y-2">
          {["Health timeline & Health Score", "AI Symptom Checker", "Cộng đồng thú cưng"].map(t => (
            <div key={t} className="flex items-center gap-2 text-white/90 text-sm"><CheckCircle2 size={16} /> {t}</div>
          ))}
        </div>
      </div>
      {/* Right form */}
      <div className="flex flex-col p-6 sm:p-12">
        <div className="flex items-center justify-between mb-8">
          <div className="lg:hidden"><Logo /></div>
          <button onClick={toggleTheme} className="ml-auto p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Toggle theme">
            {isDark ? <Sun size={16} className="text-accent" /> : <Moon size={16} className="text-primary" />}
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { navigate, login } = useApp();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("an@example.com");
  const [pass, setPass] = useState("paw123");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass !== "paw123") { setError("Email hoặc mật khẩu không đúng."); return; }
    login(email.includes("admin") ? "admin" : "user");
  };
  return (
    <AuthShell>
      <h1 className="font-extrabold text-3xl text-foreground mb-1" style={HEAD}>Đăng nhập</h1>
      <p className="text-sm text-muted-foreground mb-6">Nhập email & mật khẩu để tiếp tục.</p>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Mật khẩu</label>
          <div className="relative">
            <input type={show ? "text" : "password"} value={pass} onChange={e => { setPass(e.target.value); setError(""); }}
              className={`w-full px-3 py-2.5 pr-10 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all ${error ? "border-destructive" : "border-border"}`} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer"><input type="checkbox" className="accent-[#1D8B88]" /> Ghi nhớ</label>
          <button type="button" onClick={() => navigate("forgot")} className="text-primary hover:underline">Quên mật khẩu?</button>
        </div>
        <Btn block size="lg" type="submit">Đăng nhập</Btn>
      </form>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Btn variant="outline" size="sm" icon={<UserIcon size={15} />} onClick={() => login("user")}>Demo User</Btn>
        <Btn variant="outline" size="sm" icon={<Shield size={15} />} onClick={() => login("admin")}>Demo Admin</Btn>
      </div>
      <p className="text-sm text-muted-foreground text-center mt-6">Chưa có tài khoản? <button onClick={() => navigate("register")} className="text-primary font-medium hover:underline">Đăng ký</button></p>
    </AuthShell>
  );
}

export function Register() {
  const { navigate, login } = useApp();
  const [show, setShow] = useState(false);
  return (
    <AuthShell>
      <h1 className="font-extrabold text-3xl text-foreground mb-1" style={HEAD}>Tạo tài khoản</h1>
      <p className="text-sm text-muted-foreground mb-6">Đăng ký miễn phí — mặc định gói <b className="text-primary">Freemium</b>.</p>
      <form onSubmit={e => { e.preventDefault(); login("user"); }} className="space-y-4">
        <Field label="Họ và tên" placeholder="Nguyễn Văn An" required />
        <Field label="Email" type="email" placeholder="you@example.com" required />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Mật khẩu</label>
          <div className="relative">
            <input type={show ? "text" : "password"} defaultValue="paw123"
              className="w-full px-3 py-2.5 pr-10 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" required className="mt-1 accent-[#1D8B88]" /> Tôi đồng ý với Điều khoản dịch vụ & Chính sách bảo mật của PawPulse.
        </label>
        <Btn block size="lg" type="submit">Đăng ký</Btn>
      </form>
      <p className="text-sm text-muted-foreground text-center mt-6">Đã có tài khoản? <button onClick={() => navigate("login")} className="text-primary font-medium hover:underline">Đăng nhập</button></p>
    </AuthShell>
  );
}

export function Forgot() {
  const { navigate } = useApp();
  const [sent, setSent] = useState(false);
  return (
    <AuthShell>
      <button onClick={() => navigate("login")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft size={15} /> Quay lại</button>
      {!sent ? (
        <>
          <h1 className="font-extrabold text-3xl text-foreground mb-1" style={HEAD}>Quên mật khẩu?</h1>
          <p className="text-sm text-muted-foreground mb-6">Nhập email để nhận mã OTP khôi phục tài khoản.</p>
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <Field label="Email" type="email" placeholder="you@example.com" required />
            <Btn block size="lg" type="submit">Gửi mã OTP</Btn>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={28} /></div>
          <h1 className="font-extrabold text-2xl text-foreground mb-2" style={HEAD}>Đã gửi mã OTP</h1>
          <p className="text-sm text-muted-foreground mb-6">Kiểm tra hộp thư của bạn và nhập mã 6 số để đặt lại mật khẩu.</p>
          <div className="flex justify-center gap-2 mb-6">
            {[2, 4, 8, 1, 9, 3].map((n, i) => (
              <div key={i} className="w-10 h-12 rounded-xl border border-border bg-background flex items-center justify-center font-bold text-lg text-foreground">{n}</div>
            ))}
          </div>
          <Btn block size="lg" onClick={() => navigate("login")}>Xác nhận & Đăng nhập</Btn>
        </div>
      )}
    </AuthShell>
  );
}
