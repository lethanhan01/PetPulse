import { MOCK_ACCOUNTS, type MockAccount } from "@/mocks";

export function authenticateMock(email: string, password: string): MockAccount | null {
  return MOCK_ACCOUNTS.find(account => account.email.toLowerCase() === email.trim().toLowerCase() && account.password === password && account.status === "Active") ?? null;
}
