import type { MockAccount } from "./types";

const accountRows: Array<[string, string, "user" | "admin", "Freemium" | "Premium", "Active" | "Suspended"]> = [
  ["Nguyễn Văn An", "an@example.com", "user", "Premium", "Active"], ["Quản trị viên", "admin@pawpulse.vn", "admin", "Premium", "Active"],
  ["Trần Thu Hà", "ha@example.com", "user", "Freemium", "Active"], ["Lê Minh Quân", "quan@example.com", "user", "Premium", "Active"],
  ["Phạm Ngọc Linh", "linh@example.com", "user", "Freemium", "Suspended"], ["Đỗ Hải Yến", "yen@example.com", "user", "Premium", "Active"],
  ["Vũ Hoàng Nam", "nam.vu@example.com", "user", "Freemium", "Active"], ["Bùi Thanh Mai", "mai.bui@example.com", "user", "Premium", "Active"],
  ["Ngô Đức Minh", "minh.ngo@example.com", "user", "Freemium", "Active"], ["Hoàng Lan Anh", "lananh@example.com", "user", "Premium", "Active"],
  ["Đặng Quốc Bảo", "bao.dang@example.com", "user", "Freemium", "Active"], ["Võ Khánh Linh", "khanhlinh@example.com", "user", "Premium", "Active"],
  ["Lý Gia Hân", "gihan@example.com", "user", "Freemium", "Active"], ["Phan Nhật Hào", "nhathao@example.com", "user", "Premium", "Active"],
  ["Dương Tú Uyên", "tuyen.duong@example.com", "user", "Freemium", "Active"], ["Trương Minh Khang", "khang.truong@example.com", "user", "Premium", "Suspended"],
  ["Lâm Phương Thảo", "thao.lam@example.com", "user", "Freemium", "Active"], ["Cao Quốc Việt", "viet.cao@example.com", "user", "Premium", "Active"],
  ["Đinh Bảo Trâm", "tram.dinh@example.com", "user", "Freemium", "Active"], ["Mai Đức Long", "long.mai@example.com", "user", "Premium", "Active"],
  ["Nguyễn Khánh Vy", "vy.nguyen@example.com", "user", "Freemium", "Active"], ["Trần Gia Bảo", "giabao.tran@example.com", "user", "Premium", "Active"],
  ["Lê Thu Trang", "trang.le@example.com", "user", "Freemium", "Active"], ["Phạm Hải Đăng", "dang.pham@example.com", "user", "Premium", "Active"],
  ["Đỗ Mỹ Duyên", "duyen.do@example.com", "user", "Freemium", "Active"], ["Vũ Thanh Tùng", "tung.vu@example.com", "user", "Premium", "Active"],
  ["Bùi Minh Châu", "chau.bui@example.com", "user", "Freemium", "Active"], ["Ngô Hải Yến", "yen.ngo@example.com", "user", "Premium", "Active"],
  ["Hoàng Bích Ngọc", "ngoc.hoang@example.com", "user", "Freemium", "Suspended"], ["Võ Trọng Nhân", "nhan.vo@example.com", "user", "Premium", "Active"],
  ["Lý Thanh Hương", "huong.ly@example.com", "user", "Freemium", "Active"], ["Phan Quốc Khải", "khai.phan@example.com", "user", "Premium", "Active"],
  ["Dương Mỹ Linh", "linh.duong@example.com", "user", "Freemium", "Active"], ["Trương Anh Tuấn", "tuan.truong@example.com", "user", "Premium", "Active"],
  ["Lâm Tuyết Nhi", "nhi.lam@example.com", "user", "Freemium", "Active"], ["Cao Đức Thịnh", "thinh.cao@example.com", "user", "Premium", "Active"],
  ["Đinh Kim Anh", "kimanh.dinh@example.com", "user", "Freemium", "Active"], ["Mai Thanh Phúc", "phuc.mai@example.com", "user", "Premium", "Active"],
  ["Nguyễn Diễm My", "diemmy@example.com", "user", "Freemium", "Active"], ["Trần Quang Huy", "huy.tran@example.com", "user", "Premium", "Active"],
  ["Lê Bảo Ngân", "baongan.le@example.com", "user", "Freemium", "Active"], ["Phạm Anh Khoa", "khoa.pham@example.com", "user", "Premium", "Suspended"],
  ["Đỗ Thảo Vy", "thaovy.do@example.com", "user", "Freemium", "Active"], ["Vũ Nhật Nam", "nhatnam.vu@example.com", "user", "Premium", "Active"],
  ["Bùi Hồng Nhung", "hongnhung.bui@example.com", "user", "Freemium", "Active"], ["Ngô Khánh An", "khanhan.ngo@example.com", "user", "Premium", "Active"],
  ["Hoàng Tuệ Nhi", "tuenhi.hoang@example.com", "user", "Freemium", "Active"], ["Võ Minh Đức", "minhduc.vo@example.com", "user", "Premium", "Active"],
  ["Lý Gia Linh", "gialinh.ly@example.com", "user", "Freemium", "Active"], ["Phan Hải Nam", "hainam.phan@example.com", "user", "Premium", "Active"],
];

export const MOCK_ACCOUNTS: MockAccount[] = accountRows.map(([name, email, role, plan, status], index) => ({
  id: `U-${String(1001 + index).padStart(4, "0")}`, name, email, password: "paw123", role, plan, status,
  phone: `090${String(1234567 + index).padStart(7, "0")}`, birthDate: `199${index % 10}-0${(index % 8) + 1}-12`, city: index % 2 ? "Hà Nội" : "TP. Hồ Chí Minh", gender: index % 3 === 0 ? "Nam" : "Nữ", joined: `202${index % 3 + 3}-${String(index % 12 + 1).padStart(2, "0")}-12`, avatar: name.split(" ").slice(-2).map(part => part[0]).join(""),
}));

export const DEMO_USER_ACCOUNT_ID = "U-1001";
export const DEMO_ADMIN_ACCOUNT_ID = "U-1002";
