# Contributing to Awesome USA

Thank you for your interest in contributing to **Awesome USA** — the curated list of the best US-made AI models, tools, and sovereign infrastructure.

## How to Contribute

1. **Fork** the repository
2. **Create a new branch** for your changes
3. **Make your edits** (add models, tools, runtimes, academic projects, etc.)
4. **Follow the format**:
   - Use the existing table structure for models
   - Include **Released** date (month + year)
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

USAbench weights **open-weights sovereignty + recency** over raw capability. Scores are refreshed against the README pulse date (currently **July 2026**). A closed API-only model caps at the 80–94 band even if it's frontier-class.

- **95-100** ⭐⭐⭐: Pure US + open weights, released within ~6 months
- **80-94** ⭐⭐: Strong US closed API, or open US that is aging (13+ months)
- **60-79** ⭐: Older open releases, hybrid US + China base, or flagged entries
- **0-59**: Mostly non-US or heavy China dependency (China Base column in Models table)

**Scoring checklist**
1. Start with US purity (HQ + primary dev in USA)
2. **+15** open weights on Hugging Face or equivalent with permissive license
3. **+5** full recipe open (training code, data, or evals released)
4. **Cap at 88** if closed API-only — no exceptions for capability
5. Apply **recency decay** from pulse date: 0–3 mo (0) • 4–6 mo (−2) • 7–12 mo (−5) • 13–18 mo (−10) • 19+ mo (−15)
6. China base → `flagged` array (`chinaBase: true`, `chinaBaseLabel`, `whyFlagged`), typically 40–69 band

## Refreshing scores (pulse date)

USAbench scores are anchored to **`data/usabench.json`** → `pulseDate` (currently July 2026).

When the pulse advances or a model release changes:

1. Edit `data/usabench.json` — update `pulseDate`, `pulseLabel`, and/or model `released` / `baseScore`
2. Run `node scripts/usabench.mjs` — prints recalculated scores + README table rows
3. Copy updated scores into `README.md` (Models table)
4. Update the pulse callout at the top of `README.md` (`pulseLabel`, `daysSinceMajorRelease`)

Add new frontier models to the `frontier` array; China-base entries go in `flagged`.

## Code of Conduct

Be respectful. This list celebrates American innovation in AI while staying factual and transparent.

## Questions?

Open an issue or reach out on X (@stevederico).

Let's keep building the best sovereign AI resource together! 🇺🇸🦅

---

*Inspired by the awesome-list community and @levelsio's hardware sovereignty memes.*