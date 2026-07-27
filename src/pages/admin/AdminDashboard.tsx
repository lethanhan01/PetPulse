import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MOCK_AI_USAGE } from "@/mocks";
import { getAdminPets, getAdminStats, getAdminUsers } from "@/services/user.service";
import { Card, Btn, PageTitle, TrendChart, BarChart } from "@/components/common/kit";
import reportPrintCss from "@/styles/report-print.css?raw";
import { Users, PawPrint, Crown, DollarSign, Bot, Download, TrendingUp } from "lucide-react";

const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const WEEK_BASE = [12, 15, 13, 18, 21, 16, 20];
const MONTH_LABELS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
const MONTH_BASE = [42, 55, 61, 58, 72, 89, 96, 102, 88, 76, 82, 95];
const Q_DATA: Record<number, number[]> = {
  2024: [72, 90, 108, 136], 2025: [164, 192, 226, 285],
};

export function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [range, setRange] = useState("Tháng");
  const [rangeYear, setRangeYear] = useState(2025);
  const [weekOffset, setWeekOffset] = useState(-1);
  const lang = i18n.resolvedLanguage || i18n.language || "vi";
  const locale = lang === "vi" ? "vi-VN" : "en-US";
  const fileNamePrefix = lang === "vi" ? "bao-cao-petpulse" : "petpulse-report";
  const rangeLabel = range === "Tuần" ? t("admin.dashboard.revenue.week") : range === "Tháng" ? t("admin.dashboard.revenue.month") : t("admin.dashboard.revenue.quarter");

  const statsData = getAdminStats(range as keyof typeof MOCK_AI_USAGE);
  
  const stats = [
    { icon: <Users size={18} />, l: t("admin.dashboard.stats.totalUsers"), v: statsData.totalUsers.toLocaleString(), sub: t("admin.dashboard.stats.usersDesc"), ic: "text-primary bg-primary/10" },
    { icon: <Crown size={18} />, l: t("admin.dashboard.stats.premiumUsers"), v: statsData.premiumUsers.toLocaleString(), sub: t("admin.dashboard.stats.conversionRate", { rate: statsData.conversionRate.toFixed(1) }), ic: "text-warning bg-warning-surface" },
    { icon: <PawPrint size={18} />, l: t("admin.dashboard.stats.totalPets"), v: statsData.totalPets.toLocaleString(), sub: t("admin.dashboard.stats.petsDesc"), ic: "text-success bg-success-surface" },
    { icon: <Bot size={18} />, l: t("admin.dashboard.stats.aiUsage"), v: statsData.aiUsage.toLocaleString(), sub: t("admin.dashboard.stats.aiUsageDesc", { range: rangeLabel.toLowerCase() }), ic: "text-info bg-info-surface" },
  ];
  
  const revenueData = useMemo(() => {
    if (range === "Tuần") {
      return WEEK_DAYS.map((label, i) => ({ label, value: Math.max(8, WEEK_BASE[i] + weekOffset * 2 + (i % 3)) }));
    }
    if (range === "Tháng") {
      return MONTH_LABELS.map((label, i) => ({ label, value: Math.round(MONTH_BASE[i]) }));
    }
    if (Q_DATA[rangeYear]) return Q_DATA[rangeYear].map((v, i) => ({ label: `Q${i + 1}`, value: v }));
    const base = Q_DATA[2025];
    const factor = 1 + (rangeYear - 2025) * 0.15;
    return base.map((v, i) => ({ label: `Q${i + 1}`, value: Math.round(v * factor) }));
  }, [range, rangeYear, weekOffset]);

  const handleExport = () => {
    const d = new Date(); const now = d.toLocaleDateString(locale);
    const aiData = MOCK_AI_USAGE[range as keyof typeof MOCK_AI_USAGE];
    const u = getAdminUsers(); const p = getAdminPets();
    const freeU = u.filter(x => x.plan === "Free").length;
    const activeU = u.filter(x => x.status === "Active").length;
    const suspendedU = u.length - activeU;
    const species: Record<string, number> = {};
    const tiers = { [t("admin.dashboard.tiers.excellent")]: 0, [t("admin.dashboard.tiers.good")]: 0, [t("admin.dashboard.tiers.average")]: 0, [t("admin.dashboard.tiers.poor")]: 0 };
    p.forEach(pet => { species[pet.species] = (species[pet.species] || 0) + 1; });
    p.forEach(pet => { 
      if (pet.score >= 90) tiers[t("admin.dashboard.tiers.excellent")]++; 
      else if (pet.score >= 75) tiers[t("admin.dashboard.tiers.good")]++; 
      else if (pet.score >= 60) tiers[t("admin.dashboard.tiers.average")]++; 
      else tiers[t("admin.dashboard.tiers.poor")]++; 
    });
    const topUsers = [...u].sort((a, b) => b.petCount - a.petCount).slice(0, 5);
    const html = `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8"><title>${t("admin.dashboard.report.title")}</title>
<style>${reportPrintCss}</style></head><body>
<div class="no-print" style="text-align:right;margin-bottom:16px"><button class="btn-print" onclick="window.print()">🖨 ${t("admin.dashboard.report.printBtn")}</button></div>
<div class="header"><h1>PetPulse</h1><p>${t("admin.dashboard.report.subtitle")} • ${now}</p></div>

<div class="grid2">${stats.map(s => `<div class="card"><div class="label">${s.l}</div><div class="value">${s.v}</div><div class="sub">${s.sub}</div></div>`).join("")}</div>

<div class="grid4">
<div class="card">
  <h2>👥 ${t("admin.dashboard.report.users")}</h2>
  <div class="stat-row"><span class="lbl">${t("admin.dashboard.report.totalUsers")}</span><span class="val">${u.length}</span></div>
  <div class="stat-row"><span class="lbl">${t("admin.dashboard.report.free")}</span><span class="val">${freeU}</span></div>
  <div class="stat-row"><span class="lbl">${t("admin.dashboard.report.premium")}</span><span class="val">${u.length - freeU}</span></div>
  <div class="stat-row"><span class="lbl">${t("admin.dashboard.report.conversionRate")}</span><span class="val">${statsData.conversionRate.toFixed(1)}%</span></div>
  <div class="stat-row"><span class="lbl">${t("admin.dashboard.report.active")}</span><span class="val">${activeU}</span></div>
  <div class="stat-row"><span class="lbl">${t("admin.dashboard.report.suspended")}</span><span class="val">${suspendedU}</span></div>
</div>
<div class="card">
  <h2>🐾 ${t("admin.dashboard.report.pets")}</h2>
  <div class="stat-row"><span class="lbl">${t("admin.dashboard.report.totalPets")}</span><span class="val">${p.length}</span></div>
  ${Object.entries(species).map(([s, n]) => `<div class="stat-row"><span class="lbl">${s}</span><span class="val">${n}</span></div>`).join("\n")}
</div>
<div class="card">
  <h2>🏥 ${t("admin.dashboard.report.healthDistribution")}</h2>
  ${Object.entries(tiers).map(([tier, n]) => `<div class="stat-row"><span class="lbl">${tier}</span><span class="val">${n} (${(n / p.length * 100).toFixed(0)}%)</span></div>`).join("\n")}
</div>
<div class="card">
  <h2>⭐ ${t("admin.dashboard.report.topOwners")}</h2>
  <table><thead><tr><th>${t("admin.dashboard.report.user")}</th><th>${t("admin.dashboard.report.plan")}</th><th>${t("admin.dashboard.report.petCount")}</th></tr></thead><tbody>${topUsers.map(u2 => `<tr><td style="font-weight:500">${u2.name}</td><td>${u2.plan}</td><td>${u2.petCount}</td></tr>`).join("")}</tbody></table>
</div>
</div>

<section><h2>📊 ${t("admin.dashboard.report.revenue")} (${rangeLabel})</h2>
<table><thead><tr><th>${t("admin.dashboard.report.period")}</th><th>${t("admin.dashboard.report.value")} ${t("admin.dashboard.report.revenueUnit")}</th></tr></thead><tbody>${revenueData.map(d => `<tr><td style="font-weight:500">${d.label}</td><td>${d.value.toLocaleString(locale)}</td></tr>`).join("")}</tbody></table></section>

<section><h2>📈 ${t("admin.dashboard.report.aiUsage")} (${rangeLabel})</h2>
<table><thead><tr><th>${t("admin.dashboard.report.period")}</th><th>${t("admin.dashboard.report.aiUsageUnit")}</th></tr></thead><tbody>${aiData.map(d => `<tr><td style="font-weight:500">${d.label}</td><td>${d.value.toLocaleString(locale)}</td></tr>`).join("")}</tbody></table></section>

<div class="footer">PetPulse &bull; ${t("admin.dashboard.report.footer", { time: d.toLocaleTimeString(locale) })}</div>
</body></html>`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const dateStr = now.replace(/[\\/]/g, "-");
    a.download = `${fileNamePrefix}-${dateStr}.html`; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <div className="space-y-6">
      <PageTitle title={t("admin.dashboard.title")} subtitle={t("admin.dashboard.subtitle")}
        action={<Btn variant="outline" icon={<Download size={16} />} onClick={handleExport}>{t("admin.dashboard.exportReport")}</Btn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.l} className="p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.ic}`}>{s.icon}</div>
            <div className="font-extrabold text-2xl text-foreground">{s.v}</div>
            <div className="text-sm font-medium text-foreground">{s.l}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2"><DollarSign size={17} className="text-primary" /> {t("admin.dashboard.revenue.title")} <span className="text-xs font-normal text-muted-foreground">{t("admin.dashboard.revenue.unit")}</span></h3>
            <div className="flex items-center gap-2">
              {range === "Tuần" ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
                  <button onClick={() => setWeekOffset(w => w - 1)} className="px-1.5 py-1 rounded hover:bg-secondary transition-colors">←</button>
                  <span className="px-1 font-medium text-foreground min-w-[7rem] text-center">{t("admin.dashboard.revenue.week")} {String(30 + weekOffset).padStart(2, "0")}, 2026</span>
                  <button onClick={() => setWeekOffset(w => Math.min(w + 1, 0))} className="px-1.5 py-1 rounded hover:bg-secondary transition-colors">→</button>
                  {weekOffset < 0 && <span className="text-[10px] ml-1">{t("admin.dashboard.revenue.lastWeek")}</span>}
                  {weekOffset === 0 && <span className="text-[10px] ml-1">{t("admin.dashboard.revenue.thisWeek")}</span>}
                </div>
              ) : range === "Quý" ? (
                <select value={rangeYear} onChange={e => setRangeYear(Number(e.target.value))}
                  className="text-xs bg-secondary text-foreground rounded-lg border border-border px-2 py-1 outline-none">
                  {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              ) : null}
              {["Tuần", "Tháng", "Quý"].map(r => (
                <button key={r} onClick={() => setRange(r)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                  {r === "Tuần" ? t("admin.dashboard.revenue.week") : r === "Tháng" ? t("admin.dashboard.revenue.month") : t("admin.dashboard.revenue.quarter")}
                </button>
              ))}
            </div>
          </div>
          <div className="h-56">
            <BarChart height={224} data={revenueData} />
          </div>
        </Card>
        <Card className="p-5" hover={false}>
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-4"><TrendingUp size={17} className="text-primary" /> {t("admin.dashboard.aiUsageChart")}</h3>
          <div className="h-56">
            <TrendChart height={224} showArea showXLabels data={MOCK_AI_USAGE[range as keyof typeof MOCK_AI_USAGE]} />
          </div>
        </Card>
      </div>
    </div>
  );
}
