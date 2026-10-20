import {
  ADDITIONAL_MEDICARE_RATE,
  ADDITIONAL_MEDICARE_THRESHOLD,
  MEDICARE_RATE,
  SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_WAGE_BASE,
  STANDARD_DEDUCTION,
  federalIncomeTax,
  federalMarginalRate,
  getState,
  stateIncomeTax,
  type FilingStatus,
} from "./tax.ts";

export type PayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

export const FREQUENCY: Record<
  PayFrequency,
  { periods: number; label: string; short: string; check: string; fullTimeHours: number }
> = {
  weekly: { periods: 52, label: "Weekly", short: "Week", check: "this week", fullTimeHours: 40 },
  biweekly: {
    periods: 26,
    label: "Every 2 weeks",
    short: "2 weeks",
    check: "this paycheck",
    fullTimeHours: 80,
  },
  semimonthly: {
    periods: 24,
    label: "Twice a month",
    short: "2× month",
    check: "this paycheck",
    fullTimeHours: 86.67,
  },
  monthly: {
    periods: 12,
    label: "Monthly",
    short: "Month",
    check: "this month",
    fullTimeHours: 173.33,
  },
};

export type PaycheckInputs = {
  hourly: number;
  regularHours: number;
  overtimeHours: number;
  overtimeMultiplier: number;
  frequency: PayFrequency;
  filing: FilingStatus;
  stateId: string;
  /** 0–1. Null uses the built-in state estimate. */
  stateOverrideRate: number | null;
  /** 0–1 of gross, traditional retirement deferral. */
  retirementRate: number;
  /** Section 125 benefits per paycheck (health, FSA, HSA). Reduces income tax and FICA. */
  healthPerCheck: number;
  /** Local wage tax rate, 0–1, applied to gross wages. */
  localRate: number;
  extraFederalPerCheck: number;
  postTaxPerCheck: number;
};

export type PayRow = {
  id: string;
  label: string;
  detail: string;
  perCheck: number;
  annual: number;
  tone: "gross" | "tax" | "deduction" | "net";
};

export type PaySegment = {
  id: string;
  label: string;
  amount: number;
  share: number;
};

