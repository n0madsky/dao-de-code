import test from "node:test";
import assert from "node:assert/strict";
import { detectVariant, parseTaoCommand, resolveMode } from "./index.js";

test("detectVariant picks the variant from the prompt", () => {
  assert.equal(detectVariant("refactor this module and delete the wrapper"), "en");
  assert.equal(detectVariant("帮我重构这个模块，删掉多余的包装"), "zh");
  assert.equal(detectVariant("幫我重構這個模組，刪掉多餘的包裝"), "hant");
});

test("detectVariant keeps the previous variant on thin signal", () => {
  assert.equal(detectVariant("ok", "zh"), "zh");
  assert.equal(detectVariant("", "hant"), "hant");
  assert.equal(detectVariant("+1", "en"), "en");
});

test("parseTaoCommand switches, reports, and rejects", () => {
  assert.deepEqual(parseTaoCommand("", "off"), { type: "set", mode: "auto" });
  assert.deepEqual(parseTaoCommand("", "auto"), { type: "status" });
  assert.deepEqual(parseTaoCommand("zh-hant", "off"), { type: "set", mode: "hant" });
  assert.deepEqual(parseTaoCommand("OFF", "auto"), { type: "set", mode: "off" });
  assert.equal(parseTaoCommand("klingon", "auto").type, "invalid");
});

test("resolveMode restores the last persisted mode from the branch", () => {
  const entries = [
    { type: "message" },
    { type: "custom", customType: "tao-mode", data: { mode: "zh" } },
    { type: "custom", customType: "other", data: { mode: "off" } },
    { type: "custom", customType: "tao-mode", data: { mode: "auto" } },
  ];
  assert.equal(resolveMode(entries), "auto");
  assert.equal(resolveMode([{ type: "custom", customType: "tao-mode", data: { mode: "bogus" } }]), "off");
  assert.equal(resolveMode(undefined), "off");
});
