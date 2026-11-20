#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { formatReleased, parseDate, scoreEntry, scoreHardware } from "./score.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, "../data/usabench.json"), "utf8"));

const pulse = parseDate(data.pulseDate);
const chinaBasePenalty = data.chinaBasePenalty ?? 25;
const foreignTeacherPenalty = data.foreignTeacherPenalty ?? 15;
const fullOpenBonus = data.fullOpenBonus ?? 0;
const permissiveBonus = data.permissiveBonus ?? 0;
const closedPenalty = data.closedPenalty ?? 10;

const models = [...data.frontier, ...data.flagged]
  .map((e) => scoreEntry(e, pulse, data.decay, chinaBasePenalty, foreignTeacherPenalty, fullOpenBonus, permissiveBonus, closedPenalty))
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
  "mirendil.com": "https://mirendil.com",
  "krea.ai": "https://krea.ai",
  "platform.reflection.ai": "https://platform.reflection.ai",
  "console.liquid.ai": "https://console.liquid.ai",
};

function linkifyAccess(access) {
  if (!access) return "—";
  return access
    .split(/(\s*[+/]\s*)/)
    .map((part) => (ACCESS_LINKS[part.trim()] ? `[${part.trim()}](${ACCESS_LINKS[part.trim()]})` : part))
    .join("");
}

const COMPANY_LINKS = {
  "NVIDIA": "nvidia",
  "Google": "google",
  "Liquid AI": "LiquidAI",
  "Reflection AI": "reflection",
  "Arcee AI": "arcee-ai",
  "Ai2 (allenai)": "allenai",
  "IBM": "ibm-granite",
  "OpenAI": "openai",
  "Apple": "apple",
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
  "Essential AI": "essentialai",
  "Nomic AI": "nomic-ai",
  "Arc Institute": "arcinstitute",
  "Cisco Foundation AI": "fdtn-ai",
  "Canopy Labs": "canopylabs",
  "Fixie AI": "fixie-ai",
  "Ultralytics": "ultralytics",
  "Databricks": "databricks",
  "Together AI": "togethercomputer",
  "Suno": "suno",
  "Poolside": "poolside",
  "Thinking Machines Lab": "thinkingmachines",
  "AMD": "amd",
  "DeepGrove": "deepgrove",
  "Krea": "krea",
  "Linum": "Linum-AI",
  "PrismML": "prism-ml",
  "Boson AI": "bosonai",
  "Resemble AI": "ResembleAI",
  "Hexgrad": "hexgrad",
  "Cactus Compute": "Cactus-Compute",
  "SupraLabs": "SupraLabs",
  "Circlestone Labs": "circlestone-labs",
  "National Design Studio": "nationaldesignstudio",
  "NemoStation": "NemoStation",
  "Sesame": "sesame",
  "Voyage AI": "voyageai",
  "Datalab": "datalab-to",
  "Fish Audio": "fishaudio",
  "Conway Research": "ConwayResearch",
  "Verne": "vernerobotics",
  "Tesslate": "Tesslate",
  "Prior Labs": "Prior-Labs",
  "Zyphra": "Zyphra",
  "Netflix": "netflix",
  "Qualcomm AI Research": "Qualcomm-AI-Research",
  "Nous Research": "NousResearch",
  "BlinkDL": "BlinkDL",
  "Fastino": "fastino",
  "Cloudflare": "Cloudflare",
  "Open Athena": "open-athena",
  "Perplexity": "perplexity-ai",
  "Runway": "runwayml",
  "Stellon Labs": "KittenML",
  "Interfaze": "interfaze-ai",
  "Nace": "nace-ai",
  "OrcaRouter": "orcarouter",
  "Loop": "openjev",
  "vLLM": "vllm-sr",
  "Stanford / NVIDIA": "Contrastive-LM",
  "Amazon": "amazon",
  "Hugging Face Bio": "HuggingFaceBio",
  "Recursive": "RecursiveSI",
  "Ricursive Intelligence": "ricursiveAI",
  "webAI": "webAI-Official",
  "Base Labs": "baselabs",
  "Hao AI Lab": "FastVideo",
  "Eximius Labs": "EximiusLabs",
  "OpenMed": "OpenMed",
  "Ultralytics": "ultralytics",
  "Pika": "Pika-Labs",
  "Edge0": "Edge0",
  "Rayline": "rayline-ai",
  "Ostris": "ostris",
  "Inworld AI": "inworld",
  "RadixArk": "RadixArk",
};

