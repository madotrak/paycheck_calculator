/* Takehome — static paycheck calculator. Paste AdSense ids to replace the reserved banner. */
var ADSENSE_CLIENT = "";
var ADSENSE_SLOT = "";

var STANDARD_DEDUCTION = { single: 16100, mfs: 16100, mfj: 32200, hoh: 24150 };
var FEDERAL_BRACKETS = {
  single: [[0, 0.1], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]],
  mfs: [[0, 0.1], [12400, 0.12], [50400, 0.22], [105700, 0.24], [201775, 0.32], [256225, 0.35], [640600, 0.37]],
  mfj: [[0, 0.1], [24800, 0.12], [100800, 0.22], [211400, 0.24], [403550, 0.32], [512450, 0.35], [768700, 0.37]],
  hoh: [[0, 0.1], [17700, 0.12], [67450, 0.22], [105700, 0.24], [201750, 0.32], [256225, 0.35], [640600, 0.37]],
};
var SOCIAL_SECURITY_RATE = 0.062;
var SOCIAL_SECURITY_WAGE_BASE = 184500;
var MEDICARE_RATE = 0.0145;
var ADDITIONAL_MEDICARE_RATE = 0.009;
var ADDITIONAL_MEDICARE_THRESHOLD = { single: 200000, hoh: 200000, mfj: 250000, mfs: 125000 };

var FREQUENCY = {
  weekly: { periods: 52, label: "Weekly", short: "Week", check: "this week", fullTimeHours: 40 },
  biweekly: { periods: 26, label: "Every 2 weeks", short: "2 weeks", check: "this paycheck", fullTimeHours: 80 },
  semimonthly: { periods: 24, label: "Twice a month", short: "2× month", check: "this paycheck", fullTimeHours: 86.67 },
  monthly: { periods: 12, label: "Monthly", short: "Month", check: "this month", fullTimeHours: 173.33 },
};

function graduated(id, name, low, high, span, deduction) {
  return { id: id, name: name, kind: "graduated", rate: high, deduction: deduction, low: low, high: high, span: span, retirementDeductible: true };
}
function flat(id, name, rate, deduction) {
  return { id: id, name: name, kind: "flat", rate: rate, deduction: deduction || 0, low: rate, high: rate, span: 1, retirementDeductible: true };
}
function none(id, name) {
  return { id: id, name: name, kind: "none", rate: 0, deduction: 0, low: 0, high: 0, span: 1, retirementDeductible: true };
}

var STATES = [
  graduated("AL", "Alabama", 0.02, 0.05, 8000, 3000),
  none("AK", "Alaska"),
  flat("AZ", "Arizona", 0.025, 16100),
  graduated("AR", "Arkansas", 0, 0.037, 50000, 2470),
  graduated("CA", "California", 0.01, 0.093, 80000, 5900),
  flat("CO", "Colorado", 0.044, 16100),
  graduated("CT", "Connecticut", 0.02, 0.0699, 150000, 0),
  graduated("DE", "Delaware", 0, 0.066, 80000, 3250),
  graduated("DC", "District of Columbia", 0.04, 0.085, 150000, 15000),
  none("FL", "Florida"),
  flat("GA", "Georgia", 0.0499, 15000),
  graduated("HI", "Hawaii", 0.014, 0.088, 120000, 8000),
  flat("ID", "Idaho", 0.053, 16100),
  flat("IL", "Illinois", 0.0495, 0),
  flat("IN", "Indiana", 0.0295, 0),
  flat("IA", "Iowa", 0.038, 16100),
  graduated("KS", "Kansas", 0.052, 0.0558, 40000, 3605),
  flat("KY", "Kentucky", 0.035, 3360),
  flat("LA", "Louisiana", 0.03, 12875),
  graduated("ME", "Maine", 0.058, 0.0715, 120000, 15700),
  graduated("MD", "Maryland", 0.02, 0.055, 150000, 3400),
  flat("MA", "Massachusetts", 0.05, 0),
  flat("MI", "Michigan", 0.0425, 0),
  graduated("MN", "Minnesota", 0.0535, 0.0785, 180000, 15300),
  flat("MS", "Mississippi", 0.04, 2300),
  graduated("MO", "Missouri", 0, 0.047, 10000, 16100),
  graduated("MT", "Montana", 0.047, 0.0565, 40000, 16100),
  graduated("NE", "Nebraska", 0.0246, 0.0455, 80000, 8850),
  none("NV", "Nevada"),
  none("NH", "New Hampshire"),
  graduated("NJ", "New Jersey", 0.014, 0.0637, 150000, 0),
  graduated("NM", "New Mexico", 0.015, 0.049, 100000, 16100),
  graduated("NY", "New York", 0.039, 0.0685, 140000, 8000),
  flat("NC", "North Carolina", 0.0399, 12750),
  graduated("ND", "North Dakota", 0, 0.025, 150000, 16100),
  flat("OH", "Ohio", 0.0275, 0),
  graduated("OK", "Oklahoma", 0, 0.045, 20000, 6350),
  graduated("OR", "Oregon", 0.0475, 0.088, 150000, 2910),
  Object.assign(flat("PA", "Pennsylvania", 0.0307, 0), { retirementDeductible: false }),
  graduated("RI", "Rhode Island", 0.0375, 0.0599, 150000, 11200),
  graduated("SC", "South Carolina", 0.0199, 0.0521, 20000, 15000),
  none("SD", "South Dakota"),
  none("TN", "Tennessee"),
  none("TX", "Texas"),
  flat("UT", "Utah", 0.0445, 0),
  graduated("VT", "Vermont", 0.0335, 0.066, 150000, 7850),
  graduated("VA", "Virginia", 0.02, 0.0575, 20000, 8750),
  none("WA", "Washington"),
  graduated("WV", "West Virginia", 0.0211, 0.0458, 50000, 0),
  graduated("WI", "Wisconsin", 0.035, 0.053, 40000, 13960),
  none("WY", "Wyoming"),
];

