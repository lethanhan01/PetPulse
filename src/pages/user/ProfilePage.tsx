import { useState } from "react";
import { useApp } from "@/stores/app.store";
import { useNavigate } from "react-router";
import { Card, Btn, Field, Badge, PageTitle, HEAD } from "@/components/common/kit";
import { Pencil, Lock, Crown, Plus, ChevronRight } from "lucide-react";

export function Profile() {
  const { pets, plan, role, activeAccount } = useApp();
  const navigate = useNavigate();
  const isAdmin = role === "admin";
  const [tab, setTab] = useState<"info" | "security" | "pets">("info");
  const tabs = isAdmin
    ? [{ k: "info", l: "Thông tin cá nhân" }, { k: "security", l: "Bảo mật" }] as const
    : [{ k: "info", l: "Thông tin cá nhân" }, { k: "security", l: "Bảo mật" }, { k: "pets", l: "Thú cưng của tôi" }] as const;

  return (
    <div>
      <PageTitle title={isAdmin ? "Hồ sơ Admin" : "Hồ sơ cá nhân"} />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center h-fit" hover={false}>
          <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center text-2xl font-extrabold text-primary mx-auto mb-3" style={HEAD}>{isAdmin ? "AD" : "AN"}</div>
          <h3 className="font-bold text-lg text-foreground" style={HEAD}>{activeAccount?.name ?? (isAdmin ? "Quản trị viên" : "Nguyễn Văn An")}</h3>
          <p className="text-sm text-muted-foreground mb-3">{activeAccount?.email ?? (isAdmin ? "admin@pawpulse.vn" : "an@example.com")}</p>
          {!isAdmin && (plan === "Premium" ? <Badge v="primary"><Crown size={11} /> Premium</Badge> : <Badge v="neutral">Freemium</Badge>)}
          {!isAdmin && <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-2 text-center">
            <div><div className="font-extrabold text-xl text-primary" style={HEAD}>{pets.length}</div><div className="text-xs text-muted-foreground">Thú cưng</div></div>
            <div><div className="font-extrabold text-xl text-primary" style={HEAD}>2</div><div className="text-xs text-muted-foreground">Năm cùng PawPulse</div></div>
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
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Họ và tên" defaultValue={activeAccount?.name} />
                  <Field label="Email" type="email" defaultValue={activeAccount?.email} />
                  <Field label="Số điện thoại" defaultValue={activeAccount?.phone} />
                  <Field label="Ngày sinh" type="date" defaultValue={activeAccount?.birthDate} />
                  <Field label="Thành phố" defaultValue={activeAccount?.city} />
                  <Field label="Giới tính" defaultValue={activeAccount?.gender} />
                </div>
                <Btn icon={<Pencil size={15} />} type="submit">Lưu thay đổi</Btn>
              </form>
            </Card>
          )}

          {tab === "security" && (
            <Card className="p-6" hover={false}>
              <h3 className="font-bold text-foreground mb-4" style={HEAD}>Đổi mật khẩu</h3>
              <form className="space-y-4 max-w-sm" onSubmit={e => e.preventDefault()}>
                <Field label="Mật khẩu hiện tại" type="password" placeholder="••••••••" />
                <Field label="Mật khẩu mới" type="password" placeholder="••••••••" />
                <Field label="Xác nhận mật khẩu mới" type="password" placeholder="••••••••" />
                <Btn icon={<Lock size={15} />} type="submit">Cập nhật mật khẩu</Btn>
              </form>
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
