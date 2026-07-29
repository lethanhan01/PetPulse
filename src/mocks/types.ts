import type { Plan, Role } from "@/types/app.types";

export type AccountStatus = "Active" | "Suspended";

export type MockAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  plan: Plan;
  status: AccountStatus;
  phone: string;
  birthDate: string;
  city: string;
  gender: "Nam" | "Nữ" | "Khác";
  joined: string;
  avatar: string;
  coverImage?: string;
  reposts: string[];
};

export type AdminPet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  owner: string;
  ownerId: string;
  score: number;
};

export type CommunityStory = { id: string; authorId: string; mediaUrl: string; mediaType: "image" | "video"; createdAt: string; reactions: Record<string, string[]> };
export type CommunityComment = { id: string; authorId: string; author: string; content: string; time: string };
export type ModerationStatus = "approved" | "pending" | "rejected";
export type CommunityPost = {
  id: string; authorId: string; author: string; handle: string; avatar: string; time: string;
  pet: string; content: string; images?: string[]; likes: number; comments: CommunityComment[]; status: ModerationStatus;
};

export type Subscription = {
  id: string; name: string; price: string; period: string; features: string[]; missing: string[];
  subscribers: number; active: boolean; accent?: boolean; tagline?: string;
};

export type Notification = { id: string; title: string; subtitle: string; kind: "event" | "health" | "vaccine" | "moderation"; read: boolean; targetUserId?: string; link?: string };
export type AnalyticsPoint = { label: string; value: number };
export type AnalyticsSeries = Record<"Tuần" | "Tháng" | "Quý", AnalyticsPoint[]>;
