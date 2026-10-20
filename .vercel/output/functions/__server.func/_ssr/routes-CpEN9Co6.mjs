import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as ChevronDown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CpEN9Co6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STANDARD_DEDUCTION = {
	single: 16100,
	mfs: 16100,
	mfj: 32200,
	hoh: 24150
};
/** Lower bounds of each marginal rate. Head-of-household upper bands follow the single schedule. */
var FEDERAL_BRACKETS = {
	single: [
		[0, .1],
		[12400, .12],
		[50400, .22],
		[105700, .24],
		[201775, .32],
		[256225, .35],
		[640600, .37]
	],
	mfs: [
		[0, .1],
		[12400, .12],
		[50400, .22],
		[105700, .24],
		[201775, .32],
		[256225, .35],
		[640600, .37]
	],
	mfj: [
		[0, .1],
		[24800, .12],
		[100800, .22],
		[211400, .24],
		[403550, .32],
		[512450, .35],
		[768700, .37]
	],
	hoh: [
		[0, .1],
		[17700, .12],
		[67450, .22],
		[105700, .24],
		[201750, .32],
		[256225, .35],
		[640600, .37]
	]
};
var SOCIAL_SECURITY_RATE = .062;
var SOCIAL_SECURITY_WAGE_BASE = 184500;
var MEDICARE_RATE = .0145;
var ADDITIONAL_MEDICARE_RATE = .009;
/** Additional Medicare tax owed above these wages (not the employer's $200k withholding trigger). */
var ADDITIONAL_MEDICARE_THRESHOLD = {
	single: 2e5,
	hoh: 2e5,
	mfj: 25e4,
	mfs: 125e3
};
var g = (id, name, low, high, span, deduction) => ({
	id,
	name,
	kind: "graduated",
	rate: high,
	deduction,
	low,
	high,
	span,
	retirementDeductible: true
});
var f = (id, name, rate, deduction = 0) => ({
	id,
	name,
	kind: "flat",
	rate,
	deduction,
	low: rate,
	high: rate,
	span: 1,
	retirementDeductible: true
});
var none = (id, name) => ({
	id,
	name,
	kind: "none",
	rate: 0,
	deduction: 0,
	low: 0,
	high: 0,
	span: 1,
	retirementDeductible: true
});
var STATES = [
	g("AL", "Alabama", .02, .05, 8e3, 3e3),
	none("AK", "Alaska"),
	f("AZ", "Arizona", .025, 16100),
	g("AR", "Arkansas", 0, .037, 5e4, 2470),
	g("CA", "California", .01, .093, 8e4, 5900),
	f("CO", "Colorado", .044, 16100),
	g("CT", "Connecticut", .02, .0699, 15e4, 0),
	g("DE", "Delaware", 0, .066, 8e4, 3250),
	g("DC", "District of Columbia", .04, .085, 15e4, 15e3),
	none("FL", "Florida"),
	f("GA", "Georgia", .0499, 15e3),
	g("HI", "Hawaii", .014, .088, 12e4, 8e3),
	f("ID", "Idaho", .053, 16100),
	f("IL", "Illinois", .0495, 0),
	f("IN", "Indiana", .0295, 0),
	f("IA", "Iowa", .038, 16100),
	g("KS", "Kansas", .052, .0558, 4e4, 3605),
	f("KY", "Kentucky", .035, 3360),
	f("LA", "Louisiana", .03, 12875),
	g("ME", "Maine", .058, .0715, 12e4, 15700),
	g("MD", "Maryland", .02, .055, 15e4, 3400),
	f("MA", "Massachusetts", .05, 0),
	f("MI", "Michigan", .0425, 0),
	g("MN", "Minnesota", .0535, .0785, 18e4, 15300),
	f("MS", "Mississippi", .04, 2300),
	g("MO", "Missouri", 0, .047, 1e4, 16100),
	g("MT", "Montana", .047, .0565, 4e4, 16100),
	g("NE", "Nebraska", .0246, .0455, 8e4, 8850),
	none("NV", "Nevada"),
	none("NH", "New Hampshire"),
	g("NJ", "New Jersey", .014, .0637, 15e4, 0),
	g("NM", "New Mexico", .015, .049, 1e5, 16100),
	g("NY", "New York", .039, .0685, 14e4, 8e3),
	f("NC", "North Carolina", .0399, 12750),
	g("ND", "North Dakota", 0, .025, 15e4, 16100),
	f("OH", "Ohio", .0275, 0),
	g("OK", "Oklahoma", 0, .045, 2e4, 6350),
	g("OR", "Oregon", .0475, .088, 15e4, 2910),
	{
		...f("PA", "Pennsylvania", .0307, 0),
		retirementDeductible: false
	},
	g("RI", "Rhode Island", .0375, .0599, 15e4, 11200),
	g("SC", "South Carolina", .0199, .0521, 2e4, 15e3),
	none("SD", "South Dakota"),
	none("TN", "Tennessee"),
	none("TX", "Texas"),
	f("UT", "Utah", .0445, 0),
	g("VT", "Vermont", .0335, .066, 15e4, 7850),
	g("VA", "Virginia", .02, .0575, 2e4, 8750),
	none("WA", "Washington"),
	g("WV", "West Virginia", .0211, .0458, 5e4, 0),
	g("WI", "Wisconsin", .035, .053, 4e4, 13960),
	none("WY", "Wyoming")
];
var STATE_BY_ID = new Map(STATES.map((state) => [state.id, state]));
function getState(id) {
	return STATE_BY_ID.get(id) ?? STATE_BY_ID.get("PA");
}
function statesAlphabetical() {
	return [...STATES].sort((a, b) => a.name.localeCompare(b.name));
}
function taxFromBrackets(taxable, brackets) {
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
function marginalRate(taxable, brackets) {
	if (taxable <= 0) return 0;
	let rate = brackets[0][1];
	for (let i = 1; i < brackets.length; i++) if (taxable > brackets[i][0]) rate = brackets[i][1];
	return rate;
}
function federalIncomeTax(taxableWages, filing) {
	return taxFromBrackets(Math.max(0, taxableWages - STANDARD_DEDUCTION[filing]), FEDERAL_BRACKETS[filing]);
}
function federalMarginalRate(taxableWages, filing) {
	return marginalRate(Math.max(0, taxableWages - STANDARD_DEDUCTION[filing]), FEDERAL_BRACKETS[filing]);
}
function filingScale(filing) {
	return filing === "mfj" ? 2 : 1;
}
/** State income tax on `wages` (already reduced for deductible pre-tax items). */
function stateIncomeTax(wages, filing, state, overrideRate) {
	const base = Math.max(0, wages);
	if (overrideRate != null) return base * overrideRate;
	if (state.kind === "none") return 0;
	const scale = filingScale(filing);
	const deduction = state.deduction * scale;
	const taxable = Math.max(0, base - deduction);
	if (state.kind === "flat") return taxable * state.rate;
	const span = Math.max(1, state.span * scale);
	const rise = Math.max(0, state.high - state.low);
	if (taxable <= span) return state.low * taxable + rise * taxable * taxable / (2 * span);
	return state.low * span + rise * span / 2 + state.high * (taxable - span);
}
var FREQUENCY = {
	weekly: {
		periods: 52,
		label: "Weekly",
		short: "Week",
		check: "this week",
		fullTimeHours: 40
	},
	biweekly: {
		periods: 26,
		label: "Every 2 weeks",
		short: "2 weeks",
		check: "this paycheck",
		fullTimeHours: 80
	},
	semimonthly: {
		periods: 24,
		label: "Twice a month",
		short: "2× month",
		check: "this paycheck",
		fullTimeHours: 86.67
	},
	monthly: {
		periods: 12,
		label: "Monthly",
		short: "Month",
		check: "this month",
		fullTimeHours: 173.33
	}
};
var money = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD"
});
function formatMoney(value) {
	return money.format(value);
}
function formatRate(rate, digits = 2) {
	return new Intl.NumberFormat("en-US", {
		style: "percent",
		minimumFractionDigits: 0,
		maximumFractionDigits: digits
	}).format(rate);
}
function cents(value) {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}
function clamp(value, min, max) {
	if (!Number.isFinite(value)) return min;
	return Math.min(max, Math.max(min, value));
}
function row(id, label, detail, annual, periods, tone) {
	const annualCents = cents(annual);
	return {
		id,
		label,
		detail,
		annual: annualCents,
		perCheck: cents(annualCents / periods),
		tone
	};
}
function calculatePaycheck(input) {
	const frequency = FREQUENCY[input.frequency] ?? FREQUENCY.weekly;
	const periods = frequency.periods;
	const hourly = clamp(input.hourly, 0, 1e5);
	const regularHours = clamp(input.regularHours, 0, 1e3);
	const overtimeHours = clamp(input.overtimeHours, 0, 1e3);
	const overtimeMultiplier = clamp(input.overtimeMultiplier, 1, 5);
	const retirementRate = clamp(input.retirementRate, 0, 1);
	const localRate = clamp(input.localRate, 0, .5);
	const stateOverride = input.stateOverrideRate == null ? null : clamp(input.stateOverrideRate, 0, .5);
	const healthPerCheck = clamp(input.healthPerCheck, 0, 1e5);
	const extraFederalPerCheck = clamp(input.extraFederalPerCheck, 0, 1e5);
	const postTaxPerCheck = clamp(input.postTaxPerCheck, 0, 1e5);
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
	const additionalMedicareAnnual = Math.max(0, ficaWages - ADDITIONAL_MEDICARE_THRESHOLD[input.filing]) * ADDITIONAL_MEDICARE_RATE;
	const extraFederalAnnual = extraFederalPerCheck * periods;
	const postTaxAnnual = postTaxPerCheck * periods;
	const takeHomeAnnual = cents(grossAnnual - (retirementAnnual + healthAnnual + federalAnnual + stateAnnual + localAnnual + socialSecurityAnnual + medicareAnnual + additionalMedicareAnnual + extraFederalAnnual + postTaxAnnual));
	const bracketLabel = Math.max(0, fitWages - STANDARD_DEDUCTION[input.filing]) <= 0 ? "Under the standard deduction" : `${formatRate(marginal, 0)} federal bracket`;
	let stateSummary = "No tax on wages";
	if (stateOverride != null) stateSummary = `${formatRate(stateOverride)} flat rate you set`;
	else if (state.kind === "flat") stateSummary = `${formatRate(state.rate)} flat`;
	else if (state.kind === "graduated") stateSummary = "Graduated estimate";
	const stateDetail = state.retirementDeductible ? stateSummary : `${stateSummary} · retirement deferrals are taxed`;
	const hours = regularHours + overtimeHours;
	const otRate = hourly * overtimeMultiplier;
	const grossExplain = hours <= 0 ? "Add hours to estimate a paycheck." : overtimeHours > 0 ? `${trimHours(regularHours)} hrs × ${formatMoney(hourly)} + ${trimHours(overtimeHours)} hrs × ${formatMoney(otRate)} overtime` : `${trimHours(regularHours)} hrs × ${formatMoney(hourly)}`;
	const rows = [row("gross", "Gross pay", grossExplain, grossAnnual, periods, "gross")];
	if (retirementAnnual > 0) rows.push(row("retirement", "401(k) deferral", `${formatRate(retirementRate)} of gross · pre-tax`, retirementAnnual, periods, "deduction"));
	if (healthAnnual > 0) rows.push(row("health", "Health and pre-tax benefits", "Reduces income tax and FICA", healthAnnual, periods, "deduction"));
	rows.push(row("federal", "Federal income tax", bracketLabel, federalAnnual, periods, "tax"));
	if (extraFederalAnnual > 0) rows.push(row("extra-federal", "Extra federal withholding", "Added on top of the estimate", extraFederalAnnual, periods, "tax"));
	rows.push(row("state", `${state.name} income tax`, stateDetail, stateAnnual, periods, "tax"));
	if (localAnnual > 0) rows.push(row("local", "Local wage tax", `${formatRate(localRate)} of gross wages`, localAnnual, periods, "tax"));
	rows.push(row("social-security", "Social Security", ficaWages > 184500 ? `6.2% up to ${formatMoney(SOCIAL_SECURITY_WAGE_BASE)}` : "6.2% of FICA wages", socialSecurityAnnual, periods, "tax"));
	rows.push(row("medicare", "Medicare", "1.45% of FICA wages", medicareAnnual, periods, "tax"));
	if (additionalMedicareAnnual > 0) rows.push(row("additional-medicare", "Additional Medicare", `0.9% over ${formatMoney(ADDITIONAL_MEDICARE_THRESHOLD[input.filing])}`, additionalMedicareAnnual, periods, "tax"));
	if (postTaxAnnual > 0) rows.push(row("post-tax", "After-tax deductions", "Does not reduce taxes", postTaxAnnual, periods, "deduction"));
	rows.push(row("net", "Take-home pay", frequency.check, takeHomeAnnual, periods, "net"));
	const taxAnnual = federalAnnual + extraFederalAnnual + stateAnnual + localAnnual + socialSecurityAnnual + medicareAnnual + additionalMedicareAnnual;
	const otherAnnual = retirementAnnual + healthAnnual + postTaxAnnual;
	const segments = [];
	const pushSeg = (id, label, amount) => {
		const rounded = cents(amount);
		if (rounded <= 0 || grossAnnual <= 0) return;
		segments.push({
			id,
			label,
			amount: rounded,
			share: rounded / grossAnnual
		});
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
		empty: grossPerCheck <= 0
	};
}
function trimHours(hours) {
	if (Number.isInteger(hours)) return String(hours);
	return String(Math.round(hours * 100) / 100);
}
function adsenseConfig() {
	const client = "".trim();
	const slot = "".trim();
	return {
		client,
		slot,
		enabled: /^ca-pub-\d{10,16}$/.test(client) && /^\d{6,12}$/.test(slot)
	};
}
var { client, slot, enabled } = adsenseConfig();
function AdsenseBanner() {
	const pushed = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!enabled || pushed.current) return;
		pushed.current = true;
		if (!document.querySelector("script[data-adsense=\"true\"]")) {
			const script = document.createElement("script");
			script.async = true;
			script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
			script.crossOrigin = "anonymous";
			script.dataset.adsense = "true";
			document.head.appendChild(script);
		}
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch {}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		"aria-label": "Advertisement",
		className: "border-b border-line bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-3 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1.5 text-xs font-medium text-faint",
				children: "Advertisement"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-16 w-full max-w-3xl overflow-hidden rounded-lg border border-line bg-inset sm:h-24",
				children: enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ins", {
					className: "adsbygoogle",
					style: {
						display: "block",
						width: "100%",
						height: "100%"
					},
					"data-ad-client": client,
					"data-ad-slot": slot,
					"data-ad-format": "horizontal",
					"data-full-width-responsive": "true"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full flex-col items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-muted",
						children: "AdSense banner"
					})
				})
			})]
		})
	});
}
var STORAGE_KEY = "takehome-inputs-v1";
var FREQUENCIES = Object.keys(FREQUENCY);
var FILING = [
	{
		id: "single",
		label: "Single"
	},
	{
		id: "mfj",
		label: "Married filing jointly"
	},
	{
		id: "mfs",
		label: "Married filing separately"
	},
	{
		id: "hoh",
		label: "Head of household"
	}
];
var DEFAULTS = {
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
	stateOverride: ""
};
var FIELD = "h-11 w-full rounded-lg border border-line bg-paper px-3 text-base text-ink outline-none tabular-nums focus-visible:ring-2 focus-visible:ring-accent/30";
function parseAmount(value) {
	const cleaned = value.replace(/[^0-9.-]/g, "");
	if (cleaned === "" || cleaned === "-" || cleaned === ".") return 0;
	const number = Number(cleaned);
	return Number.isFinite(number) ? number : 0;
}
function parseOptionalRate(value) {
	if (value.trim() === "") return null;
	return parseAmount(value) / 100;
}
function isFrequency(value) {
	return typeof value === "string" && value in FREQUENCY;
}
function isFiling(value) {
	return value === "single" || value === "mfj" || value === "mfs" || value === "hoh";
}
function sanitize(raw) {
	const stateIds = new Set(statesAlphabetical().map((state) => state.id));
	return {
		hourly: typeof raw.hourly === "string" ? raw.hourly : DEFAULTS.hourly,
		regularHours: typeof raw.regularHours === "string" ? raw.regularHours : DEFAULTS.regularHours,
		overtimeHours: typeof raw.overtimeHours === "string" ? raw.overtimeHours : DEFAULTS.overtimeHours,
		overtimeMultiplier: typeof raw.overtimeMultiplier === "string" ? raw.overtimeMultiplier : DEFAULTS.overtimeMultiplier,
		frequency: isFrequency(raw.frequency) ? raw.frequency : DEFAULTS.frequency,
		filing: isFiling(raw.filing) ? raw.filing : DEFAULTS.filing,
		stateId: typeof raw.stateId === "string" && stateIds.has(raw.stateId) ? raw.stateId : DEFAULTS.stateId,
		localPct: typeof raw.localPct === "string" ? raw.localPct : "",
		retirementPct: typeof raw.retirementPct === "string" ? raw.retirementPct : "",
		health: typeof raw.health === "string" ? raw.health : "",
		extraFederal: typeof raw.extraFederal === "string" ? raw.extraFederal : "",
		postTax: typeof raw.postTax === "string" ? raw.postTax : "",
		stateOverride: typeof raw.stateOverride === "string" ? raw.stateOverride : ""
	};
}
function hasAdjustments(values) {
	return [
		values.localPct,
		values.retirementPct,
		values.health,
		values.extraFederal,
		values.postTax,
		values.stateOverride
	].some((value) => value.trim() !== "" && parseAmount(value) !== 0);
}
function PaycheckApp() {
	const [values, setValues] = (0, import_react.useState)(DEFAULTS);
	const [openAdjust, setOpenAdjust] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const states = (0, import_react.useMemo)(() => statesAlphabetical(), []);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const next = sanitize(JSON.parse(raw));
				setValues(next);
				if (hasAdjustments(next)) setOpenAdjust(true);
			}
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
	}, [values, hydrated]);
	const result = (0, import_react.useMemo)(() => calculatePaycheck({
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
		postTaxPerCheck: parseAmount(values.postTax)
	}), [values]);
	const set = (patch) => setValues((current) => ({
		...current,
		...patch
	}));
	const fullTime = FREQUENCY[values.frequency].fullTimeHours;
	const enteredHours = parseAmount(values.regularHours) + parseAmount(values.overtimeHours);
	const showFullTimeHint = enteredHours > 0 && enteredHours < fullTime * .7;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-paper pb-28 text-ink lg:pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdsenseBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-muted",
							children: "Paycheck calculator"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-title font-semibold tracking-tight",
							children: "Takehome"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-faint",
							children: "2026 tax rules"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid items-start gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex flex-col gap-5 rounded-3xl border border-line bg-card p-4",
							onSubmit: (event) => event.preventDefault(),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Hourly wage",
										htmlFor: "hourly",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted",
												children: "$"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "hourly",
												className: `${FIELD} pl-7`,
												inputMode: "decimal",
												autoComplete: "off",
												value: values.hourly,
												onChange: (event) => set({ hourly: event.target.value })
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Hours this paycheck",
										htmlFor: "hours",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "hours",
											className: FIELD,
											inputMode: "decimal",
											autoComplete: "off",
											value: values.regularHours,
											onChange: (event) => set({ regularHours: event.target.value })
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Overtime hours",
										htmlFor: "overtime",
										className: "col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "overtime",
											className: FIELD,
											inputMode: "decimal",
											autoComplete: "off",
											value: values.overtimeHours,
											onChange: (event) => set({ overtimeHours: event.target.value })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "OT rate",
										htmlFor: "ot-rate",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "ot-rate",
											className: FIELD,
											inputMode: "decimal",
											"aria-describedby": "ot-hint",
											value: values.overtimeMultiplier,
											onChange: (event) => set({ overtimeMultiplier: event.target.value })
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									id: "ot-hint",
									className: "-mt-3 text-sm text-faint",
									children: "Overtime multiplier. 1.5 is time-and-a-half."
								}),
								showFullTimeHint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "-mt-2 text-sm text-muted",
									children: [
										"These hours are for one paycheck. Full-time ",
										FREQUENCY[values.frequency].label.toLowerCase(),
										" is about",
										" ",
										trimNum(fullTime),
										" hours.",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "font-medium text-ink underline decoration-line underline-offset-2",
											onClick: () => set({
												regularHours: String(fullTime),
												overtimeHours: "0"
											}),
											children: ["Use ", trimNum(fullTime)]
										})
									]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "mb-1.5 text-sm font-medium text-muted",
									children: "How often you are paid"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-4 gap-1 rounded-lg bg-inset p-0.5",
									children: FREQUENCIES.map((id) => {
										const selected = values.frequency === id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-pressed": selected,
											className: selected ? "h-11 rounded-md bg-card text-sm font-medium text-ink focus-visible:ring-2 focus-visible:ring-accent/30" : "h-11 rounded-md text-sm font-medium text-muted focus-visible:ring-2 focus-visible:ring-accent/30",
											onClick: () => set({ frequency: id }),
											children: FREQUENCY[id].short
										}, id);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Filing status",
									htmlFor: "filing",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
										id: "filing",
										value: values.filing,
										onChange: (filing) => set({ filing }),
										children: FILING.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: option.id,
											children: option.label
										}, option.id))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "State",
									htmlFor: "state",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
										id: "state",
										value: values.stateId,
										onChange: (stateId) => set({ stateId }),
										children: states.map((state) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: state.id,
											children: [state.name, state.kind === "none" ? " — no wage tax" : ""]
										}, state.id))
									})
								}),
								values.stateId === "PA" && values.localPct.trim() === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "-mt-3 text-sm text-muted",
									children: "Pennsylvania is 3.07% flat. Philadelphia residents also pay a city wage tax — add 3.74% under local tax."
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-line pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "flex h-11 w-full items-center justify-between text-left text-base font-medium focus-visible:ring-2 focus-visible:ring-accent/30",
										"aria-expanded": openAdjust,
										onClick: () => setOpenAdjust((open) => !open),
										children: ["Deductions and local tax", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
											className: `chevron size-4 text-muted ${openAdjust ? "rotate-180" : ""}`,
											"aria-hidden": "true"
										})]
									}), openAdjust ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-col gap-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													label: "401(k) percent",
													htmlFor: "retirement",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														id: "retirement",
														className: FIELD,
														inputMode: "decimal",
														placeholder: "0",
														value: values.retirementPct,
														onChange: (event) => set({ retirementPct: event.target.value })
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													label: "Health per check",
													htmlFor: "health",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														id: "health",
														className: FIELD,
														inputMode: "decimal",
														placeholder: "0",
														value: values.health,
														onChange: (event) => set({ health: event.target.value })
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Local wage tax percent",
												htmlFor: "local",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													id: "local",
													className: FIELD,
													inputMode: "decimal",
													placeholder: "0",
													value: values.localPct,
													onChange: (event) => set({ localPct: event.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preset, {
														onClick: () => set({ localPct: "3.74" }),
														children: "Philadelphia 3.74%"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preset, {
														onClick: () => set({ localPct: "3.876" }),
														children: "New York City 3.876%"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Preset, {
														onClick: () => set({ localPct: "" }),
														children: "Clear local"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													label: "Extra federal $",
													htmlFor: "extra-federal",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														id: "extra-federal",
														className: FIELD,
														inputMode: "decimal",
														placeholder: "0",
														value: values.extraFederal,
														onChange: (event) => set({ extraFederal: event.target.value })
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
													label: "After-tax $",
													htmlFor: "post-tax",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														id: "post-tax",
														className: FIELD,
														inputMode: "decimal",
														placeholder: "0",
														value: values.postTax,
														onChange: (event) => set({ postTax: event.target.value })
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Override state rate %",
												htmlFor: "state-override",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													id: "state-override",
													className: FIELD,
													inputMode: "decimal",
													placeholder: "Use the estimate",
													value: values.stateOverride,
													onChange: (event) => set({ stateOverride: event.target.value })
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-faint",
												children: "Leave the override blank to use the built-in state estimate. 401(k) is pre-tax for federal tax but still subject to Social Security. Health premiums here are treated as pre-tax and reduce FICA too."
											})
										]
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-11 self-start text-sm font-medium text-muted underline decoration-line underline-offset-2",
									onClick: () => {
										setValues(DEFAULTS);
										setOpenAdjust(false);
									},
									children: "Reset to $20 and 40 hours"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultPanel, { result })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-3xl text-sm text-faint",
						children: "Estimate for a W-2 paycheck. Federal tax uses 2026 brackets and the standard deduction, annualized as if this check repeats all year. State amounts for graduated-tax states are simplified, not official withholding tables. It skips tax credits, itemizing, and local taxes unless you add a rate. Not tax or payroll advice."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pay-dock fixed inset-x-0 bottom-0 z-10 border-t border-line bg-card px-4 pt-3 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium text-muted",
						children: ["Take-home ", result.checkLabel]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl font-semibold tabular-nums tracking-tight",
						children: formatMoney(result.takeHomePerCheck)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-right text-sm text-muted tabular-nums",
						children: [formatMoney(result.grossPerCheck), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-faint",
							children: "gross"
						})]
					})]
				})
			})
		]
	});
}
function ResultPanel({ result }) {
	const summary = result.empty ? "Enter a wage and hours to see take-home pay." : `${formatMoney(result.grossPerCheck)} gross ${result.checkLabel}. ${formatMoney(result.takeHomeAnnual)} a year. ${result.bracketLabel}. ${formatRate(result.taxShare, 1)} of gross goes to taxes.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "stub flex flex-col gap-5 rounded-3xl border border-line bg-card p-4 lg:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-sm font-medium text-muted",
					children: ["Take-home ", result.checkLabel]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: "take-home",
					className: "font-display text-display font-semibold leading-none tracking-tight tabular-nums",
					"aria-live": "polite",
					children: formatMoney(result.takeHomePerCheck)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-prose text-sm text-muted",
					children: summary
				}),
				!result.empty && result.hourlyNet > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-faint tabular-nums",
					children: [formatMoney(result.hourlyNet), " an hour after taxes and deductions"]
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareBar, { result }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden items-baseline gap-3 border-b border-line pb-2 text-xs font-medium text-faint sm:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1",
						children: "Line"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-24 text-right",
						children: "This check"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-28 text-right",
						children: "Year"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: result.rows.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: item.tone === "net" ? "flex items-baseline justify-between gap-3 border-t border-line py-3" : "flex items-baseline justify-between gap-3 border-t border-line py-2.5 first:border-t-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: item.tone === "net" ? "block font-semibold" : "block text-sm",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-xs text-faint",
							children: item.detail
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: item.tone === "net" ? "w-24 shrink-0 text-right font-semibold tabular-nums" : "w-24 shrink-0 text-right text-sm tabular-nums",
						children: formatMoney(item.perCheck)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden w-28 shrink-0 text-right text-sm text-muted tabular-nums sm:block",
						children: formatMoney(item.annual)
					})
				]
			}, item.id)) })] })
		]
	});
}
function ShareBar({ result }) {
	if (result.empty || result.segments.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 rounded-full bg-inset" });
	const tone = {
		net: "bg-accent",
		federal: "bg-accent/70",
		state: "bg-accent/45",
		fica: "bg-ink/25",
		other: "bg-faint"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "share-bar flex h-3 overflow-hidden rounded-full bg-inset",
		role: "img",
		"aria-label": result.segments.map((segment) => `${segment.label} ${formatMoney(segment.amount)}`).join(", "),
		children: result.segments.map((segment) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: tone[segment.id] ?? "bg-faint",
			style: { flexGrow: segment.amount }
		}, segment.id))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 flex flex-wrap gap-x-4 gap-y-1",
		children: result.segments.map((segment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center gap-1.5 text-xs text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `size-2 rounded-full ${tone[segment.id] ?? "bg-faint"}`,
					"aria-hidden": "true"
				}),
				segment.label,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-faint",
					children: formatRate(segment.share, 0)
				})
			]
		}, segment.id))
	})] });
}
function Field({ label, htmlFor, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor,
		className: `flex flex-col gap-1.5 text-sm font-medium text-muted ${className ?? ""}`,
		children: [label, children]
	});
}
function Select({ id, value, onChange, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			id,
			className: `${FIELD} appearance-none pr-9`,
			value,
			onChange: (event) => onChange(event.target.value),
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
			className: "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted",
			"aria-hidden": "true"
		})]
	});
}
function Preset({ children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "h-11 rounded-full border border-line bg-paper px-3 text-sm font-medium text-ink focus-visible:ring-2 focus-visible:ring-accent/30",
		onClick,
		children
	});
}
function trimNum(value) {
	if (Number.isInteger(value)) return String(value);
	return String(Math.round(value * 100) / 100);
}
var SplitComponent = PaycheckApp;
//#endregion
export { SplitComponent as component };
