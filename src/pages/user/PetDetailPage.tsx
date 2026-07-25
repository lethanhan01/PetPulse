import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useApp } from "@/stores/app.store";
import type { CareEvent, HealthEntry } from "@/types/app.types";
import { createCareEvent, createHealthEntry } from "@/mocks";
import { Card, Btn, Badge, Field, Select, Modal, TrendChart } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  ArrowLeft, Activity, Calendar, Sparkles, Settings, Plus, Weight, Syringe,
  Stethoscope, Pill, Bell, ShieldCheck, TrendingUp, CheckCircle2, Clock, Trash2, Lightbulb, AlertTriangle,
} from "lucide-react";

const TABS = [
  { k: "overview", l: "Tổng quan", icon: <Activity size={15} /> },
  { k: "timeline", l: "Health Timeline", icon: <TrendingUp size={15} /> },
  { k: "calendar", l: "Lịch chăm sóc", icon: <Calendar size={15} /> },
  { k: "consult", l: "Lịch sử tư vấn AI", icon: <Sparkles size={15} /> },
  { k: "settings", l: "Cài đặt", icon: <Settings size={15} /> },
];

const scoreLevel = (s: number) => s >= 90 ? { l: "Xuất sắc", v: "success" as const } : s >= 75 ? { l: "Tốt", v: "info" as const } : s >= 60 ? { l: "Khá", v: "warning" as const } : { l: "Cần chú ý", v: "danger" as const };

