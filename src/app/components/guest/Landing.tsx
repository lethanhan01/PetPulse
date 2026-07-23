import { useApp } from "../../lib/store";
import { Btn, Logo, Card, HEAD } from "../kit";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Sun, Moon, Activity, Sparkles, Calendar, Users, ShieldCheck, Heart, ArrowRight, Stethoscope, Bell, PawPrint, CheckCircle2, Crown, X } from "lucide-react";

const PLANS = [
  { name: "Freemium", price: "0đ", period: "mãi mãi", accent: false,
    tagline: "Bắt đầu chăm sóc bé yêu miễn phí",
    features: ["1 thú cưng", "Health timeline cơ bản", "Lịch chăm sóc", "Cộng đồng thú cưng"],
    missing: ["AI Symptom Checker", "Không giới hạn pet", "Thống kê nâng cao"] },
  { name: "Premium", price: "99.000đ", period: "mỗi tháng", accent: true,
    tagline: "Mở khóa toàn bộ sức mạnh của PawPulse",
    features: ["Không giới hạn thú cưng", "AI Symptom Checker không giới hạn", "Health Score nâng cao", "Thống kê & báo cáo chi tiết", "Ưu tiên hỗ trợ 24/7", "Xuất hồ sơ PDF"],
    missing: [] },
];

const FEATURES = [
  { icon: <Activity size={20} />, title: "Health Timeline", desc: "Theo dõi cân nặng, dinh dưỡng & tình trạng sức khỏe theo trục thời gian." },
  { icon: <Sparkles size={20} />, title: "AI Symptom Checker", desc: "Nhập triệu chứng, AI phân tích mức độ cảnh báo và hướng dẫn sơ cứu." },
  { icon: <Calendar size={20} />, title: "Lịch chăm sóc", desc: "Nhắc lịch khám, uống thuốc, tiêm phòng qua in-app notification." },
  { icon: <ShieldCheck size={20} />, title: "Pet Passport", desc: "Hồ sơ điện tử đầy đủ: giống, microchip, tiêm phòng, health score." },
  { icon: <Users size={20} />, title: "Cộng đồng thú cưng", desc: "Chia sẻ khoảnh khắc, học hỏi mẹo chăm sóc từ cộng đồng yêu pet." },
  { icon: <Stethoscope size={20} />, title: "Health Score", desc: "Điểm sức khỏe chuẩn hóa cùng khuyến nghị chăm sóc cá nhân hóa." },
];

const NAV_LINKS = [
  { label: "Tính năng", id: "features" },
  { label: "Cộng đồng", id: "community-preview" },
  { label: "Bảng giá", id: "cta" },
  { label: "Về chúng tôi", id: "about" },
];

