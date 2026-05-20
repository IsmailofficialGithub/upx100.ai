/**
 * Client ROI simulation — models the *client's* spend vs expected closed revenue,
 * not UP100X internal unit economics.
 */

export const DEFAULT_MONTHLY_MEETINGS = 18;
/** Typical client MRR/retainer used as the "cost" line in the simulation (editable later per org). */
export const DEFAULT_MONTHLY_CLIENT_RETAINER = 3000;

export type RoiSimulationInput = {
  acv: number;
  /** Whole-number percent, e.g. 22 means 22% — NOT 0.22 */
  closeRatePercent: number;
  runwayMonths: number;
  monthlyMeetings?: number;
  monthlyClientRetainer?: number;
};

export type RoiSimulationResult = {
  projectedMeetings: number;
  pipelineValue: number;
  expectedRevenue: number;
  totalClientSpend: number;
  /** (expectedRevenue - totalClientSpend) / totalClientSpend */
  returnMultiple: number;
  /** returnMultiple × 100, e.g. 190.4 → 19040% */
  returnPercent: number;
  closeRateDecimal: number;
};

export type ProjectionPoint = {
  name: string;
  revenue: number;
  clientSpend: number;
};

/** API or legacy payloads may send 0.22 or 22 — normalize to slider percent 5–50. */
export function normalizeCloseRatePercent(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 22;
  if (n > 0 && n <= 1) return Math.min(50, Math.max(5, Math.round(n * 100)));
  return Math.min(50, Math.max(5, Math.round(n)));
}

export function computeRoiSimulation(input: RoiSimulationInput): RoiSimulationResult {
  const monthlyMeetings = input.monthlyMeetings ?? DEFAULT_MONTHLY_MEETINGS;
  const monthlyClientRetainer = input.monthlyClientRetainer ?? DEFAULT_MONTHLY_CLIENT_RETAINER;
  const closeRatePercent = normalizeCloseRatePercent(input.closeRatePercent);
  const closeRateDecimal = closeRatePercent / 100;

  const projectedMeetings = monthlyMeetings * input.runwayMonths;
  const pipelineValue = projectedMeetings * input.acv;
  const expectedRevenue = pipelineValue * closeRateDecimal;
  const totalClientSpend = input.runwayMonths * monthlyClientRetainer;
  const returnMultiple =
    totalClientSpend > 0 ? (expectedRevenue - totalClientSpend) / totalClientSpend : 0;

  return {
    projectedMeetings,
    pipelineValue,
    expectedRevenue,
    totalClientSpend,
    returnMultiple,
    returnPercent: returnMultiple * 100,
    closeRateDecimal,
  };
}

/** Month labels starting from the current calendar month (not hard-coded Jul). */
export function projectionMonthLabels(runwayMonths: number, startDate: Date = new Date()): string[] {
  return Array.from({ length: runwayMonths }, (_, i) => {
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });
}

export function buildProjectionSeries(
  input: RoiSimulationInput,
  startDate: Date = new Date(),
): ProjectionPoint[] {
  const monthlyMeetings = input.monthlyMeetings ?? DEFAULT_MONTHLY_MEETINGS;
  const monthlyClientRetainer = input.monthlyClientRetainer ?? DEFAULT_MONTHLY_CLIENT_RETAINER;
  const closeRateDecimal = normalizeCloseRatePercent(input.closeRatePercent) / 100;
  const labels = projectionMonthLabels(input.runwayMonths, startDate);

  return labels.map((name, i) => {
    const month = i + 1;
    const meetingsCumulative = monthlyMeetings * month;
    const revenue = meetingsCumulative * input.acv * closeRateDecimal;
    const clientSpend = month * monthlyClientRetainer;
    return { name, revenue, clientSpend };
  });
}
