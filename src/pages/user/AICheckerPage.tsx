import { useState } from "react";
import { useApp } from "@/stores/app.store";
import type { AIConsult } from "@/types/app.types";
import { createAIConsult, SYMPTOM_TAGS } from "@/mocks";
import { Card, Btn, Badge, Select, Textarea, PageTitle, HEAD } from "@/components/common/kit";
import { Sparkles, AlertTriangle, Stethoscope, HeartPulse, Save, Loader2, Bot } from "lucide-react";


export function AIChecker() {
  const { pets, updatePet } = useApp();
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIConsult | null>(null);
  const [saved, setSaved] = useState(false);

  const run = () => {
    if (!symptoms.trim()) return;
    setLoading(true); setResult(null); setSaved(false);
    setTimeout(() => {
      const pet = pets.find(p => p.id === petId);
      setResult(createAIConsult(pet?.name || "", symptoms));
      setLoading(false);
    }, 1400);
  };
  const save = () => {
    if (!result) return;
    const pet = pets.find(p => p.id === petId);
    if (pet) updatePet(pet.id, { consults: [result, ...pet.consults] });
    setSaved(true);
  };

  const sevColor = result?.severity === "Cao" ? "danger" : result?.severity === "Trung bình" ? "warning" : "success";

  return (
    <div>
      <PageTitle title="AI Symptom Checker" subtitle="Nhập triệu chứng, AI phân tích tình trạng bệnh của thú cưng." />
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="p-6" hover={false}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Bot size={18} /></div>
            <h3 className="font-bold text-foreground" style={HEAD}>Mô tả triệu chứng</h3>
          </div>
          <div className="space-y-4">
            <Select label="Chọn thú cưng" value={petId} onChange={e => setPetId(e.target.value)}>
              {pets.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name} — {p.breed}</option>)}
            </Select>
            <Textarea label="Triệu chứng bệnh" value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={5} placeholder="VD: Bé bỏ ăn 2 ngày, thỉnh thoảng ho khan và có vẻ mệt mỏi..." />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Triệu chứng phổ biến:</p>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_TAGS.map(t => (
                  <button key={t} onClick={() => setSymptoms(s => s ? `${s}, ${t.toLowerCase()}` : t)} className="px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">+ {t}</button>
                ))}
              </div>
            </div>
            <Btn block size="lg" icon={<Sparkles size={17} />} loading={loading} onClick={run}>{loading ? "Đang phân tích..." : "Phân tích với AI"}</Btn>
            <p className="text-xs text-muted-foreground text-center">⚠️ Kết quả AI chỉ mang tính tham khảo, không thay thế chẩn đoán của bác sĩ thú y.</p>
          </div>
        </Card>

        {/* Result */}
        <div>
          {loading && (
            <Card className="p-10 flex flex-col items-center justify-center text-center h-full" hover={false}>
              <Loader2 size={32} className="text-primary animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">AI đang phân tích triệu chứng...</p>
            </Card>
          )}
          {!loading && !result && (
            <Card className="p-10 flex flex-col items-center justify-center text-center h-full" hover={false}>
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-3"><Sparkles size={24} className="text-primary" /></div>
              <p className="text-sm text-muted-foreground max-w-xs">Kết quả phân tích của AI sẽ hiển thị tại đây sau khi bạn nhập triệu chứng.</p>
            </Card>
          )}
          {!loading && result && (
            <Card className="p-6" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground" style={HEAD}>Kết quả phân tích</h3>
                <Badge v={sevColor}><AlertTriangle size={11} /> Cảnh báo: {result.severity}</Badge>
              </div>
              <Section icon={<Stethoscope size={15} />} title="Các bệnh có khả năng gặp">
                <ul className="space-y-1.5">{result.diseases.map(d => <li key={d} className="text-sm text-foreground flex gap-2"><span className="text-primary">•</span> {d}</li>)}</ul>
              </Section>
              <Section icon={<HeartPulse size={15} />} title="Hướng dẫn sơ cứu ban đầu">
                <ol className="space-y-1.5">{result.firstAid.map((d, i) => <li key={d} className="text-sm text-foreground flex gap-2"><span className="text-primary font-bold">{i + 1}.</span> {d}</li>)}</ol>
              </Section>
              <div className="rounded-xl bg-primary/5 border border-primary/15 p-3.5 mb-4">
                <p className="text-xs font-semibold text-primary mb-1">Khuyến nghị thú y</p>
                <p className="text-sm text-foreground">{result.vetAdvice}</p>
              </div>
              <Btn block variant={saved ? "outline" : "primary"} icon={<Save size={16} />} disabled={saved} onClick={save}>{saved ? "Đã lưu vào hồ sơ ✓" : "Lưu vào hồ sơ thú cưng"}</Btn>
            </Card>
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
