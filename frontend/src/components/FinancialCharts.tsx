import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from "recharts";

interface ChartProps {
  charts: {
    revenueAndProfit: { year: string; revenue: number; netProfit: number }[];
    eps: { year: string; eps: number }[];
    debt: { year: string; borrowings: number; debtToEquity: number }[];
    cashFlow: { year: string; operatingCashFlow: number; freeCashFlow: number }[];
    quarterly: { quarter: string; sales: number; netProfit: number }[];
    returnRatios: { year: string; roe: number; roce: number; roa: number }[];
  };
}

// Custom Premium Tooltip Component
const CustomTooltip = ({ active, payload, label, unit = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-darkBorder shadow-2xl text-xs font-semibold">
        <p className="text-slate-400 mb-1.5 uppercase tracking-wider">{label}</p>
        <div className="flex flex-col gap-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-bold">
                {entry.name.includes("Ratio") || entry.name.includes("Equity") || entry.name.includes("EPS") || entry.name.includes("%")
                  ? entry.value
                  : `₹${entry.value.toLocaleString("en-IN")} Cr`}
                {unit}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function FinancialCharts({ charts }: ChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Revenue & Profit 5-Year Area Chart */}
      <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Revenue & Net Profit (5 Years)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.revenueAndProfit} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="year" stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <YAxis stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" style={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="netProfit" name="Net Profit" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Quarterly Sales & Profit */}
      <div className="p-5 rounded-2xl glass-panel">
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Quarterly Sales & profit</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.quarterly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="quarter" stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <YAxis stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" style={{ fontSize: 11 }} />
              <Bar dataKey="sales" name="Quarterly Sales" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="netProfit" name="Quarterly Profit" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Debt (Borrowings) & Leverage Chart */}
      <div className="p-5 rounded-2xl glass-panel">
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Borrowings (5 Years)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.debt} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="year" stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <YAxis stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" style={{ fontSize: 11 }} />
              <Bar dataKey="borrowings" name="Borrowings" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Cash Flows */}
      <div className="p-5 rounded-2xl glass-panel">
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Cash Flow Position</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.cashFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="year" stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <YAxis stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" style={{ fontSize: 11 }} />
              <Bar dataKey="operatingCashFlow" name="Operating Cash Flow" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="freeCashFlow" name="Free Cash Flow" fill="#06B6D4" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Return Ratios (ROE, ROCE, ROA) */}
      <div className="p-5 rounded-2xl glass-panel">
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Return Ratios (ROE, ROCE, ROA %)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.returnRatios} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="year" stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <YAxis stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Legend verticalAlign="top" height={36} iconType="circle" style={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="roe" name="ROE" stroke="#EC4899" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="roce" name="ROCE" stroke="#F59E0B" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="roa" name="ROA" stroke="#10B981" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. EPS Trend */}
      <div className="p-5 rounded-2xl glass-panel">
        <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">EPS Trend (Earnings Per Share)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.eps} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="year" stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <YAxis stroke="#6B7280" tickLine={false} style={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" style={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="eps" name="EPS" stroke="#A855F7" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
