import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
  calculatePaycheck,
  formatMoney,
  formatRate,
  FREQUENCY,
  type PayFrequency,
  type PayResult,
} from "@/lib/paycheck/calculate";
import { AdsenseBanner } from "@/components/adsense-banner";
import { SiteFooter, SiteNav } from "@/components/site-chrome";
import { statesAlphabetical, type FilingStatus } from "@/lib/paycheck/tax";

const STORAGE_KEY = "takehome-inputs-v1";

const FREQUENCIES = Object.keys(FREQUENCY) as PayFrequency[];

const FILING: { id: FilingStatus; label: string }[] = [
  { id: "single", label: "Single" },
  { id: "mfj", label: "Married filing jointly" },
  { id: "mfs", label: "Married filing separately" },
  { id: "hoh", label: "Head of household" },
];

type FormValues = {
  hourly: string;
  regularHours: string;
  overtimeHours: string;
  overtimeMultiplier: string;
  frequency: PayFrequency;
  filing: FilingStatus;
  stateId: string;
  localPct: string;
  retirementPct: string;
  health: string;
  extraFederal: string;
  postTax: string;
  stateOverride: string;
};

const DEFAULTS: FormValues = {
  hourly: "20",
  regularHours: "40",
  overtimeHours: "0",
  overtimeMultiplier: "1.5",
  frequency: "weekly",
  filing: "single",
  stateId: "PA",
  localPct: "",
  retirementPct: "",
  health: "",
  extraFederal: "",
  postTax: "",
  stateOverride: "",
};

const FIELD =
  "h-11 w-full rounded-lg border border-line bg-paper px-3 text-base text-ink outline-none tabular-nums focus-visible:ring-2 focus-visible:ring-accent/30";

