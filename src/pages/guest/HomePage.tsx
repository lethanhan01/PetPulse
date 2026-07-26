import { useApp } from "@/stores/app.store";
import { PUBLIC_SUBSCRIPTIONS } from "@/mocks";
import { useNavigate } from "react-router";
import { Btn, Logo, Card } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Sun, Moon, Activity, Sparkles, Calendar, Users, ShieldCheck, Heart, ArrowRight, Stethoscope, Bell, PawPrint, CheckCircle2, Crown, X } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useEffect, useState } from "react";

const FEATURES = [
  { icon: <Activity size={20} />, title: "Health Timeline", desc: "Theo dõi cân nặng, dinh dưỡng & tình trạng sức khỏe theo trục thời gian." },
  { icon: <Sparkles size={20} />, title: "AI Symptom Checker", desc: "Nhập triệu chứng, AI phân tích mức độ cảnh báo và hướng dẫn sơ cứu." },
  { icon: <Calendar size={20} />, title: "Lịch chăm sóc", desc: "Nhắc lịch khám, uống thuốc, tiêm phòng qua in-app notification." },
  { icon: <ShieldCheck size={20} />, title: "Pet Passport", desc: "Hồ sơ điện tử đầy đủ: giống, microchip, tiêm phòng, health score." },
  { icon: <Users size={20} />, title: "Cộng đồng thú cưng", desc: "Chia sẻ khoảnh khắc, học hỏi mẹo chăm sóc từ cộng đồng yêu pet." },
  { icon: <Stethoscope size={20} />, title: "Health Score", desc: "Điểm sức khỏe chuẩn hóa cùng khuyến nghị chăm sóc cá nhân hóa." },
];

const FAQS = [
  { q: "PetPulse có miễn phí không?", a: "Có! Bạn có thể bắt đầu với gói Free miễn phí vĩnh viễn, quản lý tối đa 3 thú cưng. Khi cần mở khóa toàn bộ tính năng, bạn có thể nâng cấp lên Premium hoặc Premium Pro bất cứ lúc nào." },
  { q: "Tôi có thể quản lý nhiều thú cưng không?", a: "Có. Gói Free cho phép quản lý tối đa 3 thú cưng. Nếu bạn có nhiều hơn, gói Premium hỗ trợ không giới hạn số lượng thú cưng, kèm theo các tính năng nâng cao như AI Symptom Checker và Lịch chăm sóc thông minh." },
  { q: "AI Symptom Checker có chính xác không?", a: "AI Symptom Checker sử dụng mô hình ngôn ngữ lớn (LLM) phân tích triệu chứng bạn nhập vào, dựa trên cơ sở dữ liệu thú y. Kết quả chỉ mang tính tham khảo, không thay thế chẩn đoán của bác sĩ thú y. Chúng tôi luôn khuyến nghị bạn đưa thú cưng đến phòng khám khi có dấu hiệu bất thường." },
  { q: "Dữ liệu của tôi có được bảo mật không?", a: "Tuyệt đối. PetPulse áp dụng các tiêu chuẩn bảo mật hàng đầu: mã hóa dữ liệu đầu cuối, xác thực đa lớp, và tuân thủ quy định bảo vệ dữ liệu cá nhân. Hồ sơ sức khỏe thú cưng của bạn được lưu trữ an toàn và chỉ bạn mới có quyền truy cập." },
  { q: "Tôi có thể hủy gói Premium bất cứ lúc nào không?", a: "Có. Bạn có thể hủy gói Premium hoặc Premium Pro bất cứ lúc nào mà không mất thêm phí. Sau khi hủy, quyền lợi Premium vẫn được duy trì đến hết chu kỳ thanh toán hiện tại, sau đó tài khoản sẽ tự động chuyển về gói Free." },
  { q: "PetPulse có hỗ trợ những loài thú cưng nào?", a: "PetPulse hỗ trợ Chó, Mèo, Chim, Cá, Hamster và nhiều loài thú cưng phổ biến khác. Bạn có thể thêm thú cưng với đầy đủ thông tin: giống, tuổi, cân nặng, microchip và lịch sử tiêm phòng." },
];

const NAV_LINKS = [
  { label: "Tính năng", id: "features" },
  { label: "Cộng đồng", id: "community-preview" },
  { label: "Bảng giá", id: "cta" },
  { label: "Về chúng tôi", id: "about" },
  { label: "FAQ", id: "faq" },
];

