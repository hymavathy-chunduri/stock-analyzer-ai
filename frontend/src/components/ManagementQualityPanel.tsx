import { Award, UserCheck, ShieldCheck, AlertOctagon, Quote } from "lucide-react";

interface ManagementProps {
  promoterHoldingCurrent: number;
  promoterPledging: number;
  promoterHolding5YrTrend: number[];
  managementComments: string;
  governanceWarnings: string[];
}

export function ManagementQualityPanel({
  promoterHoldingCurrent,
  promoterPledging,
  promoterHolding5YrTrend,
  managementComments,
  governanceWarnings
}: ManagementProps) {
  
  // Calculate ownership change
  const startHolding = promoterHolding5YrTrend[0] || 0;
  const change = promoterHoldingCurrent - startHolding;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Ownership & Pledging */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserCheck className="w-4.5 h-4.5 text-emeraldGreen" />
            Promoter Ownership
          </h3>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-extrabold text-white">{promoterHoldingCurrent}%</span>
            <span className="text-xs text-slate-400">Total Shares</span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-darkBorder/60 pt-4">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pledged Shares</span>
              <span className={`text-base font-bold ${promoterPledging > 10 ? 'text-roseRed' : 'text-slate-200'}`}>
                {promoterPledging}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">5-Year Change</span>
              <span className={`text-base font-bold ${change > 0 ? 'text-emeraldGreen' : change < 0 ? 'text-roseRed' : 'text-slate-400'}`}>
                {change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-darkBorder/40">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">5-Year Trend</span>
          <div className="flex gap-2.5 items-end h-8">
            {promoterHolding5YrTrend.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                <div 
                  className="w-full bg-emeraldGreen/20 border border-emeraldGreen/40 rounded-t-sm transition-all"
                  style={{ height: `${Math.max(10, Math.min(100, (val / 100) * 32))}px` }}
                  title={`${val}%`}
                ></div>
                <span className="text-[8px] text-slate-500 font-semibold">{val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Corporate Governance Audit */}
      <div className="glass-panel p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Award className="w-4.5 h-4.5 text-blue-400" />
          Governance Warnings
        </h3>

        {governanceWarnings.length > 0 ? (
          <div className="flex flex-col gap-3">
            {governanceWarnings.map((warning, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl border border-roseRed/20 bg-roseRed/5 flex items-start gap-2.5"
              >
                <AlertOctagon className="w-5 h-5 text-roseRed shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs text-roseRed font-medium leading-relaxed">
                  {warning}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-emeraldGreen/10 bg-emeraldGreen/5 flex flex-col items-center justify-center text-center h-[180px]">
            <ShieldCheck className="w-10 h-10 text-emeraldGreen mb-3" />
            <span className="text-sm font-bold text-emeraldGreen">Clear Governance Audit</span>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] leading-relaxed font-light">
              No material regulatory warnings, SEBI alerts, or compliance delays detected.
            </p>
          </div>
        )}
      </div>

      {/* 3. Management comments */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Quote className="w-4.5 h-4.5 text-purple-400" />
            Management commentary
          </h3>
          
          <p className="text-[11px] sm:text-xs text-slate-300 italic leading-relaxed font-light mb-4 relative z-10 pl-4 border-l-2 border-purple-500/40">
            "{managementComments}"
          </p>
        </div>
        
        <div className="text-[10px] text-slate-500 font-semibold tracking-wider flex items-center justify-between border-t border-darkBorder/40 pt-3">
          <span>SOURCE: CONCALL TRANSCRIPTS</span>
          <span className="text-emeraldGreen">VERIFIED AI EXTRACT</span>
        </div>
      </div>
    </div>
  );
}
