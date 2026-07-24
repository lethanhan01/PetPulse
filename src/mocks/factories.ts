import type { AIConsult, CareEvent, HealthEntry, Pet } from "@/types/app.types";
import { getMockAnalysis } from "./ai";
import { SPECIES_EMOJI } from "./pets";
import type { CommunityComment } from "./types";

const today = () => new Date().toISOString().slice(0, 10);
const uid = (prefix: string) => `${prefix}-${Date.now()}`;

export function createPet(input: Pick<Pet, "name" | "species" | "breed" | "gender" | "age" | "weight">, owner: string): Pet {
  const numericWeight = Number.parseFloat(input.weight) || 0;
  return { id: uid("PET"), ...input, emoji: SPECIES_EMOJI[input.species] ?? "🐾", color: "#1D8B88", microchip: String(Date.now()).padEnd(15, "0").slice(0, 15), owner, chips: ["Microchipped"], health: [{ id: uid("HEALTH"), date: today(), weight: numericWeight, condition: "Tốt", nutrition: "Cân bằng", score: 85 }], events: [], consults: [] };
}
export function createHealthEntry(input: Omit<HealthEntry, "id" | "date" | "score">): HealthEntry {
  return { ...input, id: uid("HEALTH"), date: today(), score: input.condition === "Tốt" ? 92 : input.condition === "Bình thường" ? 80 : 65 };
}
export function createCareEvent(input: Omit<CareEvent, "id" | "done">): CareEvent { return { ...input, id: uid("EVENT"), done: false }; }
export function createAIConsult(petName: string, symptoms: string): AIConsult { return { id: uid("CONSULT"), date: today(), petName, ...getMockAnalysis(symptoms) }; }
export function createCommunityComment(authorId: string, author: string, content: string): CommunityComment { return { id: uid("COMMENT"), authorId, author, content, time: "Vừa xong" }; }
