const API_BASE_URL = "http://localhost:5055/api";

export interface YearData {
  year: string;
  revenue: number;
  netProfit: number;
  eps: number;
  borrowings: number;
  debtToEquity: number;
  interestCoverage: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  roe: number;
  roce: number;
  roa: number;
  opm: number;
  npm: number;
}

export interface QuarterData {
  quarter: string;
  sales: number;
  netProfit: number;
}

export interface AnalysisData {
  metadata: {
    name: string;
    ticker: string;
    sector: string;
    industry: string;
    currentPrice: number;
    marketCap: number;
    bookValue: number;
    dividendYield: number;
    dividendHistory: number[];
    industryPe: number;
    screenerPath: string;
    dayHigh?: number;
    dayLow?: number;
    prevClose?: number;
  };
  metrics: {
    revenueGrowthStatus: string;
    revenueGrowthReason: string;
    profitGrowthStatus: string;
    profitGrowthReason: string;
    epsGrowthStatus: string;
    epsGrowthReason: string;
    debtStatus: string;
    debtReason: string;
    cashFlowStatus: string;
    cashFlowReason: string;
    roeStatus: string;
    roeReason: string;
    roceStatus: string;
    roceReason: string;
    peValuationStatus: string;
    peValuationReason: string;
    promoterStatus: string;
    promoterReason: string;
    dividendStatus: string;
    dividendReason: string;
    bookValueStatus: string;
    bookValueReason: string;
    salesCagr3Yr: number;
    salesCagr5Yr: number;
    profitCagr3Yr: number;
    profitCagr5Yr: number;
    quarterlyGrowthSales: number;
    quarterlyGrowthProfit: number;
    quarterlyGrowthReason: string;
    annualGrowthSales: number;
    annualGrowthProfit: number;
    annualGrowthReason: string;
    intrinsicValue: number;
    marginOfSafety: number;
    piotroskiScore: number;
    piotroskiReason: string;
    altmanZScore: number;
    altmanZStatus: string;
    altmanZReason: string;
    grahamNumber: number;
    grahamStatus: string;
    grahamReason: string;
    freeCashFlowCurrent: number;
    freeCashFlowReason: string;
    opMarginCurrent: number;
    opMarginReason: string;
    netMarginCurrent: number;
    netMarginReason: string;
    returnOnAssets: number;
    returnRatiosReason: string;
  };
  managementQuality: {
    promoterHoldingCurrent: number;
    promoterPledging: number;
    promoterHolding5YrTrend: number[];
    managementComments: string;
    governanceWarnings: string[];
  };
  riskAnalysis: {
    highDebtRisk: boolean;
    overvaluationRisk: boolean;
    decliningProfitRisk: boolean;
    decliningSalesRisk: boolean;
    cashFlowRisk: boolean;
    corporateGovernanceRisk: boolean;
    riskScore: number;
  };
  decision: {
    recommendation: "BUY" | "HOLD" | "SELL";
    confidenceScore: number;
    reasons: string[];
  };
  scorecard: {
    label: string;
    rating: "Excellent" | "Good" | "Average" | "Poor" | "Very Poor";
    status: string;
  }[];
  charts: {
    revenueAndProfit: { year: string; revenue: number; netProfit: number }[];
    eps: { year: string; eps: number }[];
    debt: { year: string; borrowings: number; debtToEquity: number }[];
    cashFlow: { year: string; operatingCashFlow: number; freeCashFlow: number }[];
    quarterly: { quarter: string; sales: number; netProfit: number }[];
    returnRatios: { year: string; roe: number; roce: number; roa: number }[];
  };
}

export async function fetchStockAnalysis(companyName: string): Promise<AnalysisData> {
  const url = `${API_BASE_URL}/analyze?companyName=${encodeURIComponent(companyName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to analyze the stock. Please try again.");
  }
  return response.json();
}

export interface SearchSuggestion {
  id: number;
  name: string;
  url: string;
}

export async function searchCompanies(q: string): Promise<SearchSuggestion[]> {
  const url = `${API_BASE_URL}/search?q=${encodeURIComponent(q)}`;
  const response = await fetch(url);
  if (!response.ok) return [];
  return response.json().catch(() => []);
}
