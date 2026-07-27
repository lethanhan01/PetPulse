import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCommunity } from "@/stores/community.store";
import { Card, Btn, Badge, PageTitle } from "@/components/common/kit";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Pagination } from "@/components/Pagination/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { Check, X, Trash2 } from "lucide-react";
import { isImageUrl } from "@/services/user.service";

export function AdminModeration() {
  const { t } = useTranslation();
  const { posts, approvePost, rejectPost, deletePost } = useCommunity();
  
  const sorted = useMemo(() => {
    const order = { pending: 0, approved: 1, rejected: 2 };
    return [...posts].sort((a, b) => order[a.status] - order[b.status]);
  }, [posts]);
  
  const { items: visiblePosts, currentPage, totalPages, setPage } = usePagination(sorted);
  
  return (
    <div>
      <PageTitle title={t("admin.moderation.title")} subtitle={t("admin.moderation.subtitle")} />
      <div className="grid sm:grid-cols-2 gap-5">
        {visiblePosts.map(p => (
          <Card key={p.id} className="overflow-hidden" hover={false}>
            {p.images?.[0] && <ImageWithFallback src={p.images[0]} alt="post" className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                  {isImageUrl(p.avatar) ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : p.avatar}
                </div>
                <div className="flex-1"><p className="text-sm font-semibold text-foreground">{p.author}</p><p className="text-xs text-muted-foreground">{p.time}</p></div>
                {p.status === "approved" && <Badge v="success">{t("admin.moderation.status.approved")}</Badge>}
                {p.status === "rejected" && <Badge v="danger">{t("admin.moderation.status.rejected")}</Badge>}
                {p.status === "pending" && <Badge v="warning">{t("admin.moderation.status.pending")}</Badge>}
                {p.status !== "pending" && <button onClick={() => deletePost(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive/70 hover:text-destructive transition-colors" title={t("admin.moderation.deleteTooltip")}><Trash2 size={15} /></button>}
              </div>
              <p className="text-sm text-foreground mb-3">{p.content}</p>
              {p.status === "pending" && (
                <div className="flex gap-2">
                  <Btn size="sm" block icon={<Check size={15} />} onClick={() => approvePost(p.id)}>{t("admin.moderation.approveBtn")}</Btn>
                  <Btn size="sm" block variant="danger" icon={<X size={15} />} onClick={() => rejectPost(p.id)}>{t("admin.moderation.rejectBtn")}</Btn>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Pagination page={currentPage} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
