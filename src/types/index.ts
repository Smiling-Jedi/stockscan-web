export interface AnalysisRecord {
  id: string;
  stock: string;
  timestamp: number;
  result: AnalysisResult;
}

export interface AnalysisResult {
  step1: {
    summary: string;
    business: string;
    pricing: string;
    stickiness: string;
  };
  step2: {
    profit: { signal: string; logic: string };
    receivable: { signal: string; logic: string };
    cashflow: { signal: string; logic: string };
  };
  step3: {
    model: string;
    percentile: string;
    forecast: string;
    judgment: string;
  };
  step4: {
    trend: string;
    status: string;
    support: string;
    resistance: string;
  };
  step5: {
    fundamental: string;
    technical: string;
    conclusion: string;
  };
  step6: {
    logic: string;
    risk: string;
    signals: string[];
    advice: string;
  };
  rawText: string;
}
