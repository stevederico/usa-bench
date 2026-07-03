#!/usr/bin/env node
/**
 * USAbench score calculator — anchored to data/usabench.json pulseDate.
 * Run after advancing the pulse date or adding/updating model releases.
 *
 * Usage:
 *   node scripts/usabench.mjs           # print scores + markdown rows
 *   node scripts/usabench.mjs --json    # machine-readable output
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, "../data/usabench.json"), "utf8"));


const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function parseDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function monthsBetween(released, pulse) {
  return (
    (pulse.getFullYear() - released.getFullYear()) * 12 +
    (pulse.getMonth() - released.getMonth())
  );
}

function recencyPenalty(months, decayTable) {
  for (const row of decayTable) {
    if (row.maxMonths === null || months <= row.maxMonths) {
      return row.penalty;
    }
  }
  return decayTable.at(-1).penalty;
}

function formatReleased(iso) {
  const d = parseDate(iso);
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function stars(score) {
  if (score >= 95) return "⭐⭐⭐";
  if (score >= 80) return "⭐⭐";
  if (score >= 60) return "⭐";
  return "";
}

function entryNotes(entry, ageMonths, releasedLabel) {
  let text = entry.chinaBase
    ? `❌ China base: ${entry.chinaBaseLabel} • ${entry.whyFlagged ?? ""}`
    : (entry.notes ?? "");
  if (entry.released && text.includes("⚠️ aging") && ageMonths !== null) {
    text = text.replace(/⚠️ aging(?:\s*\(~\d+\s*mo\))?/, `⚠️ aging (~${ageMonths} mo)`);
  }
  text = text.trim();
  if (releasedLabel) {
    text = text ? `Released ${releasedLabel} • ${text}` : `Released ${releasedLabel}`;
  }
  return text || "—";
}

function scoreEntry(entry, pulse, decayTable, chinaBasePenalty) {
  let recency = 0;
  let ageMonths = null;

  if (entry.released) {
    const released = parseDate(entry.released);
    ageMonths = monthsBetween(released, pulse);
    recency = recencyPenalty(ageMonths, decayTable);
  }

  const china = entry.chinaBase ? chinaBasePenalty : 0;
  const totalPenalty = recency + china;

  let score = entry.baseScore - totalPenalty;
  if (entry.closed) score = Math.min(score, 88);
  score = Math.max(0, Math.min(100, score));
  // China-base / foreign foundations are disqualified — hard 0, not a ranked score
  if (entry.chinaBase) score = 0;

  const openLabel = entry.openSource ? "Yes" : "No";

  return {
    ...entry,
    score,
    recencyPenalty: recency,
    chinaPenalty: china,
    totalPenalty,
    ageMonths,
    releasedLabel: entry.released ? formatReleased(entry.released) : null,
    starLabel: stars(score),
    openLabel,
    notes: entryNotes(
      entry,
      ageMonths,
      entry.released ? formatReleased(entry.released) : null
    ),
  };
}

const pulse = parseDate(data.pulseDate);
const chinaBasePenalty = data.chinaBasePenalty ?? 25;

const models = [...data.frontier, ...data.flagged]
  .map((e) => scoreEntry(e, pulse, data.decay, chinaBasePenalty))
  .sort((a, b) => b.score - a.score)
  .map((e, i) => ({ ...e, rank: i + 1 }));

const ACCESS_LINKS = {
  "HF": "https://huggingface.co",
  "Hugging Face": "https://huggingface.co",
  "NGC": "https://catalog.ngc.nvidia.com",
  "LEAP": "https://leap.liquid.ai",
  "Ollama": "https://ollama.com",
  "claude.ai": "https://claude.ai",
  "x.ai": "https://x.ai",
  "X": "https://x.com",
  "gemini.google.com": "https://gemini.google.com",
  "meta.ai": "https://meta.ai",
  "Azure": "https://azure.microsoft.com",
  "Cursor": "https://cursor.com",
  "midjourney.com": "https://midjourney.com",
  "runwayml.com": "https://runwayml.com",
  "heygen.com": "https://heygen.com",
  "krea.ai": "https://krea.ai",
};

// Linkify each known token in an access string, preserving " + " / " / " separators
function linkifyAccess(access) {
  if (!access) return "—";
  return access
    .split(/(\s*[+/]\s*)/)
    .map((part) => (ACCESS_LINKS[part.trim()] ? `[${part.trim()}](${ACCESS_LINKS[part.trim()]})` : part))
    .join("");
}

// Company → Hugging Face org (open-weights orgs only; closed-shop companies stay plain)
const COMPANY_LINKS = {
  "NVIDIA": "nvidia",
  "Google": "google",
  "Liquid AI": "LiquidAI",
  "Arcee AI": "arcee-ai",
  "Ai2 (allenai)": "allenai",
  "IBM": "ibm-granite",
  "OpenAI": "openai",
  "xAI": "xai-org",
  "Meta": "meta-llama",
  "Microsoft / Reflection": "microsoft",
  "Microsoft": "microsoft",
  "Prime Intellect": "PrimeIntellect",
  "DeepReinforce": "deepreinforce-ai",
  "Hugging Face": "HuggingFaceTB",
  "Salesforce": "Salesforce",
  "Snowflake": "Snowflake",
  "ServiceNow": "ServiceNow-AI",
  "Deep Cogito": "deepcogito",
  "Nous Research": "NousResearch",
  "Moondream": "moondream",
  "H2O.ai": "h2oai",
  "Cognitive Computations": "cognitivecomputations",
  "Fireworks AI": "fireworks-ai",
};

function linkifyCompany(company) {
  const bare = company.replace(/\*\*/g, "").trim();
  const slug = COMPANY_LINKS[bare];
  return slug ? `[${company}](https://huggingface.co/${slug})` : company;
}

