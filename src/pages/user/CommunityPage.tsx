import { useRef, useState } from "react";
import { createCommunityComment, createCommunityPost } from "@/mocks";
import type { CommunityComment, CommunityPost } from "@/mocks";
import { useApp } from "@/stores/app.store";
import { useCommunity } from "@/stores/community.store";
import { Card, Btn, Badge, HEAD, Textarea } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Pagination } from "@/components/Pagination/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { Heart, MessageCircle, Share2, Send, ImagePlus, PawPrint, Trash2 } from "lucide-react";

function PostItem({ post }: { post: CommunityPost }) {
  const { activeAccount } = useApp();
  const { deletePost } = useCommunity();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommunityComment[]>(post.comments);
  const [draft, setDraft] = useState("");
  const postImages = post.images;
  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/30" hover={false}>
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{post.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground text-sm truncate">{post.author}</p>
            {post.status === "pending" && <Badge v="warning">Chờ duyệt</Badge>}
            {post.status === "rejected" && <><Badge v="danger">Từ chối</Badge><button onClick={() => deletePost(post.id)} className="ml-auto text-muted-foreground hover:text-destructive p-1 rounded"><Trash2 size={14} /></button></>}
          </div>
          <p className="text-xs text-muted-foreground truncate">{post.handle} · {post.time}{post.pet ? ` · ${post.pet}` : ""}</p>
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
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors"><Share2 size={17} /> Chia sẻ</button>
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
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Viết bình luận..." className="flex-1 px-3 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={() => { if (draft.trim() && activeAccount) { setComments([...comments, createCommunityComment(activeAccount.id, activeAccount.name, draft)]); setDraft(""); } }} className="p-2.5 rounded-full bg-primary text-primary-foreground"><Send size={15} /></button>
          </div>
        </div>
      )}
    </Card>
  );
}

export function Community() {
  const { activeAccount } = useApp();
  const { posts, createPost } = useCommunity();
  const [draft, setDraft] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const visiblePosts = posts.filter(p => p.status === "approved" || p.authorId === activeAccount?.id);
  const { items, currentPage, totalPages, setPage } = usePagination(visiblePosts);

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

  const formInitials = activeAccount?.avatar?.startsWith?.("data:")
    ? activeAccount.name.split(" ").slice(-2).map(p => p[0]).join("")
    : activeAccount?.avatar ?? "PP";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-extrabold text-3xl text-foreground" style={HEAD}>Cộng đồng thú cưng</h1>
        <p className="text-sm text-muted-foreground mt-1">Chia sẻ khoảnh khắc & học hỏi mẹo chăm sóc từ cộng đồng.</p>
      </div>
      <Card className="p-4" hover={false}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">{formInitials}</div>
          <div className="flex-1">
            <Textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Chia sẻ về thú cưng của bạn..." rows={2} />
            {images.length > 0 && <div className="flex gap-2 mt-2 flex-wrap">
              {images.map((img, i) => <div key={i} className="relative inline-block"><img src={img} alt="preview" className="h-20 rounded-xl object-cover" /><button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">×</button></div>)}
            </div>}
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary px-2 py-1 rounded-lg"><ImagePlus size={16} /> Ảnh</button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImagePick} />
              <Btn size="sm" icon={<PawPrint size={15} />} disabled={!draft.trim()} onClick={handlePost}>Đăng bài</Btn>
            </div>
          </div>
        </div>
      </Card>
      {items.map(post => <PostItem key={post.id} post={post} />)}
      <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
