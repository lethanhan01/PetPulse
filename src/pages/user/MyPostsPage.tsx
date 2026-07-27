import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import { useCommunity } from "@/stores/community.store";
import type { CommunityPost } from "@/mocks";
import { Card, PageTitle, Badge } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Heart, MessageCircle, PawPrint } from "lucide-react";
import { isImageUrl } from "@/services/user.service";

export function MyPosts() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageTitle title="Bài viết của tôi" />
      <MyPostsContent />
    </div>
  );
}

export function MyPostsContent() {
  const { activeAccount } = useApp();
  const { posts } = useCommunity();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"my" | "shared">("my");

  const myPosts = useMemo(
    () => posts.filter(p => p.authorId === activeAccount?.id),
    [posts, activeAccount?.id]
  );

  const sharedPosts = useMemo(
    () => posts.filter(p => activeAccount?.reposts.includes(p.id)),
    [posts, activeAccount?.reposts]
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-1 border-b border-border">
        {[
          { k: "my" as const, l: `Bài viết của tôi (${myPosts.length})` },
          { k: "shared" as const, l: `Đã chia sẻ (${sharedPosts.length})` },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${tab === t.k ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"}`}>{t.l}</button>
        ))}
      </div>

      {tab === "my" && (
        myPosts.length === 0 ? (
          <Card className="p-8 text-center" hover={false}>
            <PawPrint size={32} className="text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Bạn chưa đăng bài viết nào.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {myPosts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        )
      )}

      {tab === "shared" && (
        sharedPosts.length === 0 ? (
          <Card className="p-8 text-center" hover={false}>
            <PawPrint size={32} className="text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Bạn chưa chia sẻ bài viết nào.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sharedPosts.map(post => (
              <div key={post.id}>
                <div className="flex items-center gap-2 px-1 mb-1">
                  <span className="text-xs text-primary font-semibold">Đã chia sẻ lại</span>
                  <span className="text-xs text-muted-foreground">từ</span>
                  <button onClick={() => navigate(`/profile/${post.authorId}`)} className="text-xs font-medium text-primary hover:underline">{post.author}</button>
                </div>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

function PostCard({ post }: { post: CommunityPost }) {
  const navigate = useNavigate();
  const postImages = post.images;
  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/30" hover={false}>
      <div className="p-4 flex items-center gap-3">
        <button onClick={() => navigate(`/profile/${post.authorId}`)} className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 overflow-hidden hover:ring-2 hover:ring-ring transition-all">
          {isImageUrl(post.avatar) ? <img src={post.avatar} alt="" className="w-full h-full object-cover" /> : post.avatar}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(`/profile/${post.authorId}`)} className="font-semibold text-foreground text-sm truncate hover:text-primary transition-colors">{post.author}</button>
            {post.status === "pending" && <Badge v="warning">Chờ duyệt</Badge>}
            {post.status === "rejected" && <Badge v="danger">Từ chối</Badge>}
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
        <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground">
          <Heart size={17} /> {post.likes}
        </span>
        <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground">
          <MessageCircle size={17} /> {post.comments.length}
        </span>
      </div>
    </Card>
  );
}
