import { useState, useEffect } from "react";
import { SearchScreen } from "./components/SearchScreen";
import { Dashboard } from "./components/Dashboard";
import { HistoryPanel } from "./components/HistoryPanel";
import { fetchStockAnalysis } from "./utils/api";
import type { AnalysisData } from "./utils/api";
import { History, TrendingUp, AlertOctagon } from "lucide-react";

interface HistoryItem {
  id: string;
  companyName: string;
  ticker: string;
  recommendation: "BUY" | "HOLD" | "SELL";
  timestamp: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"search" | "dashboard">("search");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("stock_analyzer_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load search history", e);
    }
  }, []);

  const saveHistoryItem = (data: AnalysisData) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      companyName: data.metadata.name,
      ticker: data.metadata.ticker,
      recommendation: data.decision.recommendation,
      timestamp: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    };

    // Filter duplicates
    const updated = [newItem, ...history.filter(item => item.companyName.toUpperCase() !== data.metadata.name.toUpperCase())].slice(0, 15);
    setHistory(updated);
    localStorage.setItem("stock_analyzer_history", JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("stock_analyzer_history");
  };

  const loadingSteps = [
    "Ingesting 5-year balance sheets...",
    "Reconciling operating and free cash flows...",
    "Executing Graham and Discounted Cash Flow models...",
    "Evaluating promoter pledges and corporate compliance...",
    "Compiling weighted recommendation matrix..."
  ];

  // Rotate loading steps while analysis is running
  useEffect(() => {
    if (isLoading) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 900);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleAnalyze = async (companyName: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await fetchStockAnalysis(companyName);
      setAnalysisData(result);
      saveHistoryItem(result);
      setCurrentScreen("dashboard");
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to process stock analysis. Please check server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-slate-100 flex flex-col justify-between">
      {/* Header bar */}
      <header className="no-print border-b border-darkBorder/60 bg-darkCard/30 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => setCurrentScreen("search")} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-1.5 rounded-lg bg-emeraldGreen/10 border border-emeraldGreen/20 group-hover:border-emeraldGreen/40 transition-colors">
              <TrendingUp className="w-5 h-5 text-emeraldGreen" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-white">
              STOCK ANALYZER AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-darkBorder hover:border-emeraldGreen/30 text-xs text-slate-300 font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-emeraldGreen" />
              <span className="hidden sm:inline">History</span>
              <span>({history.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Error Alert Bar */}
      {errorMsg && (
        <div className="max-w-xl mx-auto mt-6 px-4 w-full no-print">
          <div className="p-4 rounded-xl border border-roseRed/20 bg-roseRed/5 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-roseRed shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold text-roseRed uppercase tracking-wider block">Analysis Engine Fault</span>
              <p className="text-xs text-slate-300 mt-1 font-light leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Screens / Loading States */}
      <main className="flex-grow flex flex-col justify-start">
        {isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center py-20 px-4">
            <div className="glass-panel p-8 rounded-2xl max-w-sm w-full text-center flex flex-col items-center shadow-2xl relative">
              {/* Spinning Loader */}
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-darkBorder"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-emeraldGreen border-r-transparent animate-spin"></div>
              </div>

              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest block mb-1">Stock Auditor AI</span>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4">Running Audit Calculations</h3>
              
              {/* Dynamic Loading steps */}
              <div className="h-10 flex items-center justify-center">
                <p className="text-xs text-slate-400 animate-pulse font-light leading-relaxed px-4">
                  {loadingSteps[loadingStep]}
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex gap-1.5 mt-6 w-full justify-center">
                {loadingSteps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx <= loadingStep ? "w-6 bg-emeraldGreen" : "w-2 bg-darkBorder"
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : currentScreen === "search" ? (
          <SearchScreen
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            historyCount={history.length}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        ) : (
          analysisData && (
            <Dashboard 
              data={analysisData} 
              onBack={() => setCurrentScreen("search")} 
            />
          )
        )}
      </main>

      {/* History Side Panel */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleAnalyze}
        onClear={handleClearHistory}
      />

      {/* Footer bar */}
      <footer className="no-print border-t border-darkBorder/40 bg-darkCard/10 px-6 py-6 text-center text-[10px] text-slate-600 font-semibold tracking-wider uppercase">
        © 2026 Stock Analyzer AI • Financial Research System • Authorized Data Fallback Enabled
      </footer>
    </div>
  );
}
