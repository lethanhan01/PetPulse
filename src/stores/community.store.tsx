import { createContext, useContext, useState, type ReactNode } from "react";
import { MOCK_COMMUNITY_POSTS, MOCK_ADMIN_NOTIFICATIONS } from "@/mocks";
import { uid } from "@/mocks/factories";
import type { CommunityPost } from "@/mocks";

type CommunityContextValue = {
  posts: CommunityPost[];
  createPost: (post: CommunityPost) => void;
  approvePost: (id: string) => void;
  rejectPost: (id: string) => void;
  deletePost: (id: string) => void;
};

const CommunityContext = createContext<CommunityContextValue | null>(null);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) throw new Error("useCommunity must be used within CommunityProvider");
  return context;
};

const pushNoti = (title: string, subtitle: string) => {
  MOCK_ADMIN_NOTIFICATIONS.unshift({ id: uid("AN"), title, subtitle, kind: "moderation", read: false });
};

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<CommunityPost[]>(() => [...MOCK_COMMUNITY_POSTS]);

  const createPost = (post: CommunityPost) => setPosts(prev => [post, ...prev]);

  const approvePost = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) pushNoti("Bài viết đã được duyệt ✅", `"${post.content.slice(0, 50)}${post.content.length > 50 ? "..." : ""}" đã được phê duyệt`);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "approved" as const } : p));
  };

  const rejectPost = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) pushNoti("Bài viết bị từ chối ❌", `"${post.content.slice(0, 50)}${post.content.length > 50 ? "..." : ""}" không được phê duyệt`);
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" as const } : p));
  };

  const deletePost = (id: string) =>
    setPosts(prev => prev.filter(p => p.id !== id));

  return (
    <CommunityContext.Provider value={{ posts, createPost, approvePost, rejectPost, deletePost }}>
      {children}
    </CommunityContext.Provider>
  );
}
