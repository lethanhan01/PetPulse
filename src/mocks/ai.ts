import type { AIConsult } from "@/types/app.types";

export const SYMPTOM_TAGS = ["Biếng ăn", "Nôn mửa", "Tiêu chảy", "Ho khan", "Sốt", "Ngứa/gãi nhiều", "Mệt mỏi", "Chảy nước mắt", "Khó thở", "Co giật", "Có máu", "Bỏ uống nước"];

export function getMockAnalysis(symptoms: string): Omit<AIConsult, "id" | "date" | "petName"> {
  const text = symptoms.toLowerCase();
  if (/sốt|nôn|co giật|khó thở|máu/.test(text)) return { symptoms, severity: "Cao", diseases: ["Nhiễm trùng cấp tính", "Rối loạn tiêu hóa nghiêm trọng"], firstAid: ["Giữ thú cưng ở nơi yên tĩnh", "Không tự ý dùng thuốc của người", "Chuẩn bị hồ sơ tiêm phòng"], vetAdvice: "Cần liên hệ bác sĩ thú y hoặc đưa thú cưng đến phòng khám ngay hôm nay." };
  if (/ho|tiêu chảy|biếng ăn|mệt/.test(text)) return { symptoms, severity: "Trung bình", diseases: ["Viêm đường hô hấp nhẹ", "Rối loạn tiêu hóa"], firstAid: ["Bổ sung nước sạch", "Giữ ấm và theo dõi ăn uống"], vetAdvice: "Nên khám thú y nếu dấu hiệu không cải thiện trong 24–48 giờ." };
  return { symptoms, severity: "Thấp", diseases: ["Kích ứng nhẹ", "Thay đổi sinh hoạt"], firstAid: ["Theo dõi thêm", "Duy trì chế độ ăn quen thuộc"], vetAdvice: "Theo dõi triệu chứng; đặt lịch khám nếu xuất hiện dấu hiệu bất thường khác." };
}
