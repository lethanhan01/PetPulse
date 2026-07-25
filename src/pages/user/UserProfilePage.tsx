import { useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp } from "@/stores/app.store";
import { useCommunity } from "@/stores/community.store";
import { MOCK_ACCOUNTS } from "@/mocks";
import { Card, Badge } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Crown, Calendar, PawPrint, Heart, MessageCircle, ChevronLeft } from "lucide-react";

export function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { activeAccount } = useApp();
  const { posts } = useCommunity();

  const account = useMemo(
    () => MOCK_ACCOUNTS.find(a => a.id === userId) ?? null,
    [userId]
  );

  const userPosts = useMemo(
    () => posts.filter(p => p.authorId === userId && p.status === "approved"),
    [posts, userId]
  );

  const sharedPosts = useMemo(
    () => posts.filter(p => account?.reposts.includes(p.id) && p.authorId !== userId),
    [posts, account?.reposts, userId]
  );

  const allItems = useMemo(() => {
    const withLabels: Array<{ post: typeof posts[0]; label?: string }> = [
      ...userPosts.map(p => ({ post: p })),
      ...sharedPosts.map(p => ({ post: p, label: `Đã chia sẻ lại từ ${p.author}` })),
    ];
    return withLabels;
  }, [userPosts, sharedPosts]);

  if (!account) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-lg font-semibold text-foreground">Người dùng không tồn tại</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-sm text-primary hover:underline">Quay lại</button>
      </div>
    );
  }

  const isOwnProfile = activeAccount?.id === userId;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft size={17} /> Quay lại
      </button>

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
        <div className="h-24 bg-gradient-to-r from-primary/80 via-primary to-cyan-400/60" />
        <div className="px-5 pb-6">
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-background border-4 border-border flex items-center justify-center text-2xl font-extrabold text-primary shadow-sm">
              {account.avatar.startsWith("data:")
                ? <img src={account.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
                : account.avatar
              }
            </div>
          </div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0">
              <h2 className="font-bold text-xl text-foreground truncate">{account.name}</h2>
              <p className="text-sm text-muted-foreground">{account.email}</p>
            </div>
            <Badge v={account.plan === "Free" ? "neutral" : "primary"}>
              {account.plan === "Premium" || account.plan === "Premium Năm" ? <><Crown size={11} /> Premium</> : "Free"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-foreground">
              <Calendar size={14} className="text-primary" />
              <span className="font-semibold">{new Date(account.joined).getFullYear()}</span>
              <span className="text-muted-foreground">tham gia</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-foreground">
              <PawPrint size={14} className="text-primary" />
              <span className="font-semibold">{allItems.length}</span>
              <span className="text-muted-foreground">bài viết</span>
            </div>
          </div>
        </div>
      </div>

      {/* My Posts button if own profile */}
      {isOwnProfile && (
        <button onClick={() => navigate("/my-posts")}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-card hover:shadow-sm transition-all text-left">
          <div>
            <p className="text-sm font-semibold text-foreground">Quản lý bài viết của tôi</p>
            <p className="text-xs text-muted-foreground mt-0.5">Xem bài đã đăng và đã chia sẻ</p>
          </div>
          <ChevronLeft size={18} className="text-muted-foreground rotate-180" />
        </button>
      )}

      {/* Posts */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Bài viết</h3>
        {allItems.length === 0 ? (
          <Card className="p-8 text-center" hover={false}>
            <PawPrint size={32} className="text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Người dùng chưa có bài viết nào.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {allItems.map(({ post, label }) => (
              <div key={post.id}>
                {label && (
                  <div className="flex items-center gap-2 px-1 mb-1">
                    <span className="text-xs text-primary font-semibold">Đã chia sẻ lại</span>
                    <span className="text-xs text-muted-foreground">từ</span>
                    <button onClick={() => navigate(`/profile/${post.authorId}`)} className="text-xs font-medium text-primary hover:underline">{post.author}</button>
                  </div>
                )}
                <Card className="overflow-hidden border-l-4 border-l-primary/30" hover={false}>
                  <div className="p-4 flex items-center gap-3">
                    <button onClick={() => navigate(`/profile/${post.authorId}`)} className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 hover:ring-2 hover:ring-ring transition-all">{post.avatar}</button>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{post.author}</p>
                      <p className="text-xs text-muted-foreground truncate">{post.handle} · {post.time}{post.pet ? ` · ${post.pet}` : ""}</p>
                    </div>
                  </div>
                  <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.content}</p>
                  {post.images && post.images.length > 0 && (
                    <div className={`grid ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1 px-1`}>
                      {post.images.map((img, i) => <ImageWithFallback key={i} src={img} alt="post" className={`w-full ${post.images!.length === 1 ? "h-72" : "h-48"} object-cover rounded-lg`} />)}
                    </div>
                  )}
                  <div className="flex items-center gap-1 p-2 border-t border-border">
                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground"><Heart size={17} /> {post.likes}</span>
                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground"><MessageCircle size={17} /> {post.comments.length}</span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
