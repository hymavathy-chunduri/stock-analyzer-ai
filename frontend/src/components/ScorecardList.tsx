import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface ScorecardItem {
  label: string;
  rating: "Excellent" | "Good" | "Average" | "Poor" | "Very Poor";
  status: string;
}

interface ScorecardListProps {
  scorecard: ScorecardItem[];
}

export function ScorecardList({ scorecard }: ScorecardListProps) {
  // Helper to resolve colors and icons based on rating
  const getRatingConfig = (rating: ScorecardItem["rating"]) => {
    switch (rating) {
      case "Excellent":
        return {
          textColor: "text-emeraldGreen",
          bgColor: "bg-emeraldGreen/10",
          borderColor: "border-emeraldGreen/30",
          icon: <CheckCircle2 className="w-4 h-4 text-emeraldGreen" />
        };
      case "Good":
        return {
          textColor: "text-green-400",
          bgColor: "bg-green-400/10",
          borderColor: "border-green-400/20",
          icon: <CheckCircle2 className="w-4 h-4 text-green-400" />
        };
      case "Average":
        return {
          textColor: "text-goldYellow",
          bgColor: "bg-goldYellow/10",
          borderColor: "border-goldYellow/20",
          icon: <Info className="w-4 h-4 text-goldYellow" />
        };
      case "Poor":
        return {
          textColor: "text-orangeWarning",
          bgColor: "bg-orangeWarning/10",
          borderColor: "border-orangeWarning/20",
          icon: <AlertTriangle className="w-4 h-4 text-orangeWarning" />
        };
      case "Very Poor":
        return {
          textColor: "text-roseRed",
          bgColor: "bg-roseRed/10",
          borderColor: "border-roseRed/30",
          icon: <AlertTriangle className="w-4 h-4 text-roseRed" />
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {scorecard.map((item, idx) => {
        const config = getRatingConfig(item.rating);
        return (
          <div
            key={item.label + idx}
            className="p-4 rounded-xl bg-darkCard/50 border border-darkBorder hover:bg-darkCard transition-all flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wider">{item.label}</span>
              <span className="text-sm font-semibold text-slate-200">{item.status}</span>
            </div>
            
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
              {config.icon}
              <span className={`text-[11px] font-bold uppercase tracking-wider ${config.textColor}`}>
                {item.rating}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
