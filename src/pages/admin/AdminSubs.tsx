import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { MOCK_SUBSCRIPTIONS } from "@/mocks";
import { Card, Btn, Field, Modal, PageTitle } from "@/components/common/kit";
import { Pagination } from "@/components/Pagination/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

function TableShell({ title, sub, children, action }: { title: string; sub: string; children: ReactNode; action?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div>
      <PageTitle title={title} subtitle={sub} action={action} />
      <Card className="overflow-hidden" hover={false}>
        <div className="p-3 border-b border-border flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder={t("admin.users.searchPlaceholder")} className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div className="overflow-x-auto">{children}</div>
      </Card>
    </div>
  );
}

export function AdminSubs() {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const { items: subscriptions, currentPage, totalPages, setPage } = usePagination(MOCK_SUBSCRIPTIONS);
  
  return (
    <TableShell title={t("admin.subs.title")} sub={t("admin.subs.subtitle")}
      action={<Btn icon={<Plus size={16} />} onClick={() => setModal(true)}>{t("admin.subs.addBtn")}</Btn>}>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted">
          <th className="p-3">{t("admin.subs.table.plan")}</th><th className="p-3">{t("admin.subs.table.price")}</th><th className="p-3 hidden md:table-cell">{t("admin.subs.table.features")}</th><th className="p-3">{t("admin.subs.table.subscribers")}</th><th className="p-3"></th>
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
      
      <Modal open={modal} onClose={() => setModal(false)} title={t("admin.subs.modal.title")}>
        <form onSubmit={e => { e.preventDefault(); setModal(false); }} className="space-y-4">
          <Field label={t("admin.subs.modal.nameLabel")} placeholder={t("admin.subs.modal.namePlaceholder")} required />
          <Field label={t("admin.subs.modal.priceLabel")} placeholder={t("admin.subs.modal.pricePlaceholder")} required />
          <Field label={t("admin.subs.modal.featuresLabel")} placeholder={t("admin.subs.modal.featuresPlaceholder")} />
          <div className="flex gap-3">
            <Btn variant="outline" block type="button" onClick={() => setModal(false)}>{t("admin.subs.modal.cancel")}</Btn>
            <Btn block type="submit">{t("admin.subs.modal.submit")}</Btn>
          </div>
        </form>
      </Modal>
    </TableShell>
  );
}
