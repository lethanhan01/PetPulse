import { useState, useEffect } from "react";
import { useApp } from "@/stores/app.store";
import { useNavigate } from "react-router";
import { Card, Btn, Field, Select, Badge, PageTitle, HEAD } from "@/components/common/kit";
import { Pencil, Lock, Crown, Plus, ChevronRight, X, Check } from "lucide-react";
import type { MockAccount } from "@/mocks/types";

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

export function Profile() {
  const { pets, plan, role, activeAccount, updateAccount } = useApp();
  const navigate = useNavigate();
  const isAdmin = role === "admin";
  const yearsWithPawPulse = activeAccount ? Math.max(0, new Date().getFullYear() - new Date(activeAccount.joined).getFullYear()) : 0;
  const [tab, setTab] = useState<"info" | "security" | "pets">("info");
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [form, setForm] = useState<Pick<MockAccount, "name" | "email" | "phone" | "birthDate" | "city" | "gender">>({ name: "", email: "", phone: "", birthDate: "", city: "", gender: "Nam" });
  useEffect(() => {
    if (activeAccount) setForm({ name: activeAccount.name, email: activeAccount.email, phone: activeAccount.phone, birthDate: activeAccount.birthDate, city: activeAccount.city, gender: activeAccount.gender });
  }, [activeAccount]);
  const tabs = isAdmin
    ? [{ k: "info", l: "Thông tin cá nhân" }, { k: "security", l: "Bảo mật" }] as const
    : [{ k: "info", l: "Thông tin cá nhân" }, { k: "security", l: "Bảo mật" }, { k: "pets", l: "Thú cưng của tôi" }] as const;

  return (
    <div>
      <PageTitle title={isAdmin ? "Hồ sơ Admin" : "Hồ sơ cá nhân"} />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center h-fit" hover={false}>
          <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-2xl font-extrabold text-primary mx-auto mb-3" style={HEAD}>{activeAccount?.avatar ?? (isAdmin ? "AD" : "AN")}</div>
          <h3 className="font-bold text-lg text-foreground" style={HEAD}>{activeAccount?.name ?? (isAdmin ? "Quản trị viên" : "Nguyễn Văn An")}</h3>
          <p className="text-sm text-muted-foreground mb-3">{activeAccount?.email ?? (isAdmin ? "admin@pawpulse.vn" : "an@example.com")}</p>
          {!isAdmin && (plan === "Premium" ? <Badge v="primary"><Crown size={11} /> Premium</Badge> : <Badge v="neutral">Freemium</Badge>)}
          {!isAdmin && <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2 text-center">
            <div><div className="font-extrabold text-xl text-primary" style={HEAD}>{pets.length}</div><div className="text-xs text-muted-foreground">Thú cưng</div></div>
            <div><div className="font-extrabold text-xl text-primary" style={HEAD}>{yearsWithPawPulse}</div><div className="text-xs text-muted-foreground">Năm cùng PawPulse</div></div>
          </div>}
        </Card>

        <div className="lg:col-span-2">
          <div className="flex gap-1 border-b border-border mb-5">
            {tabs.map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t.k ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>{t.l}</button>
            ))}
          </div>

          {tab === "info" && (
            <Card className="p-6" hover={false}>
              {editing ? (
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); updateAccount(form); setEditing(false); }}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Họ và tên" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    <Field label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    <Field label="Số điện thoại" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    <Field label="Ngày sinh" type="date" value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
                    <Field label="Thành phố" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                    <Select label="Giới tính" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value as MockAccount["gender"] }))}><option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option></Select>
                  </div>
                  <div className="flex gap-3">
                    <Btn icon={<Check size={15} />} type="submit">Lưu thay đổi</Btn>
                    <Btn variant="outline" icon={<X size={15} />} onClick={() => { setEditing(false); if (activeAccount) setForm({ name: activeAccount.name, email: activeAccount.email, phone: activeAccount.phone, birthDate: activeAccount.birthDate, city: activeAccount.city, gender: activeAccount.gender }); }} type="button">Hủy</Btn>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InfoField label="Họ và tên" value={activeAccount?.name} />
                    <InfoField label="Email" value={activeAccount?.email} />
                    <InfoField label="Số điện thoại" value={activeAccount?.phone} />
                    <InfoField label="Ngày sinh" value={activeAccount?.birthDate} />
                    <InfoField label="Thành phố" value={activeAccount?.city} />
                    <InfoField label="Giới tính" value={activeAccount?.gender} />
                  </div>
                  <Btn icon={<Pencil size={15} />} onClick={() => setEditing(true)}>Chỉnh sửa</Btn>
                </div>
              )}
            </Card>
          )}

          {tab === "security" && (
            <Card className="p-6" hover={false}>
              <h3 className="font-bold text-foreground mb-4" style={HEAD}>Bảo mật</h3>
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
                  <p className="text-sm text-muted-foreground">Thay đổi mật khẩu bảo vệ tài khoản của bạn.</p>
                  <Btn icon={<Lock size={15} />} onClick={() => setChangingPwd(true)}>Đổi mật khẩu</Btn>
                </div>
              )}
            </Card>
          )}

          {tab === "pets" && (
            <div className="space-y-3">
              {pets.map(p => (
                <Card key={p.id} className="p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl">{p.emoji}</div>
                  <div className="flex-1"><p className="font-semibold text-foreground text-sm">{p.name}</p><p className="text-xs text-muted-foreground">{p.breed} · {p.age}</p></div>
                  <button onClick={() => navigate(`/pets/${p.id}`)} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"><ChevronRight size={18} /></button>
                </Card>
              ))}
              <Btn variant="outline" block icon={<Plus size={16} />} onClick={() => navigate("/pets")}>Quản lý thú cưng</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
