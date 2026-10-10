import assert from "node:assert/strict";
import test from "node:test";
import { money, compact } from "../src/utils/format.js";

test("money formats unchanged amounts as Mexican pesos", () => {
  assert.equal(money(123456), "MXN 123,456");
  assert.equal(money(0), "MXN 0");
  assert.equal(money(undefined), "MXN 0");
  assert.equal(money(-2500), "-MXN 2,500");
});

test("compact formats dashboard amounts as Mexican pesos", () => {
  assert.equal(compact(1234567), "MXN 1.2 M");
  assert.equal(compact(0), "MXN 0");
  assert.equal(compact(undefined), "MXN 0");
});
