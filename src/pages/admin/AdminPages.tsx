import { useState, type ReactNode } from "react";
import { ADMIN_USERS, ADMIN_PETS, ADMIN_SUBS, COMMUNITY, REVENUE, AI_USAGE } from "@/services/user.service";
import { Card, Btn, Badge, Field, Modal, PageTitle, TrendChart, BarChart, HEAD, MONO } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Pagination } from "@/components/Pagination/Pagination";
import { usePagination } from "@/hooks/usePagination";
import {
  Users, PawPrint, Crown, DollarSign, Bot, Download, Search, Trash2, Pencil, Plus,
  Check, X, TrendingUp, MoreHorizontal,
} from "lucide-react";

// ── Dashboard ──
export function AdminDashboard() {
  const [range, setRange] = useState("Tháng");
  const stats = [
    { icon: <Users size={18} />, l: "Tổng User", v: "8,420", sub: "+12% so với tháng trước", ic: "text-primary bg-primary/10" },
    { icon: <Crown size={18} />, l: "Premium User", v: "2,130", sub: "25.3% chuyển đổi", ic: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
    { icon: <PawPrint size={18} />, l: "Tổng Pet", v: "11,204", sub: "+340 tuần này", ic: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { icon: <Bot size={18} />, l: "AI Usage", v: "920", sub: "Lượt tư vấn tháng 7", ic: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
  ];
  return (
    <div className="space-y-6">
      <PageTitle title="Thống kê hệ thống" subtitle="Tổng quan chỉ số PawPulse"
        action={<Btn variant="outline" icon={<Download size={16} />}>Xuất báo cáo</Btn>} />
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
            <h3 className="font-bold text-foreground flex items-center gap-2" style={HEAD}><DollarSign size={17} className="text-primary" /> Doanh thu (triệu đ)</h3>
            <div className="flex gap-1">{["Tuần", "Tháng", "Quý"].map(r => (
              <button key={r} onClick={() => setRange(r)} className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{r}</button>
            ))}</div>
          </div>
          <div className="h-56">
            <BarChart height={224} data={REVENUE.map((r) => ({ label: r.m, value: r.v }))} />
          </div>
        </Card>
        <Card className="p-5" hover={false}>
          <h3 className="font-bold text-foreground flex items-center gap-2 mb-4" style={HEAD}><TrendingUp size={17} className="text-primary" /> AI Usage (lượt/tháng)</h3>
          <div className="h-56">
            <TrendChart height={224} showArea showXLabels data={AI_USAGE.map((r) => ({ label: r.m, value: r.v }))} />
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
  const { items: users, currentPage, totalPages, setPage } = usePagination(ADMIN_USERS);
  return (
    <TableShell title="Quản lý User" sub={`${ADMIN_USERS.length} người dùng`}>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted">
          <th className="p-3">ID</th><th className="p-3">Tên</th><th className="p-3 hidden sm:table-cell">Email</th><th className="p-3">Gói</th><th className="p-3 hidden md:table-cell">Pet</th><th className="p-3">Trạng thái</th><th className="p-3"></th>
        </tr></thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}>
              <td className="p-3"><code className="text-xs text-muted-foreground" style={MONO}>{u.id}</code></td>
              <td className="p-3 font-medium text-foreground">{u.name}</td>
              <td className="p-3 text-muted-foreground hidden sm:table-cell">{u.email}</td>
              <td className="p-3">{u.plan === "Premium" ? <Badge v="primary"><Crown size={10} />Premium</Badge> : <Badge v="neutral">Freemium</Badge>}</td>
              <td className="p-3 text-muted-foreground hidden md:table-cell">{u.pets}</td>
              <td className="p-3">{u.status === "Active" ? <Badge v="success">Active</Badge> : <Badge v="danger">Suspended</Badge>}</td>
              <td className="p-3"><button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><MoreHorizontal size={16} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />
    </TableShell>
  );
}

export function AdminPets() {
  const { items: pets, currentPage, totalPages, setPage } = usePagination(ADMIN_PETS);
  return (
    <TableShell title="Quản lý Pet" sub={`${ADMIN_PETS.length} thú cưng trên hệ thống`}>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted">
          <th className="p-3">ID</th><th className="p-3">Tên</th><th className="p-3">Loài</th><th className="p-3 hidden sm:table-cell">Giống</th><th className="p-3 hidden md:table-cell">Chủ</th><th className="p-3">Health</th>
        </tr></thead>
        <tbody>
          {pets.map((p, i) => (
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
      <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />
    </TableShell>
  );
}

export function AdminSubs() {
  const [modal, setModal] = useState(false);
  const { items: subscriptions, currentPage, totalPages, setPage } = usePagination(ADMIN_SUBS);
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
              <td className="p-3 text-muted-foreground hidden md:table-cell max-w-xs">{s.features}</td>
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
  const [posts, setPosts] = useState(COMMUNITY.map(p => ({ ...p, status: "pending" as "pending" | "approved" | "rejected" })));
  const act = (id: string, status: "approved" | "rejected") => setPosts(ps => ps.map(p => p.id === id ? { ...p, status } : p));
  const { items: visiblePosts, currentPage, totalPages, setPage } = usePagination(posts);
  return (
    <div>
      <PageTitle title="Kiểm duyệt Community" subtitle="Duyệt các bài đăng trên mạng xã hội thú cưng" />
      <div className="grid sm:grid-cols-2 gap-5">
        {visiblePosts.map(p => (
          <Card key={p.id} className="overflow-hidden" hover={false}>
            {p.image && <ImageWithFallback src={p.image} alt="post" className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{p.avatar}</div>
                <div className="flex-1"><p className="text-sm font-semibold text-foreground">{p.author}</p><p className="text-xs text-muted-foreground">{p.time}</p></div>
                {p.status === "approved" && <Badge v="success">Đã duyệt</Badge>}
                {p.status === "rejected" && <Badge v="danger">Từ chối</Badge>}
                {p.status === "pending" && <Badge v="warning">Chờ duyệt</Badge>}
              </div>
              <p className="text-sm text-foreground mb-3">{p.content}</p>
              {p.status === "pending" && (
                <div className="flex gap-2">
                  <Btn size="sm" block icon={<Check size={15} />} onClick={() => act(p.id, "approved")}>Duyệt</Btn>
                  <Btn size="sm" block variant="danger" icon={<X size={15} />} onClick={() => act(p.id, "rejected")}>Từ chối</Btn>
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
