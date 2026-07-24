import { useApp } from "@/stores/app.store";
import { useNavigate } from "react-router";
import { Card, Btn, TrendChart, HEAD } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { PawPrint, Syringe, Calendar, AlertTriangle, Activity, ArrowRight, Sparkles, Bell } from "lucide-react";

export function Dashboard() {
  const { pets, activeAccount } = useApp();
  const navigate = useNavigate();
  const stats = [
    { icon: <PawPrint size={17} />, l: "Thú cưng", v: String(pets.length), sub: "Đang quản lý", ic: "text-primary bg-primary/10" },
    { icon: <Syringe size={17} />, l: "Tiêm phòng", v: "12", sub: "Cập nhật đầy đủ", ic: "text-green-600 bg-green-100 dark:bg-green-900/30" },
    { icon: <Calendar size={17} />, l: "Lịch sắp tới", v: "3", sub: "Trong 2 tuần", ic: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    { icon: <AlertTriangle size={17} />, l: "Cảnh báo", v: "1", sub: "Cần chú ý", ic: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30" },
  ];
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-2xl p-6 sm:p-8 relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg,#1D8B88 0%,#2FE0DC 60%,#78E3FD 100%)" }}>
        <div className="relative z-10 max-w-lg">
          <p className="text-white/85 text-sm mb-1">Chào buổi sáng 👋</p>
          <h1 className="font-extrabold text-3xl mb-2" style={HEAD}>{activeAccount?.name ?? "Nguyễn Văn An"}</h1>
          <p className="text-white/90 mb-5">Các bé của bạn hôm nay đều khỏe mạnh. Đừng quên lịch uống thuốc của {pets[0]?.name ?? "bé cưng"} nhé!</p>
          <div className="flex flex-wrap gap-3">
            <Btn className="!bg-white !text-[#1D8B88] hover:!bg-white/90 !shadow-none" icon={<Sparkles size={16} />} onClick={() => navigate("/ai-checker")}>Hỏi AI về sức khỏe</Btn>
            <Btn variant="outline" className="border-white/40 text-white hover:bg-white/10" icon={<PawPrint size={16} />} onClick={() => navigate("/pets")}>Xem thú cưng</Btn>
          </div>
        </div>
        <PawPrint size={180} className="absolute -right-6 -bottom-8 text-white/10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.l} className="p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.ic}`}>{s.icon}</div>
            <div className="font-extrabold text-2xl text-foreground" style={HEAD}>{s.v}</div>
            <div className="text-sm font-medium text-foreground">{s.l}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl text-foreground" style={HEAD}>Thú cưng của bạn</h2>
            <button onClick={() => navigate("/pets")} className="text-sm text-primary hover:underline flex items-center gap-1">Xem tất cả <ArrowRight size={14} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {pets.map(p => {
              const latest = p.health[0];
              return (
                <Card key={p.id} className="overflow-hidden cursor-pointer" >
                  <button className="w-full text-left" onClick={() => navigate(`/pets/${p.id}`)}>
                    <div className="h-24 relative">
                      {p.image ? <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg,#1D8B88,#2FE0DC)" }}>{p.emoji}</div>}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-lg text-foreground" style={HEAD}>{p.emoji} {p.name}</h3>
                        <span className="font-extrabold text-lg text-primary" style={HEAD}>{latest.score}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{p.breed} · {p.age} · {p.gender}</p>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${latest.score}%`, background: "linear-gradient(90deg,#1D8B88,#2FE0DC)" }} />
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
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={17} className="text-primary" />
              <h3 className="font-bold text-foreground" style={HEAD}>Xu hướng Health Score</h3>
            </div>
            <div className="h-32">
              <TrendChart
                height={128}
                showArea
                data={[...(pets[0]?.health ?? [])].reverse().map(h => ({ label: h.date, value: h.score }))}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">Điểm sức khỏe của {pets[0]?.name ?? "thú cưng"} 4 tháng qua</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bell size={17} className="text-primary" />
              <h3 className="font-bold text-foreground" style={HEAD}>Lịch sắp tới</h3>
            </div>
            <div className="space-y-2.5">
              {pets.flatMap(p => p.events.filter(e => !e.done).map(e => ({ ...e, pet: p.name, uid: `${p.id}-${e.id}` }))).slice(0, 3).map(e => (
                <div key={e.uid} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50">
                  <div className="w-1.5 h-9 rounded-full bg-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{e.title}</p><p className="text-xs text-muted-foreground">{e.pet} · {e.date} · {e.time}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
