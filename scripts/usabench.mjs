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
const CHINA_X = '<span style="color:red">❌</span>';

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

function scoreEntry(entry, pulse, decayTable) {
  let penalty = 0;
  let ageMonths = null;

  if (entry.released) {
    const released = parseDate(entry.released);
    ageMonths = monthsBetween(released, pulse);
    penalty = recencyPenalty(ageMonths, decayTable);
  }

  let score = entry.baseScore - penalty;
  if (entry.closed) score = Math.min(score, 88);
  score = Math.max(0, Math.min(100, score));

  let notes = entry.notes ?? "";
  if (entry.released && notes.includes("⚠️ aging") && ageMonths !== null) {
    notes = notes.replace(/⚠️ aging(?:\s*\(~\d+\s*mo\))?/, `⚠️ aging (~${ageMonths} mo)`);
  }

  const openLabel = entry.openSource ? "✅ Yes" : "❌ No";

  return {
    ...entry,
    score,
    penalty,
    ageMonths,
    releasedLabel: entry.released ? formatReleased(entry.released) : null,
    starLabel: stars(score),
    openLabel,
    notes: notes || "—",
  };
}

const pulse = parseDate(data.pulseDate);
const frontier = data.frontier
  .map((e) => scoreEntry(e, pulse, data.decay))
  .sort((a, b) => b.score - a.score);

const flagged = data.flagged
  .map((e) => scoreEntry(e, pulse, data.decay))
  .sort((a, b) => b.score - a.score);

const openStack = frontier
  .filter((e) => e.openSource)
  .sort((a, b) => b.score - a.score);

function frontierRow(e) {
  return `| ${e.model.padEnd(29)} | ${e.company.padEnd(11)} | ${e.releasedLabel.padEnd(10)} | ${e.openLabel.padEnd(6)} | **${e.score}** ${e.starLabel} | ${e.access.padEnd(22)} | ${e.notes} |`;
}

function flaggedModelLabel(e) {
  return e.chinaBase ? `${CHINA_X} ${e.model}` : e.model;
}

function flaggedRow(e) {
  const released = e.releasedLabel ?? "—";
  return `| ${flaggedModelLabel(e)} | ${e.company} | ${released} | ${e.openLabel} | **${e.score}** ${e.starLabel} | ${e.access ?? "—"} | ${e.notes} |`;
}

const output = {
  pulseDate: data.pulseDate,
  pulseLabel: data.pulseLabel,
  frontier,
  flagged,
  openStack: openStack.map((e) => ({
    model: e.model.replace(/\*\*/g, ""),
    score: e.score,
    released: e.releasedLabel,
  })),
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

console.log(`USAbench pulse: ${data.pulseLabel} (${data.pulseDate})\n`);

console.log("## Frontier Models (sorted by score)\n");
for (const e of frontier) {
  console.log(
    `${String(e.score).padStart(3)} ${e.starLabel}  ${e.model}  (${e.releasedLabel}, −${e.penalty})`
  );
}

console.log("\n## Flagged\n");
for (const e of flagged) {
  const rel = e.releasedLabel ?? "no date";
  console.log(`${String(e.score).padStart(3)} ${e.starLabel}  ${e.model}  (${rel}, −${e.penalty})`);
}

console.log("\n## Open stack order\n");
for (const e of openStack) {
  console.log(`  ${e.score}  ${e.model}  (${e.releasedLabel})`);
}

console.log("\n## README table rows (Frontier Models)\n");
console.log(
  "| Model / Family                  | Company     | Released   | Open Source | USAbench   | Access                  | Notes |"
);
console.log(
  "|-------------------------------|-------------|------------|-------------|------------|-------------------------|-------|"
);
for (const e of frontier) {
  console.log(frontierRow(e));
}

console.log("\n## README table rows (Flagged)\n");
console.log(
  "| Model            | Company         | Released   | Open Source | USAbench   | Access     | Notes |"
);
console.log(
  "|------------------|-----------------|------------|-------------|------------|------------|-------|"
);
for (const e of flagged) {
  console.log(flaggedRow(e));
}