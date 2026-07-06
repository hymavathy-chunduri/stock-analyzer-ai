export interface YearData {
  year: string;
  revenue: number; // in Cr
  netProfit: number; // in Cr
  eps: number; // in Rs
  borrowings: number; // in Cr
  debtToEquity: number;
  interestCoverage: number;
  operatingCashFlow: number; // in Cr
  freeCashFlow: number; // in Cr
  roe: number; // %
  roce: number; // %
  roa: number; // %
  opm: number; // %
  npm: number; // %
}

export interface QuarterData {
  quarter: string;
  sales: number; // in Cr
  netProfit: number; // in Cr
}

export interface StockData {
  name: string;
  ticker: string;
  sector: string;
  industry: string;
  currentPrice: number;
  marketCap: number; // in Cr
  bookValue: number;
  dividendYield: number; // %
  dividendHistory: number[]; // last 5 years in %
  promoterHoldingCurrent: number; // %
  promoterHolding5YrTrend: number[]; // last 5 years in %
  promoterPledging: number; // %
  managementComments: string;
  governanceWarnings: string[];
  years: YearData[];
  quarters: QuarterData[];
  industryPe: number;
  stockPe: number;
}

// Pre-defined high fidelity stock templates
const PREDEFINED_STOCKS: { [key: string]: StockData } = {
  "TATA MOTORS": {
    name: "Tata Motors Limited",
    ticker: "TATAMOTORS",
    sector: "Automobile",
    industry: "Passenger Cars & Utility Vehicles",
    currentPrice: 955.50,
    marketCap: 351420,
    bookValue: 245.20,
    dividendYield: 0.63,
    dividendHistory: [0.0, 0.0, 0.0, 0.2, 0.63],
    promoterHoldingCurrent: 46.36,
    promoterHolding5YrTrend: [46.39, 46.39, 46.39, 46.36, 46.36],
    promoterPledging: 0.0,
    managementComments: "Management expects strong demand in JLR (Jaguar Land Rover) with a focus on EV expansion and debt reduction. EV market share in India remains above 70%. Commercial vehicle segment is witnessing cyclical recovery.",
    governanceWarnings: [],
    industryPe: 19.8,
    stockPe: 16.4,
    years: [
      { year: "2022", revenue: 278454, netProfit: -11309, eps: -29.5, borrowings: 146449, debtToEquity: 1.85, interestCoverage: 1.2, operatingCashFlow: 14292, freeCashFlow: -4500, roe: -18.2, roce: 4.8, roa: -2.9, opm: 9.2, npm: -4.1 },
      { year: "2023", revenue: 345967, netProfit: 2414, eps: 6.3, borrowings: 134113, debtToEquity: 1.48, interestCoverage: 2.1, operatingCashFlow: 29450, freeCashFlow: 8200, roe: 4.5, roce: 9.1, roa: 0.8, opm: 11.4, npm: 0.7 },
      { year: "2024", revenue: 437917, netProfit: 31807, eps: 83.1, borrowings: 95400, debtToEquity: 0.85, interestCoverage: 4.9, operatingCashFlow: 48600, freeCashFlow: 22400, roe: 32.4, roce: 20.8, roa: 8.5, opm: 14.1, npm: 7.3 },
      { year: "2025", revenue: 472100, netProfit: 35400, eps: 92.4, borrowings: 71200, debtToEquity: 0.49, interestCoverage: 6.8, operatingCashFlow: 54100, freeCashFlow: 28900, roe: 28.1, roce: 24.3, roa: 9.2, opm: 14.8, npm: 7.5 },
      { year: "2026", revenue: 512400, netProfit: 39800, eps: 104.0, borrowings: 52000, debtToEquity: 0.31, interestCoverage: 8.5, operatingCashFlow: 61200, freeCashFlow: 35100, roe: 25.5, roce: 26.2, roa: 10.1, opm: 15.2, npm: 7.8 }
    ],
    quarters: [
      { quarter: "Q1 FY26", sales: 121800, netProfit: 9100 },
      { quarter: "Q2 FY26", sales: 125300, netProfit: 9600 },
      { quarter: "Q3 FY26", sales: 131500, netProfit: 10200 },
      { quarter: "Q4 FY26", sales: 133800, netProfit: 10900 }
    ]
  },
  "INFOSYS": {
    name: "Infosys Limited",
    ticker: "INFY",
    sector: "IT - Software",
    industry: "Computers - Software - Enterprise",
    currentPrice: 1540.20,
    marketCap: 639450,
    bookValue: 310.80,
    dividendYield: 2.92,
    dividendHistory: [2.1, 2.3, 2.5, 2.7, 2.92],
    promoterHoldingCurrent: 14.94,
    promoterHolding5YrTrend: [13.15, 13.12, 14.98, 14.94, 14.94],
    promoterPledging: 0.0,
    managementComments: "Management maintains positive medium-term outlook fueled by cloud transformation, AI integrations (Topaz), and large deal wins. Margins are guided in the 20-22% range despite global macro headwinds.",
    governanceWarnings: [],
    industryPe: 27.5,
    stockPe: 24.8,
    years: [
      { year: "2022", revenue: 121641, netProfit: 22110, eps: 52.5, borrowings: 5312, debtToEquity: 0.07, interestCoverage: 85.0, operatingCashFlow: 23145, freeCashFlow: 18900, roe: 29.1, roce: 37.2, roa: 21.3, opm: 23.5, npm: 18.2 },
      { year: "2023", revenue: 146767, netProfit: 24095, eps: 57.6, borrowings: 6100, debtToEquity: 0.08, interestCoverage: 91.0, operatingCashFlow: 24200, freeCashFlow: 19400, roe: 31.8, roce: 40.5, roa: 22.1, opm: 21.0, npm: 16.4 },
      { year: "2024", revenue: 153671, netProfit: 26233, eps: 63.2, borrowings: 5800, debtToEquity: 0.07, interestCoverage: 96.0, operatingCashFlow: 27800, freeCashFlow: 23100, roe: 30.5, roce: 39.1, roa: 21.8, opm: 20.7, npm: 17.1 },
      { year: "2025", revenue: 161200, netProfit: 27800, eps: 67.0, borrowings: 5200, debtToEquity: 0.06, interestCoverage: 105.0, operatingCashFlow: 29100, freeCashFlow: 24600, roe: 29.8, roce: 38.6, roa: 21.4, opm: 20.9, npm: 17.2 },
      { year: "2026", revenue: 171800, netProfit: 29900, eps: 72.1, borrowings: 4800, debtToEquity: 0.05, interestCoverage: 120.0, operatingCashFlow: 31500, freeCashFlow: 26800, roe: 30.1, roce: 39.2, roa: 22.0, opm: 21.2, npm: 17.4 }
    ],
    quarters: [
      { quarter: "Q1 FY26", sales: 41900, netProfit: 7150 },
      { quarter: "Q2 FY26", sales: 42600, netProfit: 7300 },
      { quarter: "Q3 FY26", sales: 43200, netProfit: 7550 },
      { quarter: "Q4 FY26", sales: 44100, netProfit: 7900 }
    ]
  },
  "RELIANCE": {
    name: "Reliance Industries Limited",
    ticker: "RELIANCE",
    sector: "Energy / Retail / Telecom",
    industry: "Refineries / Integrated Conglomerate",
    currentPrice: 2880.00,
    marketCap: 1948500,
    bookValue: 1140.00,
    dividendYield: 0.35,
    dividendHistory: [0.25, 0.28, 0.30, 0.32, 0.35],
    promoterHoldingCurrent: 50.39,
    promoterHolding5YrTrend: [50.12, 50.15, 50.17, 50.39, 50.39],
    promoterPledging: 0.0,
    managementComments: "Investments in 5G expansion under Jio, retail network additions, and New Energy Gigafactories in Jamnagar remain on track. Traditional Oil-to-Chemicals (O2C) segment continues to yield solid cash flows to fund high-growth consumer businesses.",
    governanceWarnings: ["SEBI query in past years regarding transaction structures, now resolved."],
    industryPe: 22.0,
    stockPe: 26.8,
    years: [
      { year: "2022", revenue: 699907, netProfit: 60705, eps: 89.8, borrowings: 266305, debtToEquity: 0.34, interestCoverage: 5.4, operatingCashFlow: 110654, freeCashFlow: -12000, roe: 8.5, roce: 9.2, roa: 4.8, opm: 13.9, npm: 8.7 },
      { year: "2023", revenue: 877835, netProfit: 66702, eps: 98.6, borrowings: 313936, debtToEquity: 0.38, interestCoverage: 4.8, operatingCashFlow: 115200, freeCashFlow: -8500, roe: 8.9, roce: 9.5, roa: 4.9, opm: 14.5, npm: 7.6 },
      { year: "2024", revenue: 914472, netProfit: 69621, eps: 102.9, borrowings: 295000, debtToEquity: 0.32, interestCoverage: 5.6, operatingCashFlow: 128900, freeCashFlow: 18000, roe: 9.1, roce: 10.2, roa: 5.2, opm: 15.2, npm: 7.6 },
      { year: "2025", revenue: 985600, netProfit: 74200, eps: 109.7, borrowings: 271000, debtToEquity: 0.28, interestCoverage: 6.2, operatingCashFlow: 141000, freeCashFlow: 38000, roe: 9.4, roce: 10.8, roa: 5.4, opm: 15.6, npm: 7.5 },
      { year: "2026", revenue: 1065000, netProfit: 81500, eps: 120.5, borrowings: 248000, debtToEquity: 0.24, interestCoverage: 7.1, operatingCashFlow: 158000, freeCashFlow: 54000, roe: 9.8, roce: 11.5, roa: 5.7, opm: 16.0, npm: 7.7 }
    ],
    quarters: [
      { quarter: "Q1 FY26", sales: 254000, netProfit: 19100 },
      { quarter: "Q2 FY26", sales: 261000, netProfit: 20050 },
      { quarter: "Q3 FY26", sales: 272000, netProfit: 20900 },
      { quarter: "Q4 FY26", sales: 278000, netProfit: 21450 }
    ]
  },
  "HDFC BANK": {
    name: "HDFC Bank Limited",
    ticker: "HDFCBANK",
    sector: "Banking - Private",
    industry: "Banks - Private Sector",
    currentPrice: 1620.40,
    marketCap: 1234500,
    bookValue: 645.10,
    dividendYield: 1.17,
    dividendHistory: [0.8, 1.0, 1.1, 1.15, 1.17],
    promoterHoldingCurrent: 0.0, // Formally post-merger has institutional ownership primary
    promoterHolding5YrTrend: [21.3, 21.0, 20.8, 0.0, 0.0],
    promoterPledging: 0.0,
    managementComments: "Following the historic merger with HDFC Limited, the bank is focusing on cross-selling mortgage products, deposit mobilization, and branch expansion. Net Interest Margins (NIMs) are expected to stabilize at 3.4-3.6%. Credit quality remains top-tier with Gross NPA under 1.3%.",
    governanceWarnings: [],
    industryPe: 16.2,
    stockPe: 18.5,
    years: [
      { year: "2022", revenue: 127990, netProfit: 36961, eps: 66.8, borrowings: 220000, debtToEquity: 7.2, interestCoverage: 2.2, operatingCashFlow: 42100, freeCashFlow: 35000, roe: 16.9, roce: 11.2, roa: 1.9, opm: 45.2, npm: 28.9 }, // Higher borrowings/D2E is standard for banks
      { year: "2023", revenue: 170750, netProfit: 44109, eps: 79.2, borrowings: 280000, debtToEquity: 7.5, interestCoverage: 2.1, operatingCashFlow: 49800, freeCashFlow: 41000, roe: 17.1, roce: 11.5, roa: 2.0, opm: 44.8, npm: 25.8 },
      { year: "2024", revenue: 285400, netProfit: 60810, eps: 80.1, borrowings: 680000, debtToEquity: 8.5, interestCoverage: 1.8, operatingCashFlow: 82100, freeCashFlow: 68000, roe: 16.2, roce: 9.8, roa: 1.8, opm: 43.1, npm: 21.3 }, // HDFC merger impact
      { year: "2025", revenue: 312000, netProfit: 66400, eps: 87.5, borrowings: 710000, debtToEquity: 8.1, interestCoverage: 1.9, operatingCashFlow: 89000, freeCashFlow: 74000, roe: 15.8, roce: 9.9, roa: 1.8, opm: 43.8, npm: 21.3 },
      { year: "2026", revenue: 341000, netProfit: 72800, eps: 95.9, borrowings: 740000, debtToEquity: 7.8, interestCoverage: 2.0, operatingCashFlow: 98000, freeCashFlow: 82000, roe: 16.1, roce: 10.2, roa: 1.9, opm: 44.2, npm: 21.4 }
    ],
    quarters: [
      { quarter: "Q1 FY26", sales: 81200, netProfit: 16800 },
      { quarter: "Q2 FY26", sales: 83500, netProfit: 17400 },
      { quarter: "Q3 FY26", sales: 86400, netProfit: 18100 },
      { quarter: "Q4 FY26", sales: 89900, netProfit: 20500 }
    ]
  },
  "TCS": {
    name: "Tata Consultancy Services Limited",
    ticker: "TCS",
    sector: "IT - Software",
    industry: "Computers - Software - Enterprise",
    currentPrice: 3820.00,
    marketCap: 1382400,
    bookValue: 275.50,
    dividendYield: 2.41,
    dividendHistory: [1.8, 2.0, 2.2, 2.3, 2.41],
    promoterHoldingCurrent: 72.41,
    promoterHolding5YrTrend: [72.05, 72.19, 72.30, 72.41, 72.41],
    promoterPledging: 0.45,
    managementComments: "Tata Consultancy Services sees robust pipeline in generative AI and cloud optimization solutions. Cognitive Business Operations and Enterprise Solutions continue to show high double-digit growth. Pledging remains negligible.",
    governanceWarnings: [],
    industryPe: 27.5,
    stockPe: 29.2,
    years: [
      { year: "2022", revenue: 191754, netProfit: 38327, eps: 104.3, borrowings: 7810, debtToEquity: 0.08, interestCoverage: 110.0, operatingCashFlow: 39949, freeCashFlow: 35100, roe: 43.1, roce: 52.8, roa: 28.5, opm: 25.3, npm: 20.0 },
      { year: "2023", revenue: 225458, netProfit: 42147, eps: 115.2, borrowings: 7500, debtToEquity: 0.07, interestCoverage: 125.0, operatingCashFlow: 41900, freeCashFlow: 37200, roe: 46.9, roce: 57.1, roa: 29.8, opm: 24.6, npm: 18.7 },
      { year: "2024", revenue: 240893, netProfit: 46100, eps: 127.1, borrowings: 6900, debtToEquity: 0.06, interestCoverage: 130.0, operatingCashFlow: 44300, freeCashFlow: 39800, roe: 45.2, roce: 56.4, roa: 29.2, opm: 24.8, npm: 19.1 },
      { year: "2025", revenue: 256800, netProfit: 49400, eps: 136.2, borrowings: 6100, debtToEquity: 0.05, interestCoverage: 142.0, operatingCashFlow: 48900, freeCashFlow: 44100, roe: 44.8, roce: 55.9, roa: 29.5, opm: 25.1, npm: 19.2 },
      { year: "2026", revenue: 273500, netProfit: 53100, eps: 146.4, borrowings: 5400, debtToEquity: 0.04, interestCoverage: 155.0, operatingCashFlow: 52800, freeCashFlow: 48000, roe: 45.1, roce: 56.5, roa: 29.9, opm: 25.4, npm: 19.4 }
    ],
    quarters: [
      { quarter: "Q1 FY26", sales: 66800, netProfit: 12600 },
      { quarter: "Q2 FY26", sales: 67900, netProfit: 12900 },
      { quarter: "Q3 FY26", sales: 68800, netProfit: 13350 },
      { quarter: "Q4 FY26", sales: 70000, netProfit: 14250 }
    ]
  }
};

