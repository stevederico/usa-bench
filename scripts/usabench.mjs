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

function entryNotes(e) {
  let text = e.chinaBase ? (e.whyFlagged ?? e.notes ?? "—") : (e.notes ?? "—");
  if (e.released && text.includes("⚠️ aging") && e.ageMonths !== null) {
    text = text.replace(/⚠️ aging(?:\s*\(~\d+\s*mo\))?/, `⚠️ aging (~${e.ageMonths} mo)`);
  }
  return text;
}

function chinaBaseLabel(e) {
  return e.chinaBaseLabel ? `❌ ${e.chinaBaseLabel}` : "—";
}

const models = [...data.frontier, ...data.flagged]
  .map((e) => scoreEntry(e, pulse, data.decay))
  .sort((a, b) => b.score - a.score)
  .map((e, i) => ({ ...e, rank: i + 1 }));

function modelRow(e) {
  const released = e.releasedLabel ?? "—";
  return `| ${String(e.rank).padEnd(4)} | ${e.model} | ${e.company} | ${chinaBaseLabel(e)} | ${released} | ${e.openLabel} | **${e.score}** ${e.starLabel} | ${e.access ?? "—"} | ${entryNotes(e)} |`;
}

const output = {
  pulseDate: data.pulseDate,
  pulseLabel: data.pulseLabel,
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
  console.log(
    `${String(e.score).padStart(3)} ${e.starLabel}  ${e.model}${flag}  (${rel}, −${e.penalty})`
  );
}

console.log("\n## README table rows (Models)\n");
console.log(
  "| Rank | Model / Family | Company | China Base | Released | Open Source | USAbench | Access | Notes |"
);
console.log(
  "|------|----------------|---------|------------|----------|-------------|----------|--------|-------|"
);
for (const e of models) {
  console.log(modelRow(e));
}