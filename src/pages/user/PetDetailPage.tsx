import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useApp } from "@/stores/app.store";
import type { CareEvent, HealthEntry } from "@/types/app.types";
import { createCareEvent, createHealthEntry } from "@/mocks";
import { Card, Btn, Badge, Field, Textarea, Select, Modal, TrendChart } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { analyzeNutrition } from "@/utils/nutrition-calculator";
import { cancelEventOccurrence, eventsForDate, isEventCompletedOn, monthCalendarDays, toggleEventCompletion } from "@/utils/care-calendar";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft, Activity, Calendar, Sparkles, Settings, Plus, Weight, Syringe,
  Stethoscope, Pill, Bell, ShieldCheck, TrendingUp, CheckCircle2, Clock, Trash2, Lightbulb, AlertTriangle, ChevronLeft, ChevronRight,
} from "lucide-react";

function eventIcon(type: string, size = 16) {
  return type === "Uống thuốc" ? <Pill size={size} /> : type === "Khám" ? <Stethoscope size={size} /> : type === "Tiêm phòng" ? <Syringe size={size} /> : <Calendar size={size} />;
}

export function PetDetail() {
  const { t } = useTranslation();
  const { pets, updatePet } = useApp();
  const navigate = useNavigate();
  const { petId } = useParams();
  const [searchParams] = useSearchParams();
  const pet = pets.find(p => p.id === petId);
  const [tab, setTab] = useState(searchParams.get("tab") || "overview");
  const [healthModal, setHealthModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<{ id: string; title: string; date: string } | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  const TABS = [
    { k: "overview", l: t("petDetail.tabs.overview"), icon: <Activity size={15} /> },
    { k: "timeline", l: t("petDetail.tabs.timeline"), icon: <TrendingUp size={15} /> },
    { k: "calendar", l: t("petDetail.tabs.calendar"), icon: <Calendar size={15} /> },
    { k: "consult", l: t("petDetail.tabs.consult"), icon: <Sparkles size={15} /> },
    { k: "settings", l: t("petDetail.tabs.settings"), icon: <Settings size={15} /> },
  ];
  
  const WEEKDAYS = [
    t("petDetail.calendar.weekdays.mon"), t("petDetail.calendar.weekdays.tue"), t("petDetail.calendar.weekdays.wed"), 
    t("petDetail.calendar.weekdays.thu"), t("petDetail.calendar.weekdays.fri"), t("petDetail.calendar.weekdays.sat"), 
    t("petDetail.calendar.weekdays.sun")
  ];

  const scoreLevel = (s: number) => 
    s >= 90 ? { l: t("petDetail.scoreLevel.excellent"), v: "success" as const } : 
    s >= 75 ? { l: t("petDetail.scoreLevel.good"), v: "info" as const } : 
    s >= 60 ? { l: t("petDetail.scoreLevel.fair"), v: "warning" as const } : 
    { l: t("petDetail.scoreLevel.attention"), v: "danger" as const };

  const getDynamic = (category: string, value: string) => {
    const key = value.toLowerCase();
    return t(`petDetail.dynamic.${category}.${key}`, value);
  };

  if (!pet) return <div className="py-16 text-center"><p className="text-5xl font-extrabold text-primary">404</p><h1 className="mt-4 text-2xl font-bold text-foreground">{t("petDetail.notFound")}</h1></div>;
  const latest = pet.health[0];
  const level = scoreLevel(latest.score);
  
  const latestNutrition = analyzeNutrition(latest?.nutrition || "");
  const nutritionLevel = scoreLevel(latestNutrition.score);
  const pieColors = ["var(--primary)", "var(--success)", "var(--warning)", "var(--destructive)"];

  const addHealth = (h: HealthEntry) => updatePet(pet.id, { health: [h, ...pet.health] });
  const addEvent = (ev: CareEvent) => updatePet(pet.id, { events: [ev, ...pet.events] });
  const toggleEvent = (id: string, date: string) => updatePet(pet.id, { events: pet.events.map(e => e.id === id ? toggleEventCompletion(e, date) : e) });
  const deleteEvent = (id: string) => updatePet(pet.id, { events: pet.events.filter(e => e.id !== id) });
  const cancelOccurrence = (id: string, date: string) => {
    updatePet(pet.id, { events: pet.events.map(e => e.id === id ? cancelEventOccurrence(e, date) : e) });
    setCancelTarget(null);
  };
  const requestDelete = (event: CareEvent, date: string) => {
    if (event.repeat === "Không lặp") deleteEvent(event.id);
    else setCancelTarget({ id: event.id, title: event.title, date });
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/pets")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={15} /> {t("petDetail.backToList")}</button>

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
          <Card className="p-6 text-center flex flex-col" hover={false}>
            <div className="relative overflow-hidden rounded-xl -m-6 -mt-6 mb-0 p-6" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>
              <p className="text-sm text-white/80 mb-2">{t("petDetail.overview.healthScore")}</p>
              <div className="relative w-40 h-40 mx-auto mb-3">
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
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{t("petDetail.overview.recommendation")}</p>
          </Card>

          <Card className="p-6 text-center flex flex-col" hover={false}>
            <div className="relative overflow-hidden rounded-xl -m-6 -mt-6 mb-0 p-6" style={{ background: "linear-gradient(135deg,var(--success),var(--accent))" }}>
              <p className="text-sm text-white/80 mb-2">Cơ cấu dinh dưỡng</p>
              <div className="relative w-40 h-40 mx-auto mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={latestNutrition.composition} innerRadius={32} outerRadius={60} dataKey="value" stroke="none">
                      {latestNutrition.composition.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", zIndex: 100 }} itemStyle={{ fontSize: "12px", fontWeight: "bold", color: "var(--foreground)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {latestNutrition.composition.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 text-center flex flex-col" hover={false}>
            <div className="relative overflow-hidden rounded-xl -m-6 -mt-6 mb-0 p-6" style={{ background: "linear-gradient(135deg,var(--warning),var(--accent))" }}>
              <p className="text-sm text-white/80 mb-2">Cân bằng dinh dưỡng</p>
              <div className="relative w-40 h-40 mx-auto mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius={48} data={latestNutrition.balance}>
                    <PolarGrid stroke="rgba(255,255,255,0.3)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.9)", fontSize: 10 }} />
                    <Radar name="Balance" dataKey="A" stroke="white" fill="white" fillOpacity={0.5} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", zIndex: 100 }} itemStyle={{ fontSize: "12px", fontWeight: "bold", color: "var(--foreground)" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4"><Badge v={nutritionLevel.v}>{latestNutrition.score}/100 - {nutritionLevel.l}</Badge></div>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">{latestNutrition.recommendation}</p>
          </Card>

          <Card className="p-5 lg:col-span-3" hover={false}>
            <h3 className="font-bold text-foreground mb-4">{t("petDetail.overview.latestStats")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { icon: <Weight size={16} />, bg: "bg-info-surface bg-info-surface text-info", l: t("petDetail.overview.weight"), v: `${latest.weight}kg` },
                { icon: <Stethoscope size={16} />, bg: "bg-info-surface bg-info-surface text-info", l: t("petDetail.overview.condition"), v: getDynamic("condition", latest.condition) },
                { icon: <Activity size={16} />, bg: "bg-success-surface bg-success-surface text-success", l: t("petDetail.overview.nutrition"), v: getDynamic("nutrition", latest.nutrition) },
                { icon: <Syringe size={16} />, bg: "bg-warning-surface text-warning", l: t("petDetail.overview.illness"), v: latest.illness ? latest.illness : t("petDetail.overview.none") },
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
            <h3 className="font-bold text-lg text-foreground">{t("petDetail.timeline.title")}</h3>
            <Btn size="sm" icon={<Plus size={15} />} onClick={() => setHealthModal(true)}>{t("petDetail.timeline.updateBtn")}</Btn>
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
                        <Badge v={lv.v}>{t("petDetail.timeline.score")} {h.score}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: <Weight size={12} />, l: h.weight + "kg" }, 
                          { icon: <Stethoscope size={12} />, l: getDynamic("condition", h.condition) }, 
                          { icon: <Activity size={12} />, l: getDynamic("nutrition", h.nutrition) }, 
                          { icon: <Syringe size={12} />, l: h.illness ? h.illness : t("petDetail.overview.none") }
                        ].map((s, j) => (
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
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-lg text-foreground">{t("petDetail.calendar.title")}</h3>
            <Btn size="sm" icon={<Plus size={15} />} onClick={() => setEventModal(true)}>{t("petDetail.calendar.addBtn")}</Btn>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/10 text-primary">
            <Bell size={16} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">{t("petDetail.calendar.notificationMsg")}</p>
          </div>
          <Card className="p-3 sm:p-5" hover={false}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm mb-4">
              <span className="inline-flex items-center gap-2 text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> {t("petDetail.calendar.scheduled")}</span>
              <span className="inline-flex items-center gap-2 text-muted-foreground"><span className="w-2.5 h-2.5 rounded-full bg-success" /> {t("petDetail.calendar.completed")}</span>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 mb-4">
              <button type="button" aria-label="Tháng trước" onClick={() => setCalendarMonth(current => current.month === 1 ? { year: current.year - 1, month: 12 } : { ...current, month: current.month - 1 })} className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><ChevronLeft size={18} /></button>
              <h4 className="text-center font-bold text-foreground">{t("petDetail.calendar.month", { month: calendarMonth.month, year: calendarMonth.year })}</h4>
              <button type="button" aria-label="Tháng sau" onClick={() => setCalendarMonth(current => current.month === 12 ? { year: current.year + 1, month: 1 } : { ...current, month: current.month + 1 })} className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"><ChevronRight size={18} /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {WEEKDAYS.map(day => <div key={day} className="py-1 text-center text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground">{day}</div>)}
              {monthCalendarDays(calendarMonth.year, calendarMonth.month).map((day, index) => {
                if (!day) return <div key={`blank-${index}`} aria-hidden="true" className="min-h-24 sm:min-h-30 rounded-xl bg-muted/30 border border-transparent" />;
                const dayEvents = eventsForDate(pet.events, day.date);
                return (
                  <div key={day.date} className="min-h-24 sm:min-h-30 rounded-xl border border-border bg-card p-1.5 sm:p-2 flex flex-col gap-1 overflow-hidden">
                    <time dateTime={day.date} className="text-xs sm:text-sm font-semibold text-foreground">{day.day}</time>
                    <div className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-0.5">
                      {dayEvents.map(event => (
                        <Popover key={`${event.id}-${day.date}`}>
                          {(() => {
                            const done = isEventCompletedOn(event, day.date);
                            return <>
                          <PopoverTrigger asChild>
                            <button type="button" aria-label={`Xem sự kiện ${event.title} ngày ${day.date}`} className={`w-full rounded-md px-1.5 py-1 text-left text-[10px] sm:text-xs font-medium leading-tight truncate transition-colors ${done ? "bg-success-surface text-success-foreground line-through hover:bg-success-surface/80" : "bg-primary/10 text-primary hover:bg-primary/20"}`}>{event.title}</button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-72 border-border p-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-success-surface text-success" : "bg-primary/10 text-primary"}`}>{eventIcon(event.type)}</div>
                              <div className="min-w-0 flex-1"><p className={`font-semibold text-sm ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>{event.title}</p><p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5"><Clock size={12} /> {day.date} · {event.time}</p></div>
                            </div>
                            <div className="mt-3 flex items-center justify-between gap-2"><Badge v="neutral">{getDynamic("eventType", event.type)}</Badge><span className="text-xs text-muted-foreground">{getDynamic("repeat", event.repeat)}</span></div>
                            <div className="mt-4 flex gap-2"><Btn size="sm" variant="outline" className="flex-1" icon={<CheckCircle2 size={14} />} onClick={() => toggleEvent(event.id, day.date)}>{done ? t("petDetail.calendar.restore") : t("petDetail.calendar.completeBtn")}</Btn><Btn size="sm" variant="danger" aria-label={`Hủy sự kiện ${event.title}`} icon={<Trash2 size={14} />} onClick={() => requestDelete(event, day.date)} /></div>
                          </PopoverContent>
                            </>;
                          })()}
                        </Popover>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* CONSULT */}
      {tab === "consult" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-foreground">{t("petDetail.consult.title")}</h3>
            <Btn size="sm" icon={<Sparkles size={15} />} onClick={() => navigate("/ai-checker")}>{t("petDetail.consult.newBtn")}</Btn>
          </div>
          {pet.consults.length === 0 && <Card className="p-8 text-center text-sm text-muted-foreground" hover={false}>{t("petDetail.consult.emptyMsg")}</Card>}
          {pet.consults.map(c => {
            const sv = c.severity === "Cao" ? { v: "danger" as const, c: "border-destructive/40 bg-destructive/10" } : c.severity === "Trung bình" ? { v: "warning" as const, c: "border-warning-border bg-warning-surface/50" } : { v: "success" as const, c: "border-success-border bg-success-surface/50" };
            return (
              <Card key={c.id} className={`p-0 overflow-hidden border-l-4 ${sv.c}`} hover={false}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <code className="text-xs text-muted-foreground">{c.date}</code>
                    <Badge v={sv.v}><AlertTriangle size={11} /> {t("petDetail.consult.alert")}: {getDynamic("severity", c.severity)}</Badge>
                  </div>
                  <div className="flex items-start gap-2 mb-4 p-3 bg-background/80 rounded-xl text-sm text-foreground">
                    <Activity size={15} className="mt-0.5 text-primary flex-shrink-0" />
                    <span><b>{t("petDetail.consult.symptoms")}:</b> {c.symptoms}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Stethoscope size={12} /> {t("petDetail.consult.possibleDiseases")}</p>
                      <div className="flex flex-wrap gap-1.5">{c.diseases.map(d => <span key={d} className="px-2.5 py-1 bg-destructive/10 text-destructive text-xs rounded-full">{d}</span>)}</div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Pill size={12} /> {t("petDetail.consult.firstAid")}</p>
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
          <h3 className="font-bold text-lg text-foreground">{t("petDetail.settings.title", { name: pet.name })}</h3>
          <Card className="divide-y divide-border" hover={false}>
            {[
              { icon: <ShieldCheck size={17} />, l: t("petDetail.settings.items.publicProfile.title"), d: t("petDetail.settings.items.publicProfile.desc") },
              { icon: <Bell size={17} />, l: t("petDetail.settings.items.notifications.title"), d: t("petDetail.settings.items.notifications.desc") },
              { icon: <Activity size={17} />, l: t("petDetail.settings.items.autoScore.title"), d: t("petDetail.settings.items.autoScore.desc") },
              { icon: <Sparkles size={17} />, l: t("petDetail.settings.items.syncAI.title"), d: t("petDetail.settings.items.syncAI.desc") },
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
      <CancelRecurringEventModal
        target={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onCancelOccurrence={() => { if (cancelTarget) cancelOccurrence(cancelTarget.id, cancelTarget.date); }}
        onCancelSeries={() => { if (cancelTarget) { deleteEvent(cancelTarget.id); setCancelTarget(null); } }}
      />
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

const QUICK_FOODS = [
  { icon: "🥩", label: "Pate", value: "1 hộp Pate" },
  { icon: "🥣", label: "Hạt", value: "100g Hạt" },
  { icon: "🍗", label: "Gà xé", value: "50g Gà xé" },
  { icon: "🍚", label: "Cơm", value: "1 bát Cơm" },
  { icon: "🥦", label: "Rau", value: "1 ít Rau" },
];

function HealthFormModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (h: HealthEntry) => void }) {
  const { t } = useTranslation();
  const [f, setF] = useState({ weight: "", condition: "Tốt", nutrition: "Cân bằng", illness: "" });
  
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(createHealthEntry({ weight: parseFloat(f.weight) || 0, condition: f.condition as HealthEntry["condition"], nutrition: f.nutrition, illness: f.illness || undefined }));
    setF({ weight: "", condition: "Tốt", nutrition: "Cân bằng", illness: "" });
    onClose();
  };

  const appendFood = (foodValue: string) => {
    setF(p => {
      const current = p.nutrition.trim();
      const newNutrition = current && current !== "Cân bằng" ? `${current}, ${foodValue}` : foodValue;
      return { ...p, nutrition: newNutrition };
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={t("petDetail.modals.health.title")}>
      <form onSubmit={save} className="space-y-4">
        <Field label={t("petDetail.modals.health.weightLabel")} type="number" step="0.1" value={f.weight} onChange={e => setF(p => ({ ...p, weight: e.target.value }))} placeholder={t("petDetail.modals.health.weightPlaceholder")} required />
        <Select label={t("petDetail.modals.health.conditionLabel")} value={f.condition} onChange={e => setF(p => ({ ...p, condition: e.target.value }))}>
          <option value="Tốt">{t("petDetail.dynamic.condition.tốt")}</option><option value="Bình thường">{t("petDetail.dynamic.condition.bình thường")}</option><option value="Cần chú ý">{t("petDetail.dynamic.condition.cần chú ý")}</option>
        </Select>
        <div>
          <Textarea label="Chi tiết bữa ăn hôm nay (vd: 100g thịt gà, 50g cơm)" value={f.nutrition} onChange={e => setF(p => ({ ...p, nutrition: e.target.value }))} placeholder="Nhập chi tiết các món ăn và định lượng..." rows={3} required />
          <div className="flex flex-wrap gap-2 mt-2">
            {QUICK_FOODS.map(food => (
              <button 
                key={food.label} 
                type="button" 
                onClick={() => appendFood(food.value)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
              >
                <span>{food.icon}</span>
                {food.label}
              </button>
            ))}
          </div>
        </div>
        <Field label={t("petDetail.modals.health.illnessLabel")} value={f.illness} onChange={e => setF(p => ({ ...p, illness: e.target.value }))} placeholder={t("petDetail.modals.health.illnessPlaceholder")} />
        <div className="flex gap-3 pt-1"><Btn variant="outline" block type="button" onClick={onClose}>{t("petDetail.modals.health.cancelBtn")}</Btn><Btn block type="submit">{t("petDetail.modals.health.saveBtn")}</Btn></div>
      </form>
    </Modal>
  );
}

function EventFormModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (e: CareEvent) => void }) {
  const { t } = useTranslation();
  const [f, setF] = useState({ title: "", date: "", time: "", repeat: "Không lặp", type: "Khám", customType: "" });
  const isOther = f.type === "Khác";
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(createCareEvent({ title: f.title, date: f.date, time: f.time, repeat: f.repeat as CareEvent["repeat"], type: isOther ? f.customType : f.type }));
    setF({ title: "", date: "", time: "", repeat: "Không lặp", type: "Khám", customType: "" });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title={t("petDetail.modals.event.title")}>
      <form onSubmit={save} className="space-y-4">
        <Field label={t("petDetail.modals.event.nameLabel")} value={f.title} onChange={e => setF(p => ({ ...p, title: e.target.value }))} placeholder={t("petDetail.modals.event.namePlaceholder")} required />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("petDetail.modals.event.dateLabel")} type="date" value={f.date} onChange={e => setF(p => ({ ...p, date: e.target.value }))} required />
          <Field label={t("petDetail.modals.event.timeLabel")} type="time" value={f.time} onChange={e => setF(p => ({ ...p, time: e.target.value }))} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select label={t("petDetail.modals.event.repeatLabel")} value={f.repeat} onChange={e => setF(p => ({ ...p, repeat: e.target.value }))}>
            <option value="Không lặp">{t("petDetail.dynamic.repeat.không lặp")}</option><option value="Hằng ngày">{t("petDetail.dynamic.repeat.hằng ngày")}</option><option value="Hằng tuần">{t("petDetail.dynamic.repeat.hằng tuần")}</option>
          </Select>
          <Select label={t("petDetail.modals.event.typeLabel")} value={f.type} onChange={e => setF(p => ({ ...p, type: e.target.value, customType: "" }))}>
            <option value="Khám">{t("petDetail.dynamic.eventType.khám")}</option><option value="Uống thuốc">{t("petDetail.dynamic.eventType.uống thuốc")}</option><option value="Tiêm phòng">{t("petDetail.dynamic.eventType.tiêm phòng")}</option><option value="Khác">{t("petDetail.dynamic.eventType.khác")}</option>
          </Select>
        </div>
        {isOther && (
          <Field label={t("petDetail.modals.event.customTypeLabel")} value={f.customType} onChange={e => setF(p => ({ ...p, customType: e.target.value }))} placeholder={t("petDetail.modals.event.customTypePlaceholder")} required />
        )}
        <div className="flex gap-3 pt-1"><Btn variant="outline" block type="button" onClick={onClose}>{t("petDetail.modals.event.cancelBtn")}</Btn><Btn block type="submit">{t("petDetail.modals.event.saveBtn")}</Btn></div>
      </form>
    </Modal>
  );
}

function CancelRecurringEventModal({ target, onClose, onCancelOccurrence, onCancelSeries }: {
  target: { title: string; date: string } | null; onClose: () => void; onCancelOccurrence: () => void; onCancelSeries: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Modal open={!!target} onClose={onClose} title={t("petDetail.modals.cancelEvent.title")}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">{t("petDetail.modals.cancelEvent.desc")} <span className="font-semibold text-foreground">{target?.title}</span>?</p>
        <div className="space-y-2">
          <Btn variant="outline" block className="!border-destructive/30 !text-destructive hover:!bg-destructive/10" onClick={onCancelOccurrence}>{t("petDetail.modals.cancelEvent.cancelOccurrenceBtn", { date: target?.date })}</Btn>
          <Btn variant="danger" block onClick={onCancelSeries}>{t("petDetail.modals.cancelEvent.cancelSeriesBtn")}</Btn>
          <Btn variant="ghost" block onClick={onClose}>{t("petDetail.modals.cancelEvent.keepBtn")}</Btn>
        </div>
      </div>
    </Modal>
  );
}
