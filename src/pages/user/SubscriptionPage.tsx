import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import { PUBLIC_SUBSCRIPTIONS } from "@/mocks";
import { Card, Btn, Field, PageTitle, HEAD, MONO } from "@/components/common/kit";
import { Check, Crown, ArrowLeft, CreditCard, Lock, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export function Subscription() {
  const { plan } = useApp();
  const navigate = useNavigate();
  return (
    <div>
      <PageTitle title="Nâng cấp gói dịch vụ" subtitle="Mở khóa toàn bộ sức mạnh của PawPulse" />
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {PUBLIC_SUBSCRIPTIONS.map(p => (
          <Card key={p.name} className={`p-6 relative ${p.accent ? "ring-2 ring-primary" : ""}`} hover={false}>
            {p.accent && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">PHỔ BIẾN NHẤT</span>}
            <div className="flex items-center gap-2 mb-2">
              {p.accent ? <Crown size={20} className="text-primary" /> : <ShieldCheck size={20} className="text-muted-foreground" />}
              <h3 className="font-bold text-xl text-foreground" style={HEAD}>{p.name}</h3>
            </div>
            <div className="mb-5"><span className="font-extrabold text-3xl text-foreground" style={HEAD}>{p.price}</span> <span className="text-sm text-muted-foreground">/ {p.period}</span></div>
            <ul className="space-y-2.5 mb-5">
              {p.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-foreground"><Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" /> {f}</li>)}
              {p.missing.map(f => <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground/60 line-through"><Check size={16} className="mt-0.5 flex-shrink-0 opacity-40" /> {f}</li>)}
            </ul>
            {plan === p.name
              ? <Btn block variant="outline" disabled>Gói hiện tại của bạn</Btn>
              : p.accent
                ? <Btn block size="lg" icon={<Crown size={16} />} onClick={() => navigate("/checkout")}>Nâng cấp Premium</Btn>
                : <Btn block variant="outline" disabled>Miễn phí</Btn>}
          </Card>
        ))}
      </div>
    </div>
  );
}

export function Checkout() {
  const { setPlan } = useApp();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const pay = (e: React.FormEvent) => { e.preventDefault(); setDone(true); setPlan("Premium"); };

  if (done) return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-3xl bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center mx-auto mb-5"><CheckCircle2 size={32} /></div>
      <h1 className="font-extrabold text-2xl text-foreground mb-2" style={HEAD}>Thanh toán thành công! 🎉</h1>
      <p className="text-sm text-muted-foreground mb-6">Tài khoản của bạn đã được nâng cấp lên <b className="text-primary">Premium</b>. Mọi tính năng đã được mở khóa.</p>
      <Btn size="lg" icon={<Sparkles size={16} />} onClick={() => navigate("/dashboard")}>Về Dashboard</Btn>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => navigate("/subscription")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft size={15} /> Quay lại</button>
      <PageTitle title="Thanh toán" />
      <Card className="p-6" hover={false}>
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary mb-6">
          <div className="flex items-center gap-2"><Crown size={18} className="text-primary" /><span className="font-semibold text-foreground">Gói Premium</span></div>
          <span className="font-extrabold text-lg text-primary" style={HEAD}>99.000đ<span className="text-xs font-normal text-muted-foreground">/tháng</span></span>
        </div>
        <form onSubmit={pay} className="space-y-4">
          <Field label="Tên trên thẻ" placeholder="NGUYEN VAN AN" required />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Số thẻ</label>
            <div className="relative">
              <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input required placeholder="4242 4242 4242 4242" style={MONO} className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Hết hạn" placeholder="MM/YY" required />
            <Field label="CVV" placeholder="123" required />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Lock size={13} /> Thông tin thanh toán được mã hóa & bảo mật.</div>
          <Btn block size="lg" type="submit">Thanh toán 99.000đ</Btn>
        </form>
      </Card>
    </div>
  );
}
