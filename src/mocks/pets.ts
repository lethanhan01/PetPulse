import type { AIConsult, CareEvent, HealthEntry, Pet } from "@/types/app.types";
import type { AdminPet } from "./types";
import { MOCK_ACCOUNTS, DEMO_USER_ACCOUNT_ID } from "./accounts";

const images = [
  "https://images.unsplash.com/photo-1598875706250-21faaf804361?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1543852786-1cf6624b9987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
];
export const SPECIES_EMOJI: Record<string, string> = { Chó: "🐕", Mèo: "🐈", Thỏ: "🐰", Chim: "🐦", Cá: "🐟", Khác: "🐾" };
export const PET_SPECIES = Object.keys(SPECIES_EMOJI);

const demoRows: Array<[string, string, string, "Đực" | "Cái", string, number]> = [
  ["Mochi", "Chó", "Golden Retriever", "Đực", "3 tuổi", 28], ["Luna", "Mèo", "British Shorthair", "Cái", "2 tuổi", 4.2],
  ["Bắp", "Chó", "Corgi", "Đực", "4 tuổi", 12.5], ["Mít", "Mèo", "Maine Coon", "Cái", "1 tuổi", 5.1],
  ["Cà Rốt", "Thỏ", "Holland Lop", "Cái", "2 tuổi", 1.9], ["Sunny", "Chim", "Vẹt Yến Phụng", "Đực", "1 tuổi", 0.04],
  ["Nemo", "Cá", "Cá vàng", "Đực", "1 tuổi", 0.12], ["Cookie", "Chó", "Poodle", "Cái", "5 tuổi", 7.4],
  ["Miu", "Mèo", "Ba Tư", "Đực", "6 tuổi", 6.8], ["Bơ", "Chó", "Shiba Inu", "Cái", "2 tuổi", 9.3],
];

const healthDeltas: [number, number, number][] = [
  [-4, +2, -4], [-6, -2, -8], [-2, +4, -3], [-5, +1, -7], [-8, -1, -5],
  [-3, +3, -6], [-7, +4, -3], [-4, -1, -9], [-9, -3, -4], [-2, +6, -2],
];

function health(id: string, baseWeight: number, score: number, index: number, illness?: string): HealthEntry[] {
  const d = healthDeltas[index % healthDeltas.length];
  return [
    { id: `${id}-H1`, date: "2026-07-20", weight: baseWeight, condition: score < 70 ? "Cần chú ý" : score < 85 ? "Bình thường" : "Tốt", nutrition: score < 70 ? "Cần điều chỉnh" : "Cân bằng", illness, score },
    { id: `${id}-H2`, date: "2026-06-20", weight: Number((baseWeight * 0.98).toFixed(2)), condition: "Bình thường", nutrition: "Ổn", score: Math.max(62, score + d[0]) },
    { id: `${id}-H3`, date: "2026-05-20", weight: Number((baseWeight * 0.96).toFixed(2)), condition: "Tốt", nutrition: "Tốt", score: Math.max(60, score + d[1]) },
    { id: `${id}-H4`, date: "2026-04-20", weight: Number((baseWeight * 0.94).toFixed(2)), condition: "Bình thường", nutrition: "Ổn", score: Math.max(60, score + d[2]) },
  ];
}
function events(id: string, index: number): CareEvent[] {
  return [
    { id: `${id}-E1`, title: "Uống thuốc giun", date: "2026-07-25", time: "08:00", repeat: "Hằng tuần", type: "Uống thuốc", done: false },
    { id: `${id}-E2`, title: "Khám sức khỏe định kỳ", date: "2026-08-02", time: "14:30", repeat: "Không lặp", type: "Khám", done: false },
    { id: `${id}-E3`, title: index % 2 ? "Tiêm vaccine dại" : "Vệ sinh răng miệng", date: "2026-06-15", time: "09:00", repeat: "Không lặp", type: index % 2 ? "Tiêm phòng" : "Khác", done: true },
  ];
}
function consults(id: string, petName: string, index: number): AIConsult[] {
  if (index === 1) return [];
  return [{ id: `${id}-C1`, date: "2026-06-20", petName, symptoms: index % 3 ? "Ho khan, biếng ăn 2 ngày" : "Mệt mỏi và ngứa nhiều", severity: index % 3 ? "Trung bình" : "Thấp", diseases: index % 3 ? ["Viêm phế quản", "Cảm lạnh"] : ["Kích ứng da", "Dị ứng nhẹ"], firstAid: ["Giữ ấm, cung cấp nước sạch", "Theo dõi trong 24 giờ"], vetAdvice: "Đưa thú cưng đi khám nếu triệu chứng kéo dài hoặc nặng hơn." }];
}

