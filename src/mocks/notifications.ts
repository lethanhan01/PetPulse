import type { Notification } from "./types";

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "N-01", title: "Nhắc lịch: Uống thuốc giun cho Mochi", subtitle: "Hôm nay 08:00", kind: "event", read: false },
  { id: "N-02", title: "Health Score của Luna tăng lên 95 điểm", subtitle: "2 giờ trước", kind: "health", read: false },
  { id: "N-03", title: "Vaccine dại của Mochi đã được ghi nhận", subtitle: "Hôm qua", kind: "vaccine", read: true },
  { id: "N-04", title: "Khám định kỳ cho Bắp sắp đến hạn", subtitle: "Ngày mai 14:30", kind: "event", read: false },
  { id: "N-05", title: "AI Checker đã lưu một tư vấn mới", subtitle: "3 ngày trước", kind: "health", read: true },
  { id: "N-06", title: "Nhắc lịch tiêm phòng cho Mít", subtitle: "28/07/2026", kind: "vaccine", read: true },
];
