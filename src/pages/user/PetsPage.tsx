import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import type { Pet } from "@/types/app.types";
import { createPet, SPECIES_EMOJI } from "@/mocks";
import { Card, Btn, Badge, Field, Select, Modal, PageTitle } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Plus, ChevronRight, Pencil, Trash2, ShieldCheck, Upload, PawPrint } from "lucide-react";
import { toast } from "sonner";
import { useTranslation, Trans } from "react-i18next";

const SPECIES_MAP: Record<string, string> = { "Chó": "dog", "Mèo": "cat", "Chim": "bird", "Chuột": "mouse", "Thỏ": "rabbit", "Rùa": "turtle", "Khác": "other" };

export function AddPetModal({ open, onClose, edit, petLimit }: { open: boolean; onClose: () => void; edit?: Pet; petLimit: number }) {
  const { t } = useTranslation();
  const { addPet, updatePet, activeAccount, pets } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [f, setF] = useState({
    name: "", species: "Chó", breed: "",
    gender: "Đực", age: "", weight: "",
    image: "",
  });
  const [imgPreview, setImgPreview] = useState("");
  useEffect(() => {
    if (open) {
      setF({
        name: edit?.name || "", species: edit?.species || "Chó", breed: edit?.breed || "",
        gender: edit?.gender || "Đực", age: edit?.age || "", weight: edit?.weight || "",
        image: edit?.image || "",
      });
      setImgPreview(edit?.image || "");
    }
  }, [open, edit]);
  const set = <K extends keyof typeof f>(key: K, value: (typeof f)[K]) => setF(previous => ({ ...previous, [key]: value }));
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setF(prev => ({ ...prev, image: dataUrl }));
      setImgPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit && pets.length >= petLimit) {
      toast.error(t("pets.toasts.limitError", { limit: petLimit }), { style: { background: "var(--destructive)", color: "var(--primary-foreground)", border: "none" } });
      return;
    }
    if (edit) {
      updatePet(edit.id, { ...f, gender: f.gender as Pet["gender"], emoji: SPECIES_EMOJI[f.species] });
      toast.success(t("pets.toasts.updateSuccess"), { style: { background: "var(--success)", color: "var(--primary-foreground)", border: "none" } });
    } else {
      addPet(createPet({ ...f, gender: f.gender as Pet["gender"] }, activeAccount?.name ?? "Nguyễn Văn An"));
      toast.success(t("pets.toasts.addSuccess"), { style: { background: "var(--success)", color: "var(--primary-foreground)", border: "none" } });
    }
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title={edit ? t("pets.modal.editTitle") : t("pets.modal.addTitle")}>
      <form onSubmit={save} className="space-y-4">
        <Field label={t("pets.modal.nameLabel")} value={f.name} onChange={e => set("name", e.target.value)} placeholder={t("pets.modal.namePlaceholder")} required />
        <div className="grid grid-cols-2 gap-3">
          <Select label={t("pets.modal.speciesLabel")} value={f.species} onChange={e => set("species", e.target.value)}>
            {Object.keys(SPECIES_EMOJI).map(s => <option key={s} value={s}>{t(`pets.species.${SPECIES_MAP[s] || 'other'}`)}</option>)}
          </Select>
          <Select label={t("pets.modal.genderLabel")} value={f.gender} onChange={e => set("gender", e.target.value as Pet["gender"])}>
            <option value="Đực">{t("pets.male")}</option><option value="Cái">{t("pets.female")}</option>
          </Select>
        </div>
        <Field label={t("pets.modal.breedLabel")} value={f.breed} onChange={e => set("breed", e.target.value)} placeholder={t("pets.modal.breedPlaceholder")} />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("pets.modal.ageLabel")} value={f.age} onChange={e => set("age", e.target.value)} placeholder={t("pets.modal.agePlaceholder")} />
          <Field label={t("pets.modal.weightLabel")} value={f.weight} onChange={e => set("weight", e.target.value)} placeholder={t("pets.modal.weightPlaceholder")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">{t("pets.modal.imageLabel")}</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <Upload size={16} /> {t("pets.modal.imageBtn")}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
            {imgPreview && <div className="w-12 h-12 rounded-xl overflow-hidden border border-border flex-shrink-0"><img src={imgPreview} alt="preview" className="w-full h-full object-cover" /></div>}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Btn variant="outline" block type="button" onClick={onClose}>{t("pets.modal.cancelBtn")}</Btn>
          <Btn block type="submit">{edit ? t("pets.modal.saveBtn") : t("pets.modal.addBtn")}</Btn>
        </div>
      </form>
    </Modal>
  );
}

