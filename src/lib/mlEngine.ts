import { UserInput, PredictionResult, EngineeredFeatures, Scheme } from './types';

const LR_WEIGHTS = {
  perCapitaIncome: -0.00008,
  landPerMember: -0.3,
  incomeExpenseRatio: -0.15,
  householdSize: 0.12,
  monthlyExpense: 0.0003,
  sectorRural: 0.4,
  educationLow: 0.3,
  educationMedium: 0.15,
  intercept: 1.2,
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function encodeEducation(level: string): number {
  return level === 'low' ? 0 : level === 'medium' ? 1 : 2;
}

function engineerFeatures(input: UserInput): EngineeredFeatures {
  const totalMonthlyExpense = input.monthlyElectricity + input.monthlyGas;
  return {
    perCapitaIncome: input.annualIncome / input.householdSize,
    landPerMember: input.landOwned / input.householdSize,
    incomeExpenseRatio: input.annualIncome / Math.max(totalMonthlyExpense * 12, 1),
    totalMonthlyExpense,
    educationEncoded: encodeEducation(input.educationLevel),
  };
}

function predictEligibility(input: UserInput, features: EngineeredFeatures) {
  const z =
    LR_WEIGHTS.intercept +
    LR_WEIGHTS.perCapitaIncome * features.perCapitaIncome +
    LR_WEIGHTS.landPerMember * features.landPerMember +
    LR_WEIGHTS.incomeExpenseRatio * features.incomeExpenseRatio +
    LR_WEIGHTS.householdSize * input.householdSize +
    LR_WEIGHTS.monthlyExpense * features.totalMonthlyExpense +
    (input.sector === 'rural' ? LR_WEIGHTS.sectorRural : 0) +
    (input.educationLevel === 'low' ? LR_WEIGHTS.educationLow : input.educationLevel === 'medium' ? LR_WEIGHTS.educationMedium : 0);

  const prob = sigmoid(z);
  const eligible = prob > 0.45 && input.annualIncome <= 300000;
  return { eligible, confidence: Math.round(prob * 100) };
}

function detectAnomaly(input: UserInput, features: EngineeredFeatures) {
  let score = 0;
  const flags: string[] = [];

  if (features.totalMonthlyExpense > 0.25 * (input.annualIncome / 12)) {
    score += 25;
    flags.push('Expenses unusually high relative to income');
  }
  if (input.landOwned > 5 && input.annualIncome < 100000) {
    score += 30;
    flags.push('High land ownership with very low reported income');
  }
  if (input.annualIncome < 50000 && features.totalMonthlyExpense > 5000) {
    score += 25;
    flags.push('Very low income but high utility expenses');
  }
  if (input.landOwned > 10) {
    score += 15;
    flags.push('Land ownership above typical beneficiary range');
  }
  if (features.perCapitaIncome < 5000 && input.landOwned > 3) {
    score += 20;
    flags.push('Income-land mismatch detected');
  }
  if (features.educationEncoded === 2 && input.annualIncome < 80000) {
    score += 20;
    flags.push('High education level with very low reported income');
  }

  const isoScore = Math.abs(
    Math.sin(input.annualIncome * 0.0001 + input.landOwned * 0.5 + features.totalMonthlyExpense * 0.01) * 15
  );
  score = Math.min(100, score + isoScore);

  return {
    fraudRiskScore: Math.round(score),
    anomalyStatus: (score > 45 ? 'suspicious' : 'normal') as 'normal' | 'suspicious',
    flags,
  };
}

function getPercentile(income: number): number {
  const thresholds: [number, number][] = [
    [50000, 15], [100000, 35], [150000, 50], [200000, 62],
    [300000, 75], [500000, 85], [800000, 92], [1200000, 96], [2000000, 99],
  ];
  for (const [threshold, pct] of thresholds) {
    if (income <= threshold) return pct;
  }
  return 99;
}

function recommendSchemes(input: UserInput, features: EngineeredFeatures): Scheme[] {
  const schemes: Scheme[] = [];

  // Extreme poor
  if (input.annualIncome <= 100000) {
    schemes.push({
      name: 'NFSA (National Food Security Act)',
      description: 'Subsidized food grains for low-income households',
      url: 'https://nfsa.gov.in/',
      category: 'Food Security',
    });
  }

  if (input.annualIncome <= 500000) {
    schemes.push({
      name: 'Ayushman Bharat (PM-JAY)',
      description: 'Free health insurance up to ₹5 lakh per family',
      url: 'https://pmjay.gov.in/',
      category: 'Healthcare',
    });
  }

  // Housing
  if (input.annualIncome <= 300000 && input.sector === 'urban') {
    schemes.push({ name: 'PMAY - Urban', description: 'Affordable housing for urban poor', url: 'https://pmaymis.gov.in/', category: 'Housing' });
  }
  if (input.annualIncome <= 300000 && input.sector === 'rural') {
    schemes.push({ name: 'PMAY - Gramin', description: 'Housing assistance for rural families', url: 'https://pmayg.nic.in/', category: 'Housing' });
  }

  // Farmers
  if (input.landOwned <= 2 && input.sector === 'rural') {
    schemes.push({ name: 'PM-Kisan', description: '₹6,000/year direct income support for small farmers', url: 'https://pmkisan.gov.in/', category: 'Agriculture' });
  }
  if (input.sector === 'rural' && input.landOwned > 0) {
    schemes.push({ name: 'Fasal Bima Yojana', description: 'Crop insurance for farmers against natural calamities', url: 'https://pmfby.gov.in/', category: 'Agriculture' });
    schemes.push({ name: 'Kisan Credit Card', description: 'Affordable credit for agricultural and allied activities', url: 'https://www.nabard.org/', category: 'Agriculture' });
  }

  // Urban schemes
  if (input.sector === 'urban') {
    schemes.push({ name: 'Skill India', description: 'Free skill training and certification for employment', url: 'https://www.skillindia.gov.in/', category: 'Employment' });
  }
  if (input.annualIncome <= 500000) {
    schemes.push({ name: 'MUDRA Loan (Shishu)', description: 'Collateral-free loans up to ₹50,000 for micro-enterprises', url: 'https://www.mudra.org.in/', category: 'Financial' });
  }

  // Rural employment
  if (input.annualIncome <= 100000 && input.sector === 'rural') {
    schemes.push({ name: 'MGNREGA', description: '100 days guaranteed employment for rural households', url: 'https://nrega.nic.in/', category: 'Employment' });
  }

  // Ujjwala for moderate
  if (input.annualIncome <= 200000) {
    schemes.push({ name: 'PM Ujjwala Yojana', description: 'Free LPG connections for below poverty line households', url: 'https://www.pmujjwalayojana.com/', category: 'Energy' });
  }

  // Low education
  if (input.educationLevel === 'low') {
    schemes.push({ name: 'Skill Training Programs', description: 'Free vocational training for skill development', url: 'https://www.skillindia.gov.in/', category: 'Education' });
  }

  return schemes;
}

function generateExplanations(input: UserInput, features: EngineeredFeatures, eligible: boolean): string[] {
  const reasons: string[] = [];

  if (eligible) {
    if (input.annualIncome <= 150000) reasons.push('Annual income falls within BPL threshold');
    else if (input.annualIncome <= 300000) reasons.push('Income is within the eligible range for welfare schemes');
    if (input.householdSize >= 4) reasons.push('Larger household size increases welfare need');
    if (features.landPerMember < 1) reasons.push('Low per-capita land ownership indicates economic vulnerability');
    if (input.sector === 'rural') reasons.push('Rural sector classification qualifies for additional schemes');
    if (input.educationLevel === 'low') reasons.push('Low education level indicates higher need for welfare support');
  } else {
    if (input.annualIncome > 300000) reasons.push('Income exceeds the policy limit of ₹3,00,000');
    if (features.perCapitaIncome > 100000) reasons.push('Per-capita income is above the eligibility threshold');
    if (input.landOwned > 5) reasons.push('Significant land ownership reduces welfare eligibility score');
    if (input.educationLevel === 'high') reasons.push('Higher education level reduces welfare priority score');
  }

  if (features.incomeExpenseRatio < 2) reasons.push('Income-to-expense ratio suggests financial stress');

  return reasons;
}

export function predict(input: UserInput): PredictionResult {
  const features = engineerFeatures(input);
  const { eligible, confidence } = predictEligibility(input, features);
  const { fraudRiskScore, anomalyStatus, flags } = detectAnomaly(input, features);
  const percentile = getPercentile(input.annualIncome);
  const schemes = recommendSchemes(input, features);
  const explanations = [...generateExplanations(input, features, eligible), ...flags];

  return { eligible, confidence, fraudRiskScore, anomalyStatus, percentile, schemes, explanations, features, input };
}

export const NATIONAL_INCOME_DISTRIBUTION = [
  { range: '0-50K', count: 15, midpoint: 25000 },
  { range: '50K-1L', count: 20, midpoint: 75000 },
  { range: '1L-1.5L', count: 15, midpoint: 125000 },
  { range: '1.5L-2L', count: 12, midpoint: 175000 },
  { range: '2L-3L', count: 13, midpoint: 250000 },
  { range: '3L-5L', count: 10, midpoint: 400000 },
  { range: '5L-8L', count: 7, midpoint: 650000 },
  { range: '8L-12L', count: 4, midpoint: 1000000 },
  { range: '12L+', count: 4, midpoint: 1600000 },
];

export const SCATTER_DATA = Array.from({ length: 80 }, (_, i) => ({
  land: Math.random() * 15,
  consumption: Math.random() * 8000 + 500,
  label: `Household ${i + 1}`,
}));
