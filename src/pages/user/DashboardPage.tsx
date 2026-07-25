import { useState } from "react";
import { useApp } from "@/stores/app.store";
import { useNavigate } from "react-router";
import { Card, Btn, TrendChart } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { getUserDashboardStats } from "@/services/user.service";
import { PawPrint, Syringe, Calendar, AlertTriangle, Activity, ArrowRight, Sparkles, Bell, Sun, Stethoscope, Pill, Clock } from "lucide-react";

const eventIcon = (type: string) =>
  type === "Uống thuốc" ? <Pill size={14} /> : type === "Khám" ? <Stethoscope size={14} /> : type === "Tiêm phòng" ? <Syringe size={14} /> : <Calendar size={14} />;

export function Dashboard() {
  const { pets, activeAccount } = useApp();
  const navigate = useNavigate();
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id ?? "");
  const trendPet = pets.find(p => p.id === selectedPetId) ?? pets[0];
  const overview = getUserDashboardStats(pets);
  const stats = [
    { icon: <PawPrint size={17} />, l: "Thú cưng", v: String(overview.petCount), sub: "Đang quản lý", ic: "text-primary bg-primary/10" },
    { icon: <Syringe size={17} />, l: "Tiêm phòng", v: String(overview.completedVaccinations), sub: "Đã hoàn thành", ic: "text-success bg-success-surface bg-success-surface" },
    { icon: <Calendar size={17} />, l: "Lịch sắp tới", v: String(overview.upcomingEvents), sub: "Chưa hoàn thành", ic: "text-info bg-info-surface bg-info-surface" },
    { icon: <AlertTriangle size={17} />, l: "Cảnh báo", v: String(overview.alerts), sub: "Cần chú ý", ic: "text-warning bg-warning-surface" },
  ];
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg,var(--primary) 0%,var(--accent) 60%,var(--chart-3) 100%)" }}>
        <div className="relative z-10 max-w-lg">
          <p className="text-white/85 text-sm mb-1 flex items-center gap-1.5"><Sun size={14} /> Chào buổi sáng</p>
          <h1 className="font-extrabold text-3xl mb-2">{activeAccount?.name ?? "Nguyễn Văn An"}</h1>
          <p className="text-white/90 mb-5">Các bé của bạn hôm nay đều khỏe mạnh. Đừng quên lịch uống thuốc của {pets[0]?.name ?? "bé cưng"} nhé!</p>
          <div className="flex flex-wrap gap-3">
            <Btn className="!bg-white !text-[var(--primary)] hover:!bg-white/90 !shadow-none" icon={<Sparkles size={16} />} onClick={() => navigate("/ai-checker")}>Hỏi AI về sức khỏe</Btn>
            <Btn variant="outline" className="border-white/40 text-white hover:bg-white/10" icon={<PawPrint size={16} />} onClick={() => navigate("/pets")}>Xem thú cưng</Btn>
          </div>
        </div>
        <PawPrint size={180} className="absolute -right-6 -bottom-8 text-white/10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.l} className="p-4 relative overflow-hidden" hover={false}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.ic}`}>{s.icon}</div>
            <div className="font-extrabold text-2xl text-foreground">{s.v}</div>
            <div className="text-sm font-medium text-foreground">{s.l}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-foreground">Thú cưng của bạn</h2>
            <button onClick={() => navigate("/pets")} className="text-sm text-primary hover:underline flex items-center gap-1">Xem tất cả <ArrowRight size={14} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {pets.slice(0, 4).map(p => {
              const latest = p.health[0];
              return (
                <Card key={p.id} className="overflow-hidden cursor-pointer p-0 border-l-4 border-l-primary" hover={false}>
                  <button className="w-full text-left" onClick={() => navigate(`/pets/${p.id}`)}>
                    <div className="h-28 relative">
                      {p.image
                        ? <><ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /></>
                        : <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>{p.emoji}</div>}
                      <span className="absolute bottom-2 right-2 font-extrabold text-lg text-white drop-shadow-lg">{latest.score}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-foreground">{p.emoji} {p.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{p.breed} · {p.age} · {p.gender}</p>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${latest.score}%`, background: "linear-gradient(90deg,var(--primary),var(--accent))" }} />
                      </div>
                    </div>
                  </button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          <Card className="p-5" hover={false}>
            <div className="flex items-center mb-3">
              <Activity size={17} className="text-primary flex-shrink-0" />
              <h3 className="font-bold text-foreground mx-2">Xu hướng</h3>
              <div className="ml-auto" />
              {pets.length > 1 && (
                <select value={selectedPetId} onChange={e => setSelectedPetId(e.target.value)}
                  className="text-xs bg-secondary text-foreground rounded-lg border border-border px-2 py-1 outline-none cursor-pointer"
                >
                  {pets.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
                </select>
              )}
            </div>
            <div className="h-32">
              <TrendChart height={128} showArea data={[...(trendPet?.health ?? [])].reverse().map(h => ({ label: h.date, value: h.score }))} />
            </div>
            <p className="text-xs text-muted-foreground text-center">Điểm sức khỏe của {trendPet?.name ?? "thú cưng"} 4 tháng qua</p>
          </Card>

          <Card className="p-5" hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={17} className="text-primary" />
              <h3 className="font-bold text-foreground">Lịch sắp tới</h3>
            </div>
            <div className="space-y-2.5">
              {(trendPet?.events ?? []).filter(e => !e.done).slice(0, 3).map(e => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border-l-[3px] border-l-primary">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">{eventIcon(e.type)}</div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{e.title}</p><p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock size={11} /> {trendPet?.emoji} {trendPet?.name} · {e.date} · {e.time}</p></div>
                </div>
              ))}
              {(!trendPet || trendPet.events.filter(e => !e.done).length === 0) && <p className="text-xs text-muted-foreground text-center py-4">Không có lịch nào sắp tới</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