export type PayResult = {
  rows: PayRow[];
  segments: PaySegment[];
  grossPerCheck: number;
  grossAnnual: number;
  takeHomePerCheck: number;
  takeHomeAnnual: number;
  taxShare: number;
  hourlyNet: number;
  federalMarginal: number;
  grossExplain: string;
  bracketLabel: string;
  stateSummary: string;
  ficaCapped: boolean;
  periods: number;
  checkLabel: string;
  empty: boolean;
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatMoney(value: number): string {
  return money.format(value);
}

export function formatRate(rate: number, digits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(rate);
}

export function cents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function row(
  id: string,
  label: string,
  detail: string,
  annual: number,
  periods: number,
  tone: PayRow["tone"],
): PayRow {
  const annualCents = cents(annual);
  return {
    id,
    label,
    detail,
    annual: annualCents,
    perCheck: cents(annualCents / periods),
    tone,
  };
}

export function calculatePaycheck(input: PaycheckInputs): PayResult {
  const frequency = FREQUENCY[input.frequency] ?? FREQUENCY.weekly;
  const periods = frequency.periods;
  const hourly = clamp(input.hourly, 0, 100_000);
  const regularHours = clamp(input.regularHours, 0, 1_000);
  const overtimeHours = clamp(input.overtimeHours, 0, 1_000);
  const overtimeMultiplier = clamp(input.overtimeMultiplier, 1, 5);
  const retirementRate = clamp(input.retirementRate, 0, 1);
  const localRate = clamp(input.localRate, 0, 0.5);
  const stateOverride =
    input.stateOverrideRate == null ? null : clamp(input.stateOverrideRate, 0, 0.5);
  const healthPerCheck = clamp(input.healthPerCheck, 0, 100_000);
  const extraFederalPerCheck = clamp(input.extraFederalPerCheck, 0, 100_000);
  const postTaxPerCheck = clamp(input.postTaxPerCheck, 0, 100_000);

  const grossPerCheck = cents(hourly * regularHours + hourly * overtimeMultiplier * overtimeHours);
  const grossAnnual = cents(grossPerCheck * periods);
  const state = getState(input.stateId);

  const retirementAnnual = cents(Math.min(grossAnnual, grossAnnual * retirementRate));
  const healthAnnual = cents(Math.min(healthPerCheck * periods, Math.max(0, grossAnnual - retirementAnnual)));

  const ficaWages = Math.max(0, grossAnnual - healthAnnual);
  const fitWages = Math.max(0, ficaWages - retirementAnnual);
  const stateWages = state.retirementDeductible ? fitWages : ficaWages;

  const federalAnnual = federalIncomeTax(fitWages, input.filing);
  const marginal = federalMarginalRate(fitWages, input.filing);
  const stateAnnual = stateIncomeTax(stateWages, input.filing, state, stateOverride);
  const localAnnual = grossAnnual * localRate;
  const socialSecurityAnnual = Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE;
  const medicareAnnual = ficaWages * MEDICARE_RATE;
  const additionalMedicareAnnual =
    Math.max(0, ficaWages - ADDITIONAL_MEDICARE_THRESHOLD[input.filing]) * ADDITIONAL_MEDICARE_RATE;
  const extraFederalAnnual = extraFederalPerCheck * periods;
  const postTaxAnnual = postTaxPerCheck * periods;

  const deductionAnnual =
    retirementAnnual +
    healthAnnual +
    federalAnnual +
    stateAnnual +
    localAnnual +
    socialSecurityAnnual +
    medicareAnnual +
    additionalMedicareAnnual +
    extraFederalAnnual +
    postTaxAnnual;
  const takeHomeAnnual = cents(grossAnnual - deductionAnnual);

  const taxableIncome = Math.max(0, fitWages - STANDARD_DEDUCTION[input.filing]);
  const bracketLabel =
    taxableIncome <= 0 ? "Under the standard deduction" : `${formatRate(marginal, 0)} federal bracket`;

  let stateSummary = "No tax on wages";
  if (stateOverride != null) stateSummary = `${formatRate(stateOverride)} flat rate you set`;
  else if (state.kind === "flat") stateSummary = `${formatRate(state.rate)} flat`;
  else if (state.kind === "graduated") stateSummary = "Graduated estimate";

  const stateDetail = state.retirementDeductible
    ? stateSummary
    : `${stateSummary} · retirement deferrals are taxed`;

  const hours = regularHours + overtimeHours;
  const otRate = hourly * overtimeMultiplier;
  const grossExplain =
    hours <= 0
      ? "Add hours to estimate a paycheck."
      : overtimeHours > 0
        ? `${trimHours(regularHours)} hrs × ${formatMoney(hourly)} + ${trimHours(overtimeHours)} hrs × ${formatMoney(otRate)} overtime`
        : `${trimHours(regularHours)} hrs × ${formatMoney(hourly)}`;

  const rows: PayRow[] = [
    row("gross", "Gross pay", grossExplain, grossAnnual, periods, "gross"),
  ];
  if (retirementAnnual > 0) {
    rows.push(
      row(
        "retirement",
        "401(k) deferral",
        `${formatRate(retirementRate)} of gross · pre-tax`,
        retirementAnnual,
        periods,
        "deduction",
      ),
    );
  }
  if (healthAnnual > 0) {
    rows.push(
      row(
        "health",
        "Health and pre-tax benefits",
        "Reduces income tax and FICA",
        healthAnnual,
        periods,
        "deduction",
      ),
    );
  }
  rows.push(
    row(
      "federal",
      "Federal income tax",
      bracketLabel,
      federalAnnual,
      periods,
      "tax",
    ),
  );
  if (extraFederalAnnual > 0) {
    rows.push(
      row("extra-federal", "Extra federal withholding", "Added on top of the estimate", extraFederalAnnual, periods, "tax"),
    );
  }
  rows.push(row("state", `${state.name} income tax`, stateDetail, stateAnnual, periods, "tax"));
  if (localAnnual > 0) {
    rows.push(row("local", "Local wage tax", `${formatRate(localRate)} of gross wages`, localAnnual, periods, "tax"));
  }
  rows.push(
    row(
      "social-security",
      "Social Security",
      ficaWages > SOCIAL_SECURITY_WAGE_BASE
        ? `6.2% up to ${formatMoney(SOCIAL_SECURITY_WAGE_BASE)}`
        : "6.2% of FICA wages",
      socialSecurityAnnual,
      periods,
      "tax",
    ),
  );
  rows.push(row("medicare", "Medicare", "1.45% of FICA wages", medicareAnnual, periods, "tax"));
  if (additionalMedicareAnnual > 0) {
    rows.push(
      row(
        "additional-medicare",
        "Additional Medicare",
        `0.9% over ${formatMoney(ADDITIONAL_MEDICARE_THRESHOLD[input.filing])}`,
        additionalMedicareAnnual,
        periods,
        "tax",
      ),
    );
  }
  if (postTaxAnnual > 0) {
    rows.push(row("post-tax", "After-tax deductions", "Does not reduce taxes", postTaxAnnual, periods, "deduction"));
  }
  rows.push(row("net", "Take-home pay", frequency.check, takeHomeAnnual, periods, "net"));

  const taxAnnual =
    federalAnnual +
    extraFederalAnnual +
    stateAnnual +
    localAnnual +
    socialSecurityAnnual +
    medicareAnnual +
    additionalMedicareAnnual;
  const otherAnnual = retirementAnnual + healthAnnual + postTaxAnnual;

  const segments: PaySegment[] = [];
  const pushSeg = (id: string, label: string, amount: number) => {
    const rounded = cents(amount);
    if (rounded <= 0 || grossAnnual <= 0) return;
    segments.push({ id, label, amount: rounded, share: rounded / grossAnnual });
  };
  pushSeg("net", "Take-home", Math.max(0, takeHomeAnnual));
  pushSeg("federal", "Federal", federalAnnual + extraFederalAnnual);
  pushSeg("state", "State and local", stateAnnual + localAnnual);
  pushSeg("fica", "Social Security and Medicare", socialSecurityAnnual + medicareAnnual + additionalMedicareAnnual);
  pushSeg("other", "Other deductions", otherAnnual);

  const netPerCheck = rows.find((item) => item.id === "net")?.perCheck ?? 0;

  return {
    rows,
    segments,
    grossPerCheck,
    grossAnnual,
    takeHomePerCheck: netPerCheck,
    takeHomeAnnual: cents(takeHomeAnnual),
    taxShare: grossAnnual > 0 ? taxAnnual / grossAnnual : 0,
    hourlyNet: hours > 0 ? cents(netPerCheck / hours) : 0,
    federalMarginal: marginal,
    grossExplain,
    bracketLabel,
    stateSummary,
    ficaCapped: ficaWages > SOCIAL_SECURITY_WAGE_BASE,
    periods,
    checkLabel: frequency.check,
    empty: grossPerCheck <= 0,
  };
}

function trimHours(hours: number): string {
  if (Number.isInteger(hours)) return String(hours);
  return String(Math.round(hours * 100) / 100);
}
