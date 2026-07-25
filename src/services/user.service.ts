import { MOCK_ADMIN_PETS, MOCK_ACCOUNTS, MOCK_AI_USAGE, getPetsForAccount } from "@/mocks";
import type { Pet } from "@/types/app.types";
import type { AccountStatus, AnalyticsSeries, MockAccount } from "@/mocks";

export type AdminUser = MockAccount & { petCount: number };
export type AdminStats = { totalUsers: number; premiumUsers: number; conversionRate: number; totalPets: number; aiUsage: number };

export const getAdminUsers = (): AdminUser[] => {
  const petCounts = new Map<string, number>();
  MOCK_ADMIN_PETS.forEach(pet => petCounts.set(pet.ownerId, (petCounts.get(pet.ownerId) ?? 0) + 1));
  return MOCK_ACCOUNTS.filter(account => account.role === "user").map(account => ({ ...account, petCount: petCounts.get(account.id) ?? 0 }));
};
export const getAdminPets = () => MOCK_ADMIN_PETS;

export const getAdminStats = (range: keyof AnalyticsSeries): AdminStats => {
  const users = getAdminUsers();
  const premiumUsers = users.filter(user => user.plan === "Premium" || user.plan === "Premium Năm").length;
  const aiUsage = MOCK_AI_USAGE[range].at(-1)?.value ?? 0;
  return { totalUsers: users.length, premiumUsers, conversionRate: users.length ? (premiumUsers / users.length) * 100 : 0, totalPets: MOCK_ADMIN_PETS.length, aiUsage };
};

export const getUserDashboardStats = (pets: Pet[]) => ({
  petCount: pets.length,
  completedVaccinations: pets.flatMap(pet => pet.events).filter(event => event.type === "Tiêm phòng" && event.done).length,
  upcomingEvents: pets.flatMap(pet => pet.events).filter(event => !event.done).length,
  alerts: pets.filter(pet => pet.health[0]?.score < 70).length,
});

export const getAccountPets = (accountId: string) => getPetsForAccount(accountId);
export const toggleUserStatus = (userId: string): AccountStatus => {
  const acct = MOCK_ACCOUNTS.find(a => a.id === userId);
  if (!acct) return "Active";
  acct.status = acct.status === "Active" ? "Suspended" : "Active";
  return acct.status;
};

export const getAccountInitials = (account: Pick<MockAccount, "avatar" | "name"> | null) => {
  if (!account) return "PP";
  if (account.avatar && !account.avatar.startsWith("data:")) return account.avatar;
  return account.name?.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase() || "PP";
};
