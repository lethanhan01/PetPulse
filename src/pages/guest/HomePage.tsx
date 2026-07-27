import { useApp } from "@/stores/app.store";
import { PUBLIC_SUBSCRIPTIONS } from "@/mocks";
import { useNavigate } from "react-router";
import { Btn, Logo, Card } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Sun, Moon, Activity, Sparkles, Calendar, Users, ShieldCheck, Heart, ArrowRight, Stethoscope, Bell, PawPrint, CheckCircle2, Crown, X } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/Navbar/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { SplashScreen } from "@/components/common/SplashScreen";

const FEATURES = [
  { icon: <Activity size={20} />, id: "timeline" },
  { icon: <Sparkles size={20} />, id: "ai" },
  { icon: <Calendar size={20} />, id: "calendar" },
  { icon: <ShieldCheck size={20} />, id: "passport" },
  { icon: <Users size={20} />, id: "community" },
  { icon: <Stethoscope size={20} />, id: "score" },
];

const FAQS = [
  { id: "free" },
  { id: "multiplePets" },
  { id: "aiAccuracy" },
  { id: "security" },
  { id: "cancel" },
  { id: "supportedPets" },
];

const NAV_LINKS = [
  { id: "features" },
  { id: "community-preview" },
  { id: "cta" },
  { id: "about" },
  { id: "faq" },
];

