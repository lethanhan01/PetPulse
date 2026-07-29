import { createContext, useContext, useState, type ReactNode } from "react";
import { MOCK_COMMUNITY_STORIES } from "@/mocks";
import type { CommunityStory } from "@/mocks";

type StoriesContextValue = {
  stories: CommunityStory[];
  addStory: (story: CommunityStory) => void;
  deleteStory: (id: string) => void;
  toggleReaction: (storyId: string, emoji: string, accountId: string) => void;
};

const StoriesContext = createContext<StoriesContextValue | null>(null);

export const useStories = () => {
  const context = useContext(StoriesContext);
  if (!context) throw new Error("useStories must be used within StoriesProvider");
  return context;
};

export function StoriesProvider({ children }: { children: ReactNode }) {
  const [stories, setStories] = useState<CommunityStory[]>(() => [...MOCK_COMMUNITY_STORIES]);

  const addStory = (story: CommunityStory) => setStories(prev => [story, ...prev]);
  const deleteStory = (id: string) => setStories(prev => prev.filter(s => s.id !== id));
  const toggleReaction = (storyId: string, emoji: string, accountId: string) => setStories(prev => prev.map(s =>
    s.id === storyId
      ? { ...s, reactions: { ...s.reactions, [emoji]: (s.reactions[emoji] ?? []).includes(accountId) ? s.reactions[emoji].filter(id => id !== accountId) : [...(s.reactions[emoji] ?? []), accountId] } }
      : s
  ));

  return (
    <StoriesContext.Provider value={{ stories, addStory, deleteStory, toggleReaction }}>
      {children}
    </StoriesContext.Provider>
  );
}
