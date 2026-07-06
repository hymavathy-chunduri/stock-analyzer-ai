import { AlertCircle, ShieldAlert, CheckCircle } from "lucide-react";

interface RiskProps {
  highDebtRisk: boolean;
  overvaluationRisk: boolean;
  decliningProfitRisk: boolean;
  decliningSalesRisk: boolean;
  cashFlowRisk: boolean;
  corporateGovernanceRisk: boolean;
  riskScore: number;
}

export function RiskAnalysisPanel({
  highDebtRisk,
  overvaluationRisk,
  decliningProfitRisk,
  decliningSalesRisk,
  cashFlowRisk,
  corporateGovernanceRisk,
  riskScore
}: RiskProps) {
  
  // Resolve risk details based on score
  const getRiskLabel = (score: number) => {
    if (score <= 30) return { label: "LOW RISK", color: "text-emeraldGreen", barColor: "bg-emeraldGreen" };
    if (score <= 60) return { label: "MEDIUM RISK", color: "text-goldYellow", barColor: "bg-goldYellow" };
    return { label: "HIGH RISK", color: "text-roseRed", barColor: "bg-roseRed" };
  };

  const riskMeta = getRiskLabel(riskScore);

  const riskItems = [
    { label: "High Debt Risk", value: highDebtRisk, desc: "Evaluates standard leverage and interest coverage parameters." },
    { label: "Overvaluation Risk", value: overvaluationRisk, desc: "Evaluates current stock price relative to peers and intrinsic value." },
    { label: "Declining Profit Risk", value: decliningProfitRisk, desc: "Checks for declining trends in net income over recent years." },
    { label: "Declining Sales Risk", value: decliningSalesRisk, desc: "Checks for declining trends in core revenues over recent years." },
    { label: "Cash Flow Risk", value: cashFlowRisk, desc: "Evaluates cash generated from operations and free cash liquidity." },
    { label: "Governance Risk", value: corporateGovernanceRisk, desc: "Checks for promoter pledge concerns and SEBI/NSE compliance warnings." }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-8">
      {/* Risk Gauge */}
      <div className="flex-1 md:max-w-xs flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-darkBorder pb-6 md:pb-0 md:pr-8">
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Total Risk Rating</span>
        <div className="relative flex items-center justify-center h-32 w-32 mb-4">
          {/* Radial representation */}
          <div className="absolute inset-0 rounded-full border-8 border-darkBorder"></div>
          <div 
            className="absolute inset-0 rounded-full border-8 border-transparent"
            style={{
              clipPath: "polygon(50% 50%, -50% -50%, 150% -50%)",
              transform: `rotate(${Math.min(360, (riskScore / 100) * 360)}deg)`
            }}
          ></div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-white">{riskScore}</span>
            <span className="text-[10px] text-slate-500 font-bold">OUT OF 100</span>
          </div>
        </div>
        <span className={`text-sm font-extrabold tracking-wider ${riskMeta.color}`}>
          {riskMeta.label}
        </span>
        <div className="w-full bg-darkBorder h-2 rounded-full overflow-hidden mt-4 max-w-[200px]">
          <div className={`${riskMeta.barColor} h-full transition-all duration-500`} style={{ width: `${riskScore}%` }}></div>
        </div>
      </div>

      {/* Risk Dimension Details */}
      <div className="flex-[2] flex flex-col justify-center">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 text-roseRed" />
          Risk Vectors Audit
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {riskItems.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl border border-darkBorder bg-darkCard/40 flex items-start gap-3"
            >
              {item.value ? (
                <AlertCircle className="w-5 h-5 text-orangeWarning shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emeraldGreen shrink-0 mt-0.5" />
              )}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">{item.label}</span>
                <span className="text-[11px] text-slate-400 mt-1 font-light leading-relaxed">{item.desc}</span>
                <span className={`text-[10px] font-bold mt-2 tracking-wider ${item.value ? 'text-orangeWarning' : 'text-emeraldGreen'}`}>
                  {item.value ? "WARNING FLAG TRIGGERED" : "PASS (HEALTHY)"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
