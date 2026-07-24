import type { Role } from "@/types/app.types";

export function authenticateMock(email: string, password: string): Role | null {
  if (password !== "paw123") return null;
  return email.includes("admin") ? "admin" : "user";
}
