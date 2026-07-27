import { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { createCommunityComment, createCommunityPost, createStory, MOCK_ACCOUNTS } from "@/mocks";
import type { CommunityComment, CommunityPost } from "@/mocks";
import { useApp } from "@/stores/app.store";
import { useCommunity } from "@/stores/community.store";
import { useStories } from "@/stores/stories.store";
import { Card, Btn, Badge, Textarea } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { StoryViewer } from "@/components/figma/StoryViewer";
import { ImageOverlayEditor } from "@/components/figma/ImageOverlayEditor";
import type { OverlayEditorHandle } from "@/components/figma/ImageOverlayEditor";
import { useTranslation } from "react-i18next";

import { Heart, MessageCircle, Share2, Send, ImagePlus, PawPrint, Trash2, Plus, ChevronLeft, ChevronRight, Play, User } from "lucide-react";
import { isImageUrl } from "@/services/user.service";

function PostItem({ post, onViewStory }: { post: CommunityPost; onViewStory?: (authorId: string) => void }) {
  const { t } = useTranslation();
  const { activeAccount, updateAccount } = useApp();
  const { deletePost } = useCommunity();
  const { stories } = useStories();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>(post.comments);
  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const postImages = post.images;
  const storyAuthorIds = useMemo(() => new Set(stories.map(s => s.authorId)), [stories]);
  const hasStory = storyAuthorIds.has(post.authorId);
  const authorAccount = activeAccount?.id === post.authorId
    ? activeAccount
    : MOCK_ACCOUNTS.find(account => account.id === post.authorId);
  const authorName = authorAccount?.name ?? post.author;
  const authorAvatar = authorAccount?.avatar ?? post.avatar;
  const authorHandle = authorAccount
    ? `@${authorAccount.email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase()}`
    : post.handle;
  const isShared = activeAccount?.reposts?.includes(post.id) ?? false;
  const handleShare = () => {
    if (!activeAccount) return;
    const current = activeAccount.reposts ?? [];
    updateAccount({ reposts: isShared ? current.filter(id => id !== post.id) : [...current, post.id] });
  };
  return (
    <Card className="border-l-4 border-l-primary/30" hover={false}>
      <div className="p-4 flex items-center gap-3">
        {hasStory ? (
          <div className="relative flex-shrink-0">
            <button onClick={() => {
              if (activeAccount?.id === post.authorId) {
                onViewStory?.(post.authorId);
              } else {
                setMenuOpen(true);
              }
            }} className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-violet-600 hover:brightness-110 transition-all">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center overflow-hidden text-sm font-bold text-primary">
                {isImageUrl(authorAvatar) ? <img src={authorAvatar} alt="" className="w-full h-full object-cover" /> : authorAvatar}
              </div>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute left-0 mt-1.5 z-50 w-44 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                  <button onClick={() => { onViewStory?.(post.authorId); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors text-left">
                    <Play size={15} className="text-primary" /> Xem tin
                  </button>
                  <button onClick={() => { navigate(`/profile/${post.authorId}`); setMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors text-left border-t border-border">
                    <User size={15} className="text-muted-foreground" /> Trang cá nhân
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button onClick={() => navigate(`/profile/${post.authorId}`)} className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 overflow-hidden hover:ring-2 hover:ring-ring transition-all">
            {isImageUrl(authorAvatar) ? <img src={authorAvatar} alt="" className="w-full h-full object-cover" /> : authorAvatar}
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(`/profile/${post.authorId}`)} className="font-semibold text-foreground text-sm truncate hover:text-primary transition-colors">{authorName}</button>
            {post.status === "pending" && <Badge v="warning">{t("community.post.pending")}</Badge>}
            {post.status === "rejected" && <><Badge v="danger">{t("community.post.rejected")}</Badge><button onClick={() => deletePost(post.id)} className="ml-auto text-muted-foreground hover:text-destructive p-1 rounded"><Trash2 size={14} /></button></>}
          </div>
          <p className="text-xs text-muted-foreground truncate">{authorHandle} · {post.time}{post.pet ? ` · ${post.pet}` : ""}</p>
        </div>
      </div>
      <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.content}</p>
      {postImages && postImages.length > 0 && (
        <div className={`grid ${postImages.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1 px-1`}>
          {postImages.map((img, i) => <ImageWithFallback key={i} src={img} alt="post" className={`w-full ${postImages.length === 1 ? "h-72" : "h-48"} object-cover rounded-lg`} />)}
        </div>
      )}
      <div className="flex items-center gap-1 p-2 border-t border-border">
        <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors ${liked ? "text-destructive" : "text-muted-foreground"}`}>
          <Heart size={17} fill={liked ? "currentColor" : "none"} /> {post.likes + (liked ? 1 : 0)}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">
          <MessageCircle size={17} /> {comments.length}
        </button>
        <button onClick={handleShare} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors ${isShared ? "text-primary" : "text-muted-foreground"}`}>
          <Share2 size={17} /> {isShared ? t("community.post.shared") : t("community.post.share")}
        </button>
      </div>
      {showComments && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
          {comments.map((c: CommunityComment, i: number) => (
            <div key={i} className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">{c.author[0]}</div>
              <div className="bg-muted rounded-2xl px-3 py-2 flex-1"><p className="text-xs font-semibold text-foreground">{c.author}</p><p className="text-sm text-foreground">{c.content}</p></div>
            </div>
          ))}
          <div className="flex gap-2 items-center">
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder={t("community.post.commentPlaceholder")} className="flex-1 px-3 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={() => { if (draft.trim() && activeAccount) { setComments([...comments, createCommunityComment(activeAccount.id, activeAccount.name, draft)]); setDraft(""); } }} className="p-2.5 rounded-full bg-primary text-primary-foreground"><Send size={15} /></button>
          </div>
        </div>
      )}
    </Card>
  );
}

export function Community() {
  const { t } = useTranslation();
  const { activeAccount } = useApp();
  const { posts, createPost } = useCommunity();
  const { stories, addStory } = useStories();
  const [draft, setDraft] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const storyFileRef = useRef<HTMLInputElement>(null);
  const [storyPreview, setStoryPreview] = useState<string | null>(null);
  const [storyStep, setStoryStep] = useState<"crop" | "overlay">("crop");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const storyOverlayRef = useRef<OverlayEditorHandle>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [storyOffset, setStoryOffset] = useState(0);
  const [panPos, setPanPos] = useState({ x: 50, y: 50 });
  const [storyCreateChoice, setStoryCreateChoice] = useState(false);
  const [storyZoom, setStoryZoom] = useState(1);
  const storyGradientRef = useRef<string | null>(null);
  const storyOriginRef = useRef<"image" | "text">("image");
  const cropZoomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = cropZoomRef.current;
    if (!el) return;
    const zoom = (e: WheelEvent) => {
      e.preventDefault();
      setStoryZoom(z => Math.max(1, Math.min(5, z + Math.sign(e.deltaY) * -0.2)));
    };
    el.addEventListener("wheel", zoom, { passive: false });
    return () => el.removeEventListener("wheel", zoom);
  }, [storyPreview]);
  function getStoryGradient(): string {
    if (!storyGradientRef.current) {
      const c = document.createElement("canvas");
      c.width = 540; c.height = 960;
      const ctx = c.getContext("2d")!;
      const g = ctx.createLinearGradient(0, 0, 0, 960);
      g.addColorStop(0, "#667eea"); g.addColorStop(1, "#764ba2");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 540, 960);
      storyGradientRef.current = c.toDataURL("image/jpeg", 0.9);
    }
    return storyGradientRef.current;
  }

  function cropToStoryFrame(src: string, px: number, py: number, zoom: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const iw = img.naturalWidth;
          const ih = img.naturalHeight;
          const RATIO = 9 / 16;
          let sw: number, sh: number, sx: number, sy: number;
          if (iw / ih > RATIO) {
            sh = ih / zoom; sw = sh * RATIO;
          } else {
            sw = iw / zoom; sh = sw / RATIO;
          }
          sx = ((px / 100) * (iw - sw));
          sy = ((py / 100) * (ih - sh));
          sx = Math.max(0, Math.min(iw - sw, sx));
          sy = Math.max(0, Math.min(ih - sh, sy));
          const c = document.createElement("canvas");
          c.width = 540; c.height = 960;
          c.getContext("2d")!.drawImage(img, sx, sy, sw, sh, 0, 0, 540, 960);
          resolve(c.toDataURL("image/jpeg", 0.9));
        } catch (e) { reject(e); }
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  const items = posts.filter(p => p.status === "approved" || p.authorId === activeAccount?.id).sort((a, b) => a.status === "pending" ? -1 : b.status === "pending" ? 1 : 0);

  const handlePost = () => {
    if (!draft.trim() || !activeAccount) return;
    createPost(createCommunityPost(activeAccount, draft.trim(), images.length > 0 ? images : undefined));
    setDraft("");
    setImages([]);
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleStoryFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setStoryPreview(reader.result as string); setPanPos({ x: 50, y: 50 }); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleNextStoryStep = async () => {
    if (!storyPreview) return;
    try {
      const cropped = await cropToStoryFrame(storyPreview, panPos.x, panPos.y, storyZoom);
      setCroppedImage(cropped);
      setStoryStep("overlay");
    } catch {
      setCroppedImage(storyPreview);
      setStoryStep("overlay");
    }
  };

  const handlePostStoryAs = async (mode: "image" | "text") => {
    if (!activeAccount) return;
    let finalImage: string | null = null;
    if (mode === "image") {
      if (croppedImage && storyOverlayRef.current) {
        finalImage = await storyOverlayRef.current.renderDataUrl().catch(() => croppedImage);
      } else {
        finalImage = storyPreview;
      }
    } else {
      const overlays = storyOverlayRef.current?.getOverlays?.() ?? [];
      if (overlays.length === 0) return;
      const c = document.createElement("canvas");
      c.width = 540; c.height = 960;
      const ctx = c.getContext("2d")!;
      const grad = ctx.createLinearGradient(0, 0, 0, 960);
      grad.addColorStop(0, "#667eea"); grad.addColorStop(1, "#764ba2");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 540, 960);
      overlays.forEach(o => {
        const px = (o.x / 100) * 540; const py = (o.y / 100) * 960;
        const fs = Math.round(o.fontSize * (540 / 300));
        ctx.font = `bold ${fs}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = Math.max(2, fs * 0.08);
        ctx.fillStyle = o.color;
        ctx.fillText(o.text, px, py);
      });
      finalImage = c.toDataURL("image/jpeg", 0.9);
    }
    if (finalImage) addStory(createStory(activeAccount.id, finalImage));
    setStoryPreview(null);
    setCroppedImage(null);
    setStoryStep("crop");
    setPanPos({ x: 50, y: 50 });
    setStoryZoom(1);
  };

  const userStory = activeAccount ? stories.find(s => s.authorId === activeAccount.id) : null;
  const otherStories = stories.filter(s => s.authorId !== activeAccount?.id);
  const displayItems: ({ type: "add" } | { type: "story"; story: (typeof stories)[0] })[] = [
    { type: "add" },
    ...(userStory ? [{ type: "story" as const, story: userStory }] : []),
    ...otherStories.map(s => ({ type: "story" as const, story: s })),
  ];
  const VISIBLE = 7;
  const maxOffset = Math.max(0, displayItems.length - VISIBLE);
  const formAvatar = activeAccount?.avatar ?? "PP";

  useEffect(() => {
    if (storyPreview) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [storyPreview]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-extrabold text-3xl text-foreground">{t("community.pageTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("community.pageSubtitle")}</p>
      </div>

      <div className="relative -mx-4 px-4 py-2">
        <div className="overflow-hidden p-1">
          <div className="flex gap-4 transition-transform duration-300 ease-in-out" style={{ transform: `translateX(${-storyOffset * 96}px)` }}>
            {displayItems.map(item => {
              if (item.type === "add") return (
                <button key="add" onClick={() => setStoryCreateChoice(true)} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20 group">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 overflow-hidden ring-2 ring-offset-2 ring-offset-background transition-all group-hover:ring-primary bg-primary text-primary-foreground ring-primary">
                    <Plus size={24} />
                  </div>
                </button>
              );
              const account = MOCK_ACCOUNTS.find(a => a.id === item.story.authorId);
              if (!account) return null;
              const isOwn = item.story.authorId === activeAccount?.id;
              return (
                <button key={item.story.id} onClick={() => {
                  const idx = stories.indexOf(item.story);
                  setViewerIndex(idx);
                }} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-20 group">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden ring-2 ring-offset-2 ring-offset-background transition-all group-hover:ring-primary ring-primary/40">
                    {isImageUrl(account.avatar) ? (
                      <img src={account.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{account.avatar}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate w-full text-center">{isOwn ? t("community.story.yourStory") : account.name.split(" ").pop()}</span>
                </button>
              );
            })}
          </div>
        </div>
        {storyOffset > 0 && (
          <button onClick={() => setStoryOffset(o => Math.max(0, o - 1))} className="absolute -left-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background border border-border shadow-lg flex items-center justify-center z-10 hover:bg-secondary transition-colors">
            <ChevronLeft size={18} />
          </button>
        )}
        {storyOffset < maxOffset && (
          <button onClick={() => setStoryOffset(o => Math.min(maxOffset, o + 1))} className="absolute -right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background border border-border shadow-lg flex items-center justify-center z-10 hover:bg-secondary transition-colors">
            <ChevronRight size={18} />
          </button>
        )}
      </div>
      <input ref={storyFileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleStoryFilePick} />

      {storyCreateChoice && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={() => setStoryCreateChoice(false)}>
          <div className="bg-card rounded-2xl p-5 w-72 shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-foreground text-center mb-4">Tạo tin mới</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setStoryCreateChoice(false); storyOriginRef.current = "image"; storyFileRef.current?.click(); }} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-lg">📷</span></div>
                <div><p className="font-semibold text-sm text-foreground">Ảnh / Video</p><p className="text-xs text-muted-foreground">Đăng ảnh hoặc video</p></div>
              </button>
              <button onClick={() => { setStoryCreateChoice(false); storyOriginRef.current = "text"; setStoryPreview(getStoryGradient()); setStoryStep("overlay"); setCroppedImage(getStoryGradient()); }} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-lg">✏️</span></div>
                <div><p className="font-semibold text-sm text-foreground">Văn bản</p><p className="text-xs text-muted-foreground">Tạo tin chỉ với chữ</p></div>
              </button>
            </div>
          </div>
        </div>
      )}
      {storyPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onMouseDown={e => { if (e.target === e.currentTarget) { setStoryPreview(null); setStoryStep("crop"); setPanPos({ x: 50, y: 50 }); setStoryZoom(1); } }}>
          <div className="w-full max-w-[min(46vh,95vw)] mx-4" onMouseDown={e => e.stopPropagation()}>
            {storyStep === "crop" ? (
              <>
                <div ref={cropZoomRef} className="rounded-2xl overflow-hidden relative w-full aspect-[9/16] shadow-2xl border border-white/10 ring-1 ring-white/5 select-none" style={{ cursor: "grab" }}
                  onMouseDown={e => {
                    e.stopPropagation();
                    const sx = e.clientX, sy = e.clientY;
                    const ix = panPos.x, iy = panPos.y;
                    const onMove = (me: MouseEvent) => {
                      setPanPos({
                        x: Math.max(0, Math.min(100, ix + (me.clientX - sx) * 0.5)),
                        y: Math.max(0, Math.min(100, iy + (me.clientY - sy) * 0.5)),
                      });
                    };
                    const onUp = () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
                    window.addEventListener("mousemove", onMove);
                    window.addEventListener("mouseup", onUp);
                  }}
                  onTouchStart={e => {
                    const sx = e.touches[0].clientX, sy = e.touches[0].clientY;
                    const ix = panPos.x, iy = panPos.y;
                    const onMove = (te: TouchEvent) => {
                      setPanPos({
                        x: Math.max(0, Math.min(100, ix + (te.touches[0].clientX - sx) * 0.5)),
                        y: Math.max(0, Math.min(100, iy + (te.touches[0].clientY - sy) * 0.5)),
                      });
                    };
                    const onEnd = () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
                    window.addEventListener("touchmove", onMove);
                    window.addEventListener("touchend", onEnd);
                  }}
                >
                  <img src={storyPreview} alt="" draggable={false} className="w-full h-full object-cover pointer-events-none select-none"
                    style={{
                      objectPosition: `${panPos.x}% ${panPos.y}%`,
                      transform: `scale(${storyZoom})`,
                      transformOrigin: `${panPos.x}% ${panPos.y}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-center mt-3 gap-2 text-white/40 text-xs">
                  <span>{storyZoom > 1 ? `Kéo để căn chỉnh · ${storyZoom.toFixed(1)}×` : "Lăn chuột để phóng to/thu nhỏ · Kéo để căn chỉnh"}</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <Btn className="flex-1 py-2.5 !border-white/20 !text-white hover:!bg-white/10" variant="outline" onClick={() => { setStoryPreview(null); setStoryStep("crop"); setPanPos({ x: 50, y: 50 }); setStoryZoom(1); }}>{t("common.cancel")}</Btn>
                  <Btn className="flex-1 py-2.5" icon={<PawPrint size={15} />} onClick={handleNextStoryStep}>Tiếp theo</Btn>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl overflow-hidden relative w-full shadow-2xl border border-white/10 ring-1 ring-white/5" style={{ maxHeight: "calc(100dvh - 8rem)" }}>
                  {croppedImage && <ImageOverlayEditor ref={storyOverlayRef} imageUrl={croppedImage} aspectRatio={9/16} />}
                </div>
                <div className="flex items-center justify-center mt-3 gap-2 text-white/40 text-xs">
                  <span>Thêm chữ vào ảnh (tuỳ chọn)</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <Btn className="flex-1 py-2.5 !border-white/20 !text-white hover:!bg-white/10" variant="outline" onClick={() => { if (storyOriginRef.current === "text") { setStoryPreview(null); setStoryStep("crop"); setCroppedImage(null); setPanPos({ x: 50, y: 50 }); setStoryZoom(1); } else { setStoryStep("crop"); setCroppedImage(null); } }}>Quay lại</Btn>
                  <Btn className="flex-1 py-2.5" icon={<PawPrint size={15} />} onClick={() => handlePostStoryAs("image")}>{t("community.story.post")}</Btn>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Card className="p-4" hover={false}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 overflow-hidden">
            {isImageUrl(formAvatar) ? <img src={formAvatar} alt="" className="w-full h-full object-cover" /> : formAvatar}
          </div>
          <div className="flex-1">
            <Textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder={t("community.composer.placeholder")} rows={2} />
            {images.length > 0 && <div className="flex gap-2 mt-2 flex-wrap">
              {images.map((img, i) => <div key={i} className="relative inline-block"><img src={img} alt="preview" className="h-20 rounded-xl object-cover" /><button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">×</button></div>)}
            </div>}
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary px-2 py-1 rounded-lg"><ImagePlus size={16} /> {t("community.composer.photoBtn")}</button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImagePick} />
              <Btn size="sm" icon={<PawPrint size={15} />} disabled={!draft.trim()} onClick={handlePost}>{t("community.composer.postBtn")}</Btn>
            </div>
          </div>
        </div>
      </Card>
      {items.map(post => <PostItem key={post.id} post={post} onViewStory={(authorId) => {
        const idx = stories.findIndex(s => s.authorId === authorId);
        if (idx !== -1) setViewerIndex(idx);
      }} />)}

      {viewerIndex !== null && (
        <StoryViewer stories={stories} initialIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}
    </div>
  );
}