export function Pets() {
  const { t } = useTranslation();
  const { pets, removePet, plan } = useApp();
  const navigate = useNavigate();
  const petLimit = plan === "Premium" ? Infinity : 3;
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState<Pet | undefined>();
  const atLimit = !edit && pets.length >= petLimit;
  const [del, setDel] = useState<Pet | undefined>();

  return (
    <div>
      <PageTitle title={t("pets.pageTitle")} subtitle={petLimit === Infinity ? t("pets.subtitleUnlimited", { count: pets.length }) : t("pets.subtitleLimit", { count: pets.length, limit: petLimit })}
        action={<Btn icon={<Plus size={16} />} disabled={atLimit} onClick={() => { if (atLimit) { toast.error(t("pets.toasts.limitUpgradeError", { limit: petLimit }), { style: { background: "var(--destructive)", color: "var(--primary-foreground)", border: "none" } }); return; } setEdit(undefined); setAdd(true); }}>{t("pets.addBtn")}</Btn>} />

      {pets.length === 0 ? (
        <Card className="p-12 text-center" hover={false}>
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4"><PawPrint size={32} className="text-primary" /></div>
          <h3 className="font-bold text-lg text-foreground mb-1">{t("pets.empty.title")}</h3>
          <p className="text-sm text-muted-foreground mb-5">{t("pets.empty.desc")}</p>
          <Btn icon={<Plus size={16} />} onClick={() => setAdd(true)} disabled={atLimit}>{atLimit ? t("pets.empty.btnLimit", { limit: petLimit }) : t("pets.empty.btnAdd")}</Btn>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pets.map(p => {
            const latest = p.health[0];
            const sv = latest.score >= 80 ? "success" as const : latest.score >= 60 ? "info" as const : latest.score >= 40 ? "warning" as const : "danger" as const;
            
            let translatedGender: string = p.gender;
            if (p.gender === "Đực") translatedGender = t("pets.male");
            if (p.gender === "Cái") translatedGender = t("pets.female");
            
            let translatedAge: string = p.age;
            const ageMatch = p.age?.match(/(\d+)\s*(tuổi|tháng)/);
            if (ageMatch) {
              const num = parseInt(ageMatch[1], 10);
              const unit = ageMatch[2];
              if (unit === "tuổi") translatedAge = t("pets.ageYears", { count: num });
              if (unit === "tháng") translatedAge = t("pets.ageMonths", { count: num });
            }
            
            return (
              <Card key={p.id} className="overflow-hidden group border-l-4 border-l-primary">
                <div className="h-32 relative">
                  {p.image ? <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>{p.emoji}</div>}
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button onClick={() => { setEdit(p); setAdd(true); }} className="p-1.5 rounded-lg bg-card/90 backdrop-blur text-foreground hover:text-primary" aria-label="Edit"><Pencil size={14} /></button>
                    <button onClick={() => setDel(p)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur text-foreground hover:text-destructive" aria-label="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg text-foreground">{p.emoji} {p.name}</h3>
                    <Badge v={sv}><ShieldCheck size={11} /> {latest.score}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{p.breed} · {translatedAge} · {translatedGender}</p>
                  <code className="inline-block text-[11px] text-primary bg-secondary px-2 py-0.5 rounded-full mb-3">{p.id}</code>
                  <Btn variant="outline" block size="sm" icon={<ChevronRight size={15} />} iconRight onClick={() => navigate(`/pets/${p.id}`)}>{t("pets.viewProfile")}</Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddPetModal open={add} onClose={() => setAdd(false)} edit={edit} petLimit={petLimit} />
      <Modal open={!!del} onClose={() => setDel(undefined)} title={t("pets.modal.deleteTitle")}>
        <p className="text-sm text-muted-foreground mb-5"><Trans i18nKey="pets.modal.deleteConfirm" values={{ name: del?.name }} components={{ 1: <b className="text-foreground" /> }} /></p>
        <div className="flex gap-3">
          <Btn variant="outline" block onClick={() => setDel(undefined)}>{t("pets.modal.deleteCancelBtn")}</Btn>
          <Btn variant="danger" block onClick={() => { if (del) { const name = del.name; removePet(del.id); setDel(undefined); toast.error(t("pets.toasts.deleteSuccess", { name }), { style: { background: "var(--destructive)", color: "var(--primary-foreground)", border: "none" } }); } }}>{t("pets.modal.deleteBtn")}</Btn>
        </div>
      </Modal>
    </div>
  );
}
