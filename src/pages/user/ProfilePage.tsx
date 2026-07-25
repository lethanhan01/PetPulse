import { useState, useEffect, useRef, type ReactNode } from "react";
import { useApp } from "@/stores/app.store";
import { useNavigate } from "react-router";
import { Card, Btn, Field, Select, Badge, PageTitle } from "@/components/common/kit";
import { PawPrint, Calendar, Heart, ShieldCheck, Crown, Lock, Pencil, Plus, ChevronRight, X, Check, Users, CreditCard, Sparkles, Camera } from "lucide-react";
import type { MockAccount } from "@/mocks/types";
import { MyPostsContent } from "./MyPostsPage";

function StatChip({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-foreground">
      <span className="text-primary">{icon}</span>
      <span className="font-semibold">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

export function Profile() {
  const { pets, plan, role, activeAccount, updateAccount } = useApp();
  const navigate = useNavigate();
  const isAdmin = role === "admin";
  const joined = activeAccount?.joined ? new Date(activeAccount.joined) : new Date();
  const yearsWithPetPulse = Math.max(0, new Date().getFullYear() - joined.getFullYear());
  const healthRecords = pets.reduce((s, p) => s + p.health.length, 0);

  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"info" | "security" | "pets" | "posts">("info");
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [form, setForm] = useState<Pick<MockAccount, "name" | "email" | "phone" | "birthDate" | "city" | "gender">>({
    name: "", email: "", phone: "", birthDate: "", city: "", gender: "Nam"
  });

  useEffect(() => {
    if (activeAccount) setForm({ name: activeAccount.name, email: activeAccount.email, phone: activeAccount.phone, birthDate: activeAccount.birthDate, city: activeAccount.city, gender: activeAccount.gender });
  }, [activeAccount]);

  const hasAvatar = activeAccount?.avatar?.startsWith("data:");
  const initials = !hasAvatar ? (activeAccount?.avatar || activeAccount?.name?.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase() || (isAdmin ? "AD" : "VN")) : "";

  const tabs = isAdmin
    ? [{ k: "info" as const, l: "Thông tin" }, { k: "security" as const, l: "Bảo mật" }]
    : [{ k: "info" as const, l: "Thông tin" }, { k: "security" as const, l: "Bảo mật" }, { k: "pets" as const, l: "Thú cưng" }, { k: "posts" as const, l: "Bài viết" }];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageTitle title={isAdmin ? "Hồ sơ Admin" : "Hồ sơ cá nhân"} />

      {/* ── Profile Header Card ── */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
        <div
          className="group relative h-24 sm:h-32 bg-gradient-to-r from-primary/80 via-primary to-cyan-400/60 bg-cover bg-center"
          style={activeAccount?.coverImage ? { backgroundImage: `url(${activeAccount.coverImage})` } : undefined}
        >
          <button
            type="button"
            onClick={() => coverRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100 focus-visible:bg-black/30 focus-visible:opacity-100"
            aria-label="Tải ảnh nền hồ sơ"
          >
            <span className="flex items-center gap-2 rounded-lg bg-background/90 px-3 py-2 text-xs font-semibold text-foreground shadow-sm">
              <Camera size={15} /> Tải ảnh nền
            </span>
          </button>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => updateAccount({ coverImage: reader.result as string });
            reader.readAsDataURL(file);
            e.currentTarget.value = "";
          }} />
        </div>
        <div className="px-5 sm:px-7 pb-6">
          <div className="-mt-10 sm:-mt-14 mb-4 flex">
            <button type="button" onClick={() => avatarRef.current?.click()} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-background border-4 border-border flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-primary shadow-sm flex-shrink-0 overflow-hidden group cursor-pointer">
              {hasAvatar ? (
                <img src={activeAccount!.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : initials}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => updateAccount({ avatar: reader.result as string });
              reader.readAsDataURL(file);
            }} />
          </div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <h2 className="font-bold text-xl sm:text-2xl text-foreground truncate">
                {activeAccount?.name || (isAdmin ? "Quản trị viên" : "Nguyễn Văn An")}
              </h2>
              <p className="text-sm text-muted-foreground truncate">{activeAccount?.email}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAdmin ? (
                <Badge v="primary"><ShieldCheck size={11} /> Admin</Badge>
              ) : plan === "Premium" ? (
                <Badge v="primary"><Crown size={11} /> Premium</Badge>
              ) : (
                <Badge v="neutral">Free</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {isAdmin ? (
              <>
                <StatChip icon={<Users size={14} />} value="49" label="người dùng" />
                <StatChip icon={<PawPrint size={14} />} value="100" label="thú cưng" />
                <StatChip icon={<CreditCard size={14} />} value="3" label="gói đăng ký" />
              </>
            ) : (
              <>
                <StatChip icon={<PawPrint size={14} />} value={String(pets.length)} label="thú cưng" />
                <StatChip icon={<Calendar size={14} />} value={String(yearsWithPetPulse)} label="năm cùng PetPulse" />
                <StatChip icon={<Heart size={14} />} value={String(healthRecords)} label="bản ghi sức khỏe" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t.k ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>{t.l}</button>
        ))}
      </div>

      {/* ── Info Tab ── */}
      {tab === "info" && (
        <Card className="p-6" hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-foreground">Thông tin cá nhân</h3>
            {!editing && <Btn size="sm" variant="ghost" icon={<Pencil size={14} />} onClick={() => setEditing(true)}>Sửa</Btn>}
          </div>
          {editing ? (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); updateAccount(form); setEditing(false); }}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Họ và tên" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <Field label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <Field label="Số điện thoại" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <Field label="Ngày sinh" type="date" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
                <Field label="Thành phố" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                <Select label="Giới tính" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as MockAccount["gender"] }))}>
                  <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option>
                </Select>
              </div>
              <div className="flex gap-3 pt-2">
                <Btn icon={<Check size={15} />} type="submit">Lưu thay đổi</Btn>
                <Btn variant="outline" icon={<X size={15} />} type="button"
                  onClick={() => { if (activeAccount) setForm({ name: activeAccount.name, email: activeAccount.email, phone: activeAccount.phone, birthDate: activeAccount.birthDate, city: activeAccount.city, gender: activeAccount.gender }); setEditing(false); }}>Hủy</Btn>
              </div>
            </form>
          ) : (
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { l: "Họ và tên", v: activeAccount?.name },
                { l: "Email", v: activeAccount?.email },
                { l: "Số điện thoại", v: activeAccount?.phone },
                { l: "Ngày sinh", v: activeAccount?.birthDate },
                { l: "Thành phố", v: activeAccount?.city },
                { l: "Giới tính", v: activeAccount?.gender },
                ...(!isAdmin ? [{ l: "Gói đăng ký hiện tại", v: plan }] : []),
              ].map(f => (
                <div key={f.l} className="bg-muted/50 rounded-xl px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{f.l}</p>
                  <p className="text-sm font-medium text-foreground">{f.v || "—"}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ── Security Tab ── */}
      {tab === "security" && (
        <Card className="p-6" hover={false}>
          <h3 className="font-bold text-foreground mb-5">Bảo mật</h3>
          {changingPwd ? (
            <form className="space-y-4 max-w-sm" onSubmit={e => { e.preventDefault(); setChangingPwd(false); }}>
              <Field label="Mật khẩu hiện tại" type="password" placeholder="••••••••" />
              <Field label="Mật khẩu mới" type="password" placeholder="••••••••" />
              <Field label="Xác nhận mật khẩu mới" type="password" placeholder="••••••••" />
              <div className="flex gap-3">
                <Btn icon={<Lock size={15} />} type="submit">Cập nhật mật khẩu</Btn>
                <Btn variant="outline" icon={<X size={15} />} onClick={() => setChangingPwd(false)} type="button">Hủy</Btn>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border-l-4 border-l-primary">
                <Lock size={20} className="text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Mật khẩu</p>
                  <p className="text-xs text-muted-foreground">Thay đổi mật khẩu bảo vệ tài khoản của bạn.</p>
                </div>
                <Btn size="sm" variant="outline" onClick={() => setChangingPwd(true)}>Đổi</Btn>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── Pets Tab (user only) ── */}
      {tab === "pets" && !isAdmin && (
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-4">
            {pets.map(p => (
              <button key={p.id} onClick={() => navigate(`/pets/${p.id}`)} className="rounded-2xl border border-border bg-card shadow-sm p-6 flex items-center gap-5 text-left hover:shadow-md transition-all cursor-pointer w-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl flex-shrink-0">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-lg truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm text-muted-foreground truncate">{p.breed}</span>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">{p.age}</span>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">{p.health.length} bản ghi</span>
                  </div>
                </div>
                <ChevronRight size={22} className="text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
          {pets.length === 0 && (
            <Card className="p-8 text-center" hover={false}>
              <PawPrint size={32} className="text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">Bạn chưa có thú cưng nào.</p>
              <Btn size="sm" icon={<Plus size={14} />} onClick={() => navigate("/pets")}>Thêm thú cưng</Btn>
            </Card>
          )}
          <Btn variant="outline" block icon={<Sparkles size={16} />} onClick={() => navigate("/pets")}>Quản lý tất cả thú cưng</Btn>
        </div>
      )}

      {/* ── Posts Tab (user only) ── */}
      {tab === "posts" && !isAdmin && <MyPostsContent />}
    </div>
  );
}
