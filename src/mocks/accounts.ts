import type { MockAccount } from "./types";

const accountRows: Array<[string, string, "user" | "admin", "Free" | "Premium" | "Premium Năm", "Active" | "Suspended"]> = [
  ["Nguyễn Văn An", "an@example.com", "user", "Premium Năm", "Active"], ["Quản trị viên", "admin@petpulse.vn", "admin", "Premium", "Active"],
  ["Trần Thu Hà", "ha@example.com", "user", "Free", "Active"], ["Lê Minh Quân", "quan@example.com", "user", "Premium", "Active"],
  ["Phạm Ngọc Linh", "linh@example.com", "user", "Free", "Suspended"], ["Đỗ Hải Yến", "yen@example.com", "user", "Premium Năm", "Active"],
  ["Vũ Hoàng Nam", "nam.vu@example.com", "user", "Free", "Active"], ["Bùi Thanh Mai", "mai.bui@example.com", "user", "Premium", "Active"],
  ["Ngô Đức Minh", "minh.ngo@example.com", "user", "Free", "Active"], ["Hoàng Lan Anh", "lananh@example.com", "user", "Premium", "Active"],
  ["Đặng Quốc Bảo", "bao.dang@example.com", "user", "Free", "Active"], ["Võ Khánh Linh", "khanhlinh@example.com", "user", "Premium Năm", "Active"],
  ["Lý Gia Hân", "gihan@example.com", "user", "Free", "Active"], ["Phan Nhật Hào", "nhathao@example.com", "user", "Premium", "Active"],
  ["Dương Tú Uyên", "tuyen.duong@example.com", "user", "Free", "Active"], ["Trương Minh Khang", "khang.truong@example.com", "user", "Premium Năm", "Suspended"],
  ["Lâm Phương Thảo", "thao.lam@example.com", "user", "Free", "Active"], ["Cao Quốc Việt", "viet.cao@example.com", "user", "Premium", "Active"],
  ["Đinh Bảo Trâm", "tram.dinh@example.com", "user", "Free", "Active"], ["Mai Đức Long", "long.mai@example.com", "user", "Premium Năm", "Active"],
  ["Nguyễn Khánh Vy", "vy.nguyen@example.com", "user", "Free", "Active"], ["Trần Gia Bảo", "giabao.tran@example.com", "user", "Premium", "Active"],
  ["Lê Thu Trang", "trang.le@example.com", "user", "Free", "Active"], ["Phạm Hải Đăng", "dang.pham@example.com", "user", "Premium Năm", "Active"],
  ["Đỗ Mỹ Duyên", "duyen.do@example.com", "user", "Free", "Active"], ["Vũ Thanh Tùng", "tung.vu@example.com", "user", "Premium", "Active"],
  ["Bùi Minh Châu", "chau.bui@example.com", "user", "Free", "Active"], ["Ngô Hải Yến", "yen.ngo@example.com", "user", "Premium", "Active"],
  ["Hoàng Bích Ngọc", "ngoc.hoang@example.com", "user", "Free", "Suspended"], ["Võ Trọng Nhân", "nhan.vo@example.com", "user", "Premium Năm", "Active"],
  ["Lý Thanh Hương", "huong.ly@example.com", "user", "Free", "Active"], ["Phan Quốc Khải", "khai.phan@example.com", "user", "Premium", "Active"],
  ["Dương Mỹ Linh", "linh.duong@example.com", "user", "Free", "Active"], ["Trương Anh Tuấn", "tuan.truong@example.com", "user", "Premium", "Active"],
  ["Lâm Tuyết Nhi", "nhi.lam@example.com", "user", "Free", "Active"], ["Cao Đức Thịnh", "thinh.cao@example.com", "user", "Premium Năm", "Active"],
  ["Đinh Kim Anh", "kimanh.dinh@example.com", "user", "Free", "Active"], ["Mai Thanh Phúc", "phuc.mai@example.com", "user", "Premium", "Active"],
  ["Nguyễn Diễm My", "diemmy@example.com", "user", "Free", "Active"], ["Trần Quang Huy", "huy.tran@example.com", "user", "Premium", "Active"],
  ["Lê Bảo Ngân", "baongan.le@example.com", "user", "Free", "Active"], ["Phạm Anh Khoa", "khoa.pham@example.com", "user", "Premium Năm", "Suspended"],
  ["Đỗ Thảo Vy", "thaovy.do@example.com", "user", "Free", "Active"], ["Vũ Nhật Nam", "nhatnam.vu@example.com", "user", "Premium", "Active"],
  ["Bùi Hồng Nhung", "hongnhung.bui@example.com", "user", "Free", "Active"], ["Ngô Khánh An", "khanhan.ngo@example.com", "user", "Premium", "Active"],
  ["Hoàng Tuệ Nhi", "tuenhi.hoang@example.com", "user", "Free", "Active"], ["Võ Minh Đức", "minhduc.vo@example.com", "user", "Premium Năm", "Active"],
  ["Lý Gia Linh", "gialinh.ly@example.com", "user", "Free", "Active"], ["Phan Hải Nam", "hainam.phan@example.com", "user", "Premium", "Active"],
];

const repostMap: Record<string, string[]> = {
  "U-1001": ["POST-003", "POST-005", "POST-010"],
  "U-1006": ["POST-001", "POST-007"],
  "U-1009": ["POST-002", "POST-008", "POST-012"],
};

export const MOCK_ACCOUNTS: MockAccount[] = accountRows.map(([name, email, role, plan, status], index) => {
  const id = `U-${String(1001 + index).padStart(4, "0")}`;
  return {
    id, name, email, password: "paw123", role, plan, status,
    phone: `090${String(1234567 + index).padStart(7, "0")}`, birthDate: `199${index % 10}-0${(index % 8) + 1}-12`, city: index % 2 ? "Hà Nội" : "TP. Hồ Chí Minh", gender: index % 3 === 0 ? "Nam" : "Nữ", joined: `202${index % 3 + 3}-${String(index % 12 + 1).padStart(2, "0")}-12`, avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${email}`, reposts: repostMap[id] ?? [],
  };
});

export const DEMO_USER_ACCOUNT_ID = "U-1001";
export const DEMO_ADMIN_ACCOUNT_ID = "U-1002";
