# Contributing to USA-Bench

Thank you for your interest in contributing to **USA-Bench** — the US AI sovereignty leaderboard (models, tools, infrastructure).

## How to Contribute

1. **Fork** the repository
2. **Create a new branch** for your changes
3. **Make your edits** (add models, tools, runtimes, academic projects, etc.)
4. **Follow the format**:
   - Use the existing table structure for models
   - Set **`released`** in `data/usabench.json` (ISO date) — script prepends it to Notes
   - Set **openSource** (`true` / `false`) in `data/usabench.json`
   - Include **USAbench** score (0-100)
   - China-base models go in the `flagged` array — set `chinaBaseLabel` and `whyFlagged` in `data/usabench.json` (merged into Models table)
5. **Submit a Pull Request**

## What We're Looking For

- Pure US-headquartered companies and labs
- Open-weights models with clear access paths (HF, NGC, etc.)
- US-developed runtimes and tools (desktop, edge, server)
- University research contributions (Berkeley, Stanford, etc.)
- High-quality, verified entries only

## USAbench Scoring Guide

USAbench (v2) weights **US open-weights sovereignty + recency + full transparency**. One table for everything (no separate closed section). Closed models simply get a stricter cap. baseScore is the curator's quality anchor; bonuses are mechanical.

- **95-100** ⭐⭐⭐: Recent pure-US open with strong base + bonuses
- **80-94** ⭐⭐: Strong open or capped closed frontier
- **60-79** ⭐: Older US open (recency hurts)
- **0**: China-base (hard disqualify) or heavy foreign foundation

**Scoring formula (in script)**
baseScore + fullOpenBonus (5) + permissiveBonus (3) − recency − chinaPenalty(25)
if closed: min(score, closedCap=82)
clamp 0-100; chinaBase forces 0

**Scoring checklist**
1. US HQ + primary dev in USA (required)
2. Set `openSource: true` for open-weights
3. Set `fullOpen: true` when weights + training code + data/recipes are released
4. Set `permissive: true` for clean Apache 2.0 / MIT (no weird commercial caps)
5. Steeper recency decay (0–3mo:0 • 4–6:3 • 7–12:8 • 13–18:15 • 19+:22)
6. China base → `flagged` + `chinaBase: true` + labels → hard 0
7. Closed models capped at 82 (stricter than before)

## Refreshing scores (pulse date)

USAbench scores are anchored to **`data/usabench.json`** → `pulseDate` (currently July 2026).

When the pulse advances or a model release changes:

1. Edit `data/usabench.json` — update `pulseDate`, `pulseLabel`, and/or model `released` / `baseScore`
2. Run `node scripts/usabench.mjs` — prints recalculated scores + README table rows
3. Copy updated scores into `README.md` (Models table)
4. Update the pulse callout at the top of `README.md` (`pulseLabel`, `daysSinceMajorRelease`)

Add new frontier models to the `frontier` array; China-base entries go in `flagged`.

## Code of Conduct

Be respectful. This leaderboard celebrates American innovation in AI while staying factual and transparent.

## Questions?

Open an issue or reach out on X (@stevederico).

Let's keep building the best sovereign AI leaderboard together! 🇺🇸🦅

---

*Inspired by @levelsio's hardware sovereignty memes and ranked-index formats like the American-Made Cars Index.*