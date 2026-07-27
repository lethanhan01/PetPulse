import { useTranslation } from "react-i18next";

export function Pagination({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (page: number) => void }) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;
  return <nav className="mt-5 flex items-center justify-center gap-2" aria-label="Phân trang">
    <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-secondary">{t("common.pagination.prev")}</button>
    {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => <button key={number} type="button" onClick={() => setPage(number)} aria-current={number === page ? "page" : undefined} className={`h-9 min-w-9 rounded-lg px-3 text-sm ${number === page ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{number}</button>)}
    <button type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-secondary">{t("common.pagination.next")}</button>
  </nav>;
}
