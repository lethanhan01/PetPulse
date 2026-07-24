import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PETS } from "@/services/user.service";
import type { Pet, Plan, Role } from "@/types/app.types";

type AppContextValue = {
  theme: "light" | "dark"; toggleTheme: () => void;
  role: Role; plan: Plan; setPlan: (plan: Plan) => void;
  authed: boolean; login: (role: Role) => void; logout: () => void;
  pets: Pet[]; addPet: (pet: Pet) => void; updatePet: (id: string, patch: Partial<Pet>) => void; removePet: (id: string) => void;
};

const STORAGE_KEY = "petpulse:app-state";
type StoredState = Pick<AppContextValue, "theme" | "role" | "plan" | "authed" | "pets">;

function readStoredState(): Partial<StoredState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    const value = JSON.parse(stored) as Partial<StoredState>;
    return { theme: value.theme === "dark" ? "dark" : "light", role: value.role === "admin" ? "admin" : "user", plan: value.plan === "Premium" ? "Premium" : "Freemium", authed: Boolean(value.authed), pets: Array.isArray(value.pets) ? value.pets : PETS };
  } catch { return {}; }
}

const AppContext = createContext<AppContextValue | null>(null);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(readStoredState);
  const [theme, setTheme] = useState<"light" | "dark">(initial.theme ?? "light");
  const [role, setRole] = useState<Role>(initial.role ?? "user");
  const [plan, setPlan] = useState<Plan>(initial.plan ?? "Freemium");
  const [authed, setAuthed] = useState(initial.authed ?? false);
  const [pets, setPets] = useState<Pet[]>(initial.pets ?? PETS);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, role, plan, authed, pets } satisfies StoredState)); }, [theme, role, plan, authed, pets]);
  const value: AppContextValue = {
    theme, toggleTheme: () => setTheme(value => value === "light" ? "dark" : "light"), role, plan, setPlan, authed,
    login: nextRole => { setRole(nextRole); setAuthed(true); }, logout: () => { setAuthed(false); setPlan("Freemium"); }, pets,
    addPet: pet => setPets(previous => [...previous, pet]), updatePet: (id, patch) => setPets(previous => previous.map(pet => pet.id === id ? { ...pet, ...patch } : pet)), removePet: id => setPets(previous => previous.filter(pet => pet.id !== id)),
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
