import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import { authenticateMock } from "@/services/auth.service";
import { Btn, Field, HEAD } from "@/components/common/kit";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Shield, User as UserIcon } from "lucide-react";

export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("an@example.com");
  const [pass, setPass] = useState("paw123");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = authenticateMock(email, pass);
    if (!role) { setError("Email hoặc mật khẩu không đúng."); return; }
    login(role); navigate(role === "admin" ? "/admin" : "/dashboard");
  };
  return (
    <AuthLayout>
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
          <button type="button" onClick={() => navigate("/forgot-password")} className="text-primary hover:underline">Quên mật khẩu?</button>
        </div>
        <Btn block size="lg" type="submit">Đăng nhập</Btn>
      </form>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Btn variant="outline" size="sm" icon={<UserIcon size={15} />} onClick={() => { login("user"); navigate("/dashboard"); }}>Demo User</Btn>
        <Btn variant="outline" size="sm" icon={<Shield size={15} />} onClick={() => { login("admin"); navigate("/admin"); }}>Demo Admin</Btn>
      </div>
      <p className="text-sm text-muted-foreground text-center mt-6">Chưa có tài khoản? <button onClick={() => navigate("/register")} className="text-primary font-medium hover:underline">Đăng ký</button></p>
    </AuthLayout>
  );
}

export function Register() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  return (
    <AuthLayout>
      <h1 className="font-extrabold text-3xl text-foreground mb-1" style={HEAD}>Tạo tài khoản</h1>
      <p className="text-sm text-muted-foreground mb-6">Đăng ký miễn phí — mặc định gói <b className="text-primary">Freemium</b>.</p>
      <form onSubmit={e => { e.preventDefault(); login("user"); navigate("/dashboard"); }} className="space-y-4">
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
      <p className="text-sm text-muted-foreground text-center mt-6">Đã có tài khoản? <button onClick={() => navigate("/login")} className="text-primary font-medium hover:underline">Đăng nhập</button></p>
    </AuthLayout>
  );
}

export function Forgot() {
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  return (
    <AuthLayout>
      <button onClick={() => navigate("/login")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft size={15} /> Quay lại</button>
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
          <Btn block size="lg" onClick={() => navigate("/login")}>Xác nhận & Đăng nhập</Btn>
        </div>
      )}
    </AuthLayout>
  );
}
