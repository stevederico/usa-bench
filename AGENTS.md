# AGENTS.md

Agent instructions for **USA-Bench** — US AI sovereignty leaderboard.

## Stack / layout

| Path | Role |
|------|------|
| `data/usabench.json` | Source of truth: `frontier` + `flagged`, pulse date, scoring params |
| `scripts/usabench.mjs` | Score calculator + README table rows |
| `README.md` | Published Models table (paste from script) |
| `CONTRIBUTING.md` | Human scoring guide |
| `CHANGELOG.md` | Version log + to-do (commit skill format) |

**Do not** split LLM vs non-LLM into separate boards unless explicitly asked (one table for now).

## Scoring loop (after any model add/edit)

1. Edit `data/usabench.json` only (never hand-edit score numbers in README)
2. `node scripts/usabench.mjs` — print scores + markdown rows
3. Replace README `### Models` table with script output (through the last rank row; keep pulse callout after)
4. Bump CHANGELOG + commit/tag per repo convention (minor for new models)

### Entry fields (`frontier` or `flagged`)

```json
{
  "model": "Name",
  "company": "US HQ company",
  "released": "YYYY-MM-DD",
  "baseScore": 0-100,
  "openSource": true,
  "closed": false,
  "fullOpen": false,
  "permissive": false,
  "access": "HF + NGC",
  "notes": "short curator notes (script prepends Released …)"
}
```

- **Zero-foreign bar** — any foreign influence in the training stack → `flagged` + hard score **0** (not a partial hit)
- **Foreign foundation** (Qwen / GLM / Kimi / DeepSeek / etc. as weight base): `chinaBase: true`, `chinaBaseLabel`, `whyFlagged`
- **Foreign teacher** (SFT/RL synth from foreign generators, e.g. Kimi writing bootstrap labels): `foreignTeacher: true`, `foreignTeacherLabel`, `whyFlagged` — still **0** even if pretrain is own-US
- **US org quantizing foreign bases** (e.g. `nvidia/*-NVFP4` of GLM): flag, do not rank as US-open
- **Closed US** (`closed: true`): cap 82

## Discover new models — Hugging Face Trending technique

Use this when asked to find / refresh candidate models.

### URL pattern

```
https://huggingface.co/models?sort=trending&p=N
```

- `p=0` = first page; increment `p` for next pages
- ~30 cards per page
- Prefer **page batches of 5–6** in parallel, then next batch

### How far to go

| Pass | Pages | When |
|------|-------|------|
| Quick | `p=0`–`5` | Hot flagships only |
| Standard | `p=0`–`11` | Default refresh (~360 cards) |
| Deep | `p=12`–`30` | Long tail / specialists |
| Resume | start after last reviewed `p` | “do p11 through p30” style |

Track last reviewed page in the session; do not re-summarize already-scored duplicates.

### Filter rules (strict)

**Keep only US HQ orgs** (examples): `nvidia`, `google`, `meta-llama`, `facebook`, `openai`, `microsoft`, `ibm-granite`, `LiquidAI`, `poolside`, `moondream`, `bosonai`, `ResembleAI`, `ideogram-ai`, `xai-org`, `allenai`, `Snowflake`, `Ultralytics`, `HuggingFaceTB`, `NousResearch`, `voyageai`, `sesame`, `fal`, …

**Skip:**

| Skip | Examples |
|------|----------|
| China labs | `Qwen`, `deepseek-ai`, `zai-org`, `tencent`, `moonshotai`, `MiniMaxAI`, `openbmb`, `XiaomiMiMo`, `stepfun-ai`, `meituan-longcat`, `InternScience`, … |
| Non-US | `mistralai` (FR), `black-forest-labs` (DE), `Lightricks` (IL), `CohereLabs` (CA), `stabilityai` (UK), `unsloth` (IE packager), `pyannote` (FR) |
| Pure community GGUF of foreign bases | random `*Qwen*-abliterated*`, Mythos/Fable distill dumps with no US lab |
| Comfy LoRA spam | style LoRAs, workflows — not foundation entries |

**US org + foreign base** → list under “flag candidates”, not frontier.  
**US org + foreign teacher/synth** (admitted SFT/distill from Kimi/Qwen/GLM/DeepSeek/etc.) → same: flag candidates, not frontier.

### Output format for discovery passes

Produce **two tables**:

1. **A. US own-base (or US foundation line)** — candidates to score  
2. **B. US org, foreign foundation** — flag-only  

For each A row: `Org | Model | Task | Size | Notes`  
Then a short **vs USAbench** list: already scored vs **not scored yet**.

### After discovery → score

For each **not scored** A row (when asked to score):

1. Confirm US HQ + whether base is from-scratch US (own paper / Base checkpoint / not “finetuned from Qwen…”)
2. Confirm **zero foreign teachers**: no SFT/RL bootstrap synth from Kimi/Qwen/GLM/DeepSeek/etc. (blog, model card, paper)
3. Set `released` (ISO), `baseScore` (calibrate vs peers in `usabench.json`), flags, notes
4. Run scoring loop above
5. Prefer **family rows** over every GGUF/quant card (`Gemma 4`, not 40 QAT variants)

### Own-base + zero-foreign check (quick)

| Signal | Clean US | Foreign → flag 0 |
|--------|----------|------------------|
| HF “Base model” / model tree | Same org base | Qwen/Llama-CN/GLM/Kimi/… |
| Arch notes | Own paper (e.g. LFM hybrid, Nemotron) | “Based on Qwen3.6”, “continued from …” |
| Compare language | “beats Qwen on …” | “fine-tune of Qwen …” |
| Post-train / SFT | Own or US-only teachers | “SFT from Kimi…”, “distilled from …”, foreign synth teachers |

Example: **Liquid LFM2.5 = own US base** (LFM hybrid + own pretrain). **PrismML Bonsai = foreign base** (Qwen3.6 compress). **Inkling = foreign teacher** (own pretrain claimed; Kimi+peers SFT synth bootstrap → still 0).

### API note

HF API `sort=trending` may be invalid — use the **web models page** (`?sort=trending&p=N`), not the REST sort param.

### Optional org deep-dive

After trending, pull official orgs sorted by created:

```
https://huggingface.co/models?author=nvidia&sort=created
https://huggingface.co/models?author=google&sort=created
https://huggingface.co/models?author=LiquidAI&sort=created
https://huggingface.co/models?author=poolside&sort=created
```

Catches releases that never hit top trending.

## Versioning / git

- Tags + CHANGELOG (e.g. `0.8.0`)
- Minor bump for new model batches; patch for copy/README-only
- No AI attribution in commits
- Auto-commit after substantive model updates unless user says hold

## README header (don’t break)

```
# 🇺🇸 USA-Bench 🇺🇸
## 🦅 Free + Open Models from the Land of the Free 🦅   ← centered h2
*Ranked by USAbench…*
```
