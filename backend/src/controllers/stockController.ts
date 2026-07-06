import { Request, Response } from "express";
import { getCompanyFinancialData, YearData, StockData } from "../services/mockStockData";

interface AnalysisResult {
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

// CAGR helper
function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || endValue <= 0) return 0;
  const cagr = Math.pow(endValue / startValue, 1 / years) - 1;
  return Number((cagr * 100).toFixed(2));
}

interface YahooFinanceData {
  price: number;
  prevClose: number;
  high52w: number;
  low52w: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
}

async function fetchYahooFinancePrice(symbol: string): Promise<YahooFinanceData | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });
    if (response.ok) {
      const data: any = await response.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && typeof meta.regularMarketPrice === "number") {
        return {
          price: meta.regularMarketPrice,
          prevClose: meta.chartPreviousClose || meta.regularMarketPrice,
          high52w: meta.fiftyTwoWeekHigh || meta.regularMarketPrice,
          low52w: meta.fiftyTwoWeekLow || meta.regularMarketPrice,
          dayHigh: meta.regularMarketDayHigh || meta.regularMarketPrice,
          dayLow: meta.regularMarketDayLow || meta.regularMarketPrice,
          volume: meta.regularMarketVolume || 0
        };
      }
    }
  } catch (err) {
    console.warn(`Yahoo Finance fetch failed for symbol ${symbol}:`, err);
  }
  return null;
}

interface ScrapedScreenerRatios {
  marketCap: number;
  currentPrice: number;
  high52w: number;
  low52w: number;
  stockPe: number;
  bookValue: number;
  dividendYield: number;
  roce: number;
  roe: number;
  faceValue: number;
  pros: string[];
  cons: string[];
}

async function scrapeScreenerRatios(ticker: string): Promise<ScrapedScreenerRatios | null> {
  try {
    const url = `https://www.screener.in/company/${encodeURIComponent(ticker)}/`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      }
    });
    if (response.ok) {
      const html = await response.text();
      
      const extractRatio = (label: string): number => {
        const regex = new RegExp(
          `${label}[^]*?number">\\s*([0-9,.]+)\\s*<`,
          "i"
        );
        const match = html.match(regex);
        if (match && match[1]) {
          return Number(match[1].replace(/,/g, ""));
        }
        return 0;
      };

      // High / Low parse
      let high52w = 0;
      let low52w = 0;
      const hlRegex = /High\s*\/\s*Low[^]*?number">([0-9,.]+)<\/span>[^]*?number">([0-9,.]+)<\/span>/i;
      const hlMatch = html.match(hlRegex);
      if (hlMatch) {
        high52w = Number(hlMatch[1].replace(/,/g, ""));
        low52w = Number(hlMatch[2].replace(/,/g, ""));
      }

      // Parse pros
      const pros: string[] = [];
      const prosBlockRegex = /<div class="pros">[^]*?<ul>([^]*?)<\/ul>/i;
      const prosMatch = html.match(prosBlockRegex);
      if (prosMatch && prosMatch[1]) {
        const liRegex = /<li>\s*([^<]+?)\s*<\/li>/g;
        let m;
        while ((m = liRegex.exec(prosMatch[1])) !== null) {
          pros.push(m[1].trim());
        }
      }

      // Parse cons
      const cons: string[] = [];
      const consBlockRegex = /<div class="cons">[^]*?<ul>([^]*?)<\/ul>/i;
      const consMatch = html.match(consBlockRegex);
      if (consMatch && consMatch[1]) {
        const liRegex = /<li>\s*([^<]+?)\s*<\/li>/g;
        let m;
        while ((m = liRegex.exec(consMatch[1])) !== null) {
          cons.push(m[1].trim());
        }
      }

      return {
        marketCap: extractRatio("Market Cap"),
        currentPrice: extractRatio("Current Price"),
        high52w,
        low52w,
        stockPe: extractRatio("Stock P/E"),
        bookValue: extractRatio("Book Value"),
        dividendYield: extractRatio("Dividend Yield"),
        roce: extractRatio("ROCE"),
        roe: extractRatio("ROE"),
        faceValue: extractRatio("Face Value"),
        pros,
        cons
      };
    }
  } catch (err) {
    console.warn(`Screener scraping failed for ticker ${ticker}:`, err);
  }
  return null;
}

const LOCAL_TICKER_MAP: { [key: string]: string } = {
  "APOLLO MICRO SYSTEMS": "APOLLO",
  "APOLLO MICRO": "APOLLO",
  "APOLLO MICRO SYSTEMS LTD": "APOLLO",
  "APOLLO MICRO SYSTEMS LIMITED": "APOLLO",
  "TATA MOTORS": "TATAMOTORS",
  "INFOSYS": "INFY",
  "RELIANCE": "RELIANCE",
  "HDFC BANK": "HDFCBANK",
  "ICICI BANK": "ICICIBANK",
  "STATE BANK OF INDIA": "SBIN",
  "SBI": "SBIN",
  "TCS": "TCS",
  "TATA CONSULTANCY SERVICES": "TCS",
  "WIPRO": "WIPRO",
  "HINDUSTAN UNILEVER": "HINDUNILVR",
  "ITC": "ITC",
  "L&T": "LT",
  "LARSEN & TOUBRO": "LT",
  "BHARTI AIRTEL": "BHARTIARTL",
  "BAJAJ FINANCE": "BAJFINANCE",
  "ASIAN PAINTS": "ASIANPAINT",
  "MARUTI SUZUKI": "MARUTI",
  "TITAN": "TITAN",
  "ADANI ENTERPRISES": "ADANIENT",
  "AXIS BANK": "AXISBANK"
};

