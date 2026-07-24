import type { Notification } from "./types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "N-01", title: "Nhắc lịch: Uống thuốc giun cho Mochi", subtitle: "Hôm nay 08:00", kind: "event", read: false },
  { id: "N-02", title: "Health Score của Luna tăng lên 95 điểm", subtitle: "2 giờ trước", kind: "health", read: false },
  { id: "N-03", title: "Vaccine dại của Mochi đã được ghi nhận", subtitle: "Hôm qua", kind: "vaccine", read: true },
  { id: "N-04", title: "Khám định kỳ cho Bắp sắp đến hạn", subtitle: "Ngày mai 14:30", kind: "event", read: false },
  { id: "N-05", title: "AI Checker đã lưu một tư vấn mới", subtitle: "3 ngày trước", kind: "health", read: true },
  { id: "N-06", title: "Nhắc lịch tiêm phòng cho Mít", subtitle: "28/07/2026", kind: "vaccine", read: true },
];

export const MOCK_ADMIN_NOTIFICATIONS: Notification[] = [
  { id: "AN-01", title: "Có bài viết mới cần kiểm duyệt", subtitle: "5 phút trước", kind: "moderation", read: false },
  { id: "AN-02", title: "Người dùng mới đăng ký: Trần Thị B", subtitle: "1 giờ trước", kind: "event", read: false },
  { id: "AN-03", title: "Doanh thu Premium tăng 15% so với tháng trước", subtitle: "Hôm qua", kind: "health", read: true },
  { id: "AN-04", title: "Yêu cầu hỗ trợ từ Nguyễn Văn A", subtitle: "Hôm qua 15:30", kind: "event", read: false },
  { id: "AN-05", title: "Báo cáo: 3 tài khoản vi phạm bị khóa", subtitle: "2 ngày trước", kind: "moderation", read: true },
  { id: "AN-06", title: "Hệ thống đã sao lưu dữ liệu thành công", subtitle: "3 ngày trước", kind: "health", read: true },
];