function linkifyCompany(company) {
  const bare = company.replace(/\*\*/g, "").trim();
  const slug = COMPANY_LINKS[bare];
  return slug ? `[${company}](https://huggingface.co/${slug})` : company;
}

function modelRow(e) {
  const dq = e.score < 10;
  const model = e.model;
  const scoreCell = dq ? `**${e.score}** ❌` : `**${e.score}** ${e.starLabel}`;
  const company = dq ? e.company : linkifyCompany(e.company);
  const access = dq ? (e.access ?? "—") : linkifyAccess(e.access);
  const openLabel = dq ? "No" : e.openLabel;
  return `| ${String(e.rank).padEnd(4)} | ${model} | ${company} | ${openLabel} | ${scoreCell} | ${e.notes} | ${access} |`;
}

const HW_DEFAULT_WEIGHTS = { usParts: 40, finalAssembly: 20, boardAssembly: 10, chipFab: 15, display: 5, usDesign: 10 };
const hwWeights = { ...HW_DEFAULT_WEIGHTS, ...(data.hardwareWeights ?? {}) };

const hardware = (data.hardware ?? [])
  .map((h) => scoreHardware(h, hwWeights))
  .sort((a, b) => b.score - a.score)
  .map((h, i) => ({ ...h, rank: i + 1 }));

function hardwareRow(h) {
  const name = h.link ? `[${h.name}](${h.link})` : h.name;
  const released = h.announced ? `Announced ${formatReleased(h.announced)} • ` : "";
  return `| ${String(h.rank).padEnd(4)} | ${name} | ${h.company} | ${h.category} | **${h.score}** ${h.starLabel} | ${h.usContentLabel ?? `${h.usContentPct}% US`} | ${h.builtIn ?? "—"} | ${released}${h.status ?? ""}${h.notes ? ` • ${h.notes}` : ""} |`;
}

const output = {
  pulseDate: data.pulseDate,
  pulseLabel: data.pulseLabel,
  chinaBasePenalty,
  foreignTeacherPenalty,
  fullOpenBonus,
  permissiveBonus,
  closedPenalty,
  models,
  hardwareWeights: hwWeights,
  hardware,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(output, null, 2));
  process.exit(0);
}

const days = data.daysSinceMajorRelease ?? 0;
const daysLabel = days === 0 ? "**0 days**" : days === 1 ? "**1 day**" : `**${days} days**`;

console.log(`USAbench pulse (v2): ${data.pulseLabel} (${data.pulseDate})\n`);
console.log(`params: fullOpenBonus=${fullOpenBonus}, permissiveBonus=${permissiveBonus}, closedPenalty=${closedPenalty}, chinaPenalty=${chinaBasePenalty}, foreignTeacherPenalty=${foreignTeacherPenalty}`);
console.log(`recency decay: ${JSON.stringify(data.decay)}\n`);
console.log("## README pulse callout\n");
console.log(`> **US AI Pulse · ${data.pulseLabel}**  `);
console.log(`> ${daysLabel} since the last major US release — USAbench recency anchor\n`);

console.log("## Models (sorted by score)\n");
for (const e of models) {
  const rel = e.releasedLabel ?? "no date";
  const flag = e.chinaBase
    ? " [Foreign base]"
    : e.foreignTeacher
      ? " [Foreign teacher]"
      : "";
  const bonusPart = e.bonuses ? ` +${e.bonuses}b` : "";
  const parts = [`−${e.recencyPenalty} recency`];
  if (e.chinaPenalty) parts.push(`−${e.chinaPenalty} China`);
  if (e.foreignTeacherPenalty) parts.push(`−${e.foreignTeacherPenalty} foreign teacher`);
  if (e.closedPenalty) parts.push(`−${e.closedPenalty} closed`);
  if (!e.chinaPenalty && !e.foreignTeacherPenalty) {
  }
  const penaltyDetail = e.chinaPenalty || e.foreignTeacherPenalty || e.closedPenalty
    ? parts.join(", ")
    : `−${e.totalPenalty}`;
  console.log(
    `${String(e.score).padStart(3)} ${e.starLabel}  ${e.model}${flag}  (${rel}${bonusPart}, ${penaltyDetail})`
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
console.log("\n## README table rows (Hardware)\n");
console.log(`hardware weights: ${JSON.stringify(hwWeights)}\n`);
console.log("| Rank | Hardware | Company / HQ | Category | USAbench | US content | Built in | Notes |");
console.log("|------|----------|--------------|----------|----------|------------|----------|-------|");
for (const h of hardware) {
  console.log(hardwareRow(h));
}
