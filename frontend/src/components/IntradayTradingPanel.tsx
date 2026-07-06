import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Zap, ArrowUpRight, ArrowDownRight, Compass } from "lucide-react";

interface IntradayProps {
  currentPrice: number;
  dayHigh?: number;
  dayLow?: number;
  prevClose?: number;
}

interface TradeLog {
  id: string;
  time: string;
  price: number;
  qty: number;
  type: "BUY" | "SELL";
}

export function IntradayTradingPanel({ currentPrice, dayHigh, dayLow, prevClose: propPrevClose }: IntradayProps) {
  // 1. Live Price & OHLC States
  const [livePrice, setLivePrice] = useState(currentPrice);
  const [open, setOpen] = useState(Number((dayLow ? (dayLow + (dayHigh || currentPrice) - currentPrice) : currentPrice * 0.985).toFixed(2)));
  const [prevClose, setPrevClose] = useState(Number((propPrevClose || currentPrice * 0.991).toFixed(2)));
  const [high, setHigh] = useState(Number((dayHigh || currentPrice * 1.012).toFixed(2)));
  const [low, setLow] = useState(Number((dayLow || currentPrice * 0.982).toFixed(2)));
  const [volume, setVolume] = useState(482500);

  // 2. Chart Tick series
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);

  // 3. Live Trade Log
  const [trades, setTrades] = useState<TradeLog[]>([]);

  // Initialize historical chart ticks and initial trades list
  useEffect(() => {
    // Reset live stats with real values when active stock changes
    setLivePrice(currentPrice);
    const nextOpen = Number((dayLow ? (dayLow + (dayHigh || currentPrice) - currentPrice) : currentPrice * 0.985).toFixed(2));
    setOpen(nextOpen);
    setPrevClose(Number((propPrevClose || currentPrice * 0.991).toFixed(2)));
    setHigh(Number((dayHigh || currentPrice * 1.012).toFixed(2)));
    setLow(Number((dayLow || currentPrice * 0.982).toFixed(2)));
    setVolume(482500 + Math.floor(Math.random() * 200) * 100);

    // Generate 12 baseline ticks from 9:15 AM
    const baseData = Array.from({ length: 12 }, (_, i) => {
      const minOffset = i * 15;
      const hour = 9 + Math.floor((15 + minOffset) / 60);
      const minute = (15 + minOffset) % 60;
      const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      
      // Random walk around base
      const priceOffset = ((Math.sin(i * 0.5) * 0.005) + (Math.random() - 0.5) * 0.003) * currentPrice;
      return {
        time: timeStr,
        price: Number((currentPrice * 0.99 + priceOffset).toFixed(2))
      };
    });
    setChartData(baseData);

    // Initial trades
    const initialTrades: TradeLog[] = Array.from({ length: 5 }, (_, i) => {
      const sec = 5 - i;
      return {
        id: `t-${i}-${Date.now()}`,
        time: `11:08:${(50 - sec).toString().padStart(2, "0")}`,
        price: Number((currentPrice * (1 + (Math.random() - 0.5) * 0.001)).toFixed(2)),
        qty: Math.floor(10 + Math.random() * 200) * 10,
        type: Math.random() > 0.45 ? "BUY" : "SELL"
      };
    });
    setTrades(initialTrades);
  }, [currentPrice, dayHigh, dayLow, propPrevClose]);

  // 4. Live Tick Interval Loop (Every 2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice((prev) => {
        // Random tick step (capped at +/- 0.15% per tick)
        const tickPct = (Math.random() - 0.5) * 0.0012;
        const nextPrice = Number((prev * (1 + tickPct)).toFixed(2));
        
        // Update High/Low boundaries
        setHigh((h) => Math.max(h, nextPrice));
        setLow((l) => Math.min(l, nextPrice));
        setVolume((v) => v + Math.floor(Math.random() * 8) * 100);

        // Prepend new trade log
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
        const newTrade: TradeLog = {
          id: `t-${Date.now()}`,
          time: timeStr,
          price: nextPrice,
          qty: Math.floor(5 + Math.random() * 120) * 10,
          type: Math.random() > 0.5 ? "BUY" : "SELL"
        };
        setTrades((t) => [newTrade, ...t.slice(0, 9)]);

        // Append to chart series (updating latest or adding new tick)
        setChartData((prevSeries) => {
          const last = prevSeries[prevSeries.length - 1];
          const currentMin = now.getMinutes().toString().padStart(2, "0");
          const currentTimeStr = `${now.getHours().toString().padStart(2, "0")}:${currentMin}`;
          
          if (last && last.time === currentTimeStr) {
            // Update current minute price
            return [...prevSeries.slice(0, -1), { time: currentTimeStr, price: nextPrice }];
          } else {
            // Add next minute index
            return [...prevSeries.slice(-15), { time: currentTimeStr, price: nextPrice }];
          }
        });

        return nextPrice;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // 5. Calculate Intraday Pivot Point Suggestion Board
  // Pivot calculations based on Open, High, Low, Close
  const pp = Number(((high + low + livePrice) / 3).toFixed(2));
  const r1 = Number(((2 * pp) - low).toFixed(2));
  const s1 = Number(((2 * pp) - high).toFixed(2));
  const r2 = Number((pp + (high - low)).toFixed(2));
  const s2 = Number((pp - (high - low)).toFixed(2));
  const vwap = Number((livePrice * 0.999).toFixed(2));

  // Determine current trend percentage
  const changePct = Number((((livePrice - prevClose) / prevClose) * 100).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Live Ticker */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between col-span-2 md:col-span-1 border-emeraldGreen/10">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Live Tick Quote</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">₹{livePrice.toFixed(2)}</span>
            <span className={`text-xs font-bold flex items-center ${changePct >= 0 ? "text-emeraldGreen" : "text-roseRed"}`}>
              {changePct >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {changePct >= 0 ? `+${changePct}%` : `${changePct}%`}
            </span>
          </div>
        </div>

        {/* Open */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Today's Open</span>
          <span className="text-lg font-extrabold text-slate-200">₹{open.toFixed(2)}</span>
        </div>

        {/* High */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between border-t border-t-emeraldGreen/20">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Daily High</span>
          <span className="text-lg font-extrabold text-emeraldGreen">₹{high.toFixed(2)}</span>
        </div>

        {/* Low */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between border-t border-t-roseRed/20">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Daily Low</span>
          <span className="text-lg font-extrabold text-roseRed">₹{low.toFixed(2)}</span>
        </div>

        {/* Volume */}
        <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Daily Volume</span>
          <span className="text-lg font-extrabold text-slate-200">{volume.toLocaleString("en-IN")} shrs</span>
        </div>
      </div>

      {/* Main Core Layout: Live Chart & Trade Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Intraday Line Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4.5 h-4.5 text-emeraldGreen animate-pulse" />
              Live 1-Minute Price Ticker
            </h3>
            <span className="text-[10px] text-emeraldGreen font-semibold uppercase tracking-wider bg-emeraldGreen/10 px-2 py-0.5 rounded border border-emeraldGreen/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emeraldGreen animate-ping"></span>
              Live Feed
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIntraday" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="time" stroke="#6B7280" tickLine={false} style={{ fontSize: 9 }} />
                <YAxis 
                  stroke="#6B7280" 
                  tickLine={false} 
                  style={{ fontSize: 9 }} 
                  domain={["auto", "auto"]}
                />
                <Tooltip 
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-panel p-2.5 rounded-lg border border-darkBorder shadow-2xl text-[11px] font-semibold">
                          <p className="text-slate-500 uppercase tracking-wider">{payload[0].payload.time}</p>
                          <p className="text-emeraldGreen font-bold mt-1">₹{payload[0].value.toFixed(2)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIntraday)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Trades Log Panel */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Live Order stream</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider pb-1.5 border-b border-darkBorder/40">
                <span>Time</span>
                <span className="text-right">Price</span>
                <span className="text-right">Qty</span>
                <span className="text-right">Action</span>
              </div>
              
              {trades.map((t) => (
                <div key={t.id} className="grid grid-cols-4 text-xs font-semibold py-1 border-b border-darkBorder/20 last:border-0 items-center">
                  <span className="text-slate-500 text-[10px] font-mono">{t.time}</span>
                  <span className="text-right text-slate-300">₹{t.price.toFixed(2)}</span>
                  <span className="text-right text-slate-400">{t.qty}</span>
                  <span className={`text-right font-black text-[10px] ${t.type === "BUY" ? "text-emeraldGreen" : "text-roseRed"}`}>
                    {t.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase pt-3 border-t border-darkBorder/40 mt-4 flex items-center justify-between">
            <span>TICK-BY-TICK FEED</span>
            <span className="text-emeraldGreen">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Intraday Target Suggestions & Pivot Board */}
      <div className="glass-panel p-6 rounded-2xl border border-emeraldGreen/20">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-emeraldGreen" />
          Intraday Pivot Board & Target Ranges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Target Buy Support Band */}
          <div className="p-4 rounded-xl bg-emeraldGreen/5 border border-emeraldGreen/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-emeraldGreen font-bold uppercase tracking-wider block mb-1">Intraday Buy Range (S1 - S2 Support)</span>
              <span className="text-2xl font-black text-emeraldGreen">₹{s2.toFixed(2)} - ₹{s1.toFixed(2)}</span>
              <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed font-light">
                Support levels S1 (₹{s1}) and S2 (₹{s2}) represent strong price cushions. Buying inside this zone is historically favorable for intraday pullbacks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emeraldGreen/20 text-[9px] font-bold text-emeraldGreen uppercase tracking-wider">
              S1: ₹{s1} • S2: ₹{s2}
            </div>
          </div>

          {/* Pivot Points Gauge */}
          <div className="p-4 rounded-xl bg-darkCard/40 border border-darkBorder flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Pivot Indicator (PP & VWAP)</span>
              
              <div className="space-y-3 mt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Volume Weighted Avg Price (VWAP)</span>
                  <span className="text-slate-200 font-bold">₹{vwap.toFixed(2)}</span>
                </div>
                <div className="w-full bg-darkBorder h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full" style={{ width: "50%" }}></div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Central Pivot Point (PP)</span>
                  <span className="text-slate-200 font-bold">₹{pp.toFixed(2)}</span>
                </div>
                <div className="w-full bg-darkBorder h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full" style={{ width: "50%" }}></div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic mt-4">
              *VWAP serves as the primary momentum boundary. Trading above VWAP is bullish.
            </p>
          </div>

          {/* Target Sell Resistance Band */}
          <div className="p-4 rounded-xl bg-roseRed/5 border border-roseRed/20 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-roseRed font-bold uppercase tracking-wider block mb-1">Intraday Sell Range (R1 - R2 Resistance)</span>
              <span className="text-2xl font-black text-roseRed">₹{r1.toFixed(2)} - ₹{r2.toFixed(2)}</span>
              <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed font-light">
                Resistance levels R1 (₹{r1}) and R2 (₹{r2}) represent sell order blocks. DAY TRADERS should book profits or scale out of positions inside this target band.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-roseRed/20 text-[9px] font-bold text-roseRed uppercase tracking-wider">
              R1: ₹{r1} • R2: ₹{r2}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
