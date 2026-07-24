import type { Subscription } from "./types";

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: "SUB-01", name: "Free", price: "0đ", period: "mãi mãi", features: ["3 thú cưng", "Health timeline cơ bản", "Lịch chăm sóc", "Cộng đồng thú cưng"], missing: ["AI Symptom Checker", "Không giới hạn pet", "Thống kê nâng cao"], subscribers: 8420, active: true, tagline: "Bắt đầu chăm sóc bé yêu miễn phí" },
  { id: "SUB-02", name: "Premium", price: "99.000đ", period: "mỗi tháng", features: ["Không giới hạn thú cưng", "AI Symptom Checker không giới hạn", "Health Score nâng cao", "Thống kê & báo cáo chi tiết", "Ưu tiên hỗ trợ 24/7", "Xuất hồ sơ PDF"], missing: [], subscribers: 2130, active: true, accent: true, tagline: "Mở khóa toàn bộ sức mạnh của PetPulse" },
  { id: "SUB-03", name: "Premium Năm", price: "990.000đ", period: "năm", features: ["Toàn bộ Premium", "Ưu đãi 2 tháng", "Báo cáo năm"], missing: [], subscribers: 640, active: true },
  { id: "SUB-04", name: "Family", price: "149.000đ/tháng", period: "mỗi tháng", features: ["5 thành viên", "Không giới hạn pet", "Chia sẻ hồ sơ"], missing: [], subscribers: 188, active: false },
  { id: "SUB-05", name: "Clinic", price: "499.000đ/tháng", period: "mỗi tháng", features: ["Quản lý phòng khám", "Báo cáo nâng cao"], missing: [], subscribers: 42, active: false },
];

export const PUBLIC_SUBSCRIPTIONS = MOCK_SUBSCRIPTIONS.filter(subscription => subscription.active);
