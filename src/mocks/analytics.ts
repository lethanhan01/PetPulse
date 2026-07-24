import type { AnalyticsSeries } from "./types";

export const MOCK_REVENUE: AnalyticsSeries = {
  "Tuần": [{ label: "T2", value: 12 }, { label: "T3", value: 15 }, { label: "T4", value: 13 }, { label: "T5", value: 18 }, { label: "T6", value: 21 }, { label: "T7", value: 16 }, { label: "CN", value: 20 }],
  "Tháng": [{ label: "T1", value: 42 }, { label: "T2", value: 55 }, { label: "T3", value: 61 }, { label: "T4", value: 58 }, { label: "T5", value: 72 }, { label: "T6", value: 89 }, { label: "T7", value: 96 }],
  "Quý": [{ label: "Q3/24", value: 108 }, { label: "Q4/24", value: 136 }, { label: "Q1/25", value: 164 }, { label: "Q2/25", value: 192 }, { label: "Q3/25", value: 226 }],
};
export const MOCK_AI_USAGE: AnalyticsSeries = {
  "Tuần": [{ label: "T2", value: 98 }, { label: "T3", value: 112 }, { label: "T4", value: 105 }, { label: "T5", value: 128 }, { label: "T6", value: 143 }, { label: "T7", value: 133 }, { label: "CN", value: 121 }],
  "Tháng": [{ label: "T1", value: 320 }, { label: "T2", value: 410 }, { label: "T3", value: 520 }, { label: "T4", value: 480 }, { label: "T5", value: 640 }, { label: "T6", value: 810 }, { label: "T7", value: 920 }],
  "Quý": [{ label: "Q3/24", value: 680 }, { label: "Q4/24", value: 1010 }, { label: "Q1/25", value: 1510 }, { label: "Q2/25", value: 2370 }, { label: "Q3/25", value: 2730 }],
};
