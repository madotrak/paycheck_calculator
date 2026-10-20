import assert from "node:assert/strict";
import test from "node:test";
import { calculatePaycheck, type PaycheckInputs } from "./calculate.ts";

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
