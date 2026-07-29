import { MOCK_ACCOUNTS } from "./accounts";
import type { CommunityPost, CommunityStory, ModerationStatus } from "./types";

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
const communityAuthors = MOCK_ACCOUNTS.filter(account => account.role === "user");

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = Array.from({ length: 60 }, (_, index) => {
  const author = communityAuthors[(index + 2) % communityAuthors.length];
  const status = statuses[index];
  const isNotPublished = status === "pending" || status === "rejected";
  return {
    id: `POST-${String(index + 1).padStart(3, "0")}`, authorId: author.id, author: author.name,
    handle: `@${author.email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase()}`, avatar: author.avatar,
    time: isNotPublished ? (status === "rejected" ? "1 giờ trước" : "Vừa xong") : (index < 3 ? `${index + 2} giờ trước` : `${Math.floor(index / 3)} ngày trước`),
    pet: `${["Bơ", "Miu", "Cookie", "Bông", "Đậu"][index % 5]} ${index % 2 ? "🐈" : "🐕"}`,
    content: captions[index % captions.length], images: index % 4 === 3 ? undefined : [photos[index % photos.length]],
    likes: isNotPublished ? 0 : (12 + (index * 17) % 580),
    comments: isNotPublished ? [] : (index % 5 === 0 ? [] : [
      { id: `COMMENT-${index + 1}-1`, authorId: "U-1001", author: "Nguyễn Văn An", content: "Bé đáng yêu quá! 🥰", time: "1 giờ trước" },
      { id: `COMMENT-${index + 1}-2`, authorId: "U-1006", author: "Đỗ Hải Yến", content: "Chúc bé luôn khỏe mạnh nhé 🐾", time: "30 phút trước" },
    ]), status,
  };
});

export const PUBLIC_COMMUNITY_POSTS = MOCK_COMMUNITY_POSTS.filter(post => post.status === "approved");

const STORY_IMAGES = [
  "https://images.unsplash.com/photo-1544568100-847a948585b9?w=400",
  "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400",
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400",
  "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400",
  "https://images.unsplash.com/photo-1491604612772-6853927639ef?w=400",
  "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400",
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
];
const storyAuthors = MOCK_ACCOUNTS.filter(a => a.role === "user" && a.status === "Active").slice(0, 8);
export const MOCK_COMMUNITY_STORIES: CommunityStory[] = STORY_IMAGES.map((url, i) => ({
  id: `STORY-${String(i + 1).padStart(3, "0")}`,
  authorId: storyAuthors[i].id,
  mediaUrl: url,
  mediaType: "image",
  createdAt: `${i + 1} giờ trước`,
  reactions: {},
}));
