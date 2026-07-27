export interface NutritionAnalysis {
  composition: { name: string; value: number }[];
  balance: { subject: string; A: number; fullMark: number }[];
  score: number;
  recommendation: string;
}

export function analyzeNutrition(mealText: string): NutritionAnalysis {
  const text = (mealText || "").toLowerCase();
  
  let protein = 10;
  let fat = 10;
  let carbs = 10;
  let fiber = 10;
  let vitamins = 10;
  
  if (text.includes("gà") || text.includes("chicken")) protein += 40;
  if (text.includes("bò") || text.includes("beef")) { protein += 35; fat += 20; }
  if (text.includes("cá") || text.includes("fish") || text.includes("hải sản")) { protein += 30; fat += 10; vitamins += 15; }
  if (text.includes("cơm") || text.includes("rice")) carbs += 40;
  if (text.includes("rau") || text.includes("vegetable") || text.includes("củ")) { fiber += 30; vitamins += 30; }
  if (text.includes("hạt") || text.includes("kibble")) { protein += 25; carbs += 20; fat += 10; fiber += 10; vitamins += 20; }
  if (text.includes("pate")) { protein += 20; fat += 15; carbs += 5; vitamins += 10; }

  const total = protein + fat + carbs + fiber + vitamins;
  if (total === 50 && (!text || text === "cân bằng" || text === "tốt")) {
     // Default state if user didn't enter specific food
     return {
        composition: [
          { name: "Protein", value: 30 },
          { name: "Chất béo", value: 20 },
          { name: "Carbs", value: 40 },
          { name: "Chất xơ", value: 10 },
        ],
        balance: [
          { subject: 'Protein', A: 50, fullMark: 100 },
          { subject: 'Chất béo', A: 50, fullMark: 100 },
          { subject: 'Carbs', A: 50, fullMark: 100 },
          { subject: 'Chất xơ', A: 50, fullMark: 100 },
          { subject: 'Vitamin', A: 50, fullMark: 100 },
        ],
        score: 50,
        recommendation: "Vui lòng nhập chi tiết thành phần bữa ăn (vd: 100g thịt gà, cơm) để hệ thống phân tích dinh dưỡng chính xác hơn.",
     }
  }

  // Normalize to 100 for balance chart
  const maxStat = 80; // arbitrary max for normalization base
  const normalize = (val: number) => Math.min(Math.round((val / maxStat) * 100), 100);

  const nProtein = normalize(protein);
  const nFat = normalize(fat);
  const nCarbs = normalize(carbs);
  const nFiber = normalize(fiber);
  const nVitamins = normalize(vitamins);

  // Score calculation
  const score = Math.round((nProtein * 1.2 + nFat * 0.8 + nCarbs * 0.7 + nFiber * 1.1 + nVitamins * 1.2) / 5);

  let recommendation = "Bữa ăn có độ cân bằng khá tốt.";
  if (nProtein < 50) recommendation = "Bữa ăn đang thiếu Protein, hãy bổ sung thêm thịt hoặc cá.";
  else if (nFiber < 40) recommendation = "Bữa ăn thiếu chất xơ, hãy thêm rau củ để hỗ trợ tiêu hóa.";
  else if (nFat > 80) recommendation = "Lượng chất béo hơi cao, cân nhắc giảm bớt để tránh thừa cân.";
  else if (score > 80) recommendation = "Tuyệt vời! Bữa ăn rất giàu dinh dưỡng và cân bằng.";

  return {
    composition: [
      { name: "Protein", value: protein },
      { name: "Chất béo", value: fat },
      { name: "Carbs", value: carbs },
      { name: "Chất xơ", value: fiber },
    ].filter(item => item.value > 0),
    balance: [
      { subject: 'Protein', A: nProtein, fullMark: 100 },
      { subject: 'Chất béo', A: nFat, fullMark: 100 },
      { subject: 'Carbs', A: nCarbs, fullMark: 100 },
      { subject: 'Chất xơ', A: nFiber, fullMark: 100 },
      { subject: 'Vitamin', A: nVitamins, fullMark: 100 },
    ],
    score: Math.min(score, 100),
    recommendation
  };
}
