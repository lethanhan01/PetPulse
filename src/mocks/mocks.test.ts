import { describe, expect, it } from "vitest";
import { authenticateMock } from "@/services/auth.service";
import { getAdminStats, getAdminUsers } from "@/services/user.service";
import { DEMO_ADMIN_ACCOUNT_ID, DEMO_USER_ACCOUNT_ID, MOCK_ACCOUNTS, MOCK_ADMIN_PETS, MOCK_COMMUNITY_POSTS, MOCK_PETS, PUBLIC_COMMUNITY_POSTS, getPetsForAccount } from ".";

describe("mock fixture integrity", () => {
  it("provides the planned volume and valid owner relationships", () => {
    expect(MOCK_ACCOUNTS).toHaveLength(50);
    expect(MOCK_ADMIN_PETS).toHaveLength(100);
    expect(MOCK_COMMUNITY_POSTS).toHaveLength(60);
    expect(new Set(MOCK_ADMIN_PETS.map(pet => pet.id)).size).toBe(100);
    const accountIds = new Set(MOCK_ACCOUNTS.map(account => account.id));
    expect(MOCK_ADMIN_PETS.every(pet => accountIds.has(pet.ownerId))).toBe(true);
    expect(MOCK_ADMIN_PETS.filter(pet => pet.ownerId === DEMO_USER_ACCOUNT_ID)).toHaveLength(10);
    expect(getPetsForAccount(DEMO_USER_ACCOUNT_ID)).toHaveLength(10);
    expect(getPetsForAccount(DEMO_ADMIN_ACCOUNT_ID)).toHaveLength(0);
  });

  it("exposes user-only administration data and derived dashboard metrics", () => {
    const users = getAdminUsers();
    expect(MOCK_ACCOUNTS.filter(account => account.role === "admin")).toHaveLength(1);
    expect(users).toHaveLength(49);
    expect(users.some(user => user.role === "admin")).toBe(false);
    expect(users.find(user => user.id === DEMO_USER_ACCOUNT_ID)?.petCount).toBe(10);
    expect(users.reduce((total, user) => total + user.petCount, 0)).toBe(MOCK_ADMIN_PETS.length);

    const monthly = getAdminStats("Tháng");
    expect(monthly).toMatchObject({ totalUsers: 49, totalPets: 100, aiUsage: 920 });
    expect(monthly.premiumUsers).toBe(users.filter(user => user.plan === "Premium" || user.plan === "Premium Năm").length);
    expect(monthly.conversionRate).toBeCloseTo((monthly.premiumUsers / monthly.totalUsers) * 100);
  });

  it("covers moderation states, public visibility, and detailed pet histories", () => {
    expect(MOCK_COMMUNITY_POSTS.filter(post => post.status === "approved")).toHaveLength(36);
    expect(MOCK_COMMUNITY_POSTS.filter(post => post.status === "pending")).toHaveLength(18);
    expect(MOCK_COMMUNITY_POSTS.filter(post => post.status === "rejected")).toHaveLength(6);
    expect(PUBLIC_COMMUNITY_POSTS.every(post => post.status === "approved")).toBe(true);
    const userIds = new Set(MOCK_ACCOUNTS.filter(account => account.role === "user").map(account => account.id));
    expect(MOCK_COMMUNITY_POSTS.every(post => userIds.has(post.authorId))).toBe(true);
    expect(MOCK_PETS).toHaveLength(10);
    expect(MOCK_PETS.some(pet => pet.consults.length === 0)).toBe(true);
    expect(MOCK_PETS.every(pet => pet.health.length >= 4 && pet.events.some(event => event.done) && pet.events.some(event => !event.done))).toBe(true);
  });

  it("authenticates active demo accounts only", () => {
    expect(authenticateMock("an@example.com", "paw123")?.role).toBe("user");
    expect(authenticateMock("admin@petpulse.vn", "paw123")?.role).toBe("admin");
    expect(authenticateMock("linh@example.com", "paw123")).toBeNull();
    expect(authenticateMock("an@example.com", "wrong")).toBeNull();
  });
});
