/**
 * 2026 U.S. paycheck tax constants.
 * Federal brackets and standard deduction: IRS inflation adjustments for tax year 2026.
 * Social Security wage base: $184,500 (employee OASDI 6.2%).
 * State figures are simplified estimates from published 2026 rate ranges — not withholding tables.
 */

export type FilingStatus = "single" | "mfj" | "mfs" | "hoh";

export type Bracket = readonly [floor: number, rate: number];

export const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 16_100,
  mfs: 16_100,
  mfj: 32_200,
  hoh: 24_150,
};

/** Lower bounds of each marginal rate. Head-of-household upper bands follow the single schedule. */
export const FEDERAL_BRACKETS: Record<FilingStatus, readonly Bracket[]> = {
  single: [
    [0, 0.1],
    [12_400, 0.12],
    [50_400, 0.22],
    [105_700, 0.24],
    [201_775, 0.32],
    [256_225, 0.35],
    [640_600, 0.37],
  ],
  mfs: [
    [0, 0.1],
    [12_400, 0.12],
    [50_400, 0.22],
    [105_700, 0.24],
    [201_775, 0.32],
    [256_225, 0.35],
    [640_600, 0.37],
  ],
  mfj: [
    [0, 0.1],
    [24_800, 0.12],
    [100_800, 0.22],
    [211_400, 0.24],
    [403_550, 0.32],
    [512_450, 0.35],
    [768_700, 0.37],
  ],
  hoh: [
    [0, 0.1],
    [17_700, 0.12],
    [67_450, 0.22],
    [105_700, 0.24],
    [201_750, 0.32],
    [256_225, 0.35],
    [640_600, 0.37],
  ],
};

export const SOCIAL_SECURITY_RATE = 0.062;
export const SOCIAL_SECURITY_WAGE_BASE = 184_500;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009;

/** Additional Medicare tax owed above these wages (not the employer's $200k withholding trigger). */
export const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200_000,
  hoh: 200_000,
  mfj: 250_000,
  mfs: 125_000,
};

export type StateKind = "none" | "flat" | "graduated";

export type StateRule = {
  id: string;
  name: string;
  kind: StateKind;
  /** Flat rate, or ignored for graduated / none. */
  rate: number;
  /** Single-filer deduction. Doubled for married filing jointly. */
  deduction: number;
  /** Bottom of the published range. Marginal rate starts here. */
  low: number;
  /** Rate a typical full-time worker approaches — not the millionaire bracket. */
  high: number;
  /** Taxable income over which the marginal rate rises from `low` to `high`. */
  span: number;
  /** Traditional 401(k) deferrals reduce this state's wage base. Pennsylvania does not. */
  retirementDeductible: boolean;
};

const g = (
  id: string,
  name: string,
  low: number,
  high: number,
  span: number,
  deduction: number,
): StateRule => ({
  id,
  name,
  kind: "graduated",
  rate: high,
  deduction,
  low,
  high,
  span,
  retirementDeductible: true,
});

const f = (id: string, name: string, rate: number, deduction = 0): StateRule => ({
  id,
  name,
  kind: "flat",
  rate,
  deduction,
  low: rate,
  high: rate,
  span: 1,
  retirementDeductible: true,
});

const none = (id: string, name: string): StateRule => ({
  id,
  name,
  kind: "none",
  rate: 0,
  deduction: 0,
  low: 0,
  high: 0,
  span: 1,
  retirementDeductible: true,
});

