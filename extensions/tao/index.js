import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Skill files are the single source of truth; this extension only picks one.
// First root fits a repo checkout or pi package, second a local skill install.
const SKILL_ROOTS = [
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "skills"),
  path.join(os.homedir(), ".agents", "skills"),
];
const SKILL_DIR = { en: "tao-en", zh: "tao", hant: "tao-zh-hant" };
const LABEL = { en: "EN", zh: "ZH", hant: "ZH-Hant" };
const CJK = /[\u3400-\u4dbf\u4e00-\u9fff]/g;
// Traditional-only forms of very common characters; enough to tell the two Chinese sets apart.
const HANT_ONLY = /[這樣們個時會學對國發與從來麼灣開關車為說]/;
const FALLBACK = [
  "The Way that can be coded is not the eternal Way.",
  "Delete before you add. Follow the codebase's grain. Smallest change that fully works.",
].join("\n");

const ALIASES = {
  en: "en", english: "en",
  zh: "zh", hans: "zh", "zh-hans": "zh", cn: "zh",
  hant: "hant", "zh-hant": "hant", tw: "hant",
  auto: "auto",
  off: "off", normal: "off", stop: "off",
};

export function detectVariant(text, fallback = "en") {
  const s = String(text ?? "");
  if ((s.match(CJK) || []).length >= 3) return HANT_ONLY.test(s) ? "hant" : "zh";
  if ((s.match(/[A-Za-z]/g) || []).length >= 3) return "en";
  return fallback;
}

export function parseTaoCommand(text, mode, defaultVariant = "auto") {
  const arg = String(text || "").trim().toLowerCase();
  if (!arg) return mode === "off" ? { type: "set", mode: defaultVariant } : { type: "status" };
  const target = ALIASES[arg];
  return target ? { type: "set", mode: target } : { type: "invalid", arg };
}

export function resolveMode(entries, fallback = "off") {
  if (!Array.isArray(entries)) return fallback;
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (entry?.type !== "custom" || entry?.customType !== "tao-mode") continue;
    const mode = entry?.data?.mode;
    if (mode === "off" || mode === "auto" || mode in SKILL_DIR) return mode;
  }
  return fallback;
}

const bodies = new Map();
function skillBody(variant) {
  if (!bodies.has(variant)) {
    let body = null;
    for (const root of SKILL_ROOTS) {
      try {
        body = fs
          .readFileSync(path.join(root, SKILL_DIR[variant], "SKILL.md"), "utf8")
          .replace(/^---[\s\S]*?---\s*/, "");
        break;
      } catch {}
    }
    bodies.set(variant, body ?? `${FALLBACK}\n\n(${SKILL_DIR[variant]}/SKILL.md not found)`);
  }
  return bodies.get(variant);
}

function instructions(variant) {
  return [
    `TAO MODE ACTIVE — variant: ${variant}`,
    'Switch: /tao en|zh|hant|auto · Off: /tao off or "stop tao".',
    "Apply this to code you write and to diffs you review.",
    "",
    skillBody(variant),
  ].join("\n");
}

const STOP_TAO = /^(stop|exit|quit)\s+tao(\s+mode)?[.!]?$/i;

export default function taoExtension(pi) {
  let mode = "off";
  let defaultVariant = "auto";
  let variant = "en";
  let lastCtx = null;

  function syncStatus(ctx) {
    if (ctx) lastCtx = ctx;
    const c = ctx || lastCtx;
    if (!c?.ui?.setStatus) return;
    c.ui.setStatus("tao", mode === "off" ? undefined : `☯ tao: ${mode === "auto" ? LABEL[variant] + " auto" : LABEL[mode]}`);
  }

  const setMode = (next, ctx) => {
    mode = next;
    pi.appendEntry("tao-mode", { mode });
    syncStatus(ctx);
    const label = next === "off" ? "off" : next === "auto" ? `auto (${LABEL[variant]})` : LABEL[next];
    ctx?.ui?.notify?.(`Tao mode: ${label}`, "info");
  };

  pi.registerCommand("tao", {
    description: "Tao mode: en | zh | hant | auto | off | status",
    getArgumentCompletions: (prefix) => {
      const typed = String(prefix || "").trimStart().toLowerCase();
      const values = ["en", "zh", "hant", "auto", "off", "status"].filter((v) => v.startsWith(typed));
      return values.length ? values.map((value) => ({ value, label: value })) : null;
    },
    handler: async (args, ctx) => {
      const parsed = parseTaoCommand(args, mode, defaultVariant);
      if (parsed.type === "invalid") {
        ctx?.ui?.notify?.(`Unknown tao argument "${parsed.arg}". Use en, zh, hant, auto, off, status.`, "warning");
        return;
      }
      if (parsed.type === "status") {
        ctx?.ui?.notify?.(mode === "off" ? "Tao mode is off." : `Tao mode: ${mode} (${LABEL[variant]})`, "info");
        return;
      }
      setMode(parsed.mode, ctx);
    },
  });

  pi.on("input", async (event, ctx) => {
    if (event?.source === "extension") return;
    if (mode !== "off" && STOP_TAO.test(String(event?.text || "").trim())) setMode("off", ctx);
  });

  pi.on("session_start", async (_event, ctx) => {
    const entries = ctx?.sessionManager?.getBranch?.() || ctx?.sessionManager?.getEntries?.() || [];
    const defaults = pi.getSettings?.()?.tao;
    defaultVariant = ["en", "zh", "hant", "auto"].includes(defaults?.defaultVariant) ? defaults.defaultVariant : "auto";
    mode = resolveMode(entries, defaults?.enabledByDefault === true ? defaultVariant : "off");
    syncStatus(ctx);
  });

  pi.on("before_agent_start", async (event) => {
    const sections = event?.systemPromptOptions?.sections;
    if (mode === "off") {
      if (sections) delete sections.tao;
      return;
    }
    // Auto follows the conversation: explicit /tao en|zh|hant wins, otherwise the prompt decides.
    if (mode === "auto") variant = detectVariant(event?.prompt, variant);
    else variant = mode;

    if (sections && typeof sections === "object") {
      sections.tao = instructions(variant);
      return;
    }
    const base = event?.systemPrompt ? `${event.systemPrompt}\n\n` : "";
    return { systemPrompt: `${base}${instructions(variant)}` };
  });
}
