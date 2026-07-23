import { createContext, useContext, useState, ReactNode } from "react";

// ── Types ──────────────────────────────────────────────
export type Role = "user" | "admin";
export type View =
  | "landing" | "login" | "register" | "forgot"
  | "dashboard" | "community" | "pets" | "petDetail" | "ai" | "subscription" | "checkout" | "profile"
  | "adminDashboard" | "adminUsers" | "adminPets" | "adminSubs" | "adminModeration" | "adminProfile";

export type Plan = "Freemium" | "Premium";

export type HealthEntry = {
  id: string; date: string; weight: number;
  condition: "Tốt" | "Bình thường" | "Cần chú ý";
  nutrition: string; illness?: string; score: number;
};

export type CareEvent = {
  id: string; title: string; date: string; time: string;
  repeat: "Không lặp" | "Hằng ngày" | "Hằng tuần";
  type: "Uống thuốc" | "Khám" | "Tiêm phòng" | "Khác"; done: boolean;
};

export type AIConsult = {
  id: string; date: string; petName: string; symptoms: string;
  severity: "Thấp" | "Trung bình" | "Cao";
  diseases: string[]; firstAid: string[]; vetAdvice: string;
};

export type Pet = {
  id: string; name: string; species: string; emoji: string; breed: string;
  gender: "Đực" | "Cái"; age: string; weight: string; color: string;
  microchip: string; image?: string; owner: string;
  health: HealthEntry[]; events: CareEvent[]; consults: AIConsult[];
  chips: string[];
};

// ── Mock data ──────────────────────────────────────────
export const PETS: Pet[] = [
  {
    id: "PET-2024-001847", name: "Mochi", species: "Chó", emoji: "🐕",
    breed: "Golden Retriever", gender: "Đực", age: "3 tuổi", weight: "28 kg",
    color: "#F59E0B", microchip: "985141002145879", owner: "Nguyễn Văn An",
    image: "https://images.unsplash.com/photo-1598875706250-21faaf804361?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    chips: ["Vaccinated", "Microchipped", "Insured"],
    health: [
      { id: "h1", date: "2026-07-10", weight: 28.0, condition: "Tốt", nutrition: "Cân bằng", score: 92 },
      { id: "h2", date: "2026-06-10", weight: 27.4, condition: "Tốt", nutrition: "Tốt", score: 90 },
      { id: "h3", date: "2026-05-10", weight: 27.8, condition: "Bình thường", nutrition: "Ổn", illness: "Ho nhẹ", score: 82 },
      { id: "h4", date: "2026-04-10", weight: 26.9, condition: "Tốt", nutrition: "Tốt", score: 88 },
    ],
    events: [
      { id: "e1", title: "Uống thuốc giun", date: "2026-07-25", time: "08:00", repeat: "Hằng tuần", type: "Uống thuốc", done: false },
      { id: "e2", title: "Khám sức khỏe định kỳ", date: "2026-08-02", time: "14:30", repeat: "Không lặp", type: "Khám", done: false },
      { id: "e3", title: "Tiêm vaccine dại", date: "2026-06-15", time: "09:00", repeat: "Không lặp", type: "Tiêm phòng", done: true },
    ],
    consults: [
      { id: "c1", date: "2026-06-20", petName: "Mochi", symptoms: "Ho khan, biếng ăn 2 ngày", severity: "Trung bình",
        diseases: ["Viêm phế quản", "Cảm lạnh"], firstAid: ["Giữ ấm, tránh gió", "Bổ sung nước sạch"], vetAdvice: "Nên đưa đi khám nếu ho kéo dài quá 3 ngày." },
    ],
  },
  {
    id: "PET-2024-002031", name: "Luna", species: "Mèo", emoji: "🐈",
    breed: "British Shorthair", gender: "Cái", age: "2 tuổi", weight: "4.2 kg",
    color: "#8B5CF6", microchip: "985141002099213", owner: "Nguyễn Văn An",
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    chips: ["Vaccinated", "Spayed"],
    health: [
      { id: "h1", date: "2026-07-08", weight: 4.2, condition: "Tốt", nutrition: "Tốt", score: 95 },
      { id: "h2", date: "2026-06-08", weight: 4.1, condition: "Tốt", nutrition: "Tốt", score: 94 },
      { id: "h3", date: "2026-05-08", weight: 4.0, condition: "Bình thường", nutrition: "Ổn", score: 89 },
    ],
    events: [
      { id: "e1", title: "Nhỏ thuốc mắt", date: "2026-07-23", time: "20:00", repeat: "Hằng ngày", type: "Uống thuốc", done: false },
    ],
    consults: [],
  },
];

