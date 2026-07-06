import { useState } from "react";
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  TrendingUp, 
  ShieldAlert, 
  HelpCircle, 
  Check,
  ExternalLink,
  Info,
  Zap
} from "lucide-react";
import type { AnalysisData } from "../utils/api";
import { ScorecardList } from "./ScorecardList";
import { FinancialCharts } from "./FinancialCharts";
import { RiskAnalysisPanel } from "./RiskAnalysisPanel";
import { ManagementQualityPanel } from "./ManagementQualityPanel";
import { AIExplanationPanel } from "./AIExplanationPanel";
import { IntradayTradingPanel } from "./IntradayTradingPanel";
import { exportToPDF, printReport } from "../utils/exportUtils";

interface DashboardProps {
  data: AnalysisData;
  onBack: () => void;
}

export function Dashboard({ data, onBack }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "charts" | "risk" | "explainer" | "actionPlan" | "intraday">("overview");
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const getRecommendationStyle = (rec: "BUY" | "HOLD" | "SELL") => {
    switch (rec) {
      case "BUY":
        return {
          textColor: "text-emeraldGreen",
          bgColor: "bg-emeraldGreen/10",
          borderColor: "border-emeraldGreen/40",
          glowClass: "glow-buy"
        };
      case "HOLD":
        return {
          textColor: "text-goldYellow",
          bgColor: "bg-goldYellow/10",
          borderColor: "border-goldYellow/30",
          glowClass: "glow-hold"
        };
      case "SELL":
        return {
          textColor: "text-roseRed",
          bgColor: "bg-roseRed/10",
          borderColor: "border-roseRed/40",
          glowClass: "glow-sell"
        };
    }
  };

  const styleConfig = getRecommendationStyle(data.decision.recommendation);

  const handlePdfExport = async () => {
    setIsExportingPdf(true);
    // Give it a tiny timeout to render cleanly
    setTimeout(async () => {
      await exportToPDF("dashboard-report-print", data.metadata.name);
      setIsExportingPdf(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-white font-bold uppercase tracking-wider transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          Back to Search
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePdfExport}
            disabled={isExportingPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-darkBorder hover:border-emeraldGreen/40 bg-darkCard/50 hover:bg-darkCard text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-55"
          >
            <Download className="w-4 h-4 text-emeraldGreen" />
            {isExportingPdf ? "Generating PDF..." : "Export PDF"}
          </button>
          


          <button
            onClick={printReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-darkBorder hover:border-emeraldGreen/40 bg-darkCard/50 hover:bg-darkCard text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emeraldGreen" />
            Print Report
          </button>
        </div>
      </div>

      {/* Main Printable Content Container */}
      <div id="dashboard-report-print" className="space-y-6 p-1 sm:p-2">
        
        {/* Company Overview Header Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-[10px] text-emeraldGreen font-extrabold uppercase tracking-widest bg-emeraldGreen/10 px-2.5 py-1 rounded-md border border-emeraldGreen/20">
              {data.metadata.ticker}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 leading-tight">
              {data.metadata.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-semibold pt-1">
              <span>Sector: <strong className="text-slate-300">{data.metadata.sector}</strong></span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span>Industry: <strong className="text-slate-300">{data.metadata.industry}</strong></span>
            </div>
          </div>

          {/* Current Stock Price Info */}
          <div className="flex flex-row md:flex-col items-baseline md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-darkBorder/40 pt-4 md:pt-0">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Current Market Price</span>
            <span className="text-3xl font-extrabold text-white">₹{data.metadata.currentPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* 2-Column Section: Recommendation badge & Key Financial Ratios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recommendation & Engine Breakdown */}
          <div className={`lg:col-span-1 glass-panel p-6 rounded-2xl flex flex-col justify-between border ${styleConfig.glowClass} transition-shadow`}>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-4">AI Final Recommendation</span>
              
              <div className="flex items-center gap-4 mb-5">
                <div className={`px-7 py-3 rounded-2xl border text-2xl font-black tracking-widest ${styleConfig.textColor} ${styleConfig.bgColor} ${styleConfig.borderColor}`}>
                  {data.decision.recommendation}
                </div>
                <div>
                  <span className="text-2xl font-extrabold text-white">{data.decision.confidenceScore}%</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">Confidence Score</span>
                </div>
              </div>

              {/* Checklist Reasons */}
              <div className="space-y-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block border-b border-darkBorder/50 pb-1.5">Decision Drivers</span>
                {data.decision.reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-light text-slate-300 leading-relaxed">
                    <div className="p-0.5 rounded-full bg-emeraldGreen/10 border border-emeraldGreen/20 shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emeraldGreen" />
                    </div>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase pt-4 border-t border-darkBorder/40 mt-6">
              Evaluation based on weighted matrix score
            </div>
          </div>

          {/* Key Fundamentals Metrics Summary */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Core Valuation & Solvency Metrics</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Market Cap</span>
                  <span className="text-base font-extrabold text-slate-200">₹{data.metadata.marketCap.toLocaleString("en-IN")} Cr</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Book Value</span>
                  <span className="text-base font-extrabold text-slate-200">₹{data.metadata.bookValue}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Dividend Yield</span>
                  <span className="text-base font-extrabold text-slate-200">{data.metadata.dividendYield}%</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Stock P/E</span>
                  <span className="text-base font-extrabold text-slate-200">
                    {data.metadata.currentPrice / data.charts.eps[4].eps > 0 
                      ? (data.metadata.currentPrice / data.charts.eps[4].eps).toFixed(1) 
                      : "N/A"
                    }
                  </span>
                </div>

                {/* Advanced calculations Row */}
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Intrinsic Value</span>
                  <span className="text-base font-extrabold text-slate-200">₹{data.metrics.intrinsicValue}</span>
                  <span className={`text-[10px] font-bold block mt-0.5 ${data.metrics.marginOfSafety > 0 ? 'text-emeraldGreen' : 'text-roseRed'}`}>
                    {data.metrics.marginOfSafety}% MoS
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Graham Number</span>
                  <span className="text-base font-extrabold text-slate-200">₹{data.metrics.grahamNumber}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{data.metrics.grahamStatus}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Piotroski Score</span>
                  <span className="text-base font-extrabold text-slate-200">{data.metrics.piotroskiScore}/9</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Financial Strength</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Altman Z-Score</span>
                  <span className="text-base font-extrabold text-slate-200">{data.metrics.altmanZScore}</span>
                  <span className={`text-[10px] font-bold block mt-0.5 ${data.metrics.altmanZStatus === 'Safe' ? 'text-emeraldGreen' : data.metrics.altmanZStatus === 'Grey Zone' ? 'text-goldYellow' : 'text-roseRed'}`}>
                    {data.metrics.altmanZStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* CAGR Metrics Row */}
            <div className="border-t border-darkBorder/40 pt-6 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Sales CAGR (3 Yr)</span>
                <span className="text-xs font-bold text-slate-300">{data.metrics.salesCagr3Yr}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Sales CAGR (5 Yr)</span>
                <span className="text-xs font-bold text-slate-300">{data.metrics.salesCagr5Yr}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Profit CAGR (3 Yr)</span>
                <span className="text-xs font-bold text-slate-300">{data.metrics.profitCagr3Yr}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Profit CAGR (5 Yr)</span>
                <span className="text-xs font-bold text-slate-300">{data.metrics.profitCagr5Yr}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation Bar */}
        <div className="no-print border-b border-darkBorder flex overflow-x-auto gap-6 scrollbar-none pt-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === "overview" ? "border-emeraldGreen text-emeraldGreen" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Scorecard & Ratios
            </span>
          </button>

          <button
            onClick={() => setActiveTab("intraday")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === "intraday" ? "border-emeraldGreen text-emeraldGreen" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Zap className="w-4.5 h-4.5" />
              Intraday Trading
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab("charts")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === "charts" ? "border-emeraldGreen text-emeraldGreen" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Financial Charts
            </span>
          </button>

          <button
            onClick={() => setActiveTab("risk")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === "risk" ? "border-emeraldGreen text-emeraldGreen" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5" />
              Risk & Governance
            </span>
          </button>

          <button
            onClick={() => setActiveTab("actionPlan")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === "actionPlan" ? "border-emeraldGreen text-emeraldGreen" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-4.5 h-4.5" />
              AI Action Plan & Suggestions
            </span>
          </button>

          <button
            onClick={() => setActiveTab("explainer")}
            className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
              activeTab === "explainer" ? "border-emeraldGreen text-emeraldGreen" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              AI Terminology Guide
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          
          {/* OVERVIEW TAB */}
          {(activeTab === "overview" || isExportingPdf) && (
            <div className={`${activeTab !== "overview" && !isExportingPdf ? "hidden" : "block"} space-y-6`}>
              
              {/* Scorecard Grid */}
              <div className="glass-panel p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Metric Scorecard Analysis</h3>
                <ScorecardList scorecard={data.scorecard} />
              </div>

              {/* Ratios Explanations / Reasons Audit */}
              <div className="glass-panel p-5 rounded-2xl">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Detailed Metrics Audit</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Revenue Growth (5-Year)</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.revenueGrowthReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Profit Growth (5-Year)</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.profitGrowthReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">EPS Growth Trend</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.epsGrowthReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Debt & Solvency Audit</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.debtReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Cash Flow Audit</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.cashFlowReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Return on Equity (ROE)</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.roeReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Return on Capital Employed (ROCE)</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.roceReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">P/E Valuation Audit</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.peValuationReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Promoter Holding Trend</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.promoterReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Dividend Yield & History</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.dividendReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Book Value Audit</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.bookValueReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Quarterly Growth</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.quarterlyGrowthReason}</p>
                  </div>
                  <div className="border-t border-darkBorder/40 pt-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Annual Growth</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{data.metrics.annualGrowthReason}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTRADAY TRADING TAB */}
          {(activeTab === "intraday" || isExportingPdf) && (
            <div className={`${activeTab !== "intraday" && !isExportingPdf ? "hidden" : "block"} space-y-6`}>
              <IntradayTradingPanel 
                currentPrice={data.metadata.currentPrice}
                dayHigh={data.metadata.dayHigh}
                dayLow={data.metadata.dayLow}
                prevClose={data.metadata.prevClose}
              />
            </div>
          )}

          {/* CHARTS TAB */}
          {(activeTab === "charts" || isExportingPdf) && (
            <div className={activeTab !== "charts" && !isExportingPdf ? "hidden" : "block"}>
              <FinancialCharts charts={data.charts} />
            </div>
          )}

          {/* RISK & GOVERNANCE TAB */}
          {(activeTab === "risk" || isExportingPdf) && (
            <div className={`${activeTab !== "risk" && !isExportingPdf ? "hidden" : "block"} space-y-6`}>
              <RiskAnalysisPanel 
                highDebtRisk={data.riskAnalysis.highDebtRisk}
                overvaluationRisk={data.riskAnalysis.overvaluationRisk}
                decliningProfitRisk={data.riskAnalysis.decliningProfitRisk}
                decliningSalesRisk={data.riskAnalysis.decliningSalesRisk}
                cashFlowRisk={data.riskAnalysis.cashFlowRisk}
                corporateGovernanceRisk={data.riskAnalysis.corporateGovernanceRisk}
                riskScore={data.riskAnalysis.riskScore}
              />
              
              <ManagementQualityPanel 
                promoterHoldingCurrent={data.managementQuality.promoterHoldingCurrent}
                promoterPledging={data.managementQuality.promoterPledging}
                promoterHolding5YrTrend={data.managementQuality.promoterHolding5YrTrend}
                managementComments={data.managementQuality.managementComments}
                governanceWarnings={data.managementQuality.governanceWarnings}
              />
            </div>
          )}

          {/* AI ACTION PLAN & SUGGESTIONS TAB */}
          {(activeTab === "actionPlan" || isExportingPdf) && (
            <div className={`${activeTab !== "actionPlan" && !isExportingPdf ? "hidden" : "block"} space-y-6`}>
              
              {/* Target Suggestion Board */}
              <div className="glass-panel p-6 rounded-2xl border border-emeraldGreen/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-emeraldGreen/10 border-l border-b border-emeraldGreen/20 text-[9px] text-emeraldGreen font-bold tracking-widest rounded-bl-lg uppercase">
                  AI Trading Engine
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emeraldGreen" />
                  Target Buy & Sell Suggestion Board
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Current Valuation Info */}
                  <div className="p-4 rounded-xl bg-darkCard/40 border border-darkBorder flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Current Price</span>
                      <span className="text-2xl font-extrabold text-white">₹{data.metadata.currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-darkBorder/40">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Intrinsic Value (DCF)</span>
                      <span className="text-sm font-semibold text-slate-300">₹{data.metrics.intrinsicValue.toFixed(2)}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Conservative Graham Number</span>
                      <span className="text-sm font-semibold text-slate-300">₹{data.metrics.grahamNumber.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Buy Suggestion Range */}
                  <div className="p-4 rounded-xl bg-emeraldGreen/5 border border-emeraldGreen/20 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-emeraldGreen font-bold uppercase tracking-wider block mb-1">Recommended Buying Band</span>
                      <span className="text-2xl font-extrabold text-emeraldGreen">
                        {data.metrics.marginOfSafety > 0 
                          ? `Below ₹${Math.round(data.metrics.intrinsicValue)}` 
                          : `Below ₹${Math.round(data.metrics.intrinsicValue * 0.9)}`
                        }
                      </span>
                      <p className="text-[11px] text-slate-300 font-light mt-3 leading-relaxed">
                        {data.metrics.marginOfSafety > 0 
                          ? `The stock currently offers a positive margin of safety (${data.metrics.marginOfSafety}%). Safe accumulation is advised under the calculated Intrinsic Value.` 
                          : `The stock is currently trading at a premium. Wait for a pullback to below ₹${Math.round(data.metrics.intrinsicValue * 0.9)} (incorporates a 10% safety buffer) to buy.`
                        }
                      </p>
                    </div>
                    <span className="text-[9px] text-emeraldGreen font-semibold uppercase tracking-wider mt-4">
                      ENTRY SAFETY RATING: {data.metrics.marginOfSafety > 0 ? "HIGH" : "LOW (WAIT FOR CORRECTION)"}
                    </span>
                  </div>

                  {/* Sell Suggestion Range */}
                  <div className="p-4 rounded-xl bg-roseRed/5 border border-roseRed/20 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-roseRed font-bold uppercase tracking-wider block mb-1">Target Profit-Booking / Sell Band</span>
                      <span className="text-2xl font-extrabold text-roseRed">
                        Above ₹{Math.round(data.metrics.intrinsicValue * 1.25)}
                      </span>
                      <p className="text-[11px] text-slate-300 font-light mt-3 leading-relaxed">
                        If the price reaches or exceeds ₹{Math.round(data.metrics.intrinsicValue * 1.25)} (a 25% premium above the calculated DCF fair value), the valuation will be heavily stretched. It is highly recommended to book profits or trim positions at this range.
                      </p>
                    </div>
                    <span className="text-[9px] text-roseRed font-semibold uppercase tracking-wider mt-4">
                      VALUATION CEILING: ₹{Math.round(data.metrics.intrinsicValue * 1.25)} (25% PREMIUM)
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Steps Section */}
              <div className="space-y-6">
                {/* Step 1: Navigating to the Source */}
                <div className="glass-panel p-5 rounded-2xl">
                  <span className="text-[10px] text-emeraldGreen font-bold uppercase tracking-widest block mb-1">Step 1: Navigating to the Source</span>
                  <h4 className="text-base font-bold text-white mb-2">Live Screening Profile</h4>
                  <p className="text-xs text-slate-400 font-light leading-relaxed mb-4">
                    Verify this analysis directly with real-time filings, annual reports, and peer groups on the Screener.in stock research platform:
                  </p>
                  <a
                    href={`https://www.screener.in${data.metadata.screenerPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-darkCard border border-darkBorder hover:border-emeraldGreen/50 text-emeraldGreen font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View {data.metadata.name} on Screener.in
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Step 2: Interpreting Key Ratios */}
                <div className="glass-panel p-5 rounded-2xl">
                  <span className="text-[10px] text-emeraldGreen font-bold uppercase tracking-widest block mb-1">Step 2: Interpreting Key Ratios</span>
                  <h4 className="text-base font-bold text-white mb-3">Core Ratio Diagnostics</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-darkBorder text-slate-500 font-bold uppercase">
                          <th className="py-2.5">Key Financial Indicator</th>
                          <th className="py-2.5 text-right">Value</th>
                          <th className="py-2.5 pl-6">Screener.in Data Coordination</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-darkBorder/40 text-slate-300 font-light">
                        <tr>
                          <td className="py-3 font-semibold text-slate-200">Current Market Price</td>
                          <td className="py-3 text-right font-bold text-white">₹{data.metadata.currentPrice.toFixed(2)}</td>
                          <td className="py-3 pl-6 text-slate-400">Trading quote at header</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-slate-200">Market Capitalization</td>
                          <td className="py-3 text-right font-bold text-white">₹{data.metadata.marketCap.toLocaleString("en-IN")} Cr</td>
                          <td className="py-3 pl-6 text-slate-400">Header metrics grid (Total equity valuation)</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-slate-200">Book Value</td>
                          <td className="py-3 text-right font-bold text-white">₹{data.metadata.bookValue.toFixed(2)}</td>
                          <td className="py-3 pl-6 text-slate-400">Header metrics grid (Net Asset Value per share)</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-slate-200">Dividend Yield</td>
                          <td className="py-3 text-right font-bold text-white">{data.metadata.dividendYield.toFixed(2)}%</td>
                          <td className="py-3 pl-6 text-slate-400">Header metrics grid (Annual dividend return)</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-slate-200">Stock P/E Ratio</td>
                          <td className="py-3 text-right font-bold text-white">
                            {data.metadata.currentPrice / data.charts.eps[4].eps > 0 
                              ? (data.metadata.currentPrice / data.charts.eps[4].eps).toFixed(1) 
                              : "N/A"
                            }x
                          </td>
                          <td className="py-3 pl-6 text-slate-400">Header metrics grid (Price divided by latest EPS)</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold text-slate-200">Industry P/E Ratio</td>
                          <td className="py-3 text-right font-bold text-white">{data.metadata.industryPe.toFixed(1)}x</td>
                          <td className="py-3 pl-6 text-slate-400">Peer comparison index average</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Step 3: Decoding the AI Recommendation */}
                <div className="glass-panel p-5 rounded-2xl">
                  <span className="text-[10px] text-emeraldGreen font-bold uppercase tracking-widest block mb-1">Step 3: Decoding the AI Recommendation</span>
                  <h4 className="text-base font-bold text-white mb-4">
                    Engine Recommendation Balance: <strong className={data.decision.recommendation === "BUY" ? "text-emeraldGreen" : data.decision.recommendation === "HOLD" ? "text-goldYellow" : "text-roseRed"}>{data.decision.recommendation}</strong> ({data.decision.confidenceScore}% Confidence)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths (Pros) */}
                    <div className="p-4 rounded-xl bg-emeraldGreen/5 border border-emeraldGreen/20">
                      <span className="text-[10px] text-emeraldGreen font-bold uppercase tracking-wider block mb-2">Strengths (The Pros)</span>
                      <ul className="space-y-2.5">
                        {data.decision.reasons.filter(r => !r.toLowerCase().includes("premium") && !r.toLowerCase().includes("concern") && !r.toLowerCase().includes("warning")).map((pro, i) => (
                          <li key={i} className="text-xs text-slate-300 font-light flex items-start gap-2 leading-relaxed">
                            <span className="text-emeraldGreen font-bold mt-0.5">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Concerns (The Cons) */}
                    <div className="p-4 rounded-xl bg-roseRed/5 border border-roseRed/20">
                      <span className="text-[10px] text-roseRed font-bold uppercase tracking-wider block mb-2">Concerns (The Cons)</span>
                      <ul className="space-y-2.5">
                        {data.decision.reasons.filter(r => r.toLowerCase().includes("premium") || r.toLowerCase().includes("concern") || r.toLowerCase().includes("warning") || r.toLowerCase().includes("high debt") || r.toLowerCase().includes("overvaluation")).map((con, i) => (
                          <li key={i} className="text-xs text-slate-300 font-light flex items-start gap-2 leading-relaxed">
                            <span className="text-roseRed font-bold mt-0.5">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                        {data.decision.reasons.filter(r => r.toLowerCase().includes("premium") || r.toLowerCase().includes("concern") || r.toLowerCase().includes("warning") || r.toLowerCase().includes("high debt") || r.toLowerCase().includes("overvaluation")).length === 0 && (
                          <li className="text-xs text-slate-400 font-light italic">
                            No major solvency or valuation flags are active.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 4: Summary Action Plan */}
                <div className="glass-panel p-5 rounded-2xl">
                  <span className="text-[10px] text-emeraldGreen font-bold uppercase tracking-widest block mb-1">Step 4: Summary Action Plan</span>
                  <h4 className="text-base font-bold text-white mb-2">Tactical Action Guide</h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">
                    {data.decision.recommendation === "BUY" && (
                      "Action Plan: Accumulate this company in tranches during minor pullbacks. The weighted decision score indicates robust balance sheet health (Piotroski >= 7), stable credit quality (Altman Z in safe zone), and the stock trades at an attractive entry valuation offering a positive margin of safety."
                    )}
                    {data.decision.recommendation === "HOLD" && (
                      "Action Plan: If you already own this stock, hold your position. The fundamental health is solid, but the price is currently trading at a premium or contains high growth assumptions. Avoid making new purchases at current market prices; wait for a pullback to below the target buy bands to establish a safer margin of safety."
                    )}
                    {data.decision.recommendation === "SELL" && (
                      "Action Plan: Consider booking profits or trimming exposures to preserve capital. Solvency or leverage indicators are weak, margins are under pressure, or the stock trades at an extreme overvaluation premium relative to peers and projected free cash flows."
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI TERM GUIDE TAB */}
          {(activeTab === "explainer" || isExportingPdf) && (
            <div className={activeTab !== "explainer" && !isExportingPdf ? "hidden" : "block"}>
              <AIExplanationPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
