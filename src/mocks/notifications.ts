import type { Notification } from "./types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "N-01", title: "Nhắc lịch: Uống thuốc giun cho Mochi", subtitle: "Hôm nay 08:00", kind: "event", read: false, link: "/pets" },
  { id: "N-04", title: "Khám định kỳ cho Bắp sắp đến hạn", subtitle: "Ngày mai 14:30", kind: "event", read: false, link: "/pets" },
];

export const MOCK_ADMIN_NOTIFICATIONS: Notification[] = [
  { id: "AN-01", title: "Có bài viết mới cần kiểm duyệt", subtitle: "5 phút trước", kind: "moderation", read: false, link: "/admin/moderation" },
  { id: "AN-02", title: "Người dùng mới đăng ký: Trần Thị B", subtitle: "1 giờ trước", kind: "event", read: false, link: "/admin/users" },
  { id: "AN-03", title: "Doanh thu Premium tăng 15% so với tháng trước", subtitle: "Hôm qua", kind: "health", read: true, link: "/admin" },
  { id: "AN-04", title: "Yêu cầu hỗ trợ từ Nguyễn Văn A", subtitle: "Hôm qua 15:30", kind: "event", read: false, link: "/admin/profile" },
  { id: "AN-05", title: "Báo cáo: 3 tài khoản vi phạm bị khóa", subtitle: "2 ngày trước", kind: "moderation", read: true, link: "/admin/users" },
  { id: "AN-06", title: "Hệ thống đã sao lưu dữ liệu thành công", subtitle: "3 ngày trước", kind: "health", read: true, link: "/admin" },
];
