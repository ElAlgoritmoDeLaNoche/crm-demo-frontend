import test from "node:test";
import assert from "node:assert/strict";
import { resolveApiBase } from "../src/services/apiConfig.js";
const backend = "https://crm-demo-backend-production-9526.up.railway.app";
test("production defaults to Railway while development stays local", () => {
  assert.equal(resolveApiBase(undefined, true), `${backend}/api`);
  assert.equal(resolveApiBase(undefined, false), "http://localhost:4000/api");
});
test("API base always has exactly one api prefix and no trailing slash", () => {
  for (const configured of [backend, `${backend}/`, `${backend}/api`, ` ${backend}/api/ `])
    assert.equal(resolveApiBase(configured, true), `${backend}/api`);
});
