import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, TrendingUp, History, ShieldCheck, Database } from "lucide-react";
import { searchCompanies } from "../utils/api";
import type { SearchSuggestion } from "../utils/api";

interface SearchScreenProps {
  onAnalyze: (company: string) => void;
  isLoading: boolean;
  historyCount: number;
  onOpenHistory: () => void;
}

export function SearchScreen({ onAnalyze, isLoading, historyCount, onOpenHistory }: SearchScreenProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const dropdownRef = useRef<HTMLFormElement>(null);

  // Debounce API calls for suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const results = await searchCompanies(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setActiveIdx(-1);
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      setShowSuggestions(false);
      onAnalyze(query.trim());
    }
  };

  const handleExampleClick = (name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    onAnalyze(name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && activeIdx < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[activeIdx];
        setQuery(selected.name);
        setShowSuggestions(false);
        onAnalyze(selected.name);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const examples = ["Infosys", "TCS", "Reliance", "Tata Motors"];

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden bg-grid-pattern">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emeraldGreen/10 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms]"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl text-center flex flex-col items-center"
      >
        {/* Sparkle Badge */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emeraldGreen/10 border border-emeraldGreen/30 text-emeraldGreen text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Powered by Fundamental Analysis AI
        </motion.div>

        {/* Hero Headers */}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-emerald-400"
        >
          Stock Analyzer AI
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-gray-400 text-base sm:text-lg max-w-lg mb-8 leading-relaxed font-light"
        >
          Conduct comprehensive, weighted fundamental audits of listed Indian companies instantly with complete financial ratio assessments.
        </motion.p>

        {/* Input Form */}
        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="w-full mb-6 relative"
          ref={dropdownRef}
        >
          <div className="glass-panel rounded-2xl p-2.5 flex items-center shadow-2xl relative z-10">
            <div className="pl-3.5 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter Indian company name (e.g. Reliance, Infosys)..."
              className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-white px-3 placeholder-slate-500 text-sm sm:text-base font-medium"
              disabled={isLoading}
              required
            />
            
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-emeraldGreen hover:bg-emerald-500 text-slate-900 transition-colors shadow-lg disabled:opacity-40 disabled:hover:bg-emeraldGreen text-sm cursor-pointer whitespace-nowrap"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                  Analyzing...
                </span>
              ) : (
                "Analyze Company"
              )}
            </button>
          </div>

          {/* Autocomplete Dropdown List */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-darkBorder bg-darkCard/95 backdrop-blur-md shadow-2xl overflow-hidden z-30 max-h-64 overflow-y-auto text-left">
              {suggestions.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setQuery(item.name);
                    setShowSuggestions(false);
                    onAnalyze(item.name);
                  }}
                  className={`px-5 py-3 text-xs sm:text-sm font-semibold tracking-wide border-b border-darkBorder/40 last:border-0 cursor-pointer transition-colors flex items-center justify-between ${
                    idx === activeIdx
                      ? "bg-emeraldGreen/10 text-emeraldGreen border-l-4 border-l-emeraldGreen pl-4"
                      : "text-slate-300 hover:bg-darkCardHover hover:text-white"
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {item.url.split("/")[2] || "STOCK"}
                  </span>
                </div>
              ))}
              
              {/* Bottom Custom Search Everywhere Row */}
              <div
                onClick={() => {
                  setShowSuggestions(false);
                  onAnalyze(query);
                }}
                className="px-5 py-3 text-xs sm:text-sm italic font-semibold text-slate-400 hover:bg-darkCardHover hover:text-white border-t border-darkBorder/40 flex items-center justify-between cursor-pointer"
              >
                <span>Search everywhere: "{query}"</span>
                <Search className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          )}
        </motion.form>

        {/* Examples List */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-8"
        >
          <span className="text-slate-500 text-xs sm:text-sm mr-1">Popular Examples:</span>
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="px-3.5 py-1.5 rounded-lg bg-darkCard border border-darkBorder hover:border-emeraldGreen/50 hover:bg-darkCardHover text-slate-300 text-xs sm:text-sm transition-all cursor-pointer"
            >
              {example}
            </button>
          ))}
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 w-full max-w-lg mt-4 border-t border-darkBorder/60 pt-6"
        >
          <div className="flex flex-col items-center">
            <div className="p-2 bg-emeraldGreen/5 rounded-lg border border-emeraldGreen/10 mb-2">
              <TrendingUp className="w-4 h-4 text-emeraldGreen" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400">23+ Financial Metrics</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-2 bg-blue-500/5 rounded-lg border border-blue-500/10 mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400">Risk Assessment</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="p-2 bg-purple-500/5 rounded-lg border border-purple-500/10 mb-2">
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400">DCF Valuation</span>
          </div>
        </motion.div>

        {/* History Quick Access */}
        {historyCount > 0 && (
          <motion.button
            variants={itemVariants}
            onClick={onOpenHistory}
            className="flex items-center gap-2 mt-8 text-xs text-emeraldGreen hover:text-emerald-400 font-semibold uppercase tracking-wider cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            View History ({historyCount})
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