export const STATES: readonly StateRule[] = [
  g("AL", "Alabama", 0.02, 0.05, 8_000, 3_000),
  none("AK", "Alaska"),
  f("AZ", "Arizona", 0.025, 16_100),
  g("AR", "Arkansas", 0, 0.037, 50_000, 2_470),
  g("CA", "California", 0.01, 0.093, 80_000, 5_900),
  f("CO", "Colorado", 0.044, 16_100),
  g("CT", "Connecticut", 0.02, 0.0699, 150_000, 0),
  g("DE", "Delaware", 0, 0.066, 80_000, 3_250),
  g("DC", "District of Columbia", 0.04, 0.085, 150_000, 15_000),
  none("FL", "Florida"),
  f("GA", "Georgia", 0.0499, 15_000),
  g("HI", "Hawaii", 0.014, 0.088, 120_000, 8_000),
  f("ID", "Idaho", 0.053, 16_100),
  f("IL", "Illinois", 0.0495, 0),
  f("IN", "Indiana", 0.0295, 0),
  f("IA", "Iowa", 0.038, 16_100),
  g("KS", "Kansas", 0.052, 0.0558, 40_000, 3_605),
  f("KY", "Kentucky", 0.035, 3_360),
  f("LA", "Louisiana", 0.03, 12_875),
  g("ME", "Maine", 0.058, 0.0715, 120_000, 15_700),
  g("MD", "Maryland", 0.02, 0.055, 150_000, 3_400),
  f("MA", "Massachusetts", 0.05, 0),
  f("MI", "Michigan", 0.0425, 0),
  g("MN", "Minnesota", 0.0535, 0.0785, 180_000, 15_300),
  f("MS", "Mississippi", 0.04, 2_300),
  g("MO", "Missouri", 0, 0.047, 10_000, 16_100),
  g("MT", "Montana", 0.047, 0.0565, 40_000, 16_100),
  g("NE", "Nebraska", 0.0246, 0.0455, 80_000, 8_850),
  none("NV", "Nevada"),
  none("NH", "New Hampshire"),
  g("NJ", "New Jersey", 0.014, 0.0637, 150_000, 0),
  g("NM", "New Mexico", 0.015, 0.049, 100_000, 16_100),
  g("NY", "New York", 0.039, 0.0685, 140_000, 8_000),
  f("NC", "North Carolina", 0.0399, 12_750),
  g("ND", "North Dakota", 0, 0.025, 150_000, 16_100),
  f("OH", "Ohio", 0.0275, 0),
  g("OK", "Oklahoma", 0, 0.045, 20_000, 6_350),
  g("OR", "Oregon", 0.0475, 0.088, 150_000, 2_910),
  {
    ...f("PA", "Pennsylvania", 0.0307, 0),
    retirementDeductible: false,
  },
  g("RI", "Rhode Island", 0.0375, 0.0599, 150_000, 11_200),
  g("SC", "South Carolina", 0.0199, 0.0521, 20_000, 15_000),
  none("SD", "South Dakota"),
  none("TN", "Tennessee"),
  none("TX", "Texas"),
  f("UT", "Utah", 0.0445, 0),
  g("VT", "Vermont", 0.0335, 0.066, 150_000, 7_850),
  g("VA", "Virginia", 0.02, 0.0575, 20_000, 8_750),
  none("WA", "Washington"),
  g("WV", "West Virginia", 0.0211, 0.0458, 50_000, 0),
  g("WI", "Wisconsin", 0.035, 0.053, 40_000, 13_960),
  none("WY", "Wyoming"),
];

const STATE_BY_ID = new Map(STATES.map((state) => [state.id, state]));

export function getState(id: string): StateRule {
  return STATE_BY_ID.get(id) ?? STATE_BY_ID.get("PA")!;
}

export function statesAlphabetical(): StateRule[] {
  return [...STATES].sort((a, b) => a.name.localeCompare(b.name));
}

export function taxFromBrackets(taxable: number, brackets: readonly Bracket[]): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const floor = brackets[i][0];
    const rate = brackets[i][1];
    const ceiling = i + 1 < brackets.length ? brackets[i + 1][0] : Number.POSITIVE_INFINITY;
    if (taxable <= floor) break;
    tax += (Math.min(taxable, ceiling) - floor) * rate;
  }
  return tax;
}

/** Rate that applies to the last dollar of taxable income. Zero when nothing is taxable. */
export function marginalRate(taxable: number, brackets: readonly Bracket[]): number {
  if (taxable <= 0) return 0;
  let rate = brackets[0][1];
  for (let i = 1; i < brackets.length; i++) {
    if (taxable > brackets[i][0]) rate = brackets[i][1];
  }
  return rate;
}

export function federalIncomeTax(taxableWages: number, filing: FilingStatus): number {
  const taxable = Math.max(0, taxableWages - STANDARD_DEDUCTION[filing]);
  return taxFromBrackets(taxable, FEDERAL_BRACKETS[filing]);
}

export function federalMarginalRate(taxableWages: number, filing: FilingStatus): number {
  const taxable = Math.max(0, taxableWages - STANDARD_DEDUCTION[filing]);
  return marginalRate(taxable, FEDERAL_BRACKETS[filing]);
}

function filingScale(filing: FilingStatus): number {
  return filing === "mfj" ? 2 : 1;
}

/** State income tax on `wages` (already reduced for deductible pre-tax items). */
export function stateIncomeTax(wages: number, filing: FilingStatus, state: StateRule, overrideRate: number | null): number {
  const base = Math.max(0, wages);
  if (overrideRate != null) return base * overrideRate;
  if (state.kind === "none") return 0;
  const scale = filingScale(filing);
  const deduction = state.deduction * scale;
  const taxable = Math.max(0, base - deduction);
  if (state.kind === "flat") return taxable * state.rate;
  const span = Math.max(1, state.span * scale);
  const rise = Math.max(0, state.high - state.low);
  if (taxable <= span) {
    return state.low * taxable + (rise * taxable * taxable) / (2 * span);
  }
  const atSpan = state.low * span + (rise * span) / 2;
  return atSpan + state.high * (taxable - span);
}
