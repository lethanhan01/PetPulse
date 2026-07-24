export type Role = "user" | "admin";
export type Plan = "Free" | "Premium";

export type HealthEntry = {
  id: string; date: string; weight: number;
  condition: "Tốt" | "Bình thường" | "Cần chú ý";
  nutrition: string; illness?: string; score: number;
};

export type CareEvent = {
  id: string; title: string; date: string; time: string;
  repeat: "Không lặp" | "Hằng ngày" | "Hằng tuần";
  type: string; done: boolean;
};

export type AIConsult = {
  id: string; date: string; petName: string; symptoms: string;
  severity: "Thấp" | "Trung bình" | "Cao";
  diseases: string[]; firstAid: string[]; vetAdvice: string;
};

export type Pet = {
  id: string; name: string; species: string; emoji: string; breed: string;
  gender: "Đực" | "Cái"; age: string; weight: string; color: string;
  microchip: string; image?: string; owner: string;
  health: HealthEntry[]; events: CareEvent[]; consults: AIConsult[];
  chips: string[];
};
