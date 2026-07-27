import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getAdminPets } from "@/services/user.service";
import { Card, Badge, PageTitle } from "@/components/common/kit";
import { Pagination } from "@/components/Pagination/Pagination";
import { usePagination } from "@/hooks/usePagination";

export function AdminPets() {
  const { t } = useTranslation();
  const allPets = getAdminPets();
  const [healthFilter, setHealthFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  
  const speciesOptions = useMemo(() => [...new Set(allPets.map(p => p.species))].sort(), [allPets]);
  const ownerOptions = useMemo(() => [...new Set(allPets.map(p => p.owner))].sort(), [allPets]);
  
  const filtered = useMemo(() => allPets.filter(p => {
    if (healthFilter === "good" && p.score < 85) return false;
    if (healthFilter === "normal" && (p.score < 70 || p.score >= 85)) return false;
    if (healthFilter === "attention" && p.score >= 70) return false;
    if (speciesFilter && p.species !== speciesFilter) return false;
    if (ownerFilter && p.owner !== ownerFilter) return false;
    return true;
  }), [allPets, healthFilter, speciesFilter, ownerFilter]);
  
  const { items: pets, currentPage, totalPages, setPage } = usePagination(filtered);
  const HEALTH_FILTERS = ["", "good", "normal", "attention"];
  
  return (
    <div>
      <PageTitle title={t("admin.pets.title")} subtitle={t("admin.pets.subtitle", { count: filtered.length, total: allPets.length })} />
      <Card className="overflow-hidden" hover={false}>
        <div className="p-3 border-b border-border flex flex-wrap items-center gap-2">
          <div className="flex gap-1">{HEALTH_FILTERS.map(f => <button key={f} onClick={() => setHealthFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${healthFilter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>{f ? t(`admin.pets.healthValues.${f}`) : t("admin.pets.allHealth")}</button>)}</div>
          <select value={speciesFilter} onChange={e => setSpeciesFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">{t("admin.pets.allSpecies")}</option>
            {speciesOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">{t("admin.pets.allOwners")}</option>
            {ownerOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted">
              <th className="p-3">{t("admin.pets.table.id")}</th><th className="p-3">{t("admin.pets.table.name")}</th><th className="p-3">{t("admin.pets.table.species")}</th><th className="p-3 hidden sm:table-cell">{t("admin.pets.table.breed")}</th><th className="p-3 hidden md:table-cell">{t("admin.pets.table.owner")}</th><th className="p-3">{t("admin.pets.table.health")}</th>
            </tr></thead>
            <tbody>
              {pets.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">{t("admin.pets.empty")}</td></tr> : pets.map((p, i) => (
                <tr key={p.id} className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}>
                  <td className="p-3"><code className="text-xs text-muted-foreground">{p.id}</code></td>
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