// Generates dynamic but highly realistic data for any company name
export function getCompanyFinancialData(query: string): StockData {
  const normalized = query.trim().toUpperCase();

  // 1. Direct templates
  for (const key of Object.keys(PREDEFINED_STOCKS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return PREDEFINED_STOCKS[key];
    }
  }

  // 2. Classify based on query keywords or fallback to a standard industrial profile
  let sector = "Manufacturing & Engineering";
  let industry = "General Industrials";
  let priceBase = 450.00;
  let peBase = 18.5;
  let indPe = 19.5;
  let isIt = false;
  let isBank = false;
  let isAuto = false;
  let isPharma = false;

  if (normalized.includes("TECH") || normalized.includes("SOFT") || normalized.includes("INFY") || normalized.includes("MIND") || normalized.includes("WIPRO") || normalized.includes("COGNIZANT")) {
    sector = "IT - Software";
    industry = "Computers - Software - Enterprise";
    priceBase = 1200.00;
    peBase = 26.5;
    indPe = 25.0;
    isIt = true;
  } else if (normalized.includes("BANK") || normalized.includes("FIN") || normalized.includes("SBI") || normalized.includes("ICICI") || normalized.includes("AXIS") || normalized.includes("MUTHOOT")) {
    sector = "Banking - Financials";
    industry = "Banks - Private Sector";
    priceBase = 800.00;
    peBase = 15.2;
    indPe = 16.0;
    isBank = true;
  } else if (normalized.includes("MOTOR") || normalized.includes("AUTO") || normalized.includes("MARUTI") || normalized.includes("MAHINDRA") || normalized.includes("BAJAJ") || normalized.includes("HERO")) {
    sector = "Automobile";
    industry = "Passenger Cars & Two Wheelers";
    priceBase = 2200.00;
    peBase = 21.0;
    indPe = 20.0;
    isAuto = true;
  } else if (normalized.includes("PHARMA") || normalized.includes("DR") || normalized.includes("LAB") || normalized.includes("SUN") || normalized.includes("CIPLA") || normalized.includes("BIOCON")) {
    sector = "Pharmaceuticals";
    industry = "Formulations & API";
    priceBase = 980.00;
    peBase = 32.0;
    indPe = 28.5;
    isPharma = true;
  } else if (normalized.includes("POWER") || normalized.includes("ENERGY") || normalized.includes("OIL") || normalized.includes("GAS") || normalized.includes("NTPC") || normalized.includes("ADANI")) {
    sector = "Energy & Utilities";
    industry = "Power Generation & Distribution";
    priceBase = 350.00;
    peBase = 19.8;
    indPe = 17.5;
  }

  // Create hash code from company name to generate stable values for the same search query
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // Generate pseudo-random metrics based on hash
  const currentPrice = Number((priceBase + (hash % 1000) * 1.5).toFixed(2));
  const marketCap = (10000 + (hash % 500) * 800); // 10k to 410k Crores
  const bookValue = Number((currentPrice / (1.5 + (hash % 8) * 0.9)).toFixed(2));
  const dividendYield = Number((0.2 + (hash % 15) * 0.25).toFixed(2));
  const dividendHistory = Array.from({ length: 5 }, (_, i) => 
    Number(Math.max(0.1, dividendYield * (0.8 + i * 0.1) + ((hash + i) % 5) * 0.1).toFixed(2))
  );

  const promoterHoldingCurrent = Number((35 + (hash % 40)).toFixed(2));
  const promoterHolding5YrTrend = Array.from({ length: 5 }, (_, i) => 
    Number(Math.max(25, promoterHoldingCurrent - ((hash % 3) - 1) * (4 - i) * 0.3).toFixed(2))
  );
  
  // Promoter pledging
  const pledgingChoice = hash % 5;
  const promoterPledging = pledgingChoice === 0 ? Number((2 + (hash % 15)).toFixed(2)) : 0.0;

  const stockPe = Number((peBase + ((hash % 100) - 50) * 0.15).toFixed(2));
  
  // Set Sector-specific comments and warnings
  let managementComments = `Management of ${query} remains optimistic about the upcoming fiscal year. Capital expenditure of ₹${Math.floor(marketCap * 0.05)} Cr is planned for operational expansion. We expect raw material pricing pressures to ease, stabilizing margins.`;
  if (isIt) {
    managementComments = `Management of ${query} points to strong pipelines in digital cloud migrations and AI adoption. Attrition has cooled down to 12.5%. Long-term contracts from European and US banking clients provide high revenue visibility.`;
  } else if (isBank) {
    managementComments = `Management highlights robust retail loan growth of 16% YoY. Net Interest Margin (NIM) is maintained at a healthy position. High focus remains on digitizing customer acquisition and expanding rural branch footprint.`;
  }

  const governanceWarnings: string[] = [];
  if (hash % 11 === 0) {
    governanceWarnings.push("A minor delayed filing disclosure notice was reported to NSE in the previous financial year.");
  }
  if (promoterPledging > 10) {
    governanceWarnings.push("High level of promoter pledging detected. Pledged promoter holding exceeds 10%.");
  }

  // Generate Year-on-Year financial statements (5 years)
  // Let's decide growth rate based on hash: positive, moderate or declining
  const growthRate = 0.06 + (hash % 15) * 0.02; // 6% to 36% growth rate
  const margin = isIt ? 20 : isBank ? 22 : isPharma ? 18 : 12; // Base margin %
  
  const years: YearData[] = [];
  let baseSales = Math.floor(marketCap * (0.15 + (hash % 10) * 0.05)); // sales to market cap ratio
  let baseEquity = Math.floor(marketCap / (2 + (hash % 5) * 0.5));
  
  for (let i = 0; i < 5; i++) {
    const yr = (2022 + i).toString();
    const multiplier = Math.pow(1 + growthRate, i - 2); // centered around year 3 (2024)
    
    const revenue = Math.floor(baseSales * multiplier);
    
    // margins can fluctuate slightly
    const yearMargin = margin + ((hash + i) % 5 - 2) * 0.8;
    const netProfit = Math.floor(revenue * (yearMargin / 100));
    
    // EPS
    const totalShares = baseEquity / bookValue; // rough approximation
    const eps = Number((netProfit / totalShares).toFixed(2));
    
    // Borrowings
    let borrowings = 0;
    if (isBank) {
      borrowings = Math.floor(baseEquity * (6.5 + (hash % 3) * 0.5)); // Banks have high deposits/borrowings
    } else {
      const debtChoice = hash % 4;
      borrowings = debtChoice === 0 ? 0 : Math.floor(baseEquity * (0.1 + (hash % 12) * 0.1) * multiplier);
    }
    
    const debtToEquity = isBank 
      ? Number((borrowings / baseEquity).toFixed(2)) 
      : Number((borrowings / (baseEquity * multiplier)).toFixed(2));
      
    const interestCoverage = borrowings === 0 
      ? 999.0 
      : Number((netProfit * 2.5 / (borrowings * 0.08)).toFixed(1));

    const operatingCashFlow = Math.floor(netProfit * (1.0 + ((hash + i) % 3 - 1) * 0.12));
    const freeCashFlow = Math.floor(operatingCashFlow - (revenue * 0.04));

    // Return Ratios
    const roe = Number((netProfit / (baseEquity * multiplier) * 100).toFixed(1));
    const roce = Number(((netProfit + (borrowings * 0.06)) / ((baseEquity * multiplier) + borrowings) * 100).toFixed(1));
    const roa = Number((netProfit / (baseEquity * multiplier * 2) * 100).toFixed(1));

    years.push({
      year: yr,
      revenue,
      netProfit,
      eps,
      borrowings,
      debtToEquity,
      interestCoverage,
      operatingCashFlow,
      freeCashFlow,
      roe,
      roce,
      roa,
      opm: Number((yearMargin * 1.3).toFixed(1)),
      npm: Number(yearMargin.toFixed(1))
    });
  }

  // Quarterly Data (last 4 quarters)
  const quarters: QuarterData[] = [];
  const latestYearSales = years[4].revenue;
  const quarterlyBaseSales = latestYearSales / 4;
  const quarterlyBaseProfit = years[4].netProfit / 4;

  for (let q = 1; q <= 4; q++) {
    const salesMultiplier = 0.95 + (q * 0.03) + ((hash + q) % 4) * 0.01;
    quarters.push({
      quarter: `Q${q} FY26`,
      sales: Math.floor(quarterlyBaseSales * salesMultiplier),
      netProfit: Math.floor(quarterlyBaseProfit * (salesMultiplier + 0.02))
    });
  }

  return {
    name: query.endsWith("LTD") || query.endsWith("LIMITED") ? query : `${query} Limited`,
    ticker: normalized.replace(/\s+/g, ""),
    sector,
    industry,
    currentPrice,
    marketCap,
    bookValue,
    dividendYield,
    dividendHistory,
    promoterHoldingCurrent,
    promoterHolding5YrTrend,
    promoterPledging,
    managementComments,
    governanceWarnings,
    years,
    quarters,
    industryPe: indPe,
    stockPe
  };
}