function modelRow(e) {
  // Disqualified models (USAbench < 10): red ❌ on name + score, no green check, no promotional links
  const dq = e.score < 10;
  const model = e.model;
  const scoreCell = dq ? `**${e.score}** ❌` : `**${e.score}** ${e.starLabel}`;
  const company = dq ? e.company : linkifyCompany(e.company);
  const access = dq ? (e.access ?? "—") : linkifyAccess(e.access);
  const openLabel = dq ? "No" : e.openLabel;
  return `| ${String(e.rank).padEnd(4)} | ${model} | ${company} | ${openLabel} | ${scoreCell} | ${e.notes} | ${access} |`;
}

const output = {
  pulseDate: data.pulseDate,
  pulseLabel: data.pulseLabel,
  chinaBasePenalty,
  models,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

const days = data.daysSinceMajorRelease ?? 0;
const daysLabel = days === 0 ? "**0 days**" : days === 1 ? "**1 day**" : `**${days} days**`;

console.log(`USAbench pulse: ${data.pulseLabel} (${data.pulseDate})\n`);
console.log("## README pulse callout\n");
console.log(`> **US AI Pulse · ${data.pulseLabel}**  `);
console.log(`> ${daysLabel} since the last major US release — USAbench recency anchor\n`);

console.log("## Models (sorted by score)\n");
for (const e of models) {
  const rel = e.releasedLabel ?? "no date";
  const flag = e.chinaBase ? " [China base]" : "";
  const penaltyDetail = e.chinaPenalty
    ? `−${e.recencyPenalty} recency, −${e.chinaPenalty} China`
    : `−${e.totalPenalty}`;
  console.log(
    `${String(e.score).padStart(3)} ${e.starLabel}  ${e.model}${flag}  (${rel}, ${penaltyDetail})`
  );
}

console.log("\n## README table rows (Models)\n");
console.log(
  "| Rank | Model / Family | Company | Open Source | USAbench | Notes | Access |"
);
console.log(
  "|------|----------------|---------|-------------|----------|-------|--------|"
);
for (const e of models) {
  console.log(modelRow(e));
}