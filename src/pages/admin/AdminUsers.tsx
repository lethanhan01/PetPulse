import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAdminUsers, toggleUserStatus } from "@/services/user.service";
import { Card, Badge, PageTitle } from "@/components/common/kit";
import { Pagination } from "@/components/Pagination/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { Search, Crown, Check, X } from "lucide-react";

export function AdminUsers() {
  const { t } = useTranslation();
  const allUsers = getAdminUsers();
  const [planFilter, setPlanFilter] = useState("");
  const [searchQ, setSearchQ] = useState("");
  const [, forceUpdate] = useState(0);
  
  const filtered = allUsers.filter(u => 
    (!planFilter || u.plan === planFilter) && 
    (!searchQ || u.name.toLowerCase().includes(searchQ.toLowerCase()) || u.email.toLowerCase().includes(searchQ.toLowerCase()))
  );
  
  const { items: users, currentPage, totalPages, setPage } = usePagination(filtered);
  const doToggle = (id: string) => { toggleUserStatus(id); forceUpdate(n => n + 1); };
  
  const FILTERS = ["", "Free", "Premium", "Premium Năm"];
  
  return (
    <div>
      <PageTitle title={t("admin.users.title")} subtitle={t("admin.users.subtitle", { count: filtered.length, total: allUsers.length })} />
      <Card className="overflow-hidden" hover={false}>
        <div className="p-3 border-b border-border flex flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder={t("admin.users.searchPlaceholder")} value={searchQ} onChange={e => setSearchQ(e.target.value)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex gap-1">{FILTERS.map(f => <button key={f} onClick={() => setPlanFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${planFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{f || t("admin.users.all")}</button>)}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted">
              <th className="p-3">{t("admin.users.table.id")}</th><th className="p-3">{t("admin.users.table.name")}</th><th className="p-3 hidden sm:table-cell">{t("admin.users.table.email")}</th><th className="p-3">{t("admin.users.table.plan")}</th><th className="p-3 hidden md:table-cell">{t("admin.users.table.petCount")}</th><th className="p-3">{t("admin.users.table.status")}</th><th className="p-3"></th>
            </tr></thead>
            <tbody>
              {users.length === 0 ? <tr><td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">{t("admin.users.empty")}</td></tr> : users.map((u, i) => (
                <tr key={u.id} className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}>
                  <td className="p-3"><code className="text-xs text-muted-foreground">{u.id}</code></td>
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