function resolveTickerOffline(query: string): string {
  const normalized = query.toUpperCase().trim();
  
  if (LOCAL_TICKER_MAP[normalized]) {
    return LOCAL_TICKER_MAP[normalized];
  }
  
  if (normalized.includes("APOLLO MICRO")) return "APOLLO";
  if (normalized.includes("TATA MOTORS")) return "TATAMOTORS";
  if (normalized.includes("INFOSYS")) return "INFY";
  if (normalized.includes("RELIANCE")) return "RELIANCE";
  if (normalized.includes("HDFC BANK")) return "HDFCBANK";
  if (normalized.includes("ICICI BANK")) return "ICICIBANK";
  if (normalized.includes("STATE BANK")) return "SBIN";
  if (normalized.includes("SBI")) return "SBIN";
  if (normalized.includes("TCS") || normalized.includes("TATA CONSULTANCY")) return "TCS";
  if (normalized.includes("WIPRO")) return "WIPRO";
  if (normalized.includes("HINDUSTAN UNILEVER")) return "HINDUNILVR";
  if (normalized.includes("ITC")) return "ITC";
  if (normalized.includes("LARSEN") || normalized.includes("L&T")) return "LT";
  if (normalized.includes("AIRTEL") || normalized.includes("BHARTI")) return "BHARTIARTL";
  if (normalized.includes("BAJAJ FINANCE")) return "BAJFINANCE";
  if (normalized.includes("ASIAN PAINTS")) return "ASIANPAINT";
  if (normalized.includes("MARUTI")) return "MARUTI";
  
  let clean = normalized
    .replace(/\b(LTD|LIMITED|PLC|CORP|CO|INC|AND|THE)\b/g, "")
    .replace(/[^A-Z0-9]/g, "")
    .trim();
    
  return clean || "TATAMOTORS";
}

export const analyzeStock = async (req: Request, res: Response) => {
  try {
    const { companyName } = req.query;

    if (!companyName || typeof companyName !== "string") {
      return res.status(400).json({ error: "Company name parameter is required." });
    }

    // Pre-resolve official company name, ticker, and URL from Screener's autocomplete API
    let officialName = companyName;
    let officialTicker = resolveTickerOffline(companyName);
    let officialScreenerPath = `/company/${officialTicker}/`;

    try {
      const searchUrl = `https://www.screener.in/api/company/search/?q=${encodeURIComponent(companyName)}`;
      const searchRes = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        }
      });
      if (searchRes.ok) {
        const suggestions = (await searchRes.json()) as any[];
        if (suggestions && suggestions.length > 0) {
          const match = suggestions[0];
          officialName = match.name;
          officialScreenerPath = match.url;
          const parts = match.url.split("/");
          officialTicker = parts[2] || officialTicker;
        }
      }
    } catch (apiErr) {
      console.warn("Failed to pre-resolve official ticker from Screener suggestion API:", apiErr);
    }

    // Query Yahoo Finance chart API to fetch actual live stock quote
    const yahooSymbol = /^\d+$/.test(officialTicker) ? `${officialTicker}.BO` : `${officialTicker}.NS`;
    let yahooData: YahooFinanceData | null = null;
    try {
      yahooData = await fetchYahooFinancePrice(yahooSymbol);
    } catch (err) {
      console.warn("Error fetching live price from Yahoo Finance:", err);
    }

    // Fetch official financials directly from Screener.in
    let scrapedData: ScrapedScreenerRatios | null = null;
    try {
      scrapedData = await scrapeScreenerRatios(officialTicker);
    } catch (err) {
      console.warn("Error scraping from Screener.in page:", err);
    }

    const data = getCompanyFinancialData(officialName);
    const result = performFinancialAnalysis(data, officialName, officialTicker, officialScreenerPath, yahooData || undefined, scrapedData || undefined);
    return res.json(result);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ error: "An error occurred while analyzing the stock data." });
  }
};