export function Landing() {
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState("");
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
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 h-20 flex items-center px-4 sm:px-8 border-b border-border bg-background/85 backdrop-blur-md">
        <Logo size={36} />
        <nav className="hidden md:flex items-center gap-1 ml-8">
          {NAV_LINKS.map(i => (
            <button key={i.id} onClick={() => scrollTo(i.id)} className={`px-3 py-1.5 rounded-xl text-sm transition-colors border border-border ${activeSection === i.id ? "bg-secondary text-foreground font-semibold" : "text-foreground/70 hover:text-foreground hover:bg-secondary"}`}>{i.label}</button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full border border-border hover:bg-secondary transition-colors" aria-label="Toggle theme">
            {isDark ? <Sun size={16} className="text-accent" /> : <Moon size={16} className="text-primary" />}
          </button>
          <Btn variant="ghost" size="sm" className="border border-border" onClick={() => navigate("/login")}>Đăng nhập</Btn>
          <Btn size="sm" onClick={() => navigate("/register")}>Đăng ký</Btn>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-8 py-16 sm:py-24"
        style={{ background: "var(--gradient-page)" }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
              <Sparkles size={12} /> Nền tảng chăm sóc thú cưng thông minh
            </span>
            <h1 className="font-extrabold text-4xl sm:text-6xl text-foreground leading-tight mb-5">
              Hộ chiếu sức khỏe <span className="text-primary">điện tử</span> cho thú cưng của bạn
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
              PetPulse giúp bạn quản lý hồ sơ, theo dõi health timeline, đặt lịch chăm sóc và tư vấn sức khỏe bằng AI — tất cả trong một nơi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Btn size="lg" icon={<ArrowRight size={18} />} iconRight onClick={() => navigate("/login")}>Đăng nhập</Btn>
            </div>
            <div className="flex items-center gap-6 mt-8">
              {[{ v: "10K+", l: "Thú cưng" }, { v: "8K+", l: "Người dùng" }, { v: "98%", l: "Hài lòng" }].map(s => (
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
                    <p className="font-bold text-foreground">Pet Passport điện tử</p>
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
              <div className="w-9 h-9 rounded-xl bg-success-surface bg-success-surface text-success flex items-center justify-center"><Heart size={17} /></div>
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
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3">Mọi thứ thú cưng cần, trong một nền tảng</h2>
          <p className="text-muted-foreground">Từ hồ sơ điện tử đến tư vấn AI, PetPulse đồng hành cùng hành trình khỏe mạnh của bé.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <Card key={f.title} className="p-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Community preview */}
      <section id="community-preview" className="px-4 sm:px-8 pb-20 max-w-6xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3">Cộng đồng yêu thú cưng</h2>
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
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3">Chọn gói phù hợp với bạn</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Bắt đầu miễn phí với Free, nâng cấp Premium bất cứ lúc nào để mở khóa toàn bộ tính năng.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PUBLIC_SUBSCRIPTIONS.map(p => (
            <Card key={p.name} className={`p-6 relative flex flex-col ${p.accent ? "ring-2 ring-primary" : ""}`} hover={false}>
              {p.accent && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold whitespace-nowrap">PHỔ BIẾN NHẤT</span>}
              <div className="flex items-center gap-2 mb-1">
                {p.accent ? <Crown size={20} className="text-primary" /> : <ShieldCheck size={20} className="text-muted-foreground" />}
                <h3 className="font-bold text-xl text-foreground">{p.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">{p.tagline}</p>
              <div className="mb-5"><span className="font-extrabold text-3xl text-foreground">{p.price}</span> <span className="text-sm text-muted-foreground">/ {p.period}</span></div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map(f => <li key={f} className="flex items-start gap-2 text-sm text-foreground"><CheckCircle2 size={16} className="text-success mt-0.5 flex-shrink-0" /> {f}</li>)}
                {p.missing.map(f => <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground/60"><X size={16} className="mt-0.5 flex-shrink-0 opacity-40" /> {f}</li>)}
              </ul>
              {p.name === "Free"
                ? <Btn block variant="primary" onClick={() => navigate("/register")}>Bắt đầu miễn phí</Btn>
                : <Btn block size="lg" icon={<Crown size={16} />} onClick={() => navigate("/register")}>Dùng thử {p.name}</Btn>}
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
              <PawPrint size={12} /> Về chúng tôi
            </span>
            <h2 className="font-extrabold text-3xl text-foreground mb-4">Sứ mệnh của PetPulse</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              PetPulse ra đời với niềm tin rằng mỗi thú cưng đều xứng đáng được chăm sóc sức khỏe một cách khoa học và trọn vẹn. Chúng tôi số hóa toàn bộ hồ sơ sức khỏe, kết hợp công nghệ AI để giúp người nuôi trẻ theo dõi và chăm sóc bé yêu dễ dàng hơn bao giờ hết.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[{ v: "2024", l: "Thành lập" }, { v: "10K+", l: "Thú cưng" }, { v: "50+", l: "Đối tác thú y" }].map(s => (
                <div key={s.l}>
                  <div className="font-extrabold text-2xl text-primary">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {["Bảo mật dữ liệu chuẩn quốc tế", "Đội ngũ cố vấn thú y giàu kinh nghiệm", "Cam kết đồng hành suốt vòng đời thú cưng"].map(t => (
                <div key={t} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 size={16} className="text-success flex-shrink-0" /> {t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 sm:px-8 pb-20 max-w-4xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-extrabold text-3xl sm:text-4xl text-foreground mb-3">Câu hỏi thường gặp</h2>
          <p className="text-muted-foreground">Những thắc mắc phổ biến về PetPulse</p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}
              className="border border-border rounded-2xl bg-card px-6 has-[button[data-state=open]]:ring-1 has-[button[data-state=open]]:ring-primary/30">
              <AccordionTrigger className="text-base font-medium text-foreground py-4 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA banner */}
      <section className="px-4 sm:px-8 pb-20 max-w-6xl mx-auto">
        <div className="rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,var(--primary) 0%,var(--accent) 55%,var(--chart-3) 100%)" }}>
          <h2 className="font-extrabold text-3xl sm:text-4xl text-white mb-4">Sẵn sàng chăm sóc bé yêu tốt hơn?</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">Tạo tài khoản Free miễn phí ngay hôm nay. Nâng cấp Premium bất cứ lúc nào.</p>
          <Btn size="lg" className="!bg-white !text-black hover:!bg-white/90 shadow-lg shadow-black/10" onClick={() => navigate("/register")}>Tạo tài khoản miễn phí</Btn>
        </div>
      </section>

      <footer id="footer" className="border-t border-border px-4 sm:px-8 py-8 text-center text-sm text-muted-foreground scroll-mt-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={24} />
          <p>© 2026 PetPulse. Chăm sóc thú cưng bằng cả trái tim 🐾</p>
        </div>
      </footer>
    </div>
  );
}
