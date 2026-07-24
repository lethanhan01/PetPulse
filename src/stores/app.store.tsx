import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getPetsForAccount, MOCK_ACCOUNTS, type MockAccount } from "@/mocks";
import type { Pet, Plan, Role } from "@/types/app.types";

type AppContextValue = {
  theme: "light" | "dark"; toggleTheme: () => void;
  role: Role; plan: Plan; setPlan: (plan: Plan) => void;
  authed: boolean; activeAccount: MockAccount | null; login: (account: MockAccount) => void; logout: () => void;
  updateAccount: (patch: Partial<MockAccount>) => void;
  pets: Pet[]; addPet: (pet: Pet) => void; updatePet: (id: string, patch: Partial<Pet>) => void; removePet: (id: string) => void;
};

const STORAGE_KEY = "petpulse:app-state";
type StoredState = Pick<AppContextValue, "theme" | "role" | "plan" | "authed"> & { activeAccountId?: string };

function readStoredState(): Partial<StoredState> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    const value = JSON.parse(stored) as Partial<StoredState>;
    return { theme: value.theme === "dark" ? "dark" : "light", role: value.role === "admin" ? "admin" : "user", plan: value.plan === "Premium" ? "Premium" : "Free", authed: Boolean(value.authed), activeAccountId: value.activeAccountId };
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
  const [plan, setPlan] = useState<Plan>(initial.plan ?? "Free");
  const [authed, setAuthed] = useState(initial.authed ?? false);
  const [activeAccount, setActiveAccount] = useState<MockAccount | null>(() => {
    if (!initial.activeAccountId) return null;
    return MOCK_ACCOUNTS.find(account => account.id === initial.activeAccountId) ?? null;
  });
  const [pets, setPets] = useState<Pet[]>(() => getPetsForAccount(initial.activeAccountId ?? ""));
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, role, plan, authed, activeAccountId: activeAccount?.id } satisfies StoredState)); }, [theme, role, plan, authed, activeAccount]);
  const value: AppContextValue = {
    theme, toggleTheme: () => setTheme(value => value === "light" ? "dark" : "light"), role, plan, setPlan, authed, activeAccount,
    login: account => { setRole(account.role); setPlan(account.plan); setActiveAccount(account); setPets(getPetsForAccount(account.id)); setAuthed(true); }, logout: () => { setAuthed(false); setPlan("Free"); setActiveAccount(null); setPets([]); localStorage.removeItem(STORAGE_KEY); }, pets,
    updateAccount: patch => setActiveAccount(prev => prev ? { ...prev, ...patch } : null),
    addPet: pet => setPets(previous => [...previous, pet]), updatePet: (id, patch) => setPets(previous => previous.map(pet => pet.id === id ? { ...pet, ...patch } : pet)), removePet: id => setPets(previous => previous.filter(pet => pet.id !== id)),
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