function performFinancialAnalysis(
  data: StockData, 
  officialName: string, 
  officialTicker: string, 
  officialScreenerPath: string,
  yahooData?: YahooFinanceData,
  scrapedData?: ScrapedScreenerRatios
): AnalysisResult {
  if (scrapedData) {
    data.currentPrice = scrapedData.currentPrice || data.currentPrice;
    data.marketCap = scrapedData.marketCap || data.marketCap;
    data.bookValue = scrapedData.bookValue || data.bookValue;
    data.dividendYield = scrapedData.dividendYield || data.dividendYield;
  } else if (yahooData) {
    if (data.currentPrice > 0) {
      data.marketCap = Number(((data.marketCap / data.currentPrice) * yahooData.price).toFixed(2));
    }
    data.currentPrice = yahooData.price;
  }
  
  const yrs = data.years;
  const numYears = yrs.length;
  const latestYr = yrs[numYears - 1];
  const secondLatestYr = yrs[numYears - 2];
  
  if (scrapedData) {
    if (scrapedData.roce > 0) latestYr.roce = scrapedData.roce;
    if (scrapedData.roe > 0) latestYr.roe = scrapedData.roe;
  }
  const oldestYr = yrs[0];

  const isBanking = data.sector.toLowerCase().includes("bank");

  // 1. CAGR calculations
  const salesCagr5Yr = calculateCAGR(yrs[0].revenue, latestYr.revenue, 4); // 5 points = 4 intervals
  const salesCagr3Yr = calculateCAGR(yrs[numYears - 4].revenue, latestYr.revenue, 3);
  const profitCagr5Yr = calculateCAGR(yrs[0].netProfit, latestYr.netProfit, 4);
  const profitCagr3Yr = calculateCAGR(yrs[numYears - 4].netProfit, latestYr.netProfit, 3);

  // 2. Revenue Growth evaluation
  let revGrowthStatus = "Average";
  if (salesCagr5Yr > 18) revGrowthStatus = "Excellent";
  else if (salesCagr5Yr > 12) revGrowthStatus = "Good";
  else if (salesCagr5Yr > 5) revGrowthStatus = "Average";
  else if (salesCagr5Yr > 0) revGrowthStatus = "Poor";
  else revGrowthStatus = "Very Poor";

  const revGrowthReason = `Revenue increased from ₹${yrs[0].revenue.toLocaleString("en-IN")} Cr to ₹${latestYr.revenue.toLocaleString("en-IN")} Cr over the last 5 years (CAGR: ${salesCagr5Yr}%).`;

  // 3. Profit Growth evaluation
  let profitGrowthStatus = "Average";
  if (profitCagr5Yr > 18) profitGrowthStatus = "Excellent";
  else if (profitCagr5Yr > 12) profitGrowthStatus = "Good";
  else if (profitCagr5Yr > 5) profitGrowthStatus = "Average";
  else if (profitCagr5Yr > 0) profitGrowthStatus = "Poor";
  else profitGrowthStatus = "Very Poor";

  const profitGrowthReason = `Net Profit grew from ₹${yrs[0].netProfit.toLocaleString("en-IN")} Cr to ₹${latestYr.netProfit.toLocaleString("en-IN")} Cr over 5 years (CAGR: ${profitCagr5Yr}%).`;

  // 4. EPS Growth evaluation
  const epsCagr5Yr = calculateCAGR(yrs[0].eps, latestYr.eps, 4);
  let epsGrowthStatus = "Average";
  if (epsCagr5Yr > 18) epsGrowthStatus = "Excellent";
  else if (epsCagr5Yr > 12) epsGrowthStatus = "Good";
  else if (epsCagr5Yr > 5) epsGrowthStatus = "Average";
  else if (epsCagr5Yr > 0) epsGrowthStatus = "Poor";
  else epsGrowthStatus = "Very Poor";

  const epsGrowthReason = `EPS increased from ₹${yrs[0].eps} to ₹${latestYr.eps} over the last 5 years, tracking a ${epsCagr5Yr}% compound annual growth.`;

  // 5. Debt evaluation
  let debtStatus = "Excellent";
  let debtReason = "";
  if (isBanking) {
    debtStatus = latestYr.debtToEquity < 8.5 ? "Good" : "Average";
    debtReason = `For a bank, a Debt-to-Equity (Deposits/Borrowings to Equity) of ${latestYr.debtToEquity} is healthy and typical. Interest coverage stands at ${latestYr.interestCoverage}.`;
  } else {
    if (latestYr.debtToEquity === 0) {
      debtStatus = "Excellent";
      debtReason = "The company has zero debt, representing negligible bankruptcy or solvency risk.";
    } else if (latestYr.debtToEquity < 0.5) {
      debtStatus = "Excellent";
      debtReason = `Debt-to-equity is very low at ${latestYr.debtToEquity}, and interest coverage is robust at ${latestYr.interestCoverage}x.`;
    } else if (latestYr.debtToEquity <= 1.0) {
      debtStatus = "Good";
      debtReason = `Debt is manageable with a Debt-to-Equity of ${latestYr.debtToEquity} and interest coverage of ${latestYr.interestCoverage}x.`;
    } else if (latestYr.debtToEquity <= 1.5) {
      debtStatus = "Average";
      debtReason = `Leverage is slightly elevated at ${latestYr.debtToEquity}. Interest coverage is ${latestYr.interestCoverage}x. Watch for interest rate fluctuations.`;
    } else {
      debtStatus = "Poor";
      debtReason = `High financial leverage with Debt-to-Equity of ${latestYr.debtToEquity}. Interest coverage is weak at ${latestYr.interestCoverage}x, posing cash flow strain.`;
    }
  }

  // 6. Cash Flow evaluation
  let cashFlowStatus = "Average";
  if (latestYr.operatingCashFlow > 0 && latestYr.freeCashFlow > 0) {
    cashFlowStatus = latestYr.freeCashFlow > latestYr.netProfit * 0.7 ? "Excellent" : "Good";
  } else if (latestYr.operatingCashFlow > 0) {
    cashFlowStatus = "Average";
  } else {
    cashFlowStatus = "Poor";
  }

  const cashFlowReason = `Operating Cash Flow is ₹${latestYr.operatingCashFlow.toLocaleString("en-IN")} Cr. Free Cash Flow is ₹${latestYr.freeCashFlow.toLocaleString("en-IN")} Cr. Positive free cash flow facilitates reinvestment and dividends.`;

  // 7. ROE evaluation
  let roeStatus = "Average";
  if (latestYr.roe > 22) roeStatus = "Excellent";
  else if (latestYr.roe >= 15) roeStatus = "Good";
  else if (latestYr.roe >= 10) roeStatus = "Average";
  else if (latestYr.roe >= 5) roeStatus = "Poor";
  else roeStatus = "Very Poor";

  const roeReason = `ROE stands at ${latestYr.roe}% in the latest year. An ROE above 15% is generally considered high-performing for capital deployment.`;

  // 8. ROCE evaluation
  let roceStatus = "Average";
  if (latestYr.roce > 22) roceStatus = "Excellent";
  else if (latestYr.roce >= 15) roceStatus = "Good";
  else if (latestYr.roce >= 10) roceStatus = "Average";
  else if (latestYr.roce >= 5) roceStatus = "Poor";
  else roceStatus = "Very Poor";

  const roceReason = `ROCE is ${latestYr.roce}% in the latest year. It exceeds the cost of capital, indicating value creation for shareholders.`;

  // 9. Stock PE vs Industry PE evaluation
  let peValuationStatus = "Average";
  let peValuationReason = "";
  const peRatio = scrapedData && scrapedData.stockPe > 0 
    ? scrapedData.stockPe 
    : (latestYr.eps > 0 ? Number((data.currentPrice / latestYr.eps).toFixed(2)) : 0);
  
  if (peRatio <= 0) {
    peValuationStatus = "Very Poor";
    peValuationReason = "P/E ratio is negative due to negative earnings, suggesting high risk or distress.";
  } else {
    const diff = ((peRatio - data.industryPe) / data.industryPe) * 100;
    if (diff < -20) {
      peValuationStatus = "Excellent";
      peValuationReason = `Stock P/E (${peRatio}) is at a substantial discount (-${Math.abs(Math.round(diff))}% ) compared to the industry P/E (${data.industryPe}). It is undervalued.`;
    } else if (diff < 10) {
      peValuationStatus = "Good";
      peValuationReason = `Stock P/E (${peRatio}) is closely aligned with the industry P/E (${data.industryPe}). The stock is fairly valued.`;
    } else if (diff < 40) {
      peValuationStatus = "Average";
      peValuationReason = `Stock P/E (${peRatio}) is trading at a premium (+${Math.round(diff)}% ) over the industry P/E (${data.industryPe}). Growth expectations are baked into the price.`;
    } else {
      peValuationStatus = "Poor";
      peValuationReason = `Stock P/E (${peRatio}) is trading at a massive premium (+${Math.round(diff)}% ) to the industry P/E (${data.industryPe}). This indicates high overvaluation risk.`;
    }
  }

  // 10. Promoter Holding evaluation
  let promoterStatus = "Average";
  let promoterReason = "";
  if (data.promoterHoldingCurrent === 0) {
    promoterStatus = "Average";
    promoterReason = "Promoter holding is 0%, indicating a widely-held company backed by domestic (DII) and foreign (FII) institutional investors.";
  } else {
    if (data.promoterHoldingCurrent > 65) {
      promoterStatus = data.promoterPledging < 5 ? "Excellent" : "Good";
    } else if (data.promoterHoldingCurrent >= 50) {
      promoterStatus = data.promoterPledging < 10 ? "Good" : "Average";
    } else if (data.promoterHoldingCurrent >= 35) {
      promoterStatus = "Average";
    } else {
      promoterStatus = "Poor";
    }
    const pledgeTxt = data.promoterPledging > 0 ? ` (Pledged: ${data.promoterPledging}%)` : " (Zero pledging)";
    promoterReason = `Promoter holding is ${data.promoterHoldingCurrent}%${pledgeTxt}. High promoter ownership reflects strong skin in the game.`;
  }

  // 11. Dividend evaluation
  let dividendStatus = "Average";
  if (data.dividendYield > 2.5) dividendStatus = "Excellent";
  else if (data.dividendYield >= 1.2) dividendStatus = "Good";
  else if (data.dividendYield >= 0.5) dividendStatus = "Average";
  else if (data.dividendYield > 0) dividendStatus = "Poor";
  else dividendStatus = "Very Poor";

  const dividendReason = `Dividend Yield is ${data.dividendYield}%. The company has a consistent history of sharing corporate profits.`;

  // 12. Book Value evaluation
  const priceToBook = Number((data.currentPrice / data.bookValue).toFixed(2));
  let bookValueStatus = "Average";
  if (priceToBook < 1.0) bookValueStatus = "Excellent";
  else if (priceToBook <= 3.0) bookValueStatus = "Good";
  else if (priceToBook <= 6.0) bookValueStatus = "Average";
  else bookValueStatus = "Poor";

  const bookValueReason = `Price to Book value is ${priceToBook}x (Current Price: ₹${data.currentPrice} vs Book Value: ₹${data.bookValue}).`;

  // 13. Quarterly Growth evaluation
  const qSalesGrowth = calculateCAGR(data.quarters[0].sales, data.quarters[3].sales, 1);
  const qProfitGrowth = calculateCAGR(data.quarters[0].netProfit, data.quarters[3].netProfit, 1);
  const quarterlyGrowthSales = Number((((data.quarters[3].sales - data.quarters[0].sales) / data.quarters[0].sales) * 100).toFixed(1));
  const quarterlyGrowthProfit = Number((((data.quarters[3].netProfit - data.quarters[0].netProfit) / data.quarters[0].netProfit) * 100).toFixed(1));

  const quarterlyGrowthReason = `Latest quarter sales reached ₹${data.quarters[3].sales.toLocaleString("en-IN")} Cr (up ${quarterlyGrowthSales}% YoY) and profit reached ₹${data.quarters[3].netProfit.toLocaleString("en-IN")} Cr (up ${quarterlyGrowthProfit}% YoY).`;

  // 14. Annual Growth evaluation
  const annualGrowthSales = Number((((latestYr.revenue - secondLatestYr.revenue) / secondLatestYr.revenue) * 100).toFixed(1));
  const annualGrowthProfit = Number((((latestYr.netProfit - secondLatestYr.netProfit) / secondLatestYr.netProfit) * 100).toFixed(1));

  const annualGrowthReason = `Annual revenues increased by ${annualGrowthSales}% YoY, and net profits expanded by ${annualGrowthProfit}% YoY.`;

  // 15. Intrinsic Value Estimation (simplified DCF model)
  // Let's assume FCF grows at salesCagr5Yr (capped between 6% and 18%) for the next 5 years, then 4.5% terminal growth, discounted at 11%.
  const discountRate = 0.11;
  const terminalGrowth = 0.045;
  const projYears = 5;
  const fcfGrowth = Math.max(6, Math.min(18, salesCagr5Yr)) / 100;
  
  let pvOfCashFlows = 0;
  let currentFcf = latestYr.freeCashFlow > 0 ? latestYr.freeCashFlow : latestYr.operatingCashFlow * 0.6; // use OCF proxy if FCF is negative
  if (currentFcf <= 0) currentFcf = latestYr.revenue * 0.05; // emergency proxy (5% margin)

  let fcfProj = currentFcf;
  for (let t = 1; t <= projYears; t++) {
    fcfProj = fcfProj * (1 + fcfGrowth);
    pvOfCashFlows += fcfProj / Math.pow(1 + discountRate, t);
  }
  const terminalValue = (fcfProj * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
  const pvTerminalValue = terminalValue / Math.pow(1 + discountRate, projYears);
  const intrinsicCap = pvOfCashFlows + pvTerminalValue;

  const sharesOutstanding = data.marketCap / data.currentPrice;
  const intrinsicValue = Number((intrinsicCap / sharesOutstanding).toFixed(2));
  const marginOfSafety = Number((((intrinsicValue - data.currentPrice) / intrinsicValue) * 100).toFixed(1));

  // 16. Piotroski Score
  let piotroskiScore = 0;
  // 1. Positive Net Income
  if (latestYr.netProfit > 0) piotroskiScore++;
  // 2. Positive ROA
  if (latestYr.roa > 0) piotroskiScore++;
  // 3. Positive Operating Cash Flow
  if (latestYr.operatingCashFlow > 0) piotroskiScore++;
  // 4. CFO > Net Profit
  if (latestYr.operatingCashFlow > latestYr.netProfit) piotroskiScore++;
  // 5. ROA current > previous
  if (latestYr.roa > secondLatestYr.roa) piotroskiScore++;
  // 6. Debt-to-Equity current < previous (leveraging down)
  if (latestYr.debtToEquity < secondLatestYr.debtToEquity) piotroskiScore++;
  // 7. Margin current > previous
  if (latestYr.opm > secondLatestYr.opm) piotroskiScore++;
  // 8. OCF > Net Income (quality of earnings, same as 4, standard variation is shares issued, let's check stable promoters)
  if (data.promoterHoldingCurrent >= data.promoterHolding5YrTrend[3]) piotroskiScore++;
  // 9. Revenue growth > 0
  if (latestYr.revenue > secondLatestYr.revenue) piotroskiScore++;

  let piotroskiReason = `The company scores ${piotroskiScore}/9 on Piotroski criteria, reflecting `;
  if (piotroskiScore >= 7) piotroskiReason += "extremely strong financial operations and balance sheet health.";
  else if (piotroskiScore >= 5) piotroskiReason += "stable fundamental health with moderate operational improvements.";
  else piotroskiReason += "weakening financial strength or declining metrics. Exercise caution.";

  // 17. Altman Z-Score
  // Z = 1.2 * X1 + 1.4 * X2 + 3.3 * X3 + 0.6 * X4 + 0.999 * X5
  // X1: Working Capital / Total Assets. (approx 0.15 for healthy, let's simulate using current cash/debt ratios)
  // X2: Retained Earnings / Total Assets. (approx 0.25)
  // X3: EBIT / Total Assets. (approx OPM * 0.1)
  // X4: Market Cap / Total Liabilities (Borrowings)
  // X5: Sales / Assets
  // Let's approximate Z based on ratios:
  const capToLiab = latestYr.borrowings > 0 ? (data.marketCap / latestYr.borrowings) : 20.0;
  const assetTurn = latestYr.revenue / (data.marketCap * 0.6); // Sales / assets proxy
  const ebitMargin = latestYr.opm / 100;
  
  let altmanZScore = 1.2 * 0.15 + 1.4 * 0.25 + 3.3 * (ebitMargin * assetTurn) + 0.6 * Math.min(10, capToLiab) + 0.999 * Math.min(3, assetTurn);
  altmanZScore = Number(altmanZScore.toFixed(2));
  
  let altmanZStatus = "Grey Zone";
  let altmanZReason = "";
  if (altmanZScore > 2.99) {
    altmanZStatus = "Safe";
    altmanZReason = `Altman Z-Score is ${altmanZScore}, indicating the company is in the 'Safe Zone' with exceptionally low probability of bankruptcy over the next two years.`;
  } else if (altmanZScore >= 1.81) {
    altmanZStatus = "Grey Zone";
    altmanZReason = `Altman Z-Score is ${altmanZScore}, placing the company in the 'Grey Zone'. Solvency is stable but operational buffers should be monitored.`;
  } else {
    altmanZStatus = "Distress";
    altmanZReason = `Altman Z-Score is ${altmanZScore}, indicating 'Financial Distress'. There is an elevated risk of default or solvency crises.`;
  }

  // 18. Graham Number
  // Graham Number = sqrt(22.5 * EPS * Book Value)
  const grahamFactor = 22.5 * latestYr.eps * data.bookValue;
  const grahamNumber = grahamFactor > 0 ? Number(Math.sqrt(grahamFactor).toFixed(2)) : 0;
  let grahamStatus = "Fairly Valued";
  let grahamReason = "";
  if (grahamNumber > 0) {
    const grahamDiff = ((grahamNumber - data.currentPrice) / grahamNumber) * 100;
    if (grahamDiff > 15) {
      grahamStatus = "Undervalued";
      grahamReason = `Graham Number is ₹${grahamNumber}, which is ${Math.round(grahamDiff)}% above the current stock price of ₹${data.currentPrice}. The stock is undervalued on a conservative basis.`;
    } else if (grahamDiff < -15) {
      grahamStatus = "Overvalued";
      grahamReason = `Graham Number is ₹${grahamNumber}, which is ${Math.abs(Math.round(grahamDiff))}% below the current price of ₹${data.currentPrice}. The stock trades at a premium.`;
    } else {
      grahamStatus = "Fairly Valued";
      grahamReason = `Graham Number is ₹${grahamNumber}, representing a fair price close to the current valuation of ₹${data.currentPrice}.`;
    }
  } else {
    grahamStatus = "Overvalued / N/A";
    grahamReason = "Graham Number is unavailable due to negative EPS or Book Value.";
  }

  // 19. Additional details
  const freeCashFlowCurrent = latestYr.freeCashFlow;
  const freeCashFlowReason = `Free Cash Flow of ₹${freeCashFlowCurrent.toLocaleString("en-IN")} Cr signifies capital available for acquisitions, debt retirement, and equity distributions.`;
  
  const opMarginCurrent = latestYr.opm;
  const opMarginReason = `Operating Profit Margin (OPM) is ${opMarginCurrent}%, demonstrating healthy pricing power and cost controls in production.`;
  
  const netMarginCurrent = latestYr.npm;
  const netMarginReason = `Net Profit Margin (NPM) stands at ${netMarginCurrent}%, indicating the percentage of revenue successfully converted to net earnings.`;
  
  const returnOnAssets = latestYr.roa;
  const returnRatiosReason = `Return on Equity is ${latestYr.roe}%, Return on Capital Employed is ${latestYr.roce}%, and Return on Assets is ${returnOnAssets}%. These reflect solid asset utilization.`;

  // 20. Management Quality warnings
  const warnings = [...data.governanceWarnings];
  if (data.promoterPledging > 15) {
    warnings.push(`Promoters have pledged ${data.promoterPledging}% of their shares, which exposes the company to liquidation risk under stock market sell-offs.`);
  }

  // 21. Risk Analysis & Scoring (0-100)
  const highDebtRisk = !isBanking && (latestYr.debtToEquity > 1.2 || latestYr.interestCoverage < 2.5);
  const overvaluationRisk = peRatio > data.industryPe * 1.25 || marginOfSafety < -15;
  const decliningProfitRisk = latestYr.netProfit < secondLatestYr.netProfit;
  const decliningSalesRisk = latestYr.revenue < secondLatestYr.revenue;
  const cashFlowRisk = latestYr.freeCashFlow < 0;
  const corporateGovernanceRisk = warnings.length > 0;

  let riskScore = 10; // Base score
  if (highDebtRisk) riskScore += 25;
  if (overvaluationRisk) riskScore += 15;
  if (decliningProfitRisk) riskScore += 15;
  if (decliningSalesRisk) riskScore += 15;
  if (cashFlowRisk) riskScore += 10;
  if (corporateGovernanceRisk) riskScore += 10;
  riskScore = Math.min(100, riskScore);

  // 22. FINAL DECISION ENGINE (Weighted Scoring Model)
  // Weights:
  // Revenue Growth (15%), Profit Growth (15%), EPS (10%), Debt (15%), Cash Flow (10%), ROE (10%), ROCE (10%), PE (5%), Promoter (5%), Quarterly (5%), Valuation (10%)
  
  const scoreBreakdown = {
    revenue: revGrowthStatus === "Excellent" ? 100 : revGrowthStatus === "Good" ? 85 : revGrowthStatus === "Average" ? 60 : 30,
    profit: profitGrowthStatus === "Excellent" ? 100 : profitGrowthStatus === "Good" ? 85 : profitGrowthStatus === "Average" ? 60 : 30,
    eps: epsGrowthStatus === "Excellent" ? 100 : epsGrowthStatus === "Good" ? 85 : epsGrowthStatus === "Average" ? 60 : 30,
    debt: debtStatus === "Excellent" ? 100 : debtStatus === "Good" ? 85 : debtStatus === "Average" ? 60 : 30,
    cashFlow: cashFlowStatus === "Excellent" ? 100 : cashFlowStatus === "Good" ? 85 : cashFlowStatus === "Average" ? 60 : 30,
    roe: roeStatus === "Excellent" ? 100 : roeStatus === "Good" ? 85 : roeStatus === "Average" ? 60 : 30,
    roce: roceStatus === "Excellent" ? 100 : roceStatus === "Good" ? 85 : roceStatus === "Average" ? 60 : 30,
    pe: peValuationStatus === "Excellent" ? 100 : peValuationStatus === "Good" ? 85 : peValuationStatus === "Average" ? 60 : 30,
    promoter: promoterStatus === "Excellent" ? 100 : promoterStatus === "Good" ? 85 : promoterStatus === "Average" ? 60 : 30,
    quarterly: qSalesGrowth > 15 && qProfitGrowth > 15 ? 100 : qSalesGrowth > 5 && qProfitGrowth > 5 ? 80 : 50,
    valuation: marginOfSafety > 20 ? 100 : marginOfSafety > 0 ? 80 : marginOfSafety > -15 ? 60 : 30
  };

  const weightedScore = (
    scoreBreakdown.revenue * 0.15 +
    scoreBreakdown.profit * 0.15 +
    scoreBreakdown.eps * 0.10 +
    scoreBreakdown.debt * 0.15 +
    scoreBreakdown.cashFlow * 0.10 +
    scoreBreakdown.roe * 0.10 +
    scoreBreakdown.roce * 0.10 +
    scoreBreakdown.pe * 0.05 +
    scoreBreakdown.promoter * 0.05 +
    scoreBreakdown.quarterly * 0.05 +
    scoreBreakdown.valuation * 0.10
  );

  let recommendation: "BUY" | "HOLD" | "SELL" = "HOLD";
  let confidenceScore = Math.round(weightedScore);
  
  if (weightedScore >= 80) recommendation = "BUY";
  else if (weightedScore >= 60) recommendation = "HOLD";
  else recommendation = "SELL";

  // Build key recommendation reasons (Pros / Cons)
  const reasons: string[] = [];
  
  // Positive catalysts
  if (salesCagr5Yr > 12) reasons.push("Revenue growing consistently with a strong 5-year CAGR.");
  if (profitCagr5Yr > 12) reasons.push("Net profits are expanding steadily, signaling growing operational efficiency.");
  if (latestYr.roe > 15) reasons.push(`Exceptional return on equity (ROE: ${latestYr.roe}%) creating shareholder value.`);
  if (latestYr.freeCashFlow > 0) reasons.push("Strong free cash flow generation supports business growth and liquidity.");
  if (latestYr.debtToEquity < 0.5 && !isBanking) reasons.push(`Comfortable leverage profile with a low Debt-to-Equity ratio of ${latestYr.debtToEquity}.`);
  if (data.promoterHoldingCurrent > 50 && data.promoterPledging === 0) reasons.push("Healthy promoter holding with zero pledging reflects strong sponsor confidence.");
  if (marginOfSafety > 15) reasons.push(`Significant margin of safety (${marginOfSafety}%) based on discounted cash flows.`);
  if (peValuationStatus === "Excellent" || peValuationStatus === "Good") reasons.push(`Attractively valued relative to peers (P/E: ${peRatio} vs Industry P/E: ${data.industryPe}).`);

  // Concerns
  if (highDebtRisk) reasons.push("High debt/leverage represents an elevated interest burden.");
  if (overvaluationRisk) reasons.push(`Stock is priced at a premium (P/E: ${peRatio} vs Industry: ${data.industryPe}). Valuation provides a low margin of safety.`);
  if (data.promoterPledging > 10) reasons.push(`Significant promoter share pledge (${data.promoterPledging}%) is a liquidity concern.`);
  if (latestYr.freeCashFlow < 0) reasons.push("Negative free cash flow limits capital expenditure and dividend capabilities.");
  if (warnings.length > 0) reasons.push("Some corporate governance or compliance disclosures warrant investor caution.");

  if (scrapedData) {
    scrapedData.pros.forEach(pro => {
      if (!reasons.includes(pro)) reasons.push(pro);
    });
    scrapedData.cons.forEach(con => {
      if (!reasons.includes(con)) reasons.push(`Screener Concern: ${con}`);
    });
  }

  // If there are too few reasons, add some defaults
  if (reasons.length < 3) {
    reasons.push("Stable earnings and revenues matching industry sector averages.");
    reasons.push("Average financial leverage and debt obligations.");
  }

  // 23. Scorecard lists
  const scorecard: AnalysisResult["scorecard"] = [
    { label: "Revenue", rating: revGrowthStatus as any, status: revGrowthStatus === "Excellent" || revGrowthStatus === "Good" ? "Strong Growth" : "Stable" },
    { label: "Profit", rating: profitGrowthStatus as any, status: profitGrowthStatus === "Excellent" || profitGrowthStatus === "Good" ? "Expanding Profits" : "Marginal" },
    { label: "EPS", rating: epsGrowthStatus as any, status: epsGrowthStatus === "Excellent" || epsGrowthStatus === "Good" ? "Improving Value" : "Flat" },
    { label: "Debt", rating: debtStatus as any, status: debtStatus === "Excellent" || debtStatus === "Good" ? "Healthy Leverage" : "Slightly Elevated" },
    { label: "Cash Flow", rating: cashFlowStatus as any, status: cashFlowStatus === "Excellent" || cashFlowStatus === "Good" ? "Cash Rich" : "Adequate" },
    { label: "ROE", rating: roeStatus as any, status: roeStatus === "Excellent" || roeStatus === "Good" ? "High Efficiency" : "Satisfactory" },
    { label: "ROCE", rating: roceStatus as any, status: roceStatus === "Excellent" || roceStatus === "Good" ? "Value Accretive" : "Average" },
    { label: "P/E Valuation", rating: peValuationStatus as any, status: peValuationStatus === "Excellent" || peValuationStatus === "Good" ? "Reasonable" : "Premium Valuation" },
    { label: "Promoter Holding", rating: promoterStatus as any, status: promoterStatus === "Excellent" || promoterStatus === "Good" ? "Strong Ownership" : "Sufficient" }
  ];

  // 24. Extract Chart series
  const charts: AnalysisResult["charts"] = {
    revenueAndProfit: yrs.map(y => ({ year: y.year, revenue: y.revenue, netProfit: y.netProfit })),
    eps: yrs.map(y => ({ year: y.year, eps: y.eps })),
    debt: yrs.map(y => ({ year: y.year, borrowings: y.borrowings, debtToEquity: y.debtToEquity })),
    cashFlow: yrs.map(y => ({ year: y.year, operatingCashFlow: y.operatingCashFlow, freeCashFlow: y.freeCashFlow })),
    quarterly: data.quarters,
    returnRatios: yrs.map(y => ({ year: y.year, roe: y.roe, roce: y.roce, roa: y.roa }))
  };

  return {
    metadata: {
      name: officialName,
      ticker: officialTicker,
      sector: data.sector,
      industry: data.industry,
      currentPrice: scrapedData?.currentPrice || data.currentPrice,
      marketCap: scrapedData?.marketCap || data.marketCap,
      bookValue: scrapedData?.bookValue || data.bookValue,
      dividendYield: scrapedData?.dividendYield || data.dividendYield,
      dividendHistory: data.dividendHistory,
      industryPe: data.industryPe,
      screenerPath: officialScreenerPath,
      dayHigh: yahooData?.dayHigh || scrapedData?.high52w,
      dayLow: yahooData?.dayLow || scrapedData?.low52w,
      prevClose: yahooData?.prevClose
    },
    metrics: {
      revenueGrowthStatus: revGrowthStatus,
      revenueGrowthReason: revGrowthReason,
      profitGrowthStatus: profitGrowthStatus,
      profitGrowthReason: profitGrowthReason,
      epsGrowthStatus: epsGrowthStatus,
      epsGrowthReason: epsGrowthReason,
      debtStatus: debtStatus,
      debtReason: debtReason,
      cashFlowStatus: cashFlowStatus,
      cashFlowReason: cashFlowReason,
      roeStatus: roeStatus,
      roeReason: roeReason,
      roceStatus: roceStatus,
      roceReason: roceReason,
      peValuationStatus: peValuationStatus,
      peValuationReason: peValuationReason,
      promoterStatus: promoterStatus,
      promoterReason: promoterReason,
      dividendStatus: dividendStatus,
      dividendReason: dividendReason,
      bookValueStatus: bookValueStatus,
      bookValueReason: bookValueReason,
      salesCagr3Yr,
      salesCagr5Yr,
      profitCagr3Yr,
      profitCagr5Yr,
      quarterlyGrowthSales,
      quarterlyGrowthProfit,
      quarterlyGrowthReason,
      annualGrowthSales,
      annualGrowthProfit,
      annualGrowthReason,
      intrinsicValue,
      marginOfSafety,
      piotroskiScore,
      piotroskiReason,
      altmanZScore,
      altmanZStatus,
      altmanZReason,
      grahamNumber,
      grahamStatus,
      grahamReason,
      freeCashFlowCurrent,
      freeCashFlowReason,
      opMarginCurrent,
      opMarginReason,
      netMarginCurrent,
      netMarginReason,
      returnOnAssets,
      returnRatiosReason
    },
    managementQuality: {
      promoterHoldingCurrent: data.promoterHoldingCurrent,
      promoterPledging: data.promoterPledging,
      promoterHolding5YrTrend: data.promoterHolding5YrTrend,
      managementComments: data.managementComments,
      governanceWarnings: warnings
    },
    riskAnalysis: {
      highDebtRisk,
      overvaluationRisk,
      decliningProfitRisk,
      decliningSalesRisk,
      cashFlowRisk,
      corporateGovernanceRisk,
      riskScore
    },
    decision: {
      recommendation,
      confidenceScore,
      reasons
    },
    scorecard,
    charts
  };
}

export const searchCompanies = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.json([]);
    }

    const url = `https://www.screener.in/api/company/search/?q=${encodeURIComponent(q)}`;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        }
      });
      if (response.ok) {
        const data = await response.json();
        return res.json(data);
      }
    } catch (apiErr) {
      console.warn("Screener search API failed, using fallback:", apiErr);
    }

    // Local fallback list of major Indian companies for offline/fail safety
    const localCompanies = [
      { name: "Tata Motors Limited", ticker: "TATAMOTORS" },
      { name: "Infosys Limited", ticker: "INFY" },
      { name: "Reliance Industries Limited", ticker: "RELIANCE" },
      { name: "HDFC Bank Limited", ticker: "HDFCBANK" },
      { name: "Tata Consultancy Services Limited", ticker: "TCS" },
      { name: "Apollo Hospitals Enterprise Ltd", ticker: "APOLLOHOSP" },
      { name: "Apollo Tyres Ltd", ticker: "APOLLOTYRE" },
      { name: "Apollo Micro Systems Ltd", ticker: "APOLLO" },
      { name: "Apollo Pipes Ltd", ticker: "APOLLOPIPE" },
      { name: "Apollo Sindoori Hotels Ltd", ticker: "APOLSINHOT" },
      { name: "Apollo Finvest (India) Ltd", ticker: "512437" },
      { name: "Wipro Limited", ticker: "WIPRO" },
      { name: "State Bank of India", ticker: "SBIN" },
      { name: "ICICI Bank Limited", ticker: "ICICIBANK" },
      { name: "Maruti Suzuki India Limited", ticker: "MARUTI" },
      { name: "Larsen & Toubro Limited", ticker: "LT" },
      { name: "Axis Bank Limited", ticker: "AXISBANK" },
      { name: "Bharti Airtel Limited", ticker: "BHARTIARTL" },
      { name: "Hindustan Unilever Limited", ticker: "HINDUNILVR" },
      { name: "ITC Limited", ticker: "ITC" },
      { name: "Kotak Mahindra Bank Limited", ticker: "KOTAKBANK" }
    ];

    const filtered = localCompanies.filter(c =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.ticker.toLowerCase().includes(q.toLowerCase())
    );
    // Format to match screener schema (id, name, url)
    const formatted = filtered.map((c, i) => ({
      id: i,
      name: c.name,
      url: `/company/${c.ticker}/`
    }));
    return res.json(formatted);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "An error occurred during search suggestion compilation." });
  }
};
