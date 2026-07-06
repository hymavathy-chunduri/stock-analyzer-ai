import { motion, AnimatePresence } from "framer-motion";
import { X, History, Trash2, ArrowRight } from "lucide-react";

interface HistoryItem {
  id: string;
  companyName: string;
  ticker: string;
  recommendation: "BUY" | "HOLD" | "SELL";
  timestamp: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (companyName: string) => void;
  onClear: () => void;
}

export function HistoryPanel({ isOpen, onClose, history, onSelect, onClear }: HistoryPanelProps) {
  const getBadgeColor = (rec: HistoryItem["recommendation"]) => {
    switch (rec) {
      case "BUY":
        return "bg-emeraldGreen/10 text-emeraldGreen border border-emeraldGreen/30";
      case "HOLD":
        return "bg-goldYellow/10 text-goldYellow border border-goldYellow/20";
      case "SELL":
        return "bg-roseRed/10 text-roseRed border border-roseRed/30";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          ></motion.div>

          {/* Panel Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm glass-panel border-l border-darkBorder/60 z-50 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-darkBorder flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-emeraldGreen" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Analysis History</h3>
              </div>
              <button 
                onClick={onClose} 
                className="p-1 rounded-lg hover:bg-darkCard transition-colors text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelect(item.companyName);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl border border-darkBorder bg-darkCard/30 hover:bg-darkCard hover:border-emeraldGreen/30 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white tracking-wider group-hover:text-emeraldGreen transition-colors">
                        {item.companyName}
                      </span>
                      <span className="text-[9px] text-slate-500 font-semibold tracking-wide uppercase mt-1">
                        {item.ticker} • {item.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getBadgeColor(item.recommendation)}`}>
                        {item.recommendation}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emeraldGreen transition-colors transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 text-slate-500">
                  <History className="w-10 h-10 text-slate-600 mb-3" />
                  <span className="text-xs font-bold uppercase tracking-wider">No history recorded</span>
                  <p className="text-[11px] text-slate-600 mt-1 max-w-[180px] leading-relaxed">
                    Search and analyze companies to record statements here.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div className="p-5 border-t border-darkBorder">
                <button
                  onClick={onClear}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-roseRed/20 hover:border-roseRed/40 bg-roseRed/5 hover:bg-roseRed/10 text-roseRed text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All History
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