export function PetDetail() {
  const { pets, updatePet } = useApp();
  const navigate = useNavigate();
  const { petId } = useParams();
  const [searchParams] = useSearchParams();
  const pet = pets.find(p => p.id === petId);
  const [tab, setTab] = useState(searchParams.get("tab") || "overview");
  const [healthModal, setHealthModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);

  if (!pet) return <div className="py-16 text-center"><p className="text-5xl font-extrabold text-primary">404</p><h1 className="mt-4 text-2xl font-bold text-foreground">Không tìm thấy thú cưng</h1></div>;
  const latest = pet.health[0];
  const level = scoreLevel(latest.score);

  const addHealth = (h: HealthEntry) => updatePet(pet.id, { health: [h, ...pet.health] });
  const addEvent = (ev: CareEvent) => updatePet(pet.id, { events: [ev, ...pet.events] });
  const toggleEvent = (id: string) => updatePet(pet.id, { events: pet.events.map(e => e.id === id ? { ...e, done: !e.done } : e) });
  const deleteEvent = (id: string) => updatePet(pet.id, { events: pet.events.filter(e => e.id !== id) });

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/pets")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={15} /> Danh sách thú cưng</button>

      {/* Passport header */}
      <Card className="overflow-hidden" hover={false}>
        <div className="h-28 relative" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>
          <ShieldCheck size={120} className="absolute -right-4 -top-4 text-white/10" />
        </div>
        <div className="px-5 pb-5 relative">
          <div className="w-24 h-24 rounded-3xl border-4 border-card overflow-hidden bg-secondary flex items-center justify-center text-4xl flex-shrink-0 -mt-12">
            {pet.image ? <ImageWithFallback src={pet.image} alt={pet.name} className="w-full h-full object-cover" /> : pet.emoji}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mt-3">
            <div className="min-w-0">
              <h1 className="font-extrabold text-2xl text-foreground">{pet.emoji} {pet.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{pet.breed} · {pet.age} · {pet.gender} · {pet.weight}</p>
              <code className="inline-block text-xs text-primary bg-secondary px-2.5 py-1 rounded-full mt-2">{pet.id}</code>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:justify-end sm:pt-1">{pet.chips.map(c => <Badge key={c} v="primary">{c}</Badge>)}</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-border">
        {TABS.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all ${tab === t.k ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>
            {t.icon} {t.l}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1 text-center" hover={false}>
            <div className="relative overflow-hidden rounded-xl -m-6 -mt-6 mb-0 p-6" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>
              <p className="text-sm text-white/80 mb-2">Health Score</p>
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - latest.score / 100)}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-extrabold text-4xl text-white">{latest.score}</span>
                  <span className="text-xs text-white/70">/100</span>
                </div>
              </div>
            </div>
            <div className="mt-4"><Badge v={level.v}>{level.l}</Badge></div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">Khuyến nghị: Duy trì chế độ vận động, bổ sung dinh dưỡng cân bằng và khám răng định kỳ.</p>
          </Card>

          <Card className="p-5 lg:col-span-2" hover={false}>
            <h3 className="font-bold text-foreground mb-4">Chỉ số sức khỏe gần nhất</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { icon: <Weight size={16} />, bg: "bg-info-surface bg-info-surface text-info", l: "Cân nặng", v: `${latest.weight}kg` },
                { icon: <Stethoscope size={16} />, bg: "bg-info-surface bg-info-surface text-info", l: "Tình trạng", v: latest.condition },
                { icon: <Activity size={16} />, bg: "bg-success-surface bg-success-surface text-success", l: "Dinh dưỡng", v: latest.nutrition },
                { icon: <Syringe size={16} />, bg: "bg-warning-surface text-warning", l: "Bệnh", v: latest.illness || "Không" },
              ].map(m => (
                <div key={m.l} className="bg-muted rounded-xl p-3">
                  <div className={`${m.bg} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>{m.icon}</div>
                  <div className="text-sm font-bold text-foreground">{m.v}</div>
                  <div className="text-xs text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>
            <div className="h-52">
              <TrendChart
                height={208} showArea showXLabels min={60} max={100}
                data={[...pet.health].reverse().map(h => ({ label: h.date, value: h.score }))}
              />
            </div>
          </Card>
        </div>
      )}

      {/* TIMELINE */}
      {tab === "timeline" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground">Health Timeline</h3>
            <Btn size="sm" icon={<Plus size={15} />} onClick={() => setHealthModal(true)}>Cập nhật sức khỏe</Btn>
          </div>
          <div className="relative pl-8">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border" />
            {pet.health.map((h) => {
              const lv = scoreLevel(h.score);
              return (
                <div key={h.id} className="relative pb-6 last:pb-0">
                  <div className={`absolute -left-8 top-1.5 w-4 h-4 rounded-full border-[3px] border-card ${lv.v === "success" ? "bg-success" : lv.v === "info" ? "bg-primary" : lv.v === "warning" ? "bg-warning" : "bg-destructive/100"}`} />
                  <Card className={`p-0 overflow-hidden border-l-4 ${lv.v === "success" ? "border-l-green-500" : lv.v === "info" ? "border-l-primary" : lv.v === "warning" ? "border-l-amber-500" : "border-l-red-500"}`} hover={false}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <code className="text-xs text-muted-foreground">{h.date}</code>
                        <Badge v={lv.v}>Score {h.score}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[{ icon: <Weight size={12} />, l: h.weight + "kg" }, { icon: <Stethoscope size={12} />, l: h.condition }, { icon: <Activity size={12} />, l: h.nutrition }, { icon: <Syringe size={12} />, l: h.illness || "Không" }].map((s, j) => (
                          <span key={j} className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs text-foreground">{s.icon}{s.l}</span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CALENDAR */}
      {tab === "calendar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground">Lịch chăm sóc sức khỏe</h3>
            <Btn size="sm" icon={<Plus size={15} />} onClick={() => setEventModal(true)}>Thêm sự kiện</Btn>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/10 text-primary">
            <Bell size={16} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">Hệ thống sẽ gửi in-app notification nhắc bạn trước mỗi sự kiện.</p>
          </div>
          <div className="space-y-2.5">
            {pet.events.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground" hover={false}>Chưa có sự kiện nào. Thêm lịch khám, uống thuốc...</Card>}
            {pet.events.map(e => {
              const icon = e.type === "Uống thuốc" ? <Pill size={16} /> : e.type === "Khám" ? <Stethoscope size={16} /> : e.type === "Tiêm phòng" ? <Syringe size={16} /> : <Calendar size={16} />;
              const done = e.done;
              return (
                <Card key={e.id} className={`p-0 overflow-hidden border-l-4 ${done ? "border-l-green-500/60" : "border-l-primary"}`} hover={false}>
                  <div className="p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? "bg-success-surface bg-success-surface text-success" : "bg-primary/10 text-primary"}`}>{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>{e.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap mt-0.5"><Clock size={11} /> {e.date} · {e.time} · {e.repeat} <Badge v="neutral">{e.type}</Badge></p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => toggleEvent(e.id)} className={`p-2 rounded-lg transition-colors ${done ? "text-success bg-success-surface bg-success-surface" : "text-muted-foreground hover:bg-secondary"}`}><CheckCircle2 size={18} /></button>
                      <button onClick={() => deleteEvent(e.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* CONSULT */}
      {tab === "consult" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground">Lịch sử tư vấn AI</h3>
            <Btn size="sm" icon={<Sparkles size={15} />} onClick={() => navigate("/ai-checker")}>Tư vấn mới</Btn>
          </div>
          {pet.consults.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground" hover={false}>Chưa có lịch sử tư vấn. Dùng AI Symptom Checker để kiểm tra sức khỏe.</Card>}
          {pet.consults.map(c => {
            const sv = c.severity === "Cao" ? { v: "danger" as const, c: "border-destructive/40 bg-destructive/10" } : c.severity === "Trung bình" ? { v: "warning" as const, c: "border-warning-border bg-warning-surface/50" } : { v: "success" as const, c: "border-success-border bg-success-surface/50" };
            return (
              <Card key={c.id} className={`p-0 overflow-hidden border-l-4 ${sv.c}`} hover={false}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <code className="text-xs text-muted-foreground">{c.date}</code>
                    <Badge v={sv.v}><AlertTriangle size={11} /> Cảnh báo: {c.severity}</Badge>
                  </div>
                  <div className="flex items-start gap-2 mb-4 p-3 bg-background/80 rounded-xl text-sm text-foreground">
                    <Activity size={15} className="mt-0.5 text-primary flex-shrink-0" />
                    <span><b>Triệu chứng:</b> {c.symptoms}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Stethoscope size={12} /> Bệnh có thể gặp</p>
                      <div className="flex flex-wrap gap-1.5">{c.diseases.map(d => <span key={d} className="px-2.5 py-1 bg-destructive/10 text-destructive text-xs rounded-full">{d}</span>)}</div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Pill size={12} /> Sơ cứu</p>
                      <div className="flex flex-wrap gap-1.5">{c.firstAid.map(d => <span key={d} className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full">{d}</span>)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 bg-primary/5 rounded-xl text-sm text-primary">
                    <Lightbulb size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{c.vetAdvice}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* SETTINGS */}
      {tab === "settings" && (
        <div className="max-w-lg space-y-4">
          <h3 className="font-bold text-lg text-foreground">Cài đặt hồ sơ {pet.name}</h3>
          <Card className="divide-y divide-border" hover={false}>
            {[
              { icon: <ShieldCheck size={17} />, l: "Hiển thị hồ sơ công khai", d: "Cho phép cộng đồng xem passport" },
              { icon: <Bell size={17} />, l: "Nhắc lịch qua thông báo", d: "In-app notification trước sự kiện" },
              { icon: <Activity size={17} />, l: "Tự động tính Health Score", d: "Sau mỗi lần cập nhật timeline" },
              { icon: <Sparkles size={17} />, l: "Lưu kết quả tư vấn AI", d: "Đồng bộ vào hồ sơ pet" },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center gap-3 px-5 py-4 first:pt-5 last:pb-5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{s.l}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.d}</p>
                </div>
                <Toggle defaultOn={i !== 0} />
              </div>
            ))}
          </Card>
        </div>
      )}

      <HealthFormModal open={healthModal} onClose={() => setHealthModal(false)} onSave={addHealth} />
      <EventFormModal open={eventModal} onClose={() => setEventModal(false)} onSave={addEvent} />
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button onClick={() => setOn(!on)} role="switch" aria-checked={on}
      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${on ? "bg-primary" : "bg-border"}`}>
      <span className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all ${on ? "left-[19px]" : "left-[3px]"}`} />
    </button>
  );
}

function HealthFormModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (h: HealthEntry) => void }) {
  const [f, setF] = useState({ weight: "", condition: "Tốt", nutrition: "Cân bằng", illness: "" });
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(createHealthEntry({ weight: parseFloat(f.weight) || 0, condition: f.condition as HealthEntry["condition"], nutrition: f.nutrition, illness: f.illness || undefined }));
    setF({ weight: "", condition: "Tốt", nutrition: "Cân bằng", illness: "" });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Cập nhật Health Timeline">
      <form onSubmit={save} className="space-y-4">
        <Field label="Cân nặng (kg)" type="number" step="0.1" value={f.weight} onChange={e => setF(p => ({ ...p, weight: e.target.value }))} placeholder="VD: 28" required />
        <Select label="Tình trạng sức khỏe" value={f.condition} onChange={e => setF(p => ({ ...p, condition: e.target.value }))}>
          <option>Tốt</option><option>Bình thường</option><option>Cần chú ý</option>
        </Select>
        <Field label="Tình trạng dinh dưỡng" value={f.nutrition} onChange={e => setF(p => ({ ...p, nutrition: e.target.value }))} placeholder="VD: Cân bằng" />
        <Field label="Tình trạng bệnh (nếu có)" value={f.illness} onChange={e => setF(p => ({ ...p, illness: e.target.value }))} placeholder="Để trống nếu khỏe mạnh" />
        <div className="flex gap-3 pt-1"><Btn variant="outline" block type="button" onClick={onClose}>Hủy</Btn><Btn block type="submit">Lưu & tính điểm</Btn></div>
      </form>
    </Modal>
  );
}

function EventFormModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (e: CareEvent) => void }) {
  const [f, setF] = useState({ title: "", date: "", time: "", repeat: "Không lặp", type: "Khám", customType: "" });
  const isOther = f.type === "Khác";
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(createCareEvent({ title: f.title, date: f.date, time: f.time, repeat: f.repeat as CareEvent["repeat"], type: isOther ? f.customType : f.type }));
    setF({ title: "", date: "", time: "", repeat: "Không lặp", type: "Khám", customType: "" });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Thêm sự kiện chăm sóc">
      <form onSubmit={save} className="space-y-4">
        <Field label="Tên sự kiện" value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} placeholder="VD: Khám định kỳ" required />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ngày" type="date" value={f.date} onChange={e => setF(p => ({ ...p, date: e.target.value }))} required />
          <Field label="Giờ" type="time" value={f.time} onChange={e => setF(p => ({ ...p, time: e.target.value }))} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Lặp lại" value={f.repeat} onChange={e => setF(p => ({ ...p, repeat: e.target.value }))}>
            <option>Không lặp</option><option>Hằng ngày</option><option>Hằng tuần</option>
          </Select>
          <Select label="Loại sự kiện" value={f.type} onChange={e => setF(p => ({ ...p, type: e.target.value, customType: "" }))}>
            <option>Khám</option><option>Uống thuốc</option><option>Tiêm phòng</option><option>Khác</option>
          </Select>
        </div>
        {isOther && (
          <Field label="Nhập loại sự kiện khác" value={f.customType} onChange={e => setF(p => ({ ...p, customType: e.target.value }))} placeholder="VD: Tắm, cắt móng..." required />
        )}
        <div className="flex gap-3 pt-1"><Btn variant="outline" block type="button" onClick={onClose}>Hủy</Btn><Btn block type="submit">Thêm vào lịch</Btn></div>
      </form>
    </Modal>
  );
}
