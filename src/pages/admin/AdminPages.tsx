import { useState, useMemo, type ReactNode } from "react";
import { MOCK_AI_USAGE, MOCK_SUBSCRIPTIONS } from "@/mocks";
import { useCommunity } from "@/stores/community.store";
import { getAdminPets, getAdminStats, getAdminUsers, toggleUserStatus } from "@/services/user.service";
import { Card, Btn, Badge, Field, Modal, PageTitle, TrendChart, BarChart, HEAD, MONO } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Pagination } from "@/components/Pagination/Pagination";
import { usePagination } from "@/hooks/usePagination";
import {
  Users, PawPrint, Crown, DollarSign, Bot, Download, Search, Trash2, Pencil, Plus,
  Check, X, TrendingUp,
} from "lucide-react";

// ── Dashboard ──
const WEEK_DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const WEEK_BASE = [12, 15, 13, 18, 21, 16, 20];
const MONTH_LABELS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
const MONTH_BASE = [42, 55, 61, 58, 72, 89, 96, 102, 88, 76, 82, 95];
const Q_DATA: Record<number, number[]> = {
  2024: [72, 90, 108, 136], 2025: [164, 192, 226, 285],
};

export function AdminDashboard() {
  const [range, setRange] = useState("Tháng");
  const [rangeYear, setRangeYear] = useState(2025);
  const [weekOffset, setWeekOffset] = useState(-1);
  const statsData = getAdminStats(range as keyof typeof MOCK_AI_USAGE);
  const stats = [
    { icon: <Users size={18} />, l: "Tổng User", v: statsData.totalUsers.toLocaleString(), sub: "Tài khoản người dùng", ic: "text-primary bg-primary/10" },
    { icon: <Crown size={18} />, l: "Premium User", v: statsData.premiumUsers.toLocaleString(), sub: `${statsData.conversionRate.toFixed(1)}% chuyển đổi`, ic: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
    { icon: <PawPrint size={18} />, l: "Tổng Pet", v: statsData.totalPets.toLocaleString(), sub: "Thú cưng trên hệ thống", ic: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { icon: <Bot size={18} />, l: "AI Usage", v: statsData.aiUsage.toLocaleString(), sub: `Lượt tư vấn ${range.toLowerCase()}`, ic: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
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
    const d = new Date(); const now = d.toLocaleDateString("vi-VN");
    const aiData = MOCK_AI_USAGE[range as keyof typeof MOCK_AI_USAGE];
    const u = getAdminUsers(); const p = getAdminPets();
    const freeU = u.filter(x => x.plan === "Free").length;
    const activeU = u.filter(x => x.status === "Active").length;
    const suspendedU = u.length - activeU;
    const species: Record<string, number> = {};
    const tiers = { "Tốt (90+)": 0, "Khá (75-89)": 0, "TB (60-74)": 0, "Yếu (<60)": 0 };
    p.forEach(pet => { species[pet.species] = (species[pet.species] || 0) + 1; });
    p.forEach(pet => { if (pet.score >= 90) tiers["Tốt (90+)"]++; else if (pet.score >= 75) tiers["Khá (75-89)"]++; else if (pet.score >= 60) tiers["TB (60-74)"]++; else tiers["Yếu (<60)"]++; });
    const topUsers = [...u].sort((a, b) => b.petCount - a.petCount).slice(0, 5);
    const html = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>Báo cáo PetPulse</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#f8fafc;color:#0f172a;padding:40px}
  @media print{body{padding:20px} .no-print{display:none!important}}
  .header{text-align:center;padding:32px;background:linear-gradient(135deg,#0d9488,#14b8a6);border-radius:16px;color:#fff;margin-bottom:24px}
  .header h1{font-size:28px;font-weight:700;margin-bottom:4px}
  .header p{font-size:14px;opacity:.85}
  .grid2{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
  .grid4{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:24px}
  .card{background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.06);border:1px solid #e2e8f0}
  .card .label{font-size:13px;color:#64748b;margin-bottom:4px}
  .card .value{font-size:28px;font-weight:700;color:#0f172a}
  .card .sub{font-size:12px;color:#94a3b8;margin-top:2px}
  section{margin-bottom:28px}
  section h2{font-size:17px;font-weight:600;color:#0f172a;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #e2e8f0}
  .stat-row{display:flex;gap:24px;font-size:14px;padding:6px 0}
  .stat-row .lbl{color:#64748b;min-width:140px}
  .stat-row .val{font-weight:600;color:#0f172a}
  table{width:100%;border-collapse:collapse;margin-bottom:16px}
  th{text-align:left;padding:9px 10px;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.5px;background:#f1f5f9;border-bottom:2px solid #e2e8f0}
  td{padding:9px 10px;font-size:13px;border-bottom:1px solid #e2e8f0}
  tr:last-child td{border-bottom:none}
  .footer{text-align:center;font-size:12px;color:#94a3b8;margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0}
  .btn-print{display:inline-block;padding:10px 24px;background:#0d9488;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;margin-top:16px}
  .btn-print:hover{background:#0f766e}
</style></head><body>
<div class="no-print" style="text-align:right;margin-bottom:16px"><button class="btn-print" onclick="window.print()">🖨 In / Lưu PDF</button></div>
<div class="header"><h1>PetPulse</h1><p>Báo cáo thống kê hệ thống • ${now}</p></div>

<div class="grid2">${stats.map(s => `<div class="card"><div class="label">${s.l}</div><div class="value">${s.v}</div><div class="sub">${s.sub}</div></div>`).join("")}</div>

<div class="grid4">
<div class="card">
  <h2>👥 Người dùng</h2>
  <div class="stat-row"><span class="lbl">Tổng người dùng</span><span class="val">${u.length}</span></div>
  <div class="stat-row"><span class="lbl">Free</span><span class="val">${freeU}</span></div>
  <div class="stat-row"><span class="lbl">Premium</span><span class="val">${u.length - freeU}</span></div>
  <div class="stat-row"><span class="lbl">Tỷ lệ chuyển đổi</span><span class="val">${statsData.conversionRate.toFixed(1)}%</span></div>
  <div class="stat-row"><span class="lbl">Đang hoạt động</span><span class="val">${activeU}</span></div>
  <div class="stat-row"><span class="lbl">Tạm khóa</span><span class="val">${suspendedU}</span></div>
</div>
<div class="card">
  <h2>🐾 Thú cưng</h2>
  <div class="stat-row"><span class="lbl">Tổng số thú cưng</span><span class="val">${p.length}</span></div>
  ${Object.entries(species).map(([s, n]) => `<div class="stat-row"><span class="lbl">${s}</span><span class="val">${n}</span></div>`).join("\n")}
</div>
<div class="card">
  <h2>🏥 Phân bố sức khỏe</h2>
  ${Object.entries(tiers).map(([t, n]) => `<div class="stat-row"><span class="lbl">${t}</span><span class="val">${n} (${(n / p.length * 100).toFixed(0)}%)</span></div>`).join("\n")}
</div>
<div class="card">
  <h2>⭐ Top chủ nuôi</h2>
  <table><thead><tr><th>Người dùng</th><th>Gói</th><th>Số pet</th></tr></thead><tbody>${topUsers.map(u2 => `<tr><td style="font-weight:500">${u2.name}</td><td>${u2.plan}</td><td>${u2.petCount}</td></tr>`).join("")}</tbody></table>
</div>
</div>

<section><h2>📊 Doanh thu (${range})</h2>
<table><thead><tr><th>Kỳ</th><th>Giá trị (triệu đồng)</th></tr></thead><tbody>${revenueData.map(d => `<tr><td style="font-weight:500">${d.label}</td><td>${d.value.toLocaleString("vi-VN")}</td></tr>`).join("")}</tbody></table></section>

<section><h2>📈 AI Usage (${range})</h2>
<table><thead><tr><th>Kỳ</th><th>Lượt tư vấn</th></tr></thead><tbody>${aiData.map(d => `<tr><td style="font-weight:500">${d.label}</td><td>${d.value.toLocaleString("vi-VN")}</td></tr>`).join("")}</tbody></table></section>

<section><h2>💳 Gói đăng ký</h2>
<table><thead><tr><th>Gói</th><th>Giá</th><th>Người đăng ký</th></tr></thead><tbody>${MOCK_SUBSCRIPTIONS.map(s2 => `<tr><td style="font-weight:500">${s2.name}</td><td>${s2.price}</td><td>${s2.subscribers.toLocaleString("vi-VN")}</td></tr>`).join("")}</tbody></table></section>

<div class="footer">PetPulse &bull; Báo cáo được tạo lúc ${d.toLocaleTimeString("vi-VN")} &bull; Dữ liệu mô phỏng</div>
</body></html>`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    a.download = `bao-cao-petpulse-${now.replace(/\//g, "-")}.html`; a.click(); URL.revokeObjectURL(a.href);
  };
  return (
    <div className="space-y-6">
      <PageTitle title="Thống kê hệ thống" subtitle="Tổng quan chỉ số PetPulse"
        action={<Btn variant="outline" icon={<Download size={16} />} onClick={handleExport}>Xuất báo cáo</Btn>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.l} className="p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.ic}`}>{s.icon}</div>
            <div className="font-extrabold text-2xl text-foreground" style={HEAD}>{s.v}</div>
            <div className="text-sm font-medium text-foreground">{s.l}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2" style={HEAD}><DollarSign size={17} className="text-primary" /> Doanh thu <span className="text-xs font-normal text-muted-foreground">(triệu đồng)</span></h3>
            <div className="flex items-center gap-2">
              {range === "Tuần" ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
                  <button onClick={() => setWeekOffset(w => w - 1)} className="px-1.5 py-1 rounded hover:bg-secondary transition-colors">←</button>
                  <span className="px-1 font-medium text-foreground min-w-[7rem] text-center">Tuần {String(30 + weekOffset).padStart(2, "0")}, 2026</span>
                  <button onClick={() => setWeekOffset(w => Math.min(w + 1, 0))} className="px-1.5 py-1 rounded hover:bg-secondary transition-colors">→</button>
                  {weekOffset < 0 && <span className="text-[10px] ml-1">(tuần trước)</span>}
                  {weekOffset === 0 && <span className="text-[10px] ml-1">(tuần này)</span>}
                </div>
              ) : range === "Quý" ? (
                <select value={rangeYear} onChange={e => setRangeYear(Number(e.target.value))}
                  className="text-xs bg-secondary text-foreground rounded-lg border border-border px-2 py-1 outline-none cursor-pointer">
                  {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              ) : null}
              {["Tuần", "Tháng", "Quý"].map(r => (
                <button key={r} onClick={() => setRange(r)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{r}</button>
              ))}
            </div>
          </div>
          <div className="h-56">
            <BarChart height={224} data={revenueData} />
          </div>
        </Card>
        <Card className="p-5" hover={false}>
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-4" style={HEAD}><TrendingUp size={17} className="text-primary" /> AI Usage (lượt/tháng)</h3>
          <div className="h-56">
            <TrendChart height={224} showArea showXLabels data={MOCK_AI_USAGE[range as keyof typeof MOCK_AI_USAGE]} />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Table helpers ──
function TableShell({ title, sub, children, action }: { title: string; sub: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div>
      <PageTitle title={title} subtitle={sub} action={action} />
      <Card className="overflow-hidden" hover={false}>
        <div className="p-3 border-b border-border flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Tìm kiếm..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div className="overflow-x-auto">{children}</div>
      </Card>
    </div>
  );
}

export function AdminUsers() {
  const allUsers = getAdminUsers();
  const [planFilter, setPlanFilter] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [, forceUpdate] = useState(0);
  const filtered = allUsers.filter(u => (!planFilter || u.plan === planFilter) && (!searchQ || u.name.toLowerCase().includes(searchQ.toLowerCase()) || u.email.toLowerCase().includes(searchQ.toLowerCase())));
  const { items: users, currentPage, totalPages, setPage } = usePagination(filtered);
  const doToggle = (id: string) => { toggleUserStatus(id); forceUpdate(n => n + 1); };
  const FILTERS = ["", "Free", "Premium", "Premium Năm"];
  return (
    <div>
      <PageTitle title="Quản lý User" subtitle={`${filtered.length} / ${allUsers.length} người dùng`} />
      <Card className="overflow-hidden" hover={false}>
        <div className="p-3 border-b border-border flex flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Tìm kiếm..." value={searchQ} onChange={e => setSearchQ(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-1">{FILTERS.map(f => <button key={f} onClick={() => setPlanFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${planFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{f || "Tất cả"}</button>)}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted">
              <th className="p-3">ID</th><th className="p-3">Tên</th><th className="p-3 hidden sm:table-cell">Email</th><th className="p-3">Gói</th><th className="p-3 hidden md:table-cell">Pet</th><th className="p-3">Trạng thái</th><th className="p-3"></th>
            </tr></thead>
            <tbody>
              {users.length === 0 ? <tr><td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">Không có người dùng nào thuộc gói này</td></tr> : users.map((u, i) => (
                <tr key={u.id} className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}>
                  <td className="p-3"><code className="text-xs text-muted-foreground" style={MONO}>{u.id}</code></td>
                  <td className="p-3 font-medium text-foreground">{u.name}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{u.email}</td>
                  <td className="p-3">{u.plan === "Premium" ? <Badge v="primary"><Crown size={10} />Premium</Badge> : u.plan === "Premium Năm" ? <Badge v="primary"><Crown size={10} />Premium Năm</Badge> : <Badge v="neutral">Free</Badge>}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{u.petCount}</td>
                  <td className="p-3">{u.status === "Active" ? <Badge v="success">Active</Badge> : <Badge v="danger">Suspended</Badge>}</td>
                  <td className="p-3"><button onClick={() => doToggle(u.id)} className={`p-1.5 rounded-lg transition-colors ${u.status === "Active" ? "hover:bg-destructive/10 text-destructive" : "hover:bg-secondary text-muted-foreground"}`}>{u.status === "Active" ? <X size={16} /> : <Check size={16} />}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  );
}

export function AdminPets() {
  const allPets = getAdminPets();
  const [healthFilter, setHealthFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const ownerOptions = useMemo(() => [...new Set(allPets.map(p => p.owner))].sort(), [allPets]);
  const filtered = useMemo(() => allPets.filter(p => {
    if (healthFilter === "Tốt" && p.score < 90) return false;
    if (healthFilter === "Bình thường" && (p.score < 75 || p.score >= 90)) return false;
    if (healthFilter === "Cần chú ý" && p.score >= 75) return false;
    if (ownerFilter && p.owner !== ownerFilter) return false;
    return true;
  }), [allPets, healthFilter, ownerFilter]);
  const { items: pets, currentPage, totalPages, setPage } = usePagination(filtered);
  const HEALTH_FILTERS = ["", "Tốt", "Bình thường", "Cần chú ý"];
  return (
    <div>
      <PageTitle title="Quản lý Pet" subtitle={`${filtered.length} / ${allPets.length} thú cưng`} />
      <Card className="overflow-hidden" hover={false}>
        <div className="p-3 border-b border-border flex flex-wrap items-center gap-2">
          <div className="flex gap-1">{HEALTH_FILTERS.map(f => <button key={f} onClick={() => setHealthFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${healthFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{f || "Tất cả"}</button>)}</div>
          <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} className="ml-auto px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">Tất cả chủ</option>
            {ownerOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted">
              <th className="p-3">ID</th><th className="p-3">Tên</th><th className="p-3">Loài</th><th className="p-3 hidden sm:table-cell">Giống</th><th className="p-3 hidden md:table-cell">Chủ</th><th className="p-3">Health</th>
            </tr></thead>
            <tbody>
              {pets.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">Không có thú cưng nào</td></tr> : pets.map((p, i) => (
                <tr key={p.id} className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}>
                  <td className="p-3"><code className="text-xs text-muted-foreground" style={MONO}>{p.id}</code></td>
                  <td className="p-3 font-medium text-foreground">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.species}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{p.breed}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{p.owner}</td>
                  <td className="p-3"><Badge v={p.score >= 90 ? "success" : p.score >= 75 ? "info" : "warning"}>{p.score}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />
      </Card>
    </div>
  );
}

export function AdminSubs() {
  const [modal, setModal] = useState(false);
  const { items: subscriptions, currentPage, totalPages, setPage } = usePagination(MOCK_SUBSCRIPTIONS);
  return (
    <TableShell title="Quản lý Subscription" sub="Các gói đăng ký dịch vụ"
      action={<Btn icon={<Plus size={16} />} onClick={() => setModal(true)}>Thêm gói</Btn>}>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted">
          <th className="p-3">Gói</th><th className="p-3">Giá</th><th className="p-3 hidden md:table-cell">Tính năng</th><th className="p-3">Người đăng ký</th><th className="p-3"></th>
        </tr></thead>
        <tbody>
          {subscriptions.map((s, i) => (
            <tr key={s.id} className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}>
              <td className="p-3 font-medium text-foreground">{s.name}</td>
              <td className="p-3 text-primary font-semibold">{s.price}</td>
              <td className="p-3 text-muted-foreground hidden md:table-cell max-w-xs">{s.features.join(", ")}</td>
              <td className="p-3 text-foreground">{s.subscribers.toLocaleString()}</td>
              <td className="p-3"><div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><Pencil size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={15} /></button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />
      <Modal open={modal} onClose={() => setModal(false)} title="Thêm gói đăng ký">
        <form onSubmit={e => { e.preventDefault(); setModal(false); }} className="space-y-4">
          <Field label="Tên gói" placeholder="VD: Premium Plus" required />
          <Field label="Giá" placeholder="VD: 149.000đ/tháng" required />
          <Field label="Tính năng" placeholder="Mô tả tính năng..." />
          <div className="flex gap-3"><Btn variant="outline" block type="button" onClick={() => setModal(false)}>Hủy</Btn><Btn block type="submit">Thêm gói</Btn></div>
        </form>
      </Modal>
    </TableShell>
  );
}

export function AdminModeration() {
  const { posts, approvePost, rejectPost, deletePost } = useCommunity();
  const sorted = useMemo(() => {
    const order = { pending: 0, approved: 1, rejected: 2 };
    return [...posts].sort((a, b) => order[a.status] - order[b.status]);
  }, [posts]);
  const { items: visiblePosts, currentPage, totalPages, setPage } = usePagination(sorted);
  return (
    <div>
      <PageTitle title="Kiểm duyệt Community" subtitle="Duyệt các bài đăng trên mạng xã hội thú cưng" />
      <div className="grid sm:grid-cols-2 gap-5">
        {visiblePosts.map(p => (
          <Card key={p.id} className="overflow-hidden" hover={false}>
            {p.images?.[0] && <ImageWithFallback src={p.images[0]} alt="post" className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{p.avatar}</div>
                <div className="flex-1"><p className="text-sm font-semibold text-foreground">{p.author}</p><p className="text-xs text-muted-foreground">{p.time}</p></div>
                {p.status === "approved" && <Badge v="success">Đã duyệt</Badge>}
                {p.status === "rejected" && <Badge v="danger">Từ chối</Badge>}
                {p.status === "pending" && <Badge v="warning">Chờ duyệt</Badge>}
                {p.status !== "pending" && <button onClick={() => deletePost(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors" title="Xoá bài viết"><Trash2 size={15} /></button>}
              </div>
              <p className="text-sm text-foreground mb-3">{p.content}</p>
              {p.status === "pending" && (
                <div className="flex gap-2">
                  <Btn size="sm" block icon={<Check size={15} />} onClick={() => approvePost(p.id)}>Duyệt</Btn>
                  <Btn size="sm" block variant="danger" icon={<X size={15} />} onClick={() => rejectPost(p.id)}>Từ chối</Btn>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
