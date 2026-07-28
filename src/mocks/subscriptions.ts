import type { Subscription } from "./types";

import { MOCK_ACCOUNTS } from "./accounts";

const FREE_COUNT = MOCK_ACCOUNTS.filter(a => a.role === "user" && a.plan === "Free").length;
const PREM_COUNT = MOCK_ACCOUNTS.filter(a => a.role === "user" && a.plan === "Premium").length;
const PREM_YEAR_COUNT = MOCK_ACCOUNTS.filter(a => a.role === "user" && a.plan === "Premium Năm").length;

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: "SUB-01", name: "Free", price: "0đ", period: "mãi mãi", features: ["3 thú cưng", "Health timeline cơ bản", "Lịch chăm sóc", "Cộng đồng thú cưng"], missing: ["AI Symptom Checker", "Không giới hạn pet", "Thống kê nâng cao"], subscribers: FREE_COUNT, active: true, tagline: "Bắt đầu chăm sóc bé yêu miễn phí" },
  { id: "SUB-02", name: "Premium", price: "99.000đ", period: "mỗi tháng", features: ["Không giới hạn thú cưng", "AI Symptom Checker không giới hạn", "Health Score nâng cao", "Thống kê & báo cáo chi tiết", "Ưu tiên hỗ trợ 24/7"], missing: [], subscribers: PREM_COUNT, active: true, accent: true, tagline: "Mở khóa toàn bộ sức mạnh của PetPulse" },
  { id: "SUB-03", name: "Premium Năm", price: "990.000đ", period: "năm", features: ["Toàn bộ Premium", "Ưu đãi 2 tháng", "Báo cáo năm", "Ưu tiên hỗ trợ 24/7", "Xuất hồ sơ PDF", "Health Score nâng cao"], missing: [], subscribers: PREM_YEAR_COUNT, active: true },
];

export const PUBLIC_SUBSCRIPTIONS = MOCK_SUBSCRIPTIONS.filter(subscription => subscription.active);
