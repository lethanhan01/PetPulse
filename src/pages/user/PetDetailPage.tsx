import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "@/stores/app.store";
import type { CareEvent, HealthEntry } from "@/types/app.types";
import { createCareEvent, createHealthEntry } from "@/mocks";
import { Card, Btn, Badge, Field, Select, Modal, TrendChart, HEAD, MONO } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  ArrowLeft, Activity, Calendar, Sparkles, Settings, Plus, Weight, Syringe,
  Stethoscope, Pill, Bell, ShieldCheck, TrendingUp, CheckCircle2, Clock,
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
  const pet = pets.find(p => p.id === petId);
  const [tab, setTab] = useState("overview");
  const [healthModal, setHealthModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);

  if (!pet) return <div className="py-16 text-center"><p className="text-5xl font-extrabold text-primary">404</p><h1 className="mt-4 text-2xl font-bold text-foreground">Không tìm thấy thú cưng</h1></div>;
  const latest = pet.health[0];
  const level = scoreLevel(latest.score);

  const addHealth = (h: HealthEntry) => updatePet(pet.id, { health: [h, ...pet.health] });
  const addEvent = (ev: CareEvent) => updatePet(pet.id, { events: [ev, ...pet.events] });
  const toggleEvent = (id: string) => updatePet(pet.id, { events: pet.events.map(e => e.id === id ? { ...e, done: !e.done } : e) });

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/pets")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={15} /> Danh sách thú cưng</button>

      {/* Passport header */}
      <Card className="overflow-hidden" hover={false}>
        <div className="h-28 relative" style={{ background: "linear-gradient(135deg,#1D8B88,#2FE0DC)" }}>
          <ShieldCheck size={120} className="absolute -right-4 -top-4 text-white/10" />
        </div>
        <div className="px-5 pb-5 relative">
          <div className="w-24 h-24 rounded-3xl border-4 border-card overflow-hidden bg-secondary flex items-center justify-center text-4xl flex-shrink-0 -mt-12">
            {pet.image ? <ImageWithFallback src={pet.image} alt={pet.name} className="w-full h-full object-cover" /> : pet.emoji}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mt-3">
            <div className="min-w-0">
              <h1 className="font-extrabold text-2xl text-foreground" style={HEAD}>{pet.emoji} {pet.name}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{pet.breed} · {pet.age} · {pet.gender} · {pet.weight}</p>
              <code className="inline-block text-xs text-primary bg-secondary px-2.5 py-1 rounded-full mt-2" style={MONO}>{pet.id}</code>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:justify-end sm:pt-1">{pet.chips.map(c => <Badge key={c} v="primary">{c}</Badge>)}</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border">
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
          <Card className="p-6 lg:col-span-1 text-center">
            <p className="text-sm text-muted-foreground mb-2">Health Score</p>
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--secondary)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1D8B88" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - latest.score / 100)}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-extrabold text-3xl text-primary" style={HEAD}>{latest.score}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <Badge v={level.v}>{level.l}</Badge>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">Khuyến nghị: Duy trì chế độ vận động, bổ sung dinh dưỡng cân bằng và khám răng định kỳ.</p>
          </Card>

          <Card className="p-5 lg:col-span-2">
            <h3 className="font-bold text-foreground mb-4" style={HEAD}>Chỉ số sức khỏe gần nhất</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { icon: <Weight size={16} />, l: "Cân nặng", v: `${latest.weight}kg` },
                { icon: <Stethoscope size={16} />, l: "Tình trạng", v: latest.condition },
                { icon: <Activity size={16} />, l: "Dinh dưỡng", v: latest.nutrition },
                { icon: <Syringe size={16} />, l: "Bệnh", v: latest.illness || "Không" },
              ].map(m => (
                <div key={m.l} className="bg-muted rounded-xl p-3">
                  <div className="text-primary mb-1.5">{m.icon}</div>
                  <div className="text-sm font-bold text-foreground">{m.v}</div>
                  <div className="text-xs text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>
            <div className="h-40">
              <TrendChart
                height={160}
                showArea
                showXLabels
                min={60}
                max={100}
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
            <h3 className="font-bold text-lg text-foreground" style={HEAD}>Health Timeline</h3>
            <Btn size="sm" icon={<Plus size={15} />} onClick={() => setHealthModal(true)}>Cập nhật sức khỏe</Btn>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
            {pet.health.map((h, i) => (
              <div key={h.id} className="relative pb-6 last:pb-0">
                <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-card ${i === 0 ? "bg-primary" : "bg-accent"}`} />
                <Card className="p-4" hover={false}>
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-xs text-muted-foreground" style={MONO}>{h.date}</code>
                    <Badge v={scoreLevel(h.score).v}>Score {h.score}</Badge>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div><span className="text-muted-foreground text-xs block">Cân nặng</span><b className="text-foreground">{h.weight}kg</b></div>
                    <div><span className="text-muted-foreground text-xs block">Tình trạng</span><b className="text-foreground">{h.condition}</b></div>
                    <div><span className="text-muted-foreground text-xs block">Dinh dưỡng</span><b className="text-foreground">{h.nutrition}</b></div>
                    <div><span className="text-muted-foreground text-xs block">Bệnh</span><b className="text-foreground">{h.illness || "Không"}</b></div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CALENDAR */}
      {tab === "calendar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground" style={HEAD}>Lịch chăm sóc sức khỏe</h3>
            <Btn size="sm" icon={<Plus size={15} />} onClick={() => setEventModal(true)}>Thêm sự kiện</Btn>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200">
            <Bell size={15} className="mt-0.5 flex-shrink-0 text-blue-500" />
            <p className="text-sm">Hệ thống sẽ gửi in-app notification nhắc bạn trước mỗi sự kiện.</p>
          </div>
          <div className="space-y-2.5">
            {pet.events.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground" hover={false}>Chưa có sự kiện nào. Thêm lịch khám, uống thuốc...</Card>}
            {pet.events.map(e => {
              const icon = e.type === "Uống thuốc" ? <Pill size={16} /> : e.type === "Khám" ? <Stethoscope size={16} /> : e.type === "Tiêm phòng" ? <Syringe size={16} /> : <Calendar size={16} />;
              return (
                <Card key={e.id} className="p-4 flex items-center gap-3" hover={false}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${e.done ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-primary/10 text-primary"}`}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${e.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{e.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap"><Clock size={11} /> {e.date} · {e.time} · {e.repeat} <Badge v="neutral">{e.type}</Badge></p>
                  </div>
                  <button onClick={() => toggleEvent(e.id)} className={`p-2 rounded-lg transition-colors ${e.done ? "text-green-600 bg-green-100 dark:bg-green-900/30" : "text-muted-foreground hover:bg-secondary"}`}><CheckCircle2 size={18} /></button>
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
            <h3 className="font-bold text-lg text-foreground" style={HEAD}>Lịch sử tư vấn AI</h3>
            <Btn size="sm" icon={<Sparkles size={15} />} onClick={() => navigate("/ai-checker")}>Tư vấn mới</Btn>
          </div>
          {pet.consults.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground" hover={false}>Chưa có lịch sử tư vấn. Dùng AI Symptom Checker để kiểm tra sức khỏe.</Card>}
          {pet.consults.map(c => (
            <Card key={c.id} className="p-5" hover={false}>
              <div className="flex items-center justify-between mb-3">
                <code className="text-xs text-muted-foreground" style={MONO}>{c.date}</code>
                <Badge v={c.severity === "Cao" ? "danger" : c.severity === "Trung bình" ? "warning" : "success"}>Cảnh báo: {c.severity}</Badge>
              </div>
              <p className="text-sm text-foreground mb-3"><b>Triệu chứng:</b> {c.symptoms}</p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs font-semibold text-muted-foreground mb-1">Bệnh có thể gặp</p><ul className="list-disc list-inside text-foreground space-y-0.5">{c.diseases.map(d => <li key={d}>{d}</li>)}</ul></div>
                <div><p className="text-xs font-semibold text-muted-foreground mb-1">Sơ cứu</p><ul className="list-disc list-inside text-foreground space-y-0.5">{c.firstAid.map(d => <li key={d}>{d}</li>)}</ul></div>
              </div>
              <p className="text-sm text-primary mt-3 bg-primary/5 rounded-lg p-2.5">💡 {c.vetAdvice}</p>
            </Card>
          ))}
        </div>
      )}

      {/* SETTINGS */}
      {tab === "settings" && (
        <Card className="p-6 max-w-lg" hover={false}>
          <h3 className="font-bold text-foreground mb-4" style={HEAD}>Cài đặt hồ sơ {pet.name}</h3>
          <div className="space-y-3.5">
            {[
              { l: "Hiển thị hồ sơ công khai", d: "Cho phép cộng đồng xem passport" },
              { l: "Nhắc lịch qua thông báo", d: "In-app notification trước sự kiện" },
              { l: "Tự động tính Health Score", d: "Sau mỗi lần cập nhật timeline" },
              { l: "Lưu kết quả tư vấn AI", d: "Đồng bộ vào hồ sơ pet" },
            ].map((s, i) => (
              <div key={s.l} className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-foreground">{s.l}</p><p className="text-xs text-muted-foreground">{s.d}</p></div>
                <Toggle defaultOn={i !== 0} />
              </div>
            ))}
          </div>
        </Card>
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
  const [f, setF] = useState({ title: "", date: "", time: "", repeat: "Không lặp", type: "Khám" });
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(createCareEvent({ title: f.title, date: f.date, time: f.time, repeat: f.repeat as CareEvent["repeat"], type: f.type as CareEvent["type"] }));
    setF({ title: "", date: "", time: "", repeat: "Không lặp", type: "Khám" });
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
          <Select label="Loại sự kiện" value={f.type} onChange={e => setF(p => ({ ...p, type: e.target.value }))}>
            <option>Khám</option><option>Uống thuốc</option><option>Tiêm phòng</option><option>Khác</option>
          </Select>
        </div>
        <div className="flex gap-3 pt-1"><Btn variant="outline" block type="button" onClick={onClose}>Hủy</Btn><Btn block type="submit">Thêm vào lịch</Btn></div>
      </form>
    </Modal>
  );
}
