import test from "node:test";
import assert from "node:assert/strict";
import {
  propertyShareUrl,
  dateTimeInput,
  linkedPayload,
} from "../src/utils/commercial.js";
test("share links remain SPA URLs usable on Vercel", () =>
  assert.equal(
    propertyShareUrl("abc", "https://demo.test"),
    "https://demo.test/?property=abc",
  ));
test("empty references use nullable unbinding not invalid empty IDs", () =>
  assert.deepEqual(linkedPayload({ contactId: "", title: "Casa" }), {
    contactId: null,
    title: "Casa",
  }));
test("date time input includes local minute precision", () =>
  assert.match(dateTimeInput(new Date()), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/));
