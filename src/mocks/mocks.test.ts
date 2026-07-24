import { describe, expect, it } from "vitest";
import { authenticateMock } from "@/services/auth.service";
import { MOCK_ACCOUNTS, MOCK_ADMIN_PETS, MOCK_COMMUNITY_POSTS, MOCK_PETS, PUBLIC_COMMUNITY_POSTS } from ".";

describe("mock fixture integrity", () => {
  it("provides the planned volume and valid owner relationships", () => {
    expect(MOCK_ACCOUNTS).toHaveLength(50);
    expect(MOCK_ADMIN_PETS).toHaveLength(100);
    expect(MOCK_COMMUNITY_POSTS).toHaveLength(60);
    expect(new Set(MOCK_ADMIN_PETS.map(pet => pet.id)).size).toBe(100);
    const accountIds = new Set(MOCK_ACCOUNTS.map(account => account.id));
    expect(MOCK_ADMIN_PETS.every(pet => accountIds.has(pet.ownerId))).toBe(true);
  });

  it("covers moderation states, public visibility, and detailed pet histories", () => {
    expect(MOCK_COMMUNITY_POSTS.filter(post => post.status === "approved")).toHaveLength(36);
    expect(MOCK_COMMUNITY_POSTS.filter(post => post.status === "pending")).toHaveLength(18);
    expect(MOCK_COMMUNITY_POSTS.filter(post => post.status === "rejected")).toHaveLength(6);
    expect(PUBLIC_COMMUNITY_POSTS.every(post => post.status === "approved")).toBe(true);
    expect(MOCK_PETS).toHaveLength(10);
    expect(MOCK_PETS.some(pet => pet.consults.length === 0)).toBe(true);
    expect(MOCK_PETS.every(pet => pet.health.length >= 4 && pet.events.some(event => event.done) && pet.events.some(event => !event.done))).toBe(true);
  });

  it("authenticates active demo accounts only", () => {
    expect(authenticateMock("an@example.com", "paw123")?.role).toBe("user");
    expect(authenticateMock("admin@pawpulse.vn", "paw123")?.role).toBe("admin");
    expect(authenticateMock("linh@example.com", "paw123")).toBeNull();
    expect(authenticateMock("an@example.com", "wrong")).toBeNull();
  });
});