export const COMMUNITY = [
  { id: "p1", author: "Trần Thu Hà", handle: "@hachann", avatar: "TH", time: "2 giờ trước",
    pet: "Bơ 🐕", content: "Bé Bơ nhà mình vừa hoàn thành mũi vaccine cuối cùng! Health Score lên 98 điểm 🎉",
    image: "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    likes: 124, comments: 18 },
  { id: "p2", author: "Lê Minh Quân", handle: "@quanle", avatar: "MQ", time: "5 giờ trước",
    pet: "Miu 🐈", content: "Có ai biết cách giúp mèo giảm cân healthy không ạ? Miu nhà mình hơi mũm mĩm 😅",
    image: "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    likes: 87, comments: 42 },
  { id: "p3", author: "Phạm Ngọc Linh", handle: "@linhpham", avatar: "NL", time: "1 ngày trước",
    pet: "Cookie 🐕", content: "Dùng AI Symptom Checker phát hiện sớm bé bị viêm da, đi khám kịp thời. Cảm ơn PawPulse! 🐾",
    image: "https://images.unsplash.com/photo-1624956578877-4948166c5dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    likes: 203, comments: 27 },
];

export const ADMIN_USERS = [
  { id: "U-1001", name: "Nguyễn Văn An", email: "an@example.com", plan: "Premium", pets: 2, joined: "2024-03-12", status: "Active" },
  { id: "U-1002", name: "Trần Thu Hà", email: "ha@example.com", plan: "Freemium", pets: 1, joined: "2024-05-01", status: "Active" },
  { id: "U-1003", name: "Lê Minh Quân", email: "quan@example.com", plan: "Premium", pets: 3, joined: "2024-06-20", status: "Active" },
  { id: "U-1004", name: "Phạm Ngọc Linh", email: "linh@example.com", plan: "Freemium", pets: 1, joined: "2024-07-15", status: "Suspended" },
  { id: "U-1005", name: "Đỗ Hải Yến", email: "yen@example.com", plan: "Premium", pets: 2, joined: "2024-08-02", status: "Active" },
];

export const ADMIN_PETS = [
  { id: "PET-2024-001847", name: "Mochi", species: "Chó", breed: "Golden Retriever", owner: "Nguyễn Văn An", score: 92 },
  { id: "PET-2024-002031", name: "Luna", species: "Mèo", breed: "British Shorthair", owner: "Nguyễn Văn An", score: 95 },
  { id: "PET-2024-002088", name: "Bơ", species: "Chó", breed: "Corgi", owner: "Trần Thu Hà", score: 98 },
  { id: "PET-2024-002145", name: "Miu", species: "Mèo", breed: "Ba Tư", owner: "Lê Minh Quân", score: 76 },
];

export const ADMIN_SUBS = [
  { id: "SUB-01", name: "Freemium", price: "0đ", features: "1 thú cưng, Health timeline cơ bản", subscribers: 8420, active: true },
  { id: "SUB-02", name: "Premium", price: "99.000đ/tháng", features: "Không giới hạn pet, AI Checker, thống kê nâng cao", subscribers: 2130, active: true },
  { id: "SUB-03", name: "Premium Năm", price: "990.000đ/năm", features: "Toàn bộ Premium + ưu đãi 2 tháng", subscribers: 640, active: true },
];

export const REVENUE = [
  { m: "T1", v: 42 }, { m: "T2", v: 55 }, { m: "T3", v: 61 }, { m: "T4", v: 58 },
  { m: "T5", v: 72 }, { m: "T6", v: 89 }, { m: "T7", v: 96 },
];
export const AI_USAGE = [
  { m: "T1", v: 320 }, { m: "T2", v: 410 }, { m: "T3", v: 520 }, { m: "T4", v: 480 },
  { m: "T5", v: 640 }, { m: "T6", v: 810 }, { m: "T7", v: 920 },
];

// ── App context ────────────────────────────────────────
type Ctx = {
  theme: "light" | "dark"; toggleTheme: () => void;
  view: View; navigate: (v: View) => void;
  role: Role; setRole: (r: Role) => void;
  plan: Plan; setPlan: (p: Plan) => void;
  authed: boolean; login: (r: Role) => void; logout: () => void;
  selectedPet: string | null; setSelectedPet: (id: string | null) => void;
  pets: Pet[]; addPet: (p: Pet) => void; updatePet: (id: string, patch: Partial<Pet>) => void; removePet: (id: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => {
  const context = useContext(AppCtx);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [view, setView] = useState<View>("landing");
  const [role, setRole] = useState<Role>("user");
  const [plan, setPlan] = useState<Plan>("Freemium");
  const [authed, setAuthed] = useState(false);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>(PETS);

  const navigate = (v: View) => { setView(v); window.scrollTo({ top: 0 }); };

  const value: Ctx = {
    theme, toggleTheme: () => setTheme(t => (t === "light" ? "dark" : "light")),
    view, navigate, role, setRole, plan, setPlan, authed,
    login: (r) => { setRole(r); setAuthed(true); navigate(r === "admin" ? "adminDashboard" : "dashboard"); },
    logout: () => { setAuthed(false); setPlan("Freemium"); navigate("landing"); },
    selectedPet, setSelectedPet,
    pets,
    addPet: (p) => setPets(prev => [...prev, p]),
    updatePet: (id, patch) => setPets(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p))),
    removePet: (id) => setPets(prev => prev.filter(p => p.id !== id)),
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
