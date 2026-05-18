export interface UserInput {
  name: string;
  householdSize: number;
  annualIncome: number;
  monthlyElectricity: number;
  monthlyGas: number;
  landOwned: number;
  sector: 'rural' | 'urban';
  educationLevel: 'low' | 'medium' | 'high';
}

export interface PredictionResult {
  eligible: boolean;
  confidence: number;
  fraudRiskScore: number;
  anomalyStatus: 'normal' | 'suspicious';
  percentile: number;
  schemes: Scheme[];
  explanations: string[];
  features: EngineeredFeatures;
  input: UserInput;
}

export interface EngineeredFeatures {
  perCapitaIncome: number;
  landPerMember: number;
  incomeExpenseRatio: number;
  totalMonthlyExpense: number;
  educationEncoded: number;
}

export interface Scheme {
  name: string;
  description: string;
  url: string;
  category: string;
}
