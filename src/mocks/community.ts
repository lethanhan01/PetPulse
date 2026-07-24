import { MOCK_ACCOUNTS } from "./accounts";
import type { CommunityPost, ModerationStatus } from "./types";

const captions = [
  "Bé nhà mình vừa hoàn thành mũi vaccine cuối cùng! Health Score tăng rõ rệt 🎉",
  "Có ai có mẹo giúp bé giảm cân healthy không ạ? Mình đang thử tăng vận động mỗi ngày.",
  "Dùng Health Timeline giúp mình nhận ra thay đổi nhỏ của bé sớm hơn rất nhiều. 🐾",
  "Chia sẻ một buổi đi dạo thật vui của hai đứa mình cuối tuần này!",
  "Mới đổi sang chế độ ăn cân bằng, bé hợp tác và khỏe hơn hẳn.",
  "Nhắc lịch tiêm phòng cực tiện, mình không còn quên lịch khám định kỳ nữa!",
];
const photos = [
  "https://images.unsplash.com/photo-1537204696486-967f1b7198c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1624956578877-4948166c5dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
];
const statuses: ModerationStatus[] = [...Array<ModerationStatus>(36).fill("approved"), ...Array<ModerationStatus>(18).fill("pending"), ...Array<ModerationStatus>(6).fill("rejected")];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = Array.from({ length: 60 }, (_, index) => {
  const author = MOCK_ACCOUNTS[(index + 2) % MOCK_ACCOUNTS.length];
  return {
    id: `POST-${String(index + 1).padStart(3, "0")}`, authorId: author.id, author: author.name,
    handle: `@${author.email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase()}`, avatar: author.name.split(" ").slice(-2).map(part => part[0]).join(""),
    time: index < 3 ? `${index + 2} giờ trước` : `${Math.floor(index / 3)} ngày trước`, pet: `${["Bơ", "Miu", "Cookie", "Bông", "Đậu"][index % 5]} ${index % 2 ? "🐈" : "🐕"}`,
    content: captions[index % captions.length], image: index % 4 === 3 ? undefined : photos[index % photos.length], likes: 12 + (index * 17) % 580,
    comments: index % 5 === 0 ? [] : [
      { id: `COMMENT-${index + 1}-1`, authorId: "U-1001", author: "Nguyễn Văn An", content: "Bé đáng yêu quá! 🥰", time: "1 giờ trước" },
      { id: `COMMENT-${index + 1}-2`, authorId: "U-1006", author: "Đỗ Hải Yến", content: "Chúc bé luôn khỏe mạnh nhé 🐾", time: "30 phút trước" },
    ], status: statuses[index],
  };
});

export const PUBLIC_COMMUNITY_POSTS = MOCK_COMMUNITY_POSTS.filter(post => post.status === "approved");