export function Landing() {
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState("");
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("splashSeen"));

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashSeen", "true");
    setShowSplash(false);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  useEffect(() => {
    const ids = NAV_LINKS.map(i => i.id);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) { setActiveSection(entry.target.id); break; }
      }
    }, { rootMargin: "-30% 0px -60% 0px" });
    ids.forEach(id => document.getElementById(id) && observer.observe(document.getElementById(id)!));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className="min-h-screen">
        {/* Nav */}
      <header className="sticky top-0 z-40 h-20 flex items-center px-4 sm:px-8 border-b border-border bg-background/85 backdrop-blur-md">
        <Logo size={36} />
        <nav className="hidden md:flex items-center gap-1 ml-8">
          {NAV_LINKS.map(i => (
            <button key={i.id} onClick={() => scrollTo(i.id)} className={`px-3 py-1.5 rounded-xl text-sm transition-colors border border-border ${activeSection === i.id ? "bg-secondary text-foreground font-semibold" : "text-foreground/70 hover:text-foreground hover:bg-secondary"}`}>{t(`home.nav.${i.id}`)}</button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <button onClick={toggleTheme} className="p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Toggle theme">
            {isDark ? <Sun size={16} className="text-accent" /> : <Moon size={16} className="text-primary" />}
          </button>
          <Btn variant="ghost" size="sm" className="border border-border" onClick={() => navigate("/login")}>{t('auth.login.submitBtn')}</Btn>
          <Btn size="sm" onClick={() => navigate("/register")}>{t('auth.register.submitBtn')}</Btn>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-8 py-16 sm:py-24"
        style={{ background: "var(--gradient-page)" }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
              <Sparkles size={12} /> {t('home.hero.badge')}
            </span>
            <h1 className="font-extrabold text-4xl sm:text-6xl text-foreground leading-tight mb-5">
              {t('home.hero.title1')} <span className="text-primary">{t('home.hero.titleHighlight')}</span> {t('home.hero.title2')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
              {t('home.hero.desc')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Btn size="lg" icon={<ArrowRight size={18} />} iconRight onClick={() => navigate("/login")}>{t('home.hero.loginBtn')}</Btn>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {[{ v: "10K+", l: t('home.hero.stats.pets') }, { v: "8K+", l: t('home.hero.stats.users') }, { v: "98%", l: t('home.hero.stats.satisfaction') }].map(s => (
                <div key={s.l}>
                  <div className="font-extrabold text-2xl text-primary">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <Card className="overflow-hidden" hover={false}>
              <div className="h-52 relative">
                <ImageWithFallback src="https://images.unsplash.com/photo-1598875706250-21faaf804361?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Thú cưng khỏe mạnh" className="w-full h-full object-cover" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><ShieldCheck size={18} /></div>
                  <div>
                    <p className="font-bold text-foreground">{t('home.hero.card.title')}</p>
                    <p className="text-xs text-muted-foreground">{t('home.hero.card.subtitle')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <Activity size={15} />, l: t('home.hero.card.score') },
                    { icon: <Calendar size={15} />, l: t('home.hero.card.calendar') },
                    { icon: <Sparkles size={15} />, l: t('home.hero.card.ai') },
                  ].map(x => (
                    <div key={x.l} className="bg-muted rounded-xl p-2.5 text-center">
                      <div className="text-primary flex justify-center mb-1">{x.icon}</div>
                      <div className="text-[11px] text-muted-foreground leading-tight">{x.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-2xl shadow-lg p-3 flex items-center gap-2 hidden sm:flex">
              <div className="w-9 h-9 rounded-xl bg-success-surface bg-success-surface text-success flex items-center justify-center"><Heart size={17} /></div>
              <div><p className="text-sm font-semibold text-foreground">{t('home.hero.floating.vaccine')}</p><p className="text-xs text-muted-foreground">{t('home.hero.floating.vaccineSub')}</p></div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl shadow-lg p-3 flex items-center gap-2 hidden sm:flex">
              <div className="w-9 h-9 rounded-xl bg-accent/20 text-primary flex items-center justify-center"><Bell size={17} /></div>
              <div><p className="text-sm font-semibold text-foreground">{t('home.hero.floating.notification')}</p><p className="text-xs text-muted-foreground">{t('home.hero.floating.notificationSub')}</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-8 py-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3">{t('home.features.sectionTitle')}</h2>
          <p className="text-muted-foreground">{t('home.features.sectionDesc')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <Card key={f.id} className="p-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg text-foreground mb-1.5">{t(`home.features.${f.id}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(`home.features.${f.id}.desc`)}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Community preview */}
      <section id="community-preview" className="px-4 sm:px-8 pb-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3">{t('home.community.sectionTitle')}</h2>
          <p className="text-muted-foreground">{t('home.community.sectionDesc')}</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { img: "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", quoteId: "review1", name: "Thu Hà" },
            { img: "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", quoteId: "review2", name: "Minh Quân" },
            { img: "https://images.unsplash.com/photo-1624956578877-4948166c5dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", quoteId: "review3", name: "Ngọc Linh" },
          ].map(c => (
            <Card key={c.name} className="overflow-hidden">
              <div className="h-40"><ImageWithFallback src={c.img} alt={c.name} className="w-full h-full object-cover" /></div>
              <div className="p-5">
                <p className="text-sm text-foreground leading-relaxed mb-3">“{t(`home.community.${c.quoteId}`)}”</p>
                <p className="text-xs font-semibold text-primary">— {c.name}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="cta" className="px-4 sm:px-8 pb-20 max-w-5xl mx-auto scroll-mt-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Crown size={12} /> {t('home.pricing.badge')}
          </span>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3">{t('home.pricing.sectionTitle')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('home.pricing.sectionDesc')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PUBLIC_SUBSCRIPTIONS.map(p => (
            <Card key={p.name} className={`p-6 relative flex flex-col ${p.accent ? "ring-2 ring-primary" : ""}`} hover={false}>
              {p.accent && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold whitespace-nowrap">{t('home.pricing.popular')}</span>}
              <div className="flex items-center gap-2 mb-1">
                {p.accent ? <Crown size={20} className="text-primary" /> : <ShieldCheck size={20} className="text-muted-foreground" />}
                <h3 className="font-bold text-xl text-foreground">{p.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{t(`home.pricing.plans.${p.name}.tagline`)}</p>
              <div className="mb-5"><span className="font-extrabold text-3xl text-foreground">{t(`home.pricing.plans.${p.name}.price`)}</span> <span className="text-sm text-muted-foreground">/ {p.period === 'mỗi tháng' ? t('home.pricing.perMonth') : p.period === 'năm' ? t('home.pricing.perYear') : t('home.pricing.forever')}</span></div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map((f, i) => <li key={f} className="flex items-start gap-2 text-sm text-foreground"><CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" /> {t(`home.pricing.plans.${p.name}.features.${i}`)}</li>)}
                {p.missing.map((f, i) => <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground/60"><X size={16} className="mt-0.5 flex-shrink-0 opacity-40" /> {t(`home.pricing.plans.${p.name}.missing.${i}`)}</li>)}
              </ul>
              {p.name === "Free"
                ? <Btn block variant="primary" onClick={() => navigate("/register")}>{t('home.pricing.startFree')}</Btn>
                : <Btn block size="lg" icon={<Crown size={16} />} onClick={() => navigate("/register")}>{t('home.pricing.tryPlan', { planName: p.name })}</Btn>}
            </Card>
          ))}
        </div>
      </section>

      <section id="about" className="px-4 sm:px-8 pb-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="rounded-3xl border border-border bg-card overflow-hidden grid md:grid-cols-2">
          <div className="h-64 md:h-auto relative">
            <ImageWithFallback src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Về PetPulse" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 sm:p-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <PawPrint size={12} /> {t('home.about.badge')}
            </span>
            <h2 className="font-extrabold text-3xl text-foreground mb-4">{t('home.about.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('home.about.desc')}
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[{ v: "2024", l: t('home.about.stats.founded') }, { v: "10K+", l: t('home.about.stats.pets') }, { v: "50+", l: t('home.about.stats.partners') }].map(s => (
                <div key={s.l}>
                  <div className="font-extrabold text-2xl text-primary">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 size={16} className="text-success flex-shrink-0" /> {t(`home.about.points.${i}`)}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 sm:px-8 pb-20 max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3">{t('home.faq.sectionTitle')}</h2>
          <p className="text-muted-foreground">{t('home.faq.sectionDesc')}</p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}
              className="border border-border rounded-2xl bg-card px-6 has-[button[data-state=open]]:ring-1 has-[button[data-state=open]]:ring-primary/30">
              <AccordionTrigger className="text-base font-medium text-foreground py-4 hover:no-underline">
                {t(`home.faq.items.${faq.id}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {t(`home.faq.items.${faq.id}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA banner */}
      <section className="px-4 sm:px-8 pb-20 max-w-6xl mx-auto">
        <div className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,var(--primary) 0%,var(--accent) 55%,var(--chart-3) 100%)" }}>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-white mb-4">{t('home.cta.title')}</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">{t('home.cta.desc')}</p>
          <Btn size="lg" className="!bg-white !text-black hover:!bg-white/90 shadow-lg shadow-black/10" onClick={() => navigate("/register")}>{t('home.cta.btn')}</Btn>
        </div>
      </section>

      <footer id="footer" className="border-t border-border px-4 sm:px-8 py-8 text-center text-sm text-muted-foreground scroll-mt-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={24} />
          <p>{t('home.footer.copyright')}</p>
        </div>
      </footer>
    </div>
    </>
  );
}
