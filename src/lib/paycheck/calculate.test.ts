import assert from "node:assert/strict";
import test from "node:test";
import { calculatePaycheck, type PaycheckInputs } from "./calculate.ts";
import { federalIncomeTax, qualifiedOvertimeDeduction } from "./tax.ts";

function base(overrides: Partial<PaycheckInputs> = {}): PaycheckInputs {
  return {
    hourly: 20,
    regularHours: 40,
    overtimeHours: 0,
    overtimeMultiplier: 1.5,
    frequency: "weekly",
    filing: "single",
    stateId: "TX",
    stateOverrideRate: null,
    retirementRate: 0,
    healthPerCheck: 0,
    localRate: 0,
    extraFederalPerCheck: 0,
    postTaxPerCheck: 0,
    ...overrides,
  };
}

function annual(id: string, result: ReturnType<typeof calculatePaycheck>): number {
  const row = result.rows.find((item) => item.id === id);
  assert.ok(row, `missing row ${id}`);
  return row.annual;
}

test("single filer federal tax on a clean $52,000 wage matches 2026 brackets", () => {
  const result = calculatePaycheck(base({ hourly: 25 }));
  assert.equal(result.grossAnnual, 52_000);
  assert.equal(annual("federal", result), 4_060);
  assert.equal(annual("social-security", result), 3_224);
  assert.equal(annual("medicare", result), 754);
  assert.equal(annual("state", result), 0);
  assert.equal(result.takeHomeAnnual, 43_962);
  assert.equal(result.federalMarginal, 0.12);
});

test("married joint wage stays in the 12% bracket", () => {
  const result = calculatePaycheck(base({ hourly: 48, filing: "mfj", stateId: "FL" }));
  assert.equal(result.grossAnnual, 99_840);
  // taxable = 99840 - 32200 = 67640; tax = 2480 + 12% * (67640 - 24800) = 7620.80
  assert.equal(annual("federal", result), 7_620.8);
});

test("Pennsylvania taxes gross wages and does not deduct 401(k)", () => {
  const result = calculatePaycheck(
    base({ hourly: 20, stateId: "PA", retirementRate: 0.1, localRate: 0.0374 }),
  );
  assert.equal(result.grossAnnual, 41_600);
  assert.equal(annual("retirement", result), 4_160);
  // FIT wages 37,440; taxable 21,340; tax = 1240 + 12% * 8940 = 2312.80
  assert.equal(annual("federal", result), 2_312.8);
  // PA wage base stays 41,600 because deferrals are not deductible.
  assert.equal(annual("state", result), 1_277.12);
  assert.equal(annual("local", result), 1_555.84);
});

test("section 125 benefits reduce Social Security wages", () => {
  const result = calculatePaycheck(base({ hourly: 25, healthPerCheck: 100 }));
  assert.equal(annual("health", result), 5_200);
  assert.equal(annual("social-security", result), 2_901.6);
});

test("overtime is paid at the multiplier and Social Security stops at the wage base", () => {
  const overtime = calculatePaycheck(base({ hourly: 20, overtimeHours: 10 }));
  assert.equal(overtime.grossPerCheck, 1_100);

  const high = calculatePaycheck(base({ hourly: 200, regularHours: 40 }));
  assert.equal(high.grossAnnual, 416_000);
  assert.equal(annual("social-security", high), 11_439);
  assert.ok(annual("additional-medicare", high) > 0);
});

test("2026 qualified overtime deduction lowers federal tax only", () => {
  const result = calculatePaycheck(base({ hourly: 20, overtimeHours: 10, stateId: "TX" }));
  // 10 hours × $20 × 0.5 × 52 = $5,200 FLSA premium. Gross $57,200 taxes like $52,000.
  assert.equal(result.grossAnnual, 57_200);
  assert.equal(annual("federal", result), 4_060);
  assert.match(result.rows.find((item) => item.id === "federal")?.detail ?? "", /overtime deduction \$5,200\.00/);
  assert.equal(annual("social-security", result), 3_546.4);
  assert.equal(annual("medicare", result), 829.4);
  assert.equal(result.takeHomeAnnual, 48_764.2);
});

test("double time only deducts the FLSA half, and separate filers get none", () => {
  const doubled = calculatePaycheck(base({ hourly: 20, overtimeHours: 10, overtimeMultiplier: 2 }));
  assert.equal(doubled.grossAnnual, 62_400);
  assert.equal(annual("federal", doubled), 4_684);

  const separate = calculatePaycheck(base({ hourly: 20, overtimeHours: 10, filing: "mfs" }));
  assert.equal(annual("federal", separate), 4_684);
  assert.match(separate.rows.find((item) => item.id === "federal")?.detail ?? "", /joint return/);
});

test("Publication 15-T 2026 annual percentage checkpoints", () => {
  assert.equal(federalIncomeTax(656_700, "single"), 192_979.25);
  assert.equal(federalIncomeTax(800_900, "mfj"), 206_583.5);
  assert.equal(federalIncomeTax(280_350, "hoh"), 56_631);
  assert.equal(federalIncomeTax(280_375, "hoh"), 56_639.75);
  assert.equal(qualifiedOvertimeDeduction(5_200, 100_000, "single"), 5_200);
  assert.equal(qualifiedOvertimeDeduction(20_000, 100_000, "single"), 12_500);
  assert.equal(qualifiedOvertimeDeduction(20_000, 100_000, "mfj"), 20_000);
  assert.equal(qualifiedOvertimeDeduction(20_000, 100_000, "mfs"), 0);
  assert.equal(qualifiedOvertimeDeduction(12_500, 151_000, "single"), 12_400);
  assert.equal(qualifiedOvertimeDeduction(12_500, 150_999, "single"), 12_500);
  assert.equal(qualifiedOvertimeDeduction(12_500, 275_000, "single"), 0);
  assert.equal(qualifiedOvertimeDeduction(25_000, 550_000, "mfj"), 0);
});