export const MOCK_PETS: Pet[] = demoRows.map(([name, species, breed, gender, age, weight], index) => {
  const id = `PET-2026-${String(1001 + index).padStart(6, "0")}`;
  const score = [92, 95, 76, 88, 68, 91, 84, 72, 64, 98][index];
  return { id, name, species, emoji: SPECIES_EMOJI[species], breed, gender, age, weight: `${weight} kg`, color: ["#F59E0B", "#8B5CF6", "#10B981", "#EC4899"][index % 4], microchip: `9851410021${String(45879 + index).padStart(5, "0")}`, owner: "Nguyễn Văn An", image: images[index % images.length], chips: index % 2 ? ["Vaccinated", "Microchipped"] : ["Vaccinated", "Microchipped", "Insured"], health: health(id, weight, score, index, score < 70 ? "Cần theo dõi cân nặng" : undefined), events: events(id, index), consults: consults(id, name, index) };
});

const speciesRows = ["Chó", "Mèo", "Thỏ", "Chim", "Cá"] as const;
const breeds: Record<(typeof speciesRows)[number], string[]> = { Chó: ["Corgi", "Poodle", "Shiba Inu"], Mèo: ["Ba Tư", "Maine Coon", "Mèo ta"], Thỏ: ["Holland Lop", "Netherland Dwarf"], Chim: ["Vẹt Yến Phụng", "Cockatiel"], Cá: ["Cá vàng", "Cá Betta"] };

const userAccounts = MOCK_ACCOUNTS.filter(account => account.role === "user");

// The system collection is canonical. The first ten records are the detailed demo pets;
// the remaining records provide complete, deterministic data for every other user account.
export const MOCK_SYSTEM_PETS: Array<Pet & { ownerId: string }> = Array.from({ length: 100 }, (_, index) => {
  const owner = index < MOCK_PETS.length ? MOCK_ACCOUNTS.find(account => account.id === DEMO_USER_ACCOUNT_ID)! : userAccounts[1 + ((index - MOCK_PETS.length) % (userAccounts.length - 1))];
  const species = speciesRows[index % speciesRows.length];
  const score = 55 + (index * 7) % 45;
  const demoPet = MOCK_PETS[index];
  return demoPet ? { ...demoPet, ownerId: DEMO_USER_ACCOUNT_ID } : {
    id: `PET-2026-${String(2001 + index).padStart(6, "0")}`, name: ["Bông", "Đậu", "Gạo", "Sữa", "Mây", "Tép", "Na", "Bim"][index % 8] + ` ${index + 1}`,
    species, emoji: SPECIES_EMOJI[species], breed: breeds[species][index % breeds[species].length], gender: index % 2 ? "Cái" : "Đực", age: `${(index % 8) + 1} tuổi`, weight: `${(index % 18) + 2} kg`, color: ["#F59E0B", "#8B5CF6", "#10B981", "#EC4899"][index % 4], microchip: `985141003${String(50000 + index).padStart(6, "0")}`, owner: owner.name, ownerId: owner.id, chips: ["Vaccinated", "Microchipped"], health: health(`PET-2026-${String(2001 + index).padStart(6, "0")}`, (index % 18) + 2, score, index, score < 70 ? "Cần theo dõi sức khỏe" : undefined), events: events(`PET-2026-${String(2001 + index).padStart(6, "0")}`, index), consults: consults(`PET-2026-${String(2001 + index).padStart(6, "0")}`, `Pet ${index + 1}`, index),
  };
});

export const MOCK_ADMIN_PETS: AdminPet[] = MOCK_SYSTEM_PETS.map(pet => ({
  id: pet.id, name: pet.name, species: pet.species, breed: pet.breed, owner: pet.owner, ownerId: pet.ownerId, score: pet.health[0].score,
}));

export function getPetsForAccount(accountId: string): Pet[] {
  return structuredClone(MOCK_SYSTEM_PETS.filter(pet => pet.ownerId === accountId));
}
