import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import type { AIConsult } from "@/types/app.types";
import { createAIConsult, SYMPTOM_TAGS } from "@/mocks";
import { Card, Btn, Badge, Select, Textarea, PageTitle } from "@/components/common/kit";
import { Sparkles, AlertTriangle, Stethoscope, HeartPulse, Save, Loader2, Bot } from "lucide-react";
import { toast } from "sonner";


export function AIChecker() {
  const { t } = useTranslation();
  const { pets, updatePet } = useApp();
  const navigate = useNavigate();
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIConsult | null>(null);

  const run = () => {
    if (!symptoms.trim()) return;
    const currentId = petId;
    const currentSymptoms = symptoms;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const pet = pets.find(p => p.id === currentId);
      setResult(createAIConsult(pet?.name || "", currentSymptoms));
      setLoading(false);
    }, 1400);
  };
  const save = () => {
    if (!result) return;
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      updatePet(pet.id, { consults: [result, ...pet.consults] });
      const name = pet.name;
      toast.success(t("ai.result.toastSaved", { name }), { style: { background: "var(--success)", color: "var(--primary-foreground)", border: "none" } });
      navigate("/pets/" + pet.id + "?tab=consult");
    }
  };

  const sevColor = result?.severity === "Cao" ? "danger" : result?.severity === "Trung bình" ? "warning" : "success";

  return (
    <div>
      <PageTitle title={t("ai.page.title")} subtitle={t("ai.page.subtitle")} />
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Form */}
        <div>
          <Card className="flex-1 rounded-3xl p-5 md:p-6 relative border-primary/20 z-0 h-full flex flex-col" hover={false}>
            {/* Speech bubble tail (Left side) */}
            <div className="absolute -left-3 bottom-12 w-6 h-6 bg-card border-l border-b border-primary/20 rotate-45 rounded-sm"></div>
            
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Bot size={18} /></div>
              <h3 className="font-bold text-foreground">{t("ai.form.title")}</h3>
            </div>
            <div className="space-y-4 relative z-10 flex-1 flex flex-col">
            <Select label={t("ai.form.selectPet")} value={petId} onChange={e => setPetId(e.target.value)}>
              {pets.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name} — {p.breed}</option>)}
            </Select>
            <Textarea label={t("ai.form.symptomsLabel")} value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={5} placeholder={t("ai.form.symptomsPlaceholder")} />
            <div>
              <p className="text-xs text-muted-foreground mb-2">{t("ai.form.commonSymptoms")}</p>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_TAGS.map(t => {
                  const selected = symptoms.split(",").map(s => s.trim().toLowerCase()).includes(t.toLowerCase());
                  return (
                    <button key={t} onClick={() => setSymptoms(s => {
                      const list = s.split(",").map(x => x.trim()).filter(Boolean);
                      const idx = list.findIndex(x => x.toLowerCase() === t.toLowerCase());
                      if (idx >= 0) { list.splice(idx, 1); return list.join(", "); }
                      return list.length ? `${list.join(", ")}, ${t.toLowerCase()}` : t;
                    })} className={`px-2.5 py-1 rounded-full border text-xs transition-colors ${selected ? "border-primary bg-primary/10 text-primary font-medium" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>{selected ? "✓" : "+"} {t}</button>
                  );
                })}
              </div>
            </div>
            <div className="mt-auto pt-4 flex flex-col gap-3">
              <Btn block size="lg" icon={<Sparkles size={17} />} loading={loading} onClick={run}>{loading ? t("ai.form.btnAnalyzing") : t("ai.form.btnAnalyze")}</Btn>
              <div className="h-8 flex items-start justify-center overflow-hidden">
                <p className="text-[11px] leading-tight text-muted-foreground text-center">{t("ai.form.warning")}</p>
              </div>
            </div>
          </div>
          </Card>
        </div>

        {/* Result */}
        <div>
          {loading && (
            <Card className="p-10 flex flex-col items-center justify-center text-center h-full" hover={false}>
              <Loader2 size={32} className="text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">{t("ai.result.loading")}</p>
            </Card>
          )}
          {!loading && !result && (
            <Card className="p-10 flex flex-col items-center justify-center text-center h-full" hover={false}>
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-3"><Sparkles size={24} className="text-primary" /></div>
              <p className="text-sm text-muted-foreground max-w-xs">{t("ai.result.empty")}</p>
            </Card>
          )}
          {!loading && result && (
            <div className="flex items-end h-full">
              <Card className="flex-1 rounded-3xl p-5 md:p-6 relative border-primary/20 z-0 h-full flex flex-col" hover={false}>
                {/* Speech bubble tail (Right side) */}
                <div className="absolute -right-3 bottom-12 w-6 h-6 bg-card border-t border-r border-primary/20 rotate-45 rounded-sm"></div>
                
                <div className="relative z-10 flex-1 flex flex-col space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground text-lg">{t("ai.result.title")}</h3>
                    <Badge v={sevColor}><AlertTriangle size={11} /> {t("ai.result.alert", { severity: result.severity })}</Badge>
                  </div>
                  <Section icon={<Stethoscope size={15} />} title={t("ai.result.conditions")}>
                    <ul className="space-y-1.5">{result.diseases.map(d => <li key={d} className="text-sm text-foreground flex gap-2"><span className="text-primary">•</span> {d}</li>)}</ul>
                  </Section>
                  <Section icon={<HeartPulse size={15} />} title={t("ai.result.firstAid")}>
                    <ol className="space-y-1.5">{result.firstAid.map((d, i) => <li key={d} className="text-sm text-foreground flex gap-2"><span className="text-primary font-bold">{i + 1}.</span> {d}</li>)}</ol>
                  </Section>
                  <div className="rounded-xl bg-primary/5 border border-primary/15 p-4 mb-2">
                    <p className="text-xs font-semibold text-primary mb-1">{t("ai.result.vetAdvice")}</p>
                    <p className="text-sm text-foreground">{result.vetAdvice}</p>
                  </div>
                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <Btn block size="lg" icon={<Save size={16} />} onClick={save}>{t("ai.result.saveBtn")}</Btn>
                    <div className="h-8"></div>
                  </div>
                </div>
              </Card>
              <img src="/meo_ai.png" alt="AI Vet" className="w-28 md:w-36 h-auto object-contain shrink-0 drop-shadow-xl relative z-10 -ml-3 md:-ml-4 scale-x-[-1]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2"><span className="text-primary">{icon}</span> {title}</p>
      {children}
    </div>
  );
}
