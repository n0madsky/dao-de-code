import test from "node:test";
import assert from "node:assert/strict";
import taoExtension, { detectVariant, parseTaoCommand, resolveMode } from "./index.js";

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

function extension(settings = {}, entries = []) {
  const handlers = new Map();
  const commands = new Map();
  const pi = {
    getSettings: () => settings,
    on: (event, handler) => handlers.set(event, handler),
    registerCommand: (name, command) => commands.set(name, command),
    appendEntry: (customType, data) => entries.push({ type: "custom", customType, data }),
  };
  const ctx = { sessionManager: { getBranch: () => entries } };
  taoExtension(pi);
  return {
    pi,
    start: () => handlers.get("session_start")({}, ctx),
    command: (args) => commands.get("tao").handler(args, ctx),
    prompt: async (prompt = "refactor this module") => {
      const event = { prompt, systemPromptOptions: { sections: { unrelated: "keep" } } };
      await handlers.get("before_agent_start")(event);
      assert.equal(event.systemPromptOptions.sections.unrelated, "keep");
      return event.systemPromptOptions.sections.tao;
    },
  };
}

for (const variant of ["en", "zh", "hant", "auto"]) {
  test(`enabledByDefault starts Tao with defaultVariant ${variant}`, async () => {
    const ext = extension({ tao: { enabledByDefault: true, defaultVariant: variant } });
    await ext.start();
    const expected = variant === "auto" ? "zh" : variant;
    assert.match(await ext.prompt("帮我重构这个模块"), new RegExp(`TAO MODE ACTIVE — variant: ${expected}`));
  });
}

test("Tao stays off unless enabledByDefault is the boolean true", async () => {
  for (const tao of [undefined, null, false, {}, { defaultVariant: "en" },
    { enabledByDefault: false }, { enabledByDefault: "true" }, { enabledByDefault: 1 }]) {
    const ext = extension({ tao });
    await ext.start();
    assert.equal(await ext.prompt(), undefined);
  }
});

test("missing and invalid defaultVariant values fall back to auto", async () => {
  for (const defaultVariant of [undefined, null, "off", "bogus", "toString", "__proto__", 1, {}]) {
    const ext = extension({ tao: { enabledByDefault: true, defaultVariant } });
    await ext.start();
    assert.match(await ext.prompt("幫我重構這個模組"), /variant: hant/);
  }
});

test("bare /tao uses the configured variant even when startup is disabled", async () => {
  const ext = extension({ tao: { enabledByDefault: false, defaultVariant: "zh" } });
  await ext.start();
  assert.equal(await ext.prompt(), undefined);
  await ext.command("");
  assert.match(await ext.prompt(), /variant: zh/);
  await ext.command("off");
  assert.equal(await ext.prompt(), undefined);
  await ext.command("");
  assert.match(await ext.prompt(), /variant: zh/);
  await ext.command("en");
  assert.match(await ext.prompt(), /variant: en/);
});

test("persisted session overrides take priority over startup defaults", async () => {
  for (const enabledByDefault of [true, false]) {
    for (const mode of ["off", "en", "zh", "hant", "auto"]) {
      const entries = [{ type: "custom", customType: "tao-mode", data: { mode } }];
      const ext = extension({ tao: { enabledByDefault, defaultVariant: "en" } }, entries);
      await ext.start();
      const section = await ext.prompt("帮我重构这个模块");
      if (mode === "off") assert.equal(section, undefined);
      else assert.match(section, new RegExp(`variant: ${mode === "auto" ? "zh" : mode}`));
    }
  }
});

test("session_start reads changed settings without discarding a saved override", async () => {
  const settings = { tao: { enabledByDefault: true, defaultVariant: "en" } };
  const ext = extension(settings);
  await ext.start();
  assert.match(await ext.prompt(), /variant: en/);
  settings.tao = { enabledByDefault: false, defaultVariant: "hant" };
  await ext.start();
  assert.equal(await ext.prompt(), undefined);
  await ext.command("");
  assert.match(await ext.prompt(), /variant: hant/);
  settings.tao = { enabledByDefault: true, defaultVariant: "en" };
  await ext.start();
  assert.match(await ext.prompt(), /variant: hant/);
});

test("Pi versions without getSettings retain off and auto defaults", async () => {
  const ext = extension();
  delete ext.pi.getSettings;
  await ext.start();
  assert.equal(await ext.prompt(), undefined);
  await ext.command("");
  assert.match(await ext.prompt("帮我重构这个模块"), /variant: zh/);
});
