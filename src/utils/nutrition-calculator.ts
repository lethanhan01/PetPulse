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
          { name: "petDetail.nutrition.protein", value: 30 },
          { name: "petDetail.nutrition.fat", value: 20 },
          { name: "petDetail.nutrition.carbs", value: 40 },
          { name: "petDetail.nutrition.fiber", value: 10 },
        ],
        balance: [
          { subject: 'petDetail.nutrition.protein', A: 50, fullMark: 100 },
          { subject: 'petDetail.nutrition.fat', A: 50, fullMark: 100 },
          { subject: 'petDetail.nutrition.carbs', A: 50, fullMark: 100 },
          { subject: 'petDetail.nutrition.fiber', A: 50, fullMark: 100 },
          { subject: 'petDetail.nutrition.vitamins', A: 50, fullMark: 100 },
        ],
        score: 50,
        recommendation: "petDetail.nutrition.recommendation.default",
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

  let recommendation = "petDetail.nutrition.recommendation.good";
  if (nProtein < 50) recommendation = "petDetail.nutrition.recommendation.missingProtein";
  else if (nFiber < 40) recommendation = "petDetail.nutrition.recommendation.missingFiber";
  else if (nFat > 80) recommendation = "petDetail.nutrition.recommendation.highFat";
  else if (score > 80) recommendation = "petDetail.nutrition.recommendation.excellent";

  return {
    composition: [
      { name: "petDetail.nutrition.protein", value: protein },
      { name: "petDetail.nutrition.fat", value: fat },
      { name: "petDetail.nutrition.carbs", value: carbs },
      { name: "petDetail.nutrition.fiber", value: fiber },
    ].filter(item => item.value > 0),
    balance: [
      { subject: 'petDetail.nutrition.protein', A: nProtein, fullMark: 100 },
      { subject: 'petDetail.nutrition.fat', A: nFat, fullMark: 100 },
      { subject: 'petDetail.nutrition.carbs', A: nCarbs, fullMark: 100 },
      { subject: 'petDetail.nutrition.fiber', A: nFiber, fullMark: 100 },
      { subject: 'petDetail.nutrition.vitamins', A: nVitamins, fullMark: 100 },
    ],
    score: Math.min(score, 100),
    recommendation
  };
}
