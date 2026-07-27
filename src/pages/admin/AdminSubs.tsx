import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { MOCK_SUBSCRIPTIONS } from "@/mocks";
import type { Subscription } from "@/mocks/types";
import { Card, Btn, Field, Modal, PageTitle } from "@/components/common/kit";
import { Pagination } from "@/components/Pagination/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const STORAGE_KEY = "petpulse:admin-subs";

type ModalMode =
  | { type: "add" }
  | { type: "edit"; sub: Subscription }
  | { type: "delete"; sub: Subscription }
  | null;

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

function initList(): Subscription[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return MOCK_SUBSCRIPTIONS;
}

export function AdminSubs() {
  const { t } = useTranslation();
  const [modal, setModal] = useState<ModalMode>(null);
  const [list, setList] = useState<Subscription[]>(initList);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const { items: subscriptions, currentPage, totalPages, setPage } = usePagination(list);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, [list]);

  const closeModal = useCallback(() => {
    setModal(null);
    setName(""); setPrice(""); setFeaturesText("");
  }, []);

  function openAdd() {
    setName(""); setPrice(""); setFeaturesText("");
    setModal({ type: "add" });
  }

  function openEdit(sub: Subscription) {
    setName(sub.name);
    setPrice(sub.price);
    setFeaturesText(sub.features.join(", "));
    setModal({ type: "edit", sub });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;
    const features = featuresText ? featuresText.split(",").map(f => f.trim()).filter(Boolean) : [];
    if (modal?.type === "edit") {
      setList(prev => prev.map(s => s.id === modal.sub.id ? { ...s, name: name.trim(), price: price.trim(), features } : s));
    } else {
      const newSub: Subscription = {
        id: `SUB-${String(list.length + 1).padStart(2, "0")}`,
        name: name.trim(),
        price: price.trim(),
        period: "tháng",
        features,
        missing: [],
        subscribers: 0,
        active: true,
      };
      setList(prev => [...prev, newSub]);
    }
    closeModal();
  }

  function handleDelete() {
    if (modal?.type !== "delete") return;
    setList(prev => prev.filter(s => s.id !== modal.sub.id));
    closeModal();
  }

  return (
    <TableShell title={t("admin.subs.title")} sub={t("admin.subs.subtitle")}
      action={<Btn icon={<Plus size={16} />} onClick={openAdd}>{t("admin.subs.addBtn")}</Btn>}>
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
                <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground" onClick={() => openEdit(s)}><Pencil size={15} /></button>
                <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" onClick={() => setModal({ type: "delete", sub: s })}><Trash2 size={15} /></button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />

      {modal?.type === "delete" ? (
        <Modal open onClose={closeModal} title={t("admin.subs.modal.confirmDelete.title")}>
          <p className="text-sm text-muted-foreground mb-5">
            {t("admin.subs.modal.confirmDelete.message", { name: modal.sub.name })}
          </p>
          <div className="flex gap-3 justify-end">
            <Btn variant="outline" type="button" onClick={closeModal}>{t("admin.subs.modal.confirmDelete.cancel")}</Btn>
            <Btn variant="danger" type="button" onClick={handleDelete}>{t("admin.subs.modal.confirmDelete.confirm")}</Btn>
          </div>
        </Modal>
      ) : (
        <Modal open={modal?.type === "add" || modal?.type === "edit"} onClose={closeModal}
          title={modal?.type === "edit" ? t("admin.subs.modal.editTitle") : t("admin.subs.modal.title")}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label={t("admin.subs.modal.nameLabel")} placeholder={t("admin.subs.modal.namePlaceholder")} required value={name} onChange={e => setName(e.target.value)} />
            <Field label={t("admin.subs.modal.priceLabel")} placeholder={t("admin.subs.modal.pricePlaceholder")} required value={price} onChange={e => setPrice(e.target.value)} />
            <Field label={t("admin.subs.modal.featuresLabel")} placeholder={t("admin.subs.modal.featuresPlaceholder")} value={featuresText} onChange={e => setFeaturesText(e.target.value)} />
            <div className="flex gap-3">
              <Btn variant="outline" block type="button" onClick={closeModal}>{t("admin.subs.modal.cancel")}</Btn>
              <Btn block type="submit">{modal?.type === "edit" ? t("admin.subs.modal.save") : t("admin.subs.modal.submit")}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </TableShell>
  );
}