var STATE_BY_ID = {};
STATES.forEach(function (state) {
  STATE_BY_ID[state.id] = state;
});

var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
var STORAGE_KEY = "takehome-inputs-v1";
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
  stateOverride: "",
};

function cents(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function clamp(value, min, max) {
  if (!isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function formatMoney(value) {
  return money.format(value);
}

function formatRate(rate, digits) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: digits == null ? 2 : digits,
  }).format(rate);
}

function trimHours(hours) {
  if (Number.isInteger(hours)) return String(hours);
  return String(Math.round(hours * 100) / 100);
}

function taxFromBrackets(taxable, brackets) {
  if (taxable <= 0) return 0;
  var tax = 0;
  for (var i = 0; i < brackets.length; i++) {
    var floor = brackets[i][0];
    var rate = brackets[i][1];
    var ceiling = i + 1 < brackets.length ? brackets[i + 1][0] : Infinity;
    if (taxable <= floor) break;
    tax += (Math.min(taxable, ceiling) - floor) * rate;
  }
  return tax;
}

function marginalRate(taxable, brackets) {
  if (taxable <= 0) return 0;
  var rate = brackets[0][1];
  for (var i = 1; i < brackets.length; i++) {
    if (taxable > brackets[i][0]) rate = brackets[i][1];
  }
  return rate;
}

function federalIncomeTax(taxableWages, filing) {
  var taxable = Math.max(0, taxableWages - STANDARD_DEDUCTION[filing]);
  return taxFromBrackets(taxable, FEDERAL_BRACKETS[filing]);
}

function federalMarginalRate(taxableWages, filing) {
  var taxable = Math.max(0, taxableWages - STANDARD_DEDUCTION[filing]);
  return marginalRate(taxable, FEDERAL_BRACKETS[filing]);
}

function stateIncomeTax(wages, filing, state, overrideRate) {
  var base = Math.max(0, wages);
  if (overrideRate != null) return base * overrideRate;
  if (state.kind === "none") return 0;
  var scale = filing === "mfj" ? 2 : 1;
  var deduction = state.deduction * scale;
  var taxable = Math.max(0, base - deduction);
  if (state.kind === "flat") return taxable * state.rate;
  var span = Math.max(1, state.span * scale);
  var rise = Math.max(0, state.high - state.low);
  if (taxable <= span) return state.low * taxable + (rise * taxable * taxable) / (2 * span);
  var atSpan = state.low * span + (rise * span) / 2;
  return atSpan + state.high * (taxable - span);
}

function getState(id) {
  return STATE_BY_ID[id] || STATE_BY_ID.PA;
}

function makeRow(id, label, detail, annual, periods, tone) {
  var annualCents = cents(annual);
  return { id: id, label: label, detail: detail, annual: annualCents, perCheck: cents(annualCents / periods), tone: tone };
}