export function Landing() {
  const { navigate, theme, toggleTheme } = useApp();
  const isDark = theme === "dark";
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 h-16 flex items-center px-4 sm:px-8 border-b border-border bg-background/85 backdrop-blur-md">
        <Logo />
        <nav className="hidden md:flex items-center gap-1 ml-8">
          {NAV_LINKS.map(i => (
            <button key={i.id} onClick={() => scrollTo(i.id)} className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">{i.label}</button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Toggle theme">
            {isDark ? <Sun size={16} className="text-accent" /> : <Moon size={16} className="text-primary" />}
          </button>
          <Btn variant="ghost" size="sm" onClick={() => navigate("login")}>Đăng nhập</Btn>
          <Btn size="sm" onClick={() => navigate("register")}>Đăng ký</Btn>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-8 py-16 sm:py-24"
        style={{ background: isDark
          ? "radial-gradient(ellipse at 20% 30%, rgba(47,224,220,0.12) 0%, transparent 55%), radial-gradient(ellipse at 90% 60%, rgba(120,227,253,0.08) 0%, transparent 45%), #0A1E1E"
          : "radial-gradient(ellipse at 20% 30%, #D1F5FF 0%, transparent 55%), radial-gradient(ellipse at 90% 60%, rgba(120,227,253,0.5) 0%, transparent 45%), #EEF8FF" }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
              <Sparkles size={12} /> Nền tảng chăm sóc thú cưng thông minh
            </span>
            <h1 className="font-extrabold text-4xl sm:text-6xl text-foreground leading-tight mb-5" style={HEAD}>
              Hộ chiếu sức khỏe <span className="text-primary">điện tử</span> cho thú cưng của bạn
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
              PawPulse giúp bạn quản lý hồ sơ, theo dõi health timeline, đặt lịch chăm sóc và tư vấn sức khỏe bằng AI — tất cả trong một nơi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Btn size="lg" icon={<ArrowRight size={18} />} iconRight onClick={() => navigate("login")}>Đăng nhập</Btn>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {[{ v: "10K+", l: "Thú cưng" }, { v: "8K+", l: "Người dùng" }, { v: "98%", l: "Hài lòng" }].map(s => (
                <div key={s.l}>
                  <div className="font-extrabold text-2xl text-primary" style={HEAD}>{s.v}</div>
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
                    <p className="font-bold text-foreground" style={HEAD}>Pet Passport điện tử</p>
                    <p className="text-xs text-muted-foreground">Hồ sơ sức khỏe của bé, mọi lúc mọi nơi</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <Activity size={15} />, l: "Health Score" },
                    { icon: <Calendar size={15} />, l: "Lịch chăm sóc" },
                    { icon: <Sparkles size={15} />, l: "Tư vấn AI" },
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
              <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 flex items-center justify-center"><Heart size={17} /></div>
              <div><p className="text-sm font-semibold text-foreground">Theo dõi tiêm phòng</p><p className="text-xs text-muted-foreground">Nhắc lịch tự động</p></div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card border border-border rounded-2xl shadow-lg p-3 flex items-center gap-2 hidden sm:flex">
              <div className="w-9 h-9 rounded-xl bg-accent/20 text-primary flex items-center justify-center"><Bell size={17} /></div>
              <div><p className="text-sm font-semibold text-foreground">Thông báo thông minh</p><p className="text-xs text-muted-foreground">Không bỏ lỡ lịch khám</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-8 py-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3" style={HEAD}>Mọi thứ thú cưng cần, trong một nền tảng</h2>
          <p className="text-muted-foreground">Từ hồ sơ điện tử đến tư vấn AI, PawPulse đồng hành cùng hành trình khỏe mạnh của bé.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <Card key={f.title} className="p-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg text-foreground mb-1.5" style={HEAD}>{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Community preview */}
      <section id="community-preview" className="px-4 sm:px-8 pb-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3" style={HEAD}>Cộng đồng yêu thú cưng</h2>
          <p className="text-muted-foreground">Hàng nghìn người nuôi chia sẻ khoảnh khắc và mẹo chăm sóc mỗi ngày.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { img: "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", quote: "Nhắc lịch tiêm phòng cực tiện, mình không còn quên nữa!", name: "Thu Hà" },
            { img: "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", quote: "Health Score giúp mình theo dõi cân nặng của bé rõ ràng.", name: "Minh Quân" },
            { img: "https://images.unsplash.com/photo-1624956578877-4948166c5dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", quote: "AI phát hiện sớm dấu hiệu bệnh, đi khám kịp thời. Tuyệt vời!", name: "Ngọc Linh" },
          ].map(c => (
            <Card key={c.name} className="overflow-hidden">
              <div className="h-40"><ImageWithFallback src={c.img} alt={c.name} className="w-full h-full object-cover" /></div>
              <div className="p-5">
                <p className="text-sm text-foreground leading-relaxed mb-3">“{c.quote}”</p>
                <p className="text-xs font-semibold text-primary">— {c.name}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* About */}
      {/* Bảng giá */}
      <section id="cta" className="px-4 sm:px-8 pb-20 max-w-5xl mx-auto scroll-mt-20">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Crown size={12} /> Bảng giá
          </span>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3" style={HEAD}>Chọn gói phù hợp với bạn</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Bắt đầu miễn phí với Freemium, nâng cấp Premium bất cứ lúc nào để mở khóa toàn bộ tính năng.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map(p => (
            <Card key={p.name} className={`p-6 relative ${p.accent ? "ring-2 ring-primary" : ""}`} hover={false}>
              {p.accent && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold whitespace-nowrap">PHỔ BIẾN NHẤT</span>}
              <div className="flex items-center gap-2 mb-1">
                {p.accent ? <Crown size={20} className="text-primary" /> : <ShieldCheck size={20} className="text-muted-foreground" />}
                <h3 className="font-bold text-xl text-foreground" style={HEAD}>{p.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{p.tagline}</p>
              <div className="mb-5"><span className="font-extrabold text-3xl text-foreground" style={HEAD}>{p.price}</span> <span className="text-sm text-muted-foreground">/ {p.period}</span></div>
              <ul className="space-y-2.5 mb-6">
                {p.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-foreground"><CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" /> {f}</li>)}
                {p.missing.map(f => <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground/60"><X size={16} className="mt-0.5 flex-shrink-0 opacity-40" /> {f}</li>)}
              </ul>
              {p.accent
                ? <Btn block size="lg" icon={<Crown size={16} />} onClick={() => navigate("register")}>Dùng thử Premium</Btn>
                : <Btn block variant="outline" onClick={() => navigate("register")}>Bắt đầu miễn phí</Btn>}
            </Card>
          ))}
        </div>
      </section>

      <section id="about" className="px-4 sm:px-8 pb-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="rounded-3xl border border-border bg-card overflow-hidden grid md:grid-cols-2">
          <div className="h-64 md:h-auto relative">
            <ImageWithFallback src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Về PawPulse" className="w-full h-full object-cover" />
          </div>
          <div className="p-8 sm:p-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <PawPrint size={12} /> Về chúng tôi
            </span>
            <h2 className="font-extrabold text-3xl text-foreground mb-4" style={HEAD}>Sứ mệnh của PawPulse</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PawPulse ra đời với niềm tin rằng mỗi thú cưng đều xứng đáng được chăm sóc sức khỏe một cách khoa học và trọn vẹn. Chúng tôi số hóa toàn bộ hồ sơ sức khỏe, kết hợp công nghệ AI để giúp người nuôi trẻ theo dõi và chăm sóc bé yêu dễ dàng hơn bao giờ hết.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[{ v: "2024", l: "Thành lập" }, { v: "10K+", l: "Thú cưng" }, { v: "50+", l: "Đối tác thú y" }].map(s => (
                <div key={s.l}>
                  <div className="font-extrabold text-2xl text-primary" style={HEAD}>{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {["Bảo mật dữ liệu chuẩn quốc tế", "Đội ngũ cố vấn thú y giàu kinh nghiệm", "Cam kết đồng hành suốt vòng đời thú cưng"].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 size={16} className="text-green-600 flex-shrink-0" /> {t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-4 sm:px-8 pb-20 max-w-6xl mx-auto">
        <div className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1D8B88 0%,#2FE0DC 55%,#78E3FD 100%)" }}>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-white mb-4" style={HEAD}>Sẵn sàng chăm sóc bé yêu tốt hơn?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">Tạo tài khoản Freemium miễn phí ngay hôm nay. Nâng cấp Premium bất cứ lúc nào.</p>
          <Btn size="lg" className="!bg-white !text-[#0D2828] hover:!bg-white/90 shadow-lg shadow-black/10" onClick={() => navigate("register")}>Tạo tài khoản miễn phí</Btn>
        </div>
      </section>

      <footer id="footer" className="border-t border-border px-4 sm:px-8 py-8 text-center text-sm text-muted-foreground scroll-mt-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={24} />
          <p>© 2026 PawPulse. Chăm sóc thú cưng bằng cả trái tim 🐾</p>
        </div>
      </footer>
    </div>
  );
}
