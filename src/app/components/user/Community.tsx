import { useState } from "react";
import { COMMUNITY } from "../../lib/store";
import { Card, Btn, HEAD, Textarea } from "../kit";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Heart, MessageCircle, Share2, Send, ImagePlus, PawPrint } from "lucide-react";

function Post({ post }: { post: typeof COMMUNITY[number] }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    { a: "Nguyễn Văn An", t: "Bé đáng yêu quá! 🥰" },
    { a: "Đỗ Hải Yến", t: "Chúc bé luôn khỏe mạnh nhé 🐾" },
  ]);
  const [draft, setDraft] = useState("");
  return (
    <Card className="overflow-hidden" hover={false}>
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{post.avatar}</div>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">{post.author} <span className="text-muted-foreground font-normal">· {post.pet}</span></p>
          <p className="text-xs text-muted-foreground">{post.handle} · {post.time}</p>
        </div>
      </div>
      <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.content}</p>
      {post.image && <ImageWithFallback src={post.image} alt="post" className="w-full h-72 object-cover" />}
      <div className="flex items-center gap-1 p-2 border-t border-border">
        <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors ${liked ? "text-destructive" : "text-muted-foreground"}`}>
          <Heart size={17} fill={liked ? "currentColor" : "none"} /> {post.likes + (liked ? 1 : 0)}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">
          <MessageCircle size={17} /> {post.comments}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors"><Share2 size={17} /> Chia sẻ</button>
      </div>
      {showComments && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
          {comments.map((c, i) => (
            <div key={i} className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">{c.a[0]}</div>
              <div className="bg-muted rounded-2xl px-3 py-2 flex-1"><p className="text-xs font-semibold text-foreground">{c.a}</p><p className="text-sm text-foreground">{c.t}</p></div>
            </div>
          ))}
          <div className="flex gap-2 items-center">
            <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Viết bình luận..." className="flex-1 px-3 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={() => { if (draft.trim()) { setComments([...comments, { a: "Nguyễn Văn An", t: draft }]); setDraft(""); } }} className="p-2.5 rounded-full bg-primary text-primary-foreground"><Send size={15} /></button>
          </div>
        </div>
      )}
    </Card>
  );
}

export function Community() {
  const [draft, setDraft] = useState("");
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-extrabold text-3xl text-foreground" style={HEAD}>Cộng đồng thú cưng</h1>
        <p className="text-sm text-muted-foreground mt-1">Chia sẻ khoảnh khắc & học hỏi mẹo chăm sóc từ cộng đồng 🐾</p>
      </div>
      <Card className="p-4" hover={false}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">AN</div>
          <div className="flex-1">
            <Textarea value={draft} onChange={e => setDraft(e.target.value)} placeholder="Chia sẻ về thú cưng của bạn..." rows={2} />
            <div className="flex items-center justify-between mt-2">
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary px-2 py-1 rounded-lg"><ImagePlus size={16} /> Ảnh</button>
              <Btn size="sm" icon={<PawPrint size={15} />} disabled={!draft.trim()} onClick={() => setDraft("")}>Đăng bài</Btn>
            </div>
          </div>
        </div>
      </Card>
      {COMMUNITY.map(p => <Post key={p.id} post={p} />)}
    </div>
  );
}