function calculatePaycheck(input) {
  var frequency = FREQUENCY[input.frequency] || FREQUENCY.weekly;
  var periods = frequency.periods;
  var hourly = clamp(input.hourly, 0, 100000);
  var regularHours = clamp(input.regularHours, 0, 1000);
  var overtimeHours = clamp(input.overtimeHours, 0, 1000);
  var overtimeMultiplier = clamp(input.overtimeMultiplier, 1, 5);
  var retirementRate = clamp(input.retirementRate, 0, 1);
  var localRate = clamp(input.localRate, 0, 0.5);
  var stateOverride = input.stateOverrideRate == null ? null : clamp(input.stateOverrideRate, 0, 0.5);
  var healthPerCheck = clamp(input.healthPerCheck, 0, 100000);
  var extraFederalPerCheck = clamp(input.extraFederalPerCheck, 0, 100000);
  var postTaxPerCheck = clamp(input.postTaxPerCheck, 0, 100000);

  var grossPerCheck = cents(hourly * regularHours + hourly * overtimeMultiplier * overtimeHours);
  var grossAnnual = cents(grossPerCheck * periods);
  var state = getState(input.stateId);
  var retirementAnnual = cents(Math.min(grossAnnual, grossAnnual * retirementRate));
  var healthAnnual = cents(Math.min(healthPerCheck * periods, Math.max(0, grossAnnual - retirementAnnual)));
  var ficaWages = Math.max(0, grossAnnual - healthAnnual);
  var fitWages = Math.max(0, ficaWages - retirementAnnual);
  var stateWages = state.retirementDeductible ? fitWages : ficaWages;
  var federalAnnual = federalIncomeTax(fitWages, input.filing);
  var marginal = federalMarginalRate(fitWages, input.filing);
  var stateAnnual = stateIncomeTax(stateWages, input.filing, state, stateOverride);
  var localAnnual = grossAnnual * localRate;
  var socialSecurityAnnual = Math.min(ficaWages, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE;
  var medicareAnnual = ficaWages * MEDICARE_RATE;
  var additionalMedicareAnnual = Math.max(0, ficaWages - ADDITIONAL_MEDICARE_THRESHOLD[input.filing]) * ADDITIONAL_MEDICARE_RATE;
  var extraFederalAnnual = extraFederalPerCheck * periods;
  var postTaxAnnual = postTaxPerCheck * periods;
  var deductionAnnual =
    retirementAnnual + healthAnnual + federalAnnual + stateAnnual + localAnnual +
    socialSecurityAnnual + medicareAnnual + additionalMedicareAnnual + extraFederalAnnual + postTaxAnnual;
  var takeHomeAnnual = cents(grossAnnual - deductionAnnual);
  var taxableIncome = Math.max(0, fitWages - STANDARD_DEDUCTION[input.filing]);
  var bracketLabel = taxableIncome <= 0 ? "Under the standard deduction" : formatRate(marginal, 0) + " federal bracket";

  var stateSummary = "No tax on wages";
  if (stateOverride != null) stateSummary = formatRate(stateOverride) + " flat rate you set";
  else if (state.kind === "flat") stateSummary = formatRate(state.rate) + " flat";
  else if (state.kind === "graduated") stateSummary = "Graduated estimate";
  var stateDetail = state.retirementDeductible ? stateSummary : stateSummary + " · retirement deferrals are taxed";

  var hours = regularHours + overtimeHours;
  var otRate = hourly * overtimeMultiplier;
  var grossExplain =
    hours <= 0
      ? "Add hours to estimate a paycheck."
      : overtimeHours > 0
        ? trimHours(regularHours) + " hrs × " + formatMoney(hourly) + " + " + trimHours(overtimeHours) + " hrs × " + formatMoney(otRate) + " overtime"
        : trimHours(regularHours) + " hrs × " + formatMoney(hourly);

  var rows = [makeRow("gross", "Gross pay", grossExplain, grossAnnual, periods, "gross")];
  if (retirementAnnual > 0) rows.push(makeRow("retirement", "401(k) deferral", formatRate(retirementRate) + " of gross · pre-tax", retirementAnnual, periods, "deduction"));
  if (healthAnnual > 0) rows.push(makeRow("health", "Health and pre-tax benefits", "Reduces income tax and FICA", healthAnnual, periods, "deduction"));
  rows.push(makeRow("federal", "Federal income tax", bracketLabel, federalAnnual, periods, "tax"));
  if (extraFederalAnnual > 0) rows.push(makeRow("extra-federal", "Extra federal withholding", "Added on top of the estimate", extraFederalAnnual, periods, "tax"));
  rows.push(makeRow("state", state.name + " income tax", stateDetail, stateAnnual, periods, "tax"));
  if (localAnnual > 0) rows.push(makeRow("local", "Local wage tax", formatRate(localRate) + " of gross wages", localAnnual, periods, "tax"));
  rows.push(makeRow("social-security", "Social Security", ficaWages > SOCIAL_SECURITY_WAGE_BASE ? "6.2% up to " + formatMoney(SOCIAL_SECURITY_WAGE_BASE) : "6.2% of FICA wages", socialSecurityAnnual, periods, "tax"));
  rows.push(makeRow("medicare", "Medicare", "1.45% of FICA wages", medicareAnnual, periods, "tax"));
  if (additionalMedicareAnnual > 0) {
    rows.push(makeRow("additional-medicare", "Additional Medicare", "0.9% over " + formatMoney(ADDITIONAL_MEDICARE_THRESHOLD[input.filing]), additionalMedicareAnnual, periods, "tax"));
  }
  if (postTaxAnnual > 0) rows.push(makeRow("post-tax", "After-tax deductions", "Does not reduce taxes", postTaxAnnual, periods, "deduction"));
  rows.push(makeRow("net", "Take-home pay", frequency.check, takeHomeAnnual, periods, "net"));

  var taxAnnual = federalAnnual + extraFederalAnnual + stateAnnual + localAnnual + socialSecurityAnnual + medicareAnnual + additionalMedicareAnnual;
  var otherAnnual = retirementAnnual + healthAnnual + postTaxAnnual;
  var segments = [];
  function pushSeg(id, label, amount) {
    var rounded = cents(amount);
    if (rounded <= 0 || grossAnnual <= 0) return;
    segments.push({ id: id, label: label, amount: rounded, share: rounded / grossAnnual });
  }
  pushSeg("net", "Take-home", Math.max(0, takeHomeAnnual));
  pushSeg("federal", "Federal", federalAnnual + extraFederalAnnual);
  pushSeg("state", "State and local", stateAnnual + localAnnual);
  pushSeg("fica", "Social Security and Medicare", socialSecurityAnnual + medicareAnnual + additionalMedicareAnnual);
  pushSeg("other", "Other deductions", otherAnnual);

  var netPerCheck = 0;
  rows.forEach(function (item) {
    if (item.id === "net") netPerCheck = item.perCheck;
  });

  return {
    rows: rows,
    segments: segments,
    grossPerCheck: grossPerCheck,
    grossAnnual: grossAnnual,
    takeHomePerCheck: netPerCheck,
    takeHomeAnnual: cents(takeHomeAnnual),
    taxShare: grossAnnual > 0 ? taxAnnual / grossAnnual : 0,
    hourlyNet: hours > 0 ? cents(netPerCheck / hours) : 0,
    federalMarginal: marginal,
    bracketLabel: bracketLabel,
    periods: periods,
    checkLabel: frequency.check,
    empty: grossPerCheck <= 0,
  };
}

function parseAmount(value) {
  var cleaned = String(value == null ? "" : value).replace(/[^0-9.-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return 0;
  var number = Number(cleaned);
  return isFinite(number) ? number : 0;
}

function parseOptionalRate(value) {
  if (String(value).trim() === "") return null;
  return parseAmount(value) / 100;
}

function annualOf(id, result) {
  for (var i = 0; i < result.rows.length; i++) {
    if (result.rows[i].id === id) return result.rows[i].annual;
  }
  return null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculatePaycheck: calculatePaycheck, annualOf: annualOf };
}

function boot() {
  var client = ADSENSE_CLIENT.trim();
  var slot = ADSENSE_SLOT.trim();
  if (/^ca-pub-\d{10,16}$/.test(client) && /^\d{6,12}$/.test(slot)) {
    var slotEl = document.getElementById("ad-slot");
    slotEl.textContent = "";
    var unit = document.createElement("ins");
    unit.className = "adsbygoogle";
    unit.setAttribute("data-ad-client", client);
    unit.setAttribute("data-ad-slot", slot);
    unit.setAttribute("data-ad-format", "horizontal");
    unit.setAttribute("data-full-width-responsive", "true");
    slotEl.appendChild(unit);
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(client);
    script.crossOrigin = "anonymous";
    script.onload = function () {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        /* AdSense may reject a second push. */
      }
    };
    document.head.appendChild(script);
  }

  var stateSelect = document.getElementById("state");
  STATES.slice()
    .sort(function (a, b) {
      return a.name.localeCompare(b.name);
    })
    .forEach(function (state) {
      var option = document.createElement("option");
      option.value = state.id;
      option.textContent = state.name + (state.kind === "none" ? " — no wage tax" : "");
      stateSelect.appendChild(option);
    });

  var fields = {
    hourly: document.getElementById("hourly"),
    regularHours: document.getElementById("hours"),
    overtimeHours: document.getElementById("overtime"),
    overtimeMultiplier: document.getElementById("ot-rate"),
    filing: document.getElementById("filing"),
    stateId: stateSelect,
    localPct: document.getElementById("local"),
    retirementPct: document.getElementById("retirement"),
    health: document.getElementById("health"),
    extraFederal: document.getElementById("extra-federal"),
    postTax: document.getElementById("post-tax"),
    stateOverride: document.getElementById("state-override"),
  };

  var values = Object.assign({}, DEFAULTS);
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) values = sanitize(JSON.parse(saved));
  } catch (error) {
    values = Object.assign({}, DEFAULTS);
  }

  function sanitize(raw) {
    raw = raw || {};
    return {
      hourly: typeof raw.hourly === "string" ? raw.hourly : DEFAULTS.hourly,
      regularHours: typeof raw.regularHours === "string" ? raw.regularHours : DEFAULTS.regularHours,
      overtimeHours: typeof raw.overtimeHours === "string" ? raw.overtimeHours : DEFAULTS.overtimeHours,
      overtimeMultiplier: typeof raw.overtimeMultiplier === "string" ? raw.overtimeMultiplier : DEFAULTS.overtimeMultiplier,
      frequency: FREQUENCY[raw.frequency] ? raw.frequency : DEFAULTS.frequency,
      filing: raw.filing === "single" || raw.filing === "mfj" || raw.filing === "mfs" || raw.filing === "hoh" ? raw.filing : DEFAULTS.filing,
      stateId: STATE_BY_ID[raw.stateId] ? raw.stateId : DEFAULTS.stateId,
      localPct: typeof raw.localPct === "string" ? raw.localPct : "",
      retirementPct: typeof raw.retirementPct === "string" ? raw.retirementPct : "",
      health: typeof raw.health === "string" ? raw.health : "",
      extraFederal: typeof raw.extraFederal === "string" ? raw.extraFederal : "",
      postTax: typeof raw.postTax === "string" ? raw.postTax : "",
      stateOverride: typeof raw.stateOverride === "string" ? raw.stateOverride : "",
    };
  }

  function writeForm() {
    fields.hourly.value = values.hourly;
    fields.regularHours.value = values.regularHours;
    fields.overtimeHours.value = values.overtimeHours;
    fields.overtimeMultiplier.value = values.overtimeMultiplier;
    fields.filing.value = values.filing;
    fields.stateId.value = values.stateId;
    fields.localPct.value = values.localPct;
    fields.retirementPct.value = values.retirementPct;
    fields.health.value = values.health;
    fields.extraFederal.value = values.extraFederal;
    fields.postTax.value = values.postTax;
    fields.stateOverride.value = values.stateOverride;
    document.querySelectorAll("#frequency button").forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-frequency") === values.frequency ? "true" : "false");
    });
  }

  function hasAdjustments() {
    return [values.localPct, values.retirementPct, values.health, values.extraFederal, values.postTax, values.stateOverride].some(function (value) {
      return value.trim() !== "" && parseAmount(value) !== 0;
    });
  }

  var adjustBody = document.getElementById("adjust-body");
  var adjustToggle = document.getElementById("adjust-toggle");
  function setAdjust(open) {
    adjustBody.hidden = !open;
    adjustToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function readInputs() {
    return {
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
    };
  }

  function render() {
    var result = calculatePaycheck(readInputs());
    var heading = "Take-home " + result.checkLabel;
    document.getElementById("takehome-heading").textContent = heading;
    document.getElementById("take-home").textContent = formatMoney(result.takeHomePerCheck);
    document.getElementById("summary").textContent = result.empty
      ? "Enter a wage and hours to see take-home pay."
      : formatMoney(result.grossPerCheck) + " gross " + result.checkLabel + ". " + formatMoney(result.takeHomeAnnual) + " a year. " + result.bracketLabel + ". " + formatRate(result.taxShare, 1) + " of gross goes to taxes.";
    var hourlyNet = document.getElementById("hourly-net");
    if (!result.empty && result.hourlyNet > 0) {
      hourlyNet.hidden = false;
      hourlyNet.textContent = formatMoney(result.hourlyNet) + " an hour after taxes and deductions";
    } else {
      hourlyNet.hidden = true;
    }

    var share = document.getElementById("share");
    var legend = document.getElementById("legend");
    share.replaceChildren();
    legend.replaceChildren();
    if (result.empty || result.segments.length === 0) {
      share.removeAttribute("aria-label");
    } else {
      share.setAttribute("aria-label", result.segments.map(function (segment) {
        return segment.label + " " + formatMoney(segment.amount);
      }).join(", "));
      result.segments.forEach(function (segment) {
        var bar = document.createElement("span");
        bar.className = "seg-" + segment.id;
        bar.style.flexGrow = String(segment.amount);
        share.appendChild(bar);
        var item = document.createElement("li");
        var dot = document.createElement("span");
        dot.className = "dot seg-" + segment.id;
        dot.setAttribute("aria-hidden", "true");
        item.appendChild(dot);
        item.appendChild(document.createTextNode(segment.label + " "));
        var rate = document.createElement("span");
        rate.textContent = formatRate(segment.share, 0);
        item.appendChild(rate);
        legend.appendChild(item);
      });
    }

    var list = document.getElementById("rows");
    list.replaceChildren();
    result.rows.forEach(function (item) {
      var li = document.createElement("li");
      if (item.tone === "net") li.className = "net";
      var copy = document.createElement("span");
      copy.className = "row-copy";
      var label = document.createElement("span");
      label.className = "row-label";
      label.textContent = item.label;
      var detail = document.createElement("span");
      detail.className = "row-detail";
      detail.textContent = item.detail;
      copy.appendChild(label);
      copy.appendChild(detail);
      var check = document.createElement("span");
      check.className = "check";
      check.textContent = formatMoney(item.perCheck);
      var year = document.createElement("span");
      year.className = "year-col";
      year.textContent = formatMoney(item.annual);
      li.appendChild(copy);
      li.appendChild(check);
      li.appendChild(year);
      list.appendChild(li);
    });

    document.getElementById("dock-label").textContent = heading;
    document.getElementById("dock-pay").textContent = formatMoney(result.takeHomePerCheck);
    document.getElementById("dock-gross").childNodes[0].textContent = formatMoney(result.grossPerCheck);

    var fullTime = FREQUENCY[values.frequency].fullTimeHours;
    var entered = parseAmount(values.regularHours) + parseAmount(values.overtimeHours);
    var hoursHint = document.getElementById("hours-hint");
    if (entered > 0 && entered < fullTime * 0.7) {
      hoursHint.hidden = false;
      hoursHint.replaceChildren();
      hoursHint.appendChild(document.createTextNode("These hours are for one paycheck. Full-time " + FREQUENCY[values.frequency].label.toLowerCase() + " is about " + trimHours(fullTime) + " hours. "));
      var use = document.createElement("button");
      use.type = "button";
      use.className = "linkish";
      use.textContent = "Use " + trimHours(fullTime);
      use.addEventListener("click", function () {
        values.regularHours = String(fullTime);
        values.overtimeHours = "0";
        writeForm();
        persist();
      });
      hoursHint.appendChild(use);
    } else {
      hoursHint.hidden = true;
    }

    document.getElementById("pa-hint").hidden = !(values.stateId === "PA" && values.localPct.trim() === "");
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (error) {
      /* Private mode can block storage. The estimate still updates. */
    }
    render();
  }

  Object.keys(fields).forEach(function (key) {
    function sync() {
      values[key] = fields[key].value;
      persist();
    }
    fields[key].addEventListener("input", sync);
    fields[key].addEventListener("change", sync);
  });

  document.getElementById("frequency").addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    values.frequency = button.getAttribute("data-frequency");
    writeForm();
    persist();
  });

  document.querySelector(".presets").addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;
    values.localPct = button.getAttribute("data-local");
    writeForm();
    persist();
  });

  adjustToggle.addEventListener("click", function () {
    setAdjust(adjustBody.hidden);
  });

  document.getElementById("reset").addEventListener("click", function () {
    values = Object.assign({}, DEFAULTS);
    setAdjust(false);
    writeForm();
    persist();
  });

  document.getElementById("pay-form").addEventListener("submit", function (event) {
    event.preventDefault();
  });

  writeForm();
  setAdjust(hasAdjustments());
  render();
}

if (typeof document !== "undefined") boot();
