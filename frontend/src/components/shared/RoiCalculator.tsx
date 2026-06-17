import React, { useMemo, useState } from 'react';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, Legend,
} from 'recharts';
import { roiDefaults as mockRoi } from '@/data/mockData';
import { formatCurrencyForSource, useClientCurrencySource, type CurrencySource } from '@/lib/currency';
import {
  buildProjectionSeries,
  computeRoiSimulation,
  DEFAULT_MONTHLY_CLIENT_RETAINER,
  DEFAULT_MONTHLY_MEETINGS,
  normalizeCloseRatePercent,
  type RoiSimulationInput,
} from '@/lib/roiSimulation';

type Props = {
  currencySource?: CurrencySource;
  className?: string;
  subtitle?: string;
  initialDefaults?: Partial<Pick<RoiSimulationInput, 'acv' | 'closeRatePercent' | 'runwayMonths'>>;
};

const RoiCalculator: React.FC<Props> = ({ currencySource: currencySourceProp, className = '', subtitle, initialDefaults }) => {
  const scopedCurrency = useClientCurrencySource();
  const currencySource = currencySourceProp ?? scopedCurrency;
  const [acv, setAcv] = useState(initialDefaults?.acv ?? mockRoi.acv);
  const [closeRatePercent, setCloseRatePercent] = useState(
    normalizeCloseRatePercent(initialDefaults?.closeRatePercent ?? mockRoi.closeRate),
  );
  const [runway, setRunway] = useState(initialDefaults?.runwayMonths ?? mockRoi.runway);

  const simInput: RoiSimulationInput = useMemo(
    () => ({ acv, closeRatePercent, runwayMonths: runway }),
    [acv, closeRatePercent, runway],
  );

  const roiCalc = useMemo(() => computeRoiSimulation(simInput), [simInput]);
  const projectionData = useMemo(() => buildProjectionSeries(simInput), [simInput]);

  const compactMoney = (value: number) =>
    formatCurrencyForSource(value, currencySource, { notation: 'compact', maximumFractionDigits: 2 });
  const shortMoney = (value: number) => formatCurrencyForSource(value, currencySource);

  const returnMultipleLabel =
    Math.abs(roiCalc.returnMultiple) >= 100
      ? `${roiCalc.returnMultiple.toFixed(0)}×`
      : `${roiCalc.returnMultiple.toFixed(1)}×`;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))]/25 px-3 py-2.5 space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-wider text-[hsl(var(--foreground))]">
          Client ROI simulation
        </p>
        <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">
          Models the client&apos;s expected closed revenue vs their monthly platform retainer — not UP100X internal
          COGS. For GCC operations cost, use finance / commissions views.
        </p>
        {subtitle && <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-relaxed">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SliderField
          label="Average ACV"
          display={shortMoney(acv)}
          min={10000}
          max={500000}
          step={5000}
          value={acv}
          onChange={setAcv}
          minLabel={compactMoney(10000)}
          maxLabel={compactMoney(500000)}
        />
        <SliderField
          label="Close rate"
          display={`${closeRatePercent}%`}
          min={5}
          max={50}
          step={1}
          value={closeRatePercent}
          onChange={setCloseRatePercent}
          minLabel="5%"
          maxLabel="50%"
        />
        <SliderField
          label="Horizon"
          display={`${runway} mo`}
          min={3}
          max={12}
          step={1}
          value={runway}
          onChange={setRunway}
          minLabel="3 mo"
          maxLabel="12 mo"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Projected meetings" value={String(roiCalc.projectedMeetings)} />
        <StatTile label="Pipeline (ACV × meetings)" value={compactMoney(roiCalc.pipelineValue)} accent />
        <StatTile label="Expected closed revenue" value={compactMoney(roiCalc.expectedRevenue)} positive />
        <StatTile
          label="Return multiple"
          value={returnMultipleLabel}
          sub={`${roiCalc.returnPercent.toFixed(0)}% on ${shortMoney(roiCalc.totalClientSpend)} spend`}
          className={roiCalc.returnMultiple >= 0 ? 'text-emerald-400' : 'text-red-400'}
        />
      </div>

      <div>
        <h4 className="text-xs font-mono uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">
          Cumulative projection (from this month)
        </h4>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} key={`${acv}-${closeRatePercent}-${runway}`}>
              <defs>
                <linearGradient id="revGradientRoi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costGradientRoi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={(v) => compactMoney(Number(v))} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border-v))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value: number, name: string) => [
                  shortMoney(Math.round(value)),
                  name === 'revenue' ? 'Cumulative expected revenue' : 'Cumulative client retainer',
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area
                type="monotone"
                dataKey="clientSpend"
                stroke="hsl(var(--muted-foreground))"
                fill="url(#costGradientRoi)"
                strokeWidth={1.5}
                name="Client retainer"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                fill="url(#revGradientRoi)"
                strokeWidth={2}
                name="Expected revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] mt-2">
          {DEFAULT_MONTHLY_MEETINGS} meetings/mo · {shortMoney(DEFAULT_MONTHLY_CLIENT_RETAINER)}/mo client retainer (simulated)
        </p>
      </div>

      <details className="rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--card))]/50 px-3 py-2 text-[10px] text-[hsl(var(--muted-foreground))]">
        <summary className="cursor-pointer font-mono uppercase tracking-wider text-[hsl(var(--foreground))] py-1">
          How these numbers are calculated
        </summary>
        <ul className="mt-2 space-y-1.5 list-disc pl-4 leading-relaxed">
          <li>
            <strong className="text-[hsl(var(--foreground))]">Meetings</strong> = {DEFAULT_MONTHLY_MEETINGS} × {runway} months ={' '}
            {roiCalc.projectedMeetings}
          </li>
          <li>
            <strong className="text-[hsl(var(--foreground))]">Pipeline</strong> = meetings × ACV = {shortMoney(roiCalc.pipelineValue)}
          </li>
          <li>
            <strong className="text-[hsl(var(--foreground))]">Expected revenue</strong> = pipeline × ({closeRatePercent}% ÷ 100) ={' '}
            {shortMoney(roiCalc.expectedRevenue)}
            <span className="block text-[9px] mt-0.5 opacity-80">
              Close rate is stored as {closeRatePercent} (percent), applied as × {roiCalc.closeRateDecimal.toFixed(2)} — not × {closeRatePercent}.
            </span>
          </li>
          <li>
            <strong className="text-[hsl(var(--foreground))]">Client spend</strong> = {runway} × {shortMoney(DEFAULT_MONTHLY_CLIENT_RETAINER)} retainer ={' '}
            {shortMoney(roiCalc.totalClientSpend)}
          </li>
          <li>
            <strong className="text-[hsl(var(--foreground))]">Return multiple</strong> = (expected revenue − client spend) ÷ client spend ={' '}
            {returnMultipleLabel}
            <span className="block text-[9px] mt-0.5 opacity-80">
              Shown as “{returnMultipleLabel}” (e.g. 190×), not “{(roiCalc.returnMultiple * 100).toFixed(0)}×”. Multiplying the multiple by 100 again was the prior bug.
            </span>
          </li>
        </ul>
      </details>
    </div>
  );
};

function SliderField({
  label,
  display,
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string;
  display: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <div>
      <label className="flex justify-between text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">
        <span>{label}</span>
        <span className="text-[hsl(var(--primary))]">{display}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-[hsl(var(--muted))] rounded-full appearance-none cursor-pointer accent-[hsl(var(--primary))]"
      />
      <div className="flex justify-between mt-1">
        <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">{minLabel}</span>
        <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">{maxLabel}</span>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  accent,
  positive,
  className = '',
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  positive?: boolean;
  className?: string;
}) {
  return (
    <div className="p-3 bg-[hsl(var(--muted))] rounded-lg text-center">
      <p className="text-[9px] font-mono uppercase text-[hsl(var(--muted-foreground))] tracking-wider">{label}</p>
      <p
        className={`text-lg font-bold font-display mt-1 ${
          className || (positive ? 'text-emerald-400' : accent ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]')
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[9px] font-mono text-[hsl(var(--muted-foreground))] mt-1 leading-snug">{sub}</p>}
    </div>
  );
}

export default RoiCalculator;
