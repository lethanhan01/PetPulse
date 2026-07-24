import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import type { Pet } from "@/types/app.types";
import { createPet, SPECIES_EMOJI } from "@/mocks";
import { Card, Btn, Badge, Field, Select, Modal, PageTitle, HEAD, MONO } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Plus, ChevronRight, Pencil, Trash2, ShieldCheck } from "lucide-react";

export function AddPetModal({ open, onClose, edit }: { open: boolean; onClose: () => void; edit?: Pet }) {
  const { addPet, updatePet, activeAccount } = useApp();
  const [f, setF] = useState({
    name: edit?.name || "", species: edit?.species || "Chó", breed: edit?.breed || "",
    gender: edit?.gender || "Đực", age: edit?.age || "", weight: edit?.weight || "",
  });
  const set = <K extends keyof typeof f>(key: K, value: (typeof f)[K]) => setF(previous => ({ ...previous, [key]: value }));
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (edit) {
      updatePet(edit.id, { ...f, gender: f.gender as Pet["gender"], emoji: SPECIES_EMOJI[f.species] });
    } else {
      addPet(createPet({ ...f, gender: f.gender as Pet["gender"] }, activeAccount?.name ?? "Nguyễn Văn An"));
    }
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title={edit ? "Chỉnh sửa thú cưng" : "Thêm thú cưng mới"}>
      <form onSubmit={save} className="space-y-4">
        <Field label="Tên thú cưng" value={f.name} onChange={e => set("name", e.target.value)} placeholder="VD: Mochi" required />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Loài" value={f.species} onChange={e => set("species", e.target.value)}>
            {Object.keys(SPECIES_EMOJI).map(s => <option key={s}>{s}</option>)}
          </Select>
          <Select label="Giới tính" value={f.gender} onChange={e => set("gender", e.target.value as Pet["gender"])}>
            <option>Đực</option><option>Cái</option>
          </Select>
        </div>
        <Field label="Giống" value={f.breed} onChange={e => set("breed", e.target.value)} placeholder="VD: Golden Retriever" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tuổi" value={f.age} onChange={e => set("age", e.target.value)} placeholder="VD: 3 tuổi" />
          <Field label="Cân nặng" value={f.weight} onChange={e => set("weight", e.target.value)} placeholder="VD: 28 kg" />
        </div>
        <div className="flex gap-3 pt-2">
          <Btn variant="outline" block type="button" onClick={onClose}>Hủy</Btn>
          <Btn block type="submit">{edit ? "Lưu thay đổi" : "Thêm thú cưng"}</Btn>
        </div>
      </form>
    </Modal>
  );
}

export function Pets() {
  const { pets, removePet } = useApp();
  const navigate = useNavigate();
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState<Pet | undefined>();
  const [del, setDel] = useState<Pet | undefined>();

  return (
    <div>
      <PageTitle title="Thú cưng của tôi" subtitle={`Bạn đang quản lý ${pets.length} hồ sơ Pet Passport`}
        action={<Btn icon={<Plus size={16} />} onClick={() => { setEdit(undefined); setAdd(true); }}>Thêm thú cưng</Btn>} />

      {pets.length === 0 ? (
        <Card className="p-12 text-center" hover={false}>
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4 text-3xl">🐾</div>
          <h3 className="font-bold text-lg text-foreground mb-1" style={HEAD}>Chưa có thú cưng nào</h3>
          <p className="text-sm text-muted-foreground mb-5">Thêm thú cưng đầu tiên để bắt đầu quản lý sức khỏe.</p>
          <Btn icon={<Plus size={16} />} onClick={() => setAdd(true)}>Thêm thú cưng</Btn>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pets.map(p => {
            const latest = p.health[0];
            return (
              <Card key={p.id} className="overflow-hidden group">
                <div className="h-32 relative">
                  {p.image ? <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: "linear-gradient(135deg,#1D8B88,#2FE0DC)" }}>{p.emoji}</div>}
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button onClick={() => { setEdit(p); setAdd(true); }} className="p-1.5 rounded-lg bg-card/90 backdrop-blur text-foreground hover:text-primary" aria-label="Edit"><Pencil size={14} /></button>
                    <button onClick={() => setDel(p)} className="p-1.5 rounded-lg bg-card/90 backdrop-blur text-foreground hover:text-destructive" aria-label="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-lg text-foreground" style={HEAD}>{p.emoji} {p.name}</h3>
                    <Badge v="success"><ShieldCheck size={11} /> {latest.score}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{p.breed} · {p.age} · {p.gender}</p>
                  <code className="inline-block text-[11px] text-primary bg-secondary px-2 py-0.5 rounded-full mb-3" style={MONO}>{p.id}</code>
                  <Btn variant="outline" block size="sm" icon={<ChevronRight size={15} />} iconRight onClick={() => navigate(`/pets/${p.id}`)}>Xem hồ sơ</Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddPetModal open={add} onClose={() => setAdd(false)} edit={edit} />
      <Modal open={!!del} onClose={() => setDel(undefined)} title="Xóa thú cưng">
        <p className="text-sm text-muted-foreground mb-5">Bạn có chắc muốn xóa hồ sơ của <b className="text-foreground">{del?.name}</b>? Hành động này không thể hoàn tác.</p>
        <div className="flex gap-3">
          <Btn variant="outline" block onClick={() => setDel(undefined)}>Hủy</Btn>
          <Btn variant="danger" block onClick={() => { if (del) removePet(del.id); setDel(undefined); }}>Xóa</Btn>
        </div>
      </Modal>
    </div>
  );
}
