import React, { useState, useMemo } from 'react';
import { winLossData, objectionInsights, roiDefaults, revenueProjection } from '@/data/mockData';
import { useTheme } from '@/context/ThemeContext';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const AnalyticsView: React.FC = () => {
  const { currencySymbol } = useTheme();
  const [acv, setAcv] = useState(roiDefaults.acv);
  const [closeRate, setCloseRate] = useState(roiDefaults.closeRate);
  const [runway, setRunway] = useState(roiDefaults.runway);
  const [expandedObj, setExpandedObj] = useState<number | null>(null);
  const [expandedLoss, setExpandedLoss] = useState<number | null>(null);

  const roiCalc = useMemo(() => {
    const monthlyMeetings = 18;
    const projectedMeetings = monthlyMeetings * runway;
    const pipelineValue = projectedMeetings * acv;
    const expectedRevenue = pipelineValue * (closeRate / 100);
    const totalCost = runway * 3000;
    const roi = ((expectedRevenue - totalCost) / totalCost);
    return { projectedMeetings, pipelineValue, expectedRevenue, totalCost, roi };
  }, [acv, closeRate, runway]);

  const projectionData = revenueProjection.labels.slice(0, runway).map((label, i) => ({
    name: label,
    revenue: revenueProjection.data[i] * (closeRate / 100) * (acv / 145000),
    costs: revenueProjection.costs[i] * runway / 12,
  }));

  return (
    <div className="space-y-6">
      {/* Win/Loss + Objections Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Win/Loss Analysis */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Win/Loss Analysis</h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Won</span>
              </div>
              <p className="text-2xl font-bold font-display text-emerald-400">{winLossData.won.count}</p>
              <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] mt-1">{winLossData.won.percentage}% of deals</p>
              <p className="text-[10px] font-mono text-emerald-400 mt-1">Avg {currencySymbol}{(winLossData.won.avgDeal / 1000).toFixed(0)}k</p>
            </div>
            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <TrendingDown size={16} className="text-red-400" />
                <span className="text-[10px] font-mono uppercase text-red-400 tracking-wider">Lost</span>
              </div>
              <p className="text-2xl font-bold font-display text-red-400">{winLossData.lost.count}</p>
              <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] mt-1">{winLossData.lost.percentage}% of deals</p>
              <p className="text-[10px] font-mono text-red-400 mt-1">Avg {currencySymbol}{(winLossData.lost.avgDeal / 1000).toFixed(0)}k</p>
            </div>
          </div>

          {/* Loss Reasons Accordion */}
          <div>
            <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">Loss Reasons</p>
            <div className="space-y-2">
              {winLossData.reasons.map((reason, i) => {
                const isExpanded = expandedLoss === i;
                const pct = (reason.count / winLossData.lost.count) * 100;
                return (
                  <div key={i} className="border border-[hsl(var(--border-v))] rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-[hsl(var(--muted))] transition-colors"
                      onClick={() => setExpandedLoss(isExpanded ? null : i)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[hsl(var(--foreground))]">{reason.reason}</span>
                          <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{reason.count} deals</span>
                        </div>
                        <div className="h-3 bg-[hsl(var(--muted))] rounded overflow-hidden">
                          <div className="h-full bg-red-400 rounded transition-all" style={{ width: `${pct}%`, opacity: 0.6 }} />
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={14} className="ml-2 text-[hsl(var(--muted-foreground))]" /> : <ChevronDown size={14} className="ml-2 text-[hsl(var(--muted-foreground))]" />}
                    </button>
                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-[hsl(var(--border))]">
                        <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                          This is the #{i + 1} reason for lost deals. Consider adjusting your pitch or objection handling to address this concern earlier in the conversation.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Objection Insights */}
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Objection Insights</h3>

          <div className="space-y-3">
            {objectionInsights.map((obj, i) => {
              const isExpanded = expandedObj === i;
              const maxFreq = objectionInsights[0].frequency;
              const pct = (obj.frequency / maxFreq) * 100;
              return (
                <div key={i} className="border border-[hsl(var(--border-v))] rounded-lg overflow-hidden">
                  <button
                    className="w-full p-3 text-left hover:bg-[hsl(var(--muted))] transition-colors"
                    onClick={() => setExpandedObj(isExpanded ? null : i)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={12} className="text-yellow-400" />
                        <span className="text-xs font-medium text-[hsl(var(--foreground))]">{obj.objection}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{obj.frequency}%</span>
                        {isExpanded ? <ChevronUp size={14} className="text-[hsl(var(--muted-foreground))]" /> : <ChevronDown size={14} className="text-[hsl(var(--muted-foreground))]" />}
                      </div>
                    </div>
                    <div className="h-2.5 bg-[hsl(var(--muted))] rounded overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded transition-all" style={{ width: `${pct}%`, opacity: 0.6 }} />
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-[hsl(var(--border))]">
                      <p className="text-[10px] font-mono uppercase text-[hsl(var(--primary))] mb-1 tracking-wider">Recommended Rebuttal</p>
                      <p className="text-[11px] text-[hsl(var(--foreground))] leading-relaxed italic">"{obj.rebuttal}"</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROI Calculator */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">ROI Calculator</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="flex justify-between text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">
              <span>Average ACV</span>
              <span className="text-[hsl(var(--primary))]">{currencySymbol}{acv.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min={10000}
              max={500000}
              step={5000}
              value={acv}
              onChange={e => setAcv(Number(e.target.value))}
              className="w-full h-1.5 bg-[hsl(var(--muted))] rounded-full appearance-none cursor-pointer accent-[hsl(var(--primary))]"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">{currencySymbol}10k</span>
              <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">{currencySymbol}500k</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">
              <span>Close Rate %</span>
              <span className="text-[hsl(var(--primary))]">{closeRate}%</span>
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={closeRate}
              onChange={e => setCloseRate(Number(e.target.value))}
              className="w-full h-1.5 bg-[hsl(var(--muted))] rounded-full appearance-none cursor-pointer accent-[hsl(var(--primary))]"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">5%</span>
              <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">50%</span>
            </div>
          </div>

          <div>
            <label className="flex justify-between text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">
              <span>Runway (months)</span>
              <span className="text-[hsl(var(--primary))]">{runway}mo</span>
            </label>
            <input
              type="range"
              min={3}
              max={12}
              step={1}
              value={runway}
              onChange={e => setRunway(Number(e.target.value))}
              className="w-full h-1.5 bg-[hsl(var(--muted))] rounded-full appearance-none cursor-pointer accent-[hsl(var(--primary))]"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">3mo</span>
              <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">12mo</span>
            </div>
          </div>
        </div>

        {/* ROI Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-[hsl(var(--muted))] rounded-lg text-center">
            <p className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Projected Meetings</p>
            <p className="text-lg font-bold font-display text-[hsl(var(--foreground))] mt-1">{roiCalc.projectedMeetings}</p>
          </div>
          <div className="p-3 bg-[hsl(var(--muted))] rounded-lg text-center">
            <p className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Pipeline Value</p>
            <p className="text-lg font-bold font-display text-[hsl(var(--primary))] mt-1">{currencySymbol}{(roiCalc.pipelineValue / 1000000).toFixed(2)}M</p>
          </div>
          <div className="p-3 bg-[hsl(var(--muted))] rounded-lg text-center">
            <p className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">Expected Revenue</p>
            <p className="text-lg font-bold font-display text-emerald-400 mt-1">{currencySymbol}{(roiCalc.expectedRevenue / 1000000).toFixed(2)}M</p>
          </div>
          <div className="p-3 bg-[hsl(var(--muted))] rounded-lg text-center">
            <p className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">ROI</p>
            <p className={`text-lg font-bold font-display mt-1 ${roiCalc.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {(roiCalc.roi * 100).toFixed(0)}x
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Projection Chart */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Revenue Projection</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `${currencySymbol}${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border-v))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, 'Expected Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                fill="url(#revGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
