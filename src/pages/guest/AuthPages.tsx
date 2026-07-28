import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import { authenticateMock } from "@/services/auth.service";
import { DEMO_ADMIN_ACCOUNT_ID, DEMO_USER_ACCOUNT_ID, MOCK_ACCOUNTS } from "@/mocks";
import { Btn, Field } from "@/components/common/kit";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Eye, EyeOff, ArrowLeft, CheckCircle2, Shield, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Login() {
  const { t } = useTranslation();
  const { login } = useApp();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("an@example.com");
  const [pass, setPass] = useState("paw123");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const account = authenticateMock(email, pass);
    if (!account) { setError(t("auth.login.errorMsg")); return; }
    login(account); navigate(account.role === "admin" ? "/admin" : "/dashboard");
  };
  return (
    <AuthLayout>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h1 className="font-extrabold text-3xl text-foreground mb-1">{t("auth.login.title")}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t("auth.login.subtitle")}</p>
        <form onSubmit={submit} className="space-y-4">
          <Field label={t("auth.login.emailLabel")} type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder={t("auth.login.emailPlaceholder")} />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("auth.login.passwordLabel")}</label>
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
            <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="accent-[var(--primary)]" /> {t("auth.login.rememberMe")}</label>
            <button type="button" onClick={() => navigate("/forgot-password")} className="text-primary hover:underline">{t("auth.login.forgotPassword")}</button>
          </div>
          <Btn block size="lg" type="submit">{t("auth.login.submitBtn")}</Btn>
        </form>
        <div className="relative my-5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">{t("auth.login.quickAccess")}</span></div></div>
        <div className="grid grid-cols-2 gap-3">
          <Btn variant="outline" size="sm" icon={<UserIcon size={15} />} onClick={() => { login(MOCK_ACCOUNTS.find(account => account.id === DEMO_USER_ACCOUNT_ID)!); navigate("/dashboard"); }}>{t("auth.login.demoUser")}</Btn>
          <Btn variant="outline" size="sm" icon={<Shield size={15} />} onClick={() => { login(MOCK_ACCOUNTS.find(account => account.id === DEMO_ADMIN_ACCOUNT_ID)!); navigate("/admin"); }}>{t("auth.login.demoAdmin")}</Btn>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center mt-6">{t("auth.login.noAccount")} <button onClick={() => navigate("/register")} className="text-primary font-medium hover:underline">{t("auth.login.registerLink")}</button></p>
    </AuthLayout>
  );
}

export function Register() {
  const { t } = useTranslation();
  const { login } = useApp();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  return (
    <AuthLayout>
      <h1 className="font-extrabold text-3xl text-foreground mb-1">{t("auth.register.title")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("auth.register.subtitlePart1")} <b className="text-primary">Free</b> {t("auth.register.subtitlePart2")}</p>
      <form onSubmit={e => { e.preventDefault(); login(MOCK_ACCOUNTS.find(account => account.id === DEMO_USER_ACCOUNT_ID)!); navigate("/dashboard"); }} className="space-y-4">
        <Field label={t("auth.register.nameLabel")} placeholder={t("auth.register.namePlaceholder")} required />
        <Field label={t("auth.login.emailLabel")} type="email" placeholder={t("auth.login.emailPlaceholder")} required />
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t("auth.login.passwordLabel")}</label>
          <div className="relative">
            <input type={show ? "text" : "password"} defaultValue="paw123"
              className="w-full px-3 py-2.5 pr-10 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" required className="mt-1 accent-[var(--primary)]" /> {t("auth.register.terms")}
        </label>
        <Btn block size="lg" type="submit">{t("auth.register.submitBtn")}</Btn>
      </form>
      <p className="text-sm text-muted-foreground text-center mt-6">{t("auth.register.hasAccount")} <button onClick={() => navigate("/login")} className="text-primary font-medium hover:underline">{t("auth.register.loginLink")}</button></p>
    </AuthLayout>
  );
}

export function Forgot() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  return (
    <AuthLayout>
      <button onClick={() => navigate("/login")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft size={15} /> {t("auth.forgot.back")}</button>
      {!sent ? (
        <>
          <h1 className="font-extrabold text-3xl text-foreground mb-1">{t("auth.forgot.title")}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t("auth.forgot.subtitle")}</p>
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <Field label={t("auth.login.emailLabel")} type="email" placeholder={t("auth.login.emailPlaceholder")} required />
            <Btn block size="lg" type="submit">{t("auth.forgot.sendOtp")}</Btn>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-success-surface bg-success-surface text-success flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={28} /></div>
          <h1 className="font-extrabold text-2xl text-foreground mb-2">{t("auth.forgot.otpSentTitle")}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t("auth.forgot.otpSentDesc")}</p>
          <div className="flex justify-center gap-2 mb-6">
            {[2, 4, 8, 1, 9, 3].map((n, i) => (
              <div key={i} className="w-10 h-12 rounded-xl border border-border bg-background flex items-center justify-center font-bold text-lg text-foreground">{n}</div>
            ))}
          </div>
          <Btn block size="lg" onClick={() => navigate("/login")}>{t("auth.forgot.confirmBtn")}</Btn>
        </div>
      )}
    </AuthLayout>
  );
}
