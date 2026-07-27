import { useState, useEffect, useMemo, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { isImageUrl } from "@/services/user.service";
import type { CommunityStory } from "@/mocks";
import { MOCK_ACCOUNTS } from "@/mocks";

export function StoryViewer({ stories, initialIndex, onClose }: {
  stories: CommunityStory[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const story = stories[index];
  const author = MOCK_ACCOUNTS.find(a => a.id === story?.authorId);

  const authorGroups = useMemo(() => {
    const groups: { authorId: string; stories: CommunityStory[] }[] = [];
    const seen = new Set<string>();
    stories.forEach(s => {
      if (!seen.has(s.authorId)) {
        seen.add(s.authorId);
        groups.push({ authorId: s.authorId, stories: [s] });
      } else {
        groups.find(g => g.authorId === s.authorId)!.stories.push(s);
      }
    });
    return groups;
  }, [stories]);

  const { currentGroupIdx, storyIdxInGroup } = useMemo(() => {
    let acc = 0;
    for (let g = 0; g < authorGroups.length; g++) {
      if (index < acc + authorGroups[g].stories.length) {
        return { currentGroupIdx: g, storyIdxInGroup: index - acc };
      }
      acc += authorGroups[g].stories.length;
    }
    return { currentGroupIdx: 0, storyIdxInGroup: 0 };
  }, [index, authorGroups]);

  const handlePrev = () => setIndex(Math.max(0, index - 1));
  const handleNext = () => index < stories.length - 1 ? setIndex(index + 1) : onClose();

  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;
  const handlePrevRef = useRef(handlePrev);
  handlePrevRef.current = handlePrev;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const elapsedRef = useRef(0);

  useEffect(() => {
    setProgress(0);
    setPaused(false);
    elapsedRef.current = 0;
  }, [index]);

  useEffect(() => {
    if (paused) return;

    const start = Date.now() - elapsedRef.current;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / 5000) * 100);
      setProgress(pct);
      if (elapsed >= 5000) handleNextRef.current();
    }, 50);
    return () => {
      elapsedRef.current = Date.now() - start;
      clearInterval(interval);
    };
  }, [index, paused]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key === "ArrowLeft") handlePrevRef.current();
      if (e.key === "ArrowRight") handleNextRef.current();
      if (e.key === " ") { e.preventDefault(); setPaused(p => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.width;
    if (x < w * 0.33) handlePrevRef.current();
    else if (x < w * 0.66) setPaused(p => !p);
    else handleNextRef.current();
  };

  if (!story || !author) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex">
      <div className="w-72 bg-black/90 border-r border-white/10 flex flex-col overflow-y-auto flex-shrink-0" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-white/10">
          <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Stories</span>
        </div>
        <div className="flex-1 py-2">
          {authorGroups.map((group, gi) => {
            const account = MOCK_ACCOUNTS.find(a => a.id === group.authorId);
            if (!account) return null;
            const isActive = gi === currentGroupIdx;
            return (
              <button key={group.authorId} onClick={() => {
                const flatIdx = authorGroups.slice(0, gi).reduce((acc, g) => acc + g.stories.length, 0);
                setIndex(flatIdx);
              }} className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden ring-2 ${isActive ? "ring-primary" : "ring-transparent"}`}>
                  {isImageUrl(account.avatar) ? <img src={account.avatar} alt="" className="w-full h-full object-cover" /> : account.avatar}
                </div>
                <span className={`text-sm truncate ${isActive ? "text-white font-semibold" : "text-white/70"}`}>{account.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col relative group" onClick={handleClick}>
        <div className="relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
          <div className="flex gap-0.5 p-2 pb-3 relative">
            {authorGroups[currentGroupIdx]?.stories.map((_, si) => (
              <div key={si} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{
                  width: `${si < storyIdxInGroup ? 100 : si === storyIdxInGroup ? progress : 0}%`
                }} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white overflow-hidden flex-shrink-0">
              {isImageUrl(author.avatar) ? <img src={author.avatar} alt="" className="w-full h-full object-cover" /> : author.avatar}
            </div>
            <span className="text-sm font-semibold text-white">{author.name}</span>
            <span className="text-xs text-white/60">{story.createdAt}</span>
          </div>
          <button onClick={e => { e.stopPropagation(); onClose(); }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 pointer-events-auto"><X size={18} /></button>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
          <div className="relative w-full max-w-[50vh] aspect-[9/16]">
            {story.mediaType === "image" ? (
              <img src={story.mediaUrl} alt="story" className="w-full h-full object-contain" />
            ) : (
              <video src={story.mediaUrl} autoPlay loop muted className="w-full h-full object-contain" />
            )}
            {paused && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Play size={32} className="text-white ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
        <button onClick={e => { e.stopPropagation(); handlePrevRef.current(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/30 z-20 opacity-60 group-hover:opacity-100 transition-opacity">
          <ChevronLeft size={22} />
        </button>
        <button onClick={e => { e.stopPropagation(); handleNextRef.current(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/30 z-20 opacity-60 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={22} />
        </button>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"><p className="text-white/40 text-xs">Chạm trái/phải để xem tin trước/sau</p></div>
      </div>
    </div>
  );
}
