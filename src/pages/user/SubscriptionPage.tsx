import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useApp } from "@/stores/app.store";
import { PUBLIC_SUBSCRIPTIONS } from "@/mocks";
import type { Subscription } from "@/mocks";
import { Card, Btn, Field, PageTitle } from "@/components/common/kit";
import { Check, Crown, ArrowLeft, CreditCard, Lock, ShieldCheck, Sparkles, CheckCircle2, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import invoicePrintCss from "@/styles/invoice-print.css?raw";

export function Subscription() {
  const { t } = useTranslation();
  const { plan } = useApp();
  const navigate = useNavigate();
  return (
    <div>
      <PageTitle title={t("subscription.pageTitle")} subtitle={t("subscription.pageSubtitle")} />
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PUBLIC_SUBSCRIPTIONS.map(p => {
          const isCurrent = plan === p.name;
          const features = Object.values(t(`subscription.plans.${p.name}.features`, { returnObjects: true }) as Record<string, string>);
          const missing = Object.values(t(`subscription.plans.${p.name}.missing`, { returnObjects: true }) as Record<string, string>);
          const price = t(`subscription.plans.${p.name}.price`);
          const period = t(`subscription.plans.${p.name}.period`);
          return (
          <Card key={p.name} className={`p-6 relative flex flex-col ${isCurrent ? "ring-2 ring-primary shadow-lg shadow-primary/15" : ""}`} hover={false}>
            {isCurrent && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">{t("subscription.status.currentBadge")}</span>}
            <div className="flex items-center gap-2 mb-2">
              {isCurrent ? <Crown size={20} className="text-primary" /> : <ShieldCheck size={20} className="text-muted-foreground" />}
              <h3 className="font-bold text-xl text-foreground">{p.name}</h3>
            </div>
            <div className="mb-5"><span className="font-extrabold text-3xl text-foreground">{price}</span> <span className="text-sm text-muted-foreground">/ {period}</span></div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-foreground"><Check size={16} className="text-success mt-0.5 flex-shrink-0" /> {f}</li>)}
              {missing.map(f => <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground/60 line-through"><Check size={16} className="mt-0.5 flex-shrink-0 opacity-40" /> {f}</li>)}
            </ul>
            {isCurrent
              ? <Btn block size="lg" variant="primary" className="opacity-100 cursor-default">{t("subscription.status.currentBtn")}</Btn>
              : p.name === "Free"
                ? <Btn block size="lg" variant="primary" disabled className="disabled:opacity-100 disabled:cursor-default">{t("subscription.status.freeBtn")}</Btn>
                : <Btn block size="lg" icon={<Crown size={16} />} onClick={() => navigate("/checkout", { state: { plan: p.name } })}>{t("subscription.status.upgradeBtn", { plan: p.name })}</Btn>}
          </Card>
          );
        })}
      </div>
    </div>
  );
}

export function Checkout() {
  const { t, i18n } = useTranslation();
  const { setPlan, updateAccount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [done, setDone] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const planName = (location.state as Record<string, unknown>)?.plan as string | undefined;
  const selected = PUBLIC_SUBSCRIPTIONS.find(s => s.name === planName) ?? PUBLIC_SUBSCRIPTIONS.find(s => s.name === "Premium")!;
  const pay = (e: React.FormEvent) => { e.preventDefault(); setDone(true); const newPlan = selected.name as "Premium" | "Premium Năm"; setPlan(newPlan); updateAccount({ plan: newPlan }); };

  function handleExportInvoice() {
    const d = new Date();
    const lang = i18n.resolvedLanguage || i18n.language || "vi";
    const locale = lang === "vi" ? "vi-VN" : "en-US";
    const invNum = `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")}`;
    const last4 = cardNumber.replace(/\D/g, "").slice(-4) || "4242";
    const customerName = nameOnCard.trim() || (lang === "vi" ? "Khách hàng" : "Valued Customer");
    const price = t(`subscription.plans.${selected.name}.price`);
    const period = t(`subscription.plans.${selected.name}.period`);

    const html = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"><title>${t("subscription.checkout.invoice.title")}</title>
<style>${invoicePrintCss}</style></head><body>
<div class="print-area no-print"><button onclick="window.print()">🖨 ${t("subscription.checkout.invoice.printBtn")}</button></div>
<div class="invoice-wrap">
<div class="header">
  <div class="brand">PetPulse <span>${t("subscription.checkout.invoice.title")}</span></div>
  <div class="meta">
    <strong>${t("subscription.checkout.invoice.invoiceNum")}:</strong> ${invNum}<br>
    <strong>${t("subscription.checkout.invoice.date")}:</strong> ${d.toLocaleDateString(locale)} ${d.toLocaleTimeString(locale)}
  </div>
</div>

<div style="text-align:center;margin-bottom:24px"><span class="badge">${t("subscription.checkout.invoice.paid")}</span></div>

<table>
  <thead><tr>
    <th>${t("subscription.checkout.invoice.plan")}</th>
    <th>${t("subscription.checkout.invoice.period")}</th>
    <th style="text-align:right">${t("subscription.checkout.invoice.amount")}</th>
  </tr></thead>
  <tbody>
    <tr>
      <td style="font-weight:600">${selected.name}</td>
      <td>${period}</td>
      <td style="text-align:right">${price}</td>
    </tr>
  </tbody>
</table>

<div class="details-grid">
  <div class="group">
    <h3>${t("subscription.checkout.invoice.customer")}</h3>
    <p>${customerName}</p>
  </div>
  <div class="group">
    <h3>${t("subscription.checkout.invoice.paymentMethod")}</h3>
    <p>${t("subscription.checkout.invoice.card")} ****${last4}</p>
  </div>
</div>

<div class="footer">${t("subscription.checkout.invoice.footer")}</div>
</div>
</body></html>`;

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    a.download = `petpulse-invoice-${dateStr}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (done) return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-3xl bg-success-surface text-success flex items-center justify-center mx-auto mb-5"><CheckCircle2 size={32} /></div>
      <h1 className="font-extrabold text-2xl text-foreground mb-2">{t("subscription.checkout.successTitle")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t("subscription.checkout.successDescPart1")}<b className="text-primary">{selected.name}</b>{t("subscription.checkout.successDescPart2")}</p>
      <div className="flex flex-col gap-3 items-center">
        <Btn size="lg" icon={<Sparkles size={16} />} onClick={() => navigate("/dashboard")}>{t("subscription.checkout.backToDashboard")}</Btn>
        <Btn variant="outline" size="lg" icon={<FileText size={16} />} onClick={handleExportInvoice}>{t("subscription.checkout.invoice.downloadBtn")}</Btn>
      </div>
    </div>
  );

  const price = t(`subscription.plans.${selected.name}.price`);
  const period = t(`subscription.plans.${selected.name}.period`);

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={() => navigate("/subscription")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft size={15} /> {t("subscription.checkout.back")}</button>
      <PageTitle title={t("subscription.checkout.title")} />
      <Card className="p-6" hover={false}>
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary mb-6">
          <div className="flex items-center gap-2"><Crown size={18} className="text-primary" /><span className="font-semibold text-foreground">{t("subscription.checkout.planName", { name: selected.name })}</span></div>
          <span className="font-extrabold text-lg text-primary">{price}<span className="text-xs font-normal text-muted-foreground">/{period}</span></span>
        </div>
        <form onSubmit={pay} className="space-y-4">
          <Field label={t("subscription.checkout.nameOnCard")} placeholder={t("subscription.checkout.namePlaceholder")} required value={nameOnCard} onChange={e => setNameOnCard(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t("subscription.checkout.cardNumber")}</label>
            <div className="relative">
              <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input required placeholder="4242 4242 4242 4242" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t("subscription.checkout.expiry")} placeholder="MM/YY" required />
            <Field label={t("subscription.checkout.cvv")} placeholder="123" required />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Lock size={13} /> {t("subscription.checkout.securityText")}</div>
          <Btn block size="lg" type="submit">{t("subscription.checkout.payBtn", { price })}</Btn>
        </form>
      </Card>
    </div>
  );
}