function parseAmount(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return 0;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function parseOptionalRate(value: string): number | null {
  if (value.trim() === "") return null;
  return parseAmount(value) / 100;
}

function isFrequency(value: unknown): value is PayFrequency {
  return typeof value === "string" && value in FREQUENCY;
}

function isFiling(value: unknown): value is FilingStatus {
  return value === "single" || value === "mfj" || value === "mfs" || value === "hoh";
}

function sanitize(raw: Partial<FormValues>): FormValues {
  const stateIds = new Set(statesAlphabetical().map((state) => state.id));
  return {
    hourly: typeof raw.hourly === "string" ? raw.hourly : DEFAULTS.hourly,
    regularHours: typeof raw.regularHours === "string" ? raw.regularHours : DEFAULTS.regularHours,
    overtimeHours: typeof raw.overtimeHours === "string" ? raw.overtimeHours : DEFAULTS.overtimeHours,
    overtimeMultiplier:
      typeof raw.overtimeMultiplier === "string" ? raw.overtimeMultiplier : DEFAULTS.overtimeMultiplier,
    frequency: isFrequency(raw.frequency) ? raw.frequency : DEFAULTS.frequency,
    filing: isFiling(raw.filing) ? raw.filing : DEFAULTS.filing,
    stateId: typeof raw.stateId === "string" && stateIds.has(raw.stateId) ? raw.stateId : DEFAULTS.stateId,
    localPct: typeof raw.localPct === "string" ? raw.localPct : "",
    retirementPct: typeof raw.retirementPct === "string" ? raw.retirementPct : "",
    health: typeof raw.health === "string" ? raw.health : "",
    extraFederal: typeof raw.extraFederal === "string" ? raw.extraFederal : "",
    postTax: typeof raw.postTax === "string" ? raw.postTax : "",
    stateOverride: typeof raw.stateOverride === "string" ? raw.stateOverride : "",
  };
}

function hasAdjustments(values: FormValues): boolean {
  return [values.localPct, values.retirementPct, values.health, values.extraFederal, values.postTax, values.stateOverride].some(
    (value) => value.trim() !== "" && parseAmount(value) !== 0,
  );
}

export function PaycheckApp() {
  const [values, setValues] = useState<FormValues>(DEFAULTS);
  const [openAdjust, setOpenAdjust] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const states = useMemo(() => statesAlphabetical(), []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const next = sanitize(JSON.parse(raw) as Partial<FormValues>);
        setValues(next);
        if (hasAdjustments(next)) setOpenAdjust(true);
      }
    } catch {
      /* ignore damaged saved inputs */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [values, hydrated]);

  const result = useMemo(
    () =>
      calculatePaycheck({
        hourly: parseAmount(values.hourly),
        regularHours: parseAmount(values.regularHours),
        overtimeHours: parseAmount(values.overtimeHours),
        overtimeMultiplier: values.overtimeMultiplier.trim() === "" ? 1.5 : parseAmount(values.overtimeMultiplier),
        frequency: values.frequency,
        filing: values.filing,
        stateId: values.stateId,
        stateOverrideRate: parseOptionalRate(values.stateOverride),
        retirementRate: parseAmount(values.retirementPct) / 100,
        healthPerCheck: parseAmount(values.health),
        localRate: parseAmount(values.localPct) / 100,
        extraFederalPerCheck: parseAmount(values.extraFederal),
        postTaxPerCheck: parseAmount(values.postTax),
      }),
    [values],
  );

  const set = (patch: Partial<FormValues>) => setValues((current) => ({ ...current, ...patch }));

  const fullTime = FREQUENCY[values.frequency].fullTimeHours;
  const enteredHours = parseAmount(values.regularHours) + parseAmount(values.overtimeHours);
  const showFullTimeHint = enteredHours > 0 && enteredHours < fullTime * 0.7;

  return (
    <main className="min-h-screen bg-paper pb-28 text-ink lg:pb-10">
      <AdsenseBanner />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <SiteNav />
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Paycheck calculator</p>
            <h1 className="font-display text-title font-semibold tracking-tight">Takehome</h1>
          </div>
          <p className="text-sm text-faint">Estimate only</p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
          <form
            className="flex flex-col gap-5 rounded-3xl border border-line bg-card p-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid grid-cols-2 gap-3">
              <Field label="Hourly wage" htmlFor="hourly">
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted">$</span>
                  <input
                    id="hourly"
                    className={`${FIELD} pl-7`}
                    inputMode="decimal"
                    autoComplete="off"
                    value={values.hourly}
                    onChange={(event) => set({ hourly: event.target.value })}
                  />
                </div>
              </Field>
              <Field label="Hours this paycheck" htmlFor="hours">
                <input
                  id="hours"
                  className={FIELD}
                  inputMode="decimal"
                  autoComplete="off"
                  value={values.regularHours}
                  onChange={(event) => set({ regularHours: event.target.value })}
                />
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Overtime hours" htmlFor="overtime" className="col-span-2">
                <input
                  id="overtime"
                  className={FIELD}
                  inputMode="decimal"
                  autoComplete="off"
                  value={values.overtimeHours}
                  onChange={(event) => set({ overtimeHours: event.target.value })}
                />
              </Field>
              <Field label="OT rate" htmlFor="ot-rate">
                <input
                  id="ot-rate"
                  className={FIELD}
                  inputMode="decimal"
                  aria-describedby="ot-hint"
                  value={values.overtimeMultiplier}
                  onChange={(event) => set({ overtimeMultiplier: event.target.value })}
                />
              </Field>
            </div>
            <p id="ot-hint" className="-mt-3 text-sm text-faint">
              Overtime multiplier. 1.5 is time-and-a-half.
            </p>

            {showFullTimeHint ? (
              <p className="-mt-2 text-sm text-muted">
                These hours are for one paycheck. Full-time {FREQUENCY[values.frequency].label.toLowerCase()} is about{" "}
                {trimNum(fullTime)} hours.{" "}
                <button
                  type="button"
                  className="font-medium text-ink underline decoration-line underline-offset-2"
                  onClick={() => set({ regularHours: String(fullTime), overtimeHours: "0" })}
                >
                  Use {trimNum(fullTime)}
                </button>
              </p>
            ) : null}

            <fieldset>
              <legend className="mb-1.5 text-sm font-medium text-muted">How often you are paid</legend>
              <div className="grid grid-cols-4 gap-1 rounded-lg bg-inset p-0.5">
                {FREQUENCIES.map((id) => {
                  const selected = values.frequency === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      className={
                        selected
                          ? "h-11 rounded-md bg-card text-sm font-medium text-ink focus-visible:ring-2 focus-visible:ring-accent/30"
                          : "h-11 rounded-md text-sm font-medium text-muted focus-visible:ring-2 focus-visible:ring-accent/30"
                      }
                      onClick={() => set({ frequency: id })}
                    >
                      {FREQUENCY[id].short}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <Field label="Filing status" htmlFor="filing">
              <Select
                id="filing"
                value={values.filing}
                onChange={(filing) => set({ filing: filing as FilingStatus })}
              >
                {FILING.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="State" htmlFor="state">
              <Select id="state" value={values.stateId} onChange={(stateId) => set({ stateId })}>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                    {state.kind === "none" ? " — no wage tax" : ""}
                  </option>
                ))}
              </Select>
            </Field>
            {values.stateId === "PA" && values.localPct.trim() === "" ? (
              <p className="-mt-3 text-sm text-muted">
                Pennsylvania’s flat wage tax is included as an estimate. Philadelphia residents can add the city wage tax under local tax.
                These are not official withholding tables.
              </p>
            ) : null}

            <p className="text-xs leading-5 text-muted">
              Government Disclaimer: Paycheck is not a government application and is not affiliated with any federal, state, or local
              government agency.
            </p>

            <div className="border-t border-line pt-4">
              <button
                type="button"
                className="flex h-11 w-full items-center justify-between text-left text-base font-medium focus-visible:ring-2 focus-visible:ring-accent/30"
                aria-expanded={openAdjust}
                onClick={() => setOpenAdjust((open) => !open)}
              >
                Deductions and local tax
                <ChevronDown className={`chevron size-4 text-muted ${openAdjust ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {openAdjust ? (
                <div className="mt-3 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="401(k) percent" htmlFor="retirement">
                      <input
                        id="retirement"
                        className={FIELD}
                        inputMode="decimal"
                        placeholder="0"
                        value={values.retirementPct}
                        onChange={(event) => set({ retirementPct: event.target.value })}
                      />
                    </Field>
                    <Field label="Health per check" htmlFor="health">
                      <input
                        id="health"
                        className={FIELD}
                        inputMode="decimal"
                        placeholder="0"
                        value={values.health}
                        onChange={(event) => set({ health: event.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Local wage tax percent" htmlFor="local">
                    <input
                      id="local"
                      className={FIELD}
                      inputMode="decimal"
                      placeholder="0"
                      value={values.localPct}
                      onChange={(event) => set({ localPct: event.target.value })}
                    />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    <Preset onClick={() => set({ localPct: "3.74" })}>Philadelphia estimate 3.74%</Preset>
                    <Preset onClick={() => set({ localPct: "3.876" })}>New York City 3.876%</Preset>
                    <Preset onClick={() => set({ localPct: "" })}>Clear local</Preset>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Extra federal $" htmlFor="extra-federal">
                      <input
                        id="extra-federal"
                        className={FIELD}
                        inputMode="decimal"
                        placeholder="0"
                        value={values.extraFederal}
                        onChange={(event) => set({ extraFederal: event.target.value })}
                      />
                    </Field>
                    <Field label="After-tax $" htmlFor="post-tax">
                      <input
                        id="post-tax"
                        className={FIELD}
                        inputMode="decimal"
                        placeholder="0"
                        value={values.postTax}
                        onChange={(event) => set({ postTax: event.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Override state rate %" htmlFor="state-override">
                    <input
                      id="state-override"
                      className={FIELD}
                      inputMode="decimal"
                      placeholder="Use the estimate"
                      value={values.stateOverride}
                      onChange={(event) => set({ stateOverride: event.target.value })}
                    />
                  </Field>
                  <p className="text-sm text-faint">
                    Leave the override blank to use the built-in state estimate. 401(k) is pre-tax for federal tax but still subject to
                    Social Security. Health premiums here are treated as pre-tax and reduce FICA too.
                  </p>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="h-11 self-start text-sm font-medium text-muted underline decoration-line underline-offset-2"
              onClick={() => {
                setValues(DEFAULTS);
                setOpenAdjust(false);
              }}
            >
              Reset to $20 and 40 hours
            </button>
          </form>

          <ResultPanel result={result} />
        </div>

        <p className="max-w-3xl text-sm text-faint">
          The estimate uses publicly available tax information and payroll guidelines for estimation purposes only. It annualizes this check
          as if it repeats all year. State amounts for graduated-tax states are simplified, not official withholding tables. It skips tax
          credits, itemizing, and local taxes unless you add a rate. Not tax, legal, or payroll advice.
        </p>
        <p className="max-w-3xl text-xs leading-5 text-muted">
          Disclaimer: Paycheck is an independent paycheck estimation tool and is not affiliated with, endorsed by, or operated by the
          Internal Revenue Service (IRS), Social Security Administration (SSA), Centers for Medicare & Medicaid Services (CMS), the
          U.S. Department of Labor, or any United States government agency. Information is provided for estimation purposes only.{" "}
          <Link to="/sources" className="font-medium underline decoration-line underline-offset-2">
            Government Sources
          </Link>
        </p>
        <SiteFooter />
      </div>

      <div className="pay-dock fixed inset-x-0 bottom-0 z-10 border-t border-line bg-card px-4 pt-3 lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted">Take-home {result.checkLabel}</p>
            <p className="font-display text-2xl font-semibold tabular-nums tracking-tight">{formatMoney(result.takeHomePerCheck)}</p>
          </div>
          <p className="text-right text-sm text-muted tabular-nums">
            {formatMoney(result.grossPerCheck)}
            <span className="block text-faint">gross</span>
          </p>
        </div>
      </div>
    </main>
  );
}

function ResultPanel({ result }: { result: PayResult }) {
  const summary = result.empty
    ? "Enter a wage and hours to see take-home pay."
    : `${formatMoney(result.grossPerCheck)} gross ${result.checkLabel}. ${formatMoney(result.takeHomeAnnual)} a year. ${result.bracketLabel}. ${formatRate(result.taxShare, 1)} of gross goes to taxes.`;

  return (
    <section
      className="stub flex flex-col gap-5 rounded-3xl border border-line bg-card p-4 lg:p-6"
    >
      <div>
        <h2 className="text-sm font-medium text-muted">Take-home {result.checkLabel}</h2>
        <p id="take-home" className="font-display text-display font-semibold leading-none tracking-tight tabular-nums" aria-live="polite">
          {formatMoney(result.takeHomePerCheck)}
        </p>
        <p className="mt-1 max-w-prose text-sm text-muted">{summary}</p>
        {!result.empty && result.hourlyNet > 0 ? (
          <p className="mt-1 text-sm text-faint tabular-nums">{formatMoney(result.hourlyNet)} an hour after taxes and deductions</p>
        ) : null}
      </div>

      <ShareBar result={result} />

      <div>
        <div className="hidden items-baseline gap-3 border-b border-line pb-2 text-xs font-medium text-faint sm:flex">
          <span className="min-w-0 flex-1">Line</span>
          <span className="w-24 text-right">This check</span>
          <span className="w-28 text-right">Year</span>
        </div>
        <ul>
          {result.rows.map((item) => (
            <li
              key={item.id}
              className={
                item.tone === "net"
                  ? "flex items-baseline justify-between gap-3 border-t border-line py-3"
                  : "flex items-baseline justify-between gap-3 border-t border-line py-2.5 first:border-t-0"
              }
            >
              <span className="min-w-0 flex-1">
                <span className={item.tone === "net" ? "block font-semibold" : "block text-sm"}>{item.label}</span>
                <span className="block truncate text-xs text-faint">{item.detail}</span>
              </span>
              <span
                className={
                  item.tone === "net"
                    ? "w-24 shrink-0 text-right font-semibold tabular-nums"
                    : "w-24 shrink-0 text-right text-sm tabular-nums"
                }
              >
                {formatMoney(item.perCheck)}
              </span>
              <span className="hidden w-28 shrink-0 text-right text-sm text-muted tabular-nums sm:block">
                {formatMoney(item.annual)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ShareBar({ result }: { result: PayResult }) {
  if (result.empty || result.segments.length === 0) {
    return <div className="h-3 rounded-full bg-inset" />;
  }
  const tone: Record<string, string> = {
    net: "bg-accent",
    federal: "bg-accent/70",
    state: "bg-accent/45",
    fica: "bg-ink/25",
    other: "bg-faint",
  };
  return (
    <div>
      <div
        className="share-bar flex h-3 overflow-hidden rounded-full bg-inset"
        role="img"
        aria-label={result.segments.map((segment) => `${segment.label} ${formatMoney(segment.amount)}`).join(", ")}
      >
        {result.segments.map((segment) => (
          <span key={segment.id} className={tone[segment.id] ?? "bg-faint"} style={{ flexGrow: segment.amount }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {result.segments.map((segment) => (
          <li key={segment.id} className="flex items-center gap-1.5 text-xs text-muted">
            <span className={`size-2 rounded-full ${tone[segment.id] ?? "bg-faint"}`} aria-hidden="true" />
            {segment.label}
            <span className="tabular-nums text-faint">{formatRate(segment.share, 0)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className={`flex flex-col gap-1.5 text-sm font-medium text-muted ${className ?? ""}`}>
      {label}
      {children}
    </label>
  );
}

function Select({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select id={id} className={`${FIELD} appearance-none pr-9`} value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
    </div>
  );
}

function Preset({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      className="h-11 rounded-full border border-line bg-paper px-3 text-sm font-medium text-ink focus-visible:ring-2 focus-visible:ring-accent/30"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function trimNum(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return String(Math.round(value * 100) / 100);
}
