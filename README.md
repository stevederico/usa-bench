<img width="1456" height="1139" alt="comeandtake" src="banner.png" />

##### image credit @levelsio https://x.com/levelsio/status/2070979198928277842

# Awesome USA 🇺🇸 

### Free + open source models, made in the land of the free 

### Models
Ranked by USAbench score. **China Base** marks models built on Chinese foundations (US post-train or wrapper); see Notes for details.

| Rank | Model / Family | Company | China Base | Released | Open Source | USAbench | Access | Notes |
|------|----------------|---------|------------|----------|-------------|----------|--------|-------|
| 1 | Nemotron Super / Ultra / 3 | NVIDIA | — | Jun 2026 | ✅ Yes | **98** ⭐⭐⭐ | NGC + HF | Enterprise, agentic |
| 2 | Gemma 4 | Google | — | May 2026 | ✅ Yes | **98** ⭐⭐⭐ | HF | Efficient local + multimodal |
| 3 | Liquid LFM2.5 / LFM2 | Liquid AI | — | Jun 2026 | ✅ Yes | **96** ⭐⭐⭐ | HF + LEAP + Ollama | MIT spinoff • edge/on-device • 230M–24B MoE • VL + Audio • LFM Open License ($10M commercial cap) |
| 4 | Arcee Trinity Large | Arcee AI | — | Mar 2026 | ✅ Yes | **95** ⭐⭐⭐ | HF | Agentic open |
| 5 | Claude Opus 4.6 / Fable 5 | Anthropic | — | Jun 2026 | ❌ No | **88** ⭐⭐ | claude.ai / API | Reasoning, safety, agents |
| 6 | GPT-5.6 (Sol/Terra/Luna) | OpenAI | — | May 2026 | ❌ No | **87** ⭐⭐ | API (vetted) | All-round + elite |
| 7 | Grok 4.3 / 4.20 / 5 | xAI | — | Apr 2026 | ❌ No | **86** ⭐⭐ | x.ai / X / API | Coding, real-time |
| 8 | Gemini 3 + Nano Banana / Veo | Google | — | Jun 2026 | ❌ No | **85** ⭐⭐ | gemini.google.com | Multimodal, video • use Gemma 4 for open |
| 9 | Llama 4 Maverick / Scout | Meta | — | Apr 2025 | ✅ Yes | **85** ⭐⭐ | Hugging Face | Open weights pioneer • ⚠️ aging (~15 mo) |
| 10 | **Muse Spark (Muse family)** | **Meta** | — | Mar 2026 | ❌ No | **82** ⭐⭐ | meta.ai / apps / API | Multimodal reasoning, agents • Meta's current frontier |
| 11 | Phi-4 + Reflection | Microsoft / Reflection | — | Dec 2024 | ✅ Yes | **81** ⭐⭐ | HF | Small & efficient open • ⚠️ aging (~19 mo) |
| 12 | MAI Code / Image / Thinking | Microsoft | — | Sep 2025 | ❌ No | **78** ⭐ | Azure | In-house coding + multimodal • use Phi-4 / Nemotron for open |
| 13 | INTELLECT-1 | Prime Intellect | — | Nov 2024 | ✅ Yes | **74** ⭐ | HF | First fully decentralized 10B • ⚠️ aging (~20 mo) • Arcee post-train |
| 14 | Ornith-1.0 | DeepReinforce | ❌ Qwen 3.5 + Gemma 4 | Jun 2026 | ✅ Yes | **68** ⭐ | HF | 397B/35B on Qwen 3.5 (Alibaba); 9B/31B also use Gemma 4 • MIT open • agentic coding RL |
| 15 | INTELLECT-3.1 | Prime Intellect | ❌ GLM-4.5-Air (Zhipu) | Feb 2026 | ✅ Yes | **63** ⭐ | HF | Post-trained on Chinese foundation; US RL only |
| 16 | INTELLECT-3 | Prime Intellect | ❌ GLM-4.5-Air (Zhipu) | Nov 2025 | ✅ Yes | **58** | HF | 106B MoE (12B active) on GLM base |
| 17 | INTELLECT-2 | Prime Intellect | ❌ QwQ-32B (Qwen) | Mar 2025 | ✅ Yes | **52** | HF | Distributed US RL on Qwen base • ⚠️ aging (~16 mo) |
| 18 | Composer 2.5 | Cursor | ❌ Kimi K2.5 (Moonshot) | — | ❌ No | **42** | Cursor | US company; closed API on Kimi checkpoint |

### Table of Contents
- [Models](#models)
- [Multimodal](#multimodal)
- [Dev Tools](#dev-tools)
- [US Tools for Running Models Locally & on Edge](#us-tools-for-running-models-locally--on-edge)
- [US University Labs & Research Contributions](#us-university-labs--research-contributions)
- [Discover More on Hugging Face](#discover-more-on-hugging-face)
- [Contributing](#contributing)

> **US AI Pulse · July 2026**  
> **0 days** since the last major US release — USAbench recency anchor



### Criteria
- US-headquartered company + primary development in the USA  
- USAbench score (0–100) — **open-weights sovereignty + recency**, not raw capability alone  
- Flag any China fine-tunes  
- Strong emphasis on open-weights + self-hosting tools

**USAbench tiers** (scores refreshed against **July 2026** pulse date)

| Score | Tier | Meaning |
|-------|------|---------|
| 95–100 | ⭐⭐⭐ | Pure US + open weights, released within ~6 months |
| 80–94 | ⭐⭐ | Strong US open (aging) or closed API-only (caps here) |
| 60–79 | ⭐ | Older open releases, or hybrid/flagged (China base + US post-train) |
| &lt;60 | — | Mostly non-US or heavy China dependency (see **China Base** column) |

**Recency decay** (from pulse date)

| Age | Penalty |
|-----|---------|
| 0–3 mo | none |
| 4–6 mo | −2 |
| 7–12 mo | −5 |
| 13–18 mo | −10 |
| 19+ mo | −15 |

Scores are computed from `data/usabench.json` — run `node scripts/usabench.mjs` after advancing the pulse date or updating releases.

Closed frontier models (Claude, GPT, Grok, etc.) can be excellent — they just don't score sovereign-open tier, and stale weights fall fast.

### Multimodal

| Model / Tool | Company | Type | Notes |
|--------------|---------|------|-------|
| Grok Imagine | xAI | Image + video | Real-time generation |
| Sora 2 / DALL·E | OpenAI | Video + image | Closed API |
| Veo 3.1 + Imagen 4 + Nano Banana | Google | Video + image | Use Gemma 4 for open LLM |
| Muse Spark | Meta | Multimodal reasoning | Closed API |
| Midjourney | Midjourney | Image | US company |
| Runway Gen-4 | Runway | Video | US company |
| HeyGen | HeyGen | Avatar video | US company |
| Krea | Krea | Image | US company |

### Dev Tools (All US)

| Tool | Company | Open Source | Notes |
|------|---------|-------------|-------|
| Cursor | Cursor | ❌ No | Composer 2.5 — China-base Kimi K2.5 ([Models](#models)) |
| GitHub Copilot | Microsoft / GitHub | ❌ No | IDE coding assistant |
| Claude Code | Anthropic | ❌ No | Agentic coding |
| Cognition (Devin) | Cognition | ❌ No | Autonomous software engineer |
| LangChain / LangGraph | LangChain | ✅ Yes | Agent orchestration framework |
| Vercel AI + v0 | Vercel | ✅ Partial | SDK open; v0 hosted |
| Hugging Face | Hugging Face | ✅ Yes | Hub + tools (NYC) |
| Groq | Groq | ❌ No | US inference (LPU) |
| Fireworks | Fireworks AI | ❌ No | US inference |
| Together.ai | Together AI | ❌ No | US inference |
| Perplexity | Perplexity | ❌ No | Answer engine |
| Sierra | Sierra | ❌ No | Enterprise agents |
| Palantir | Palantir | ❌ No | Enterprise AI platform |
| Databricks | Databricks | ✅ Partial | Mosaic AI + open components |
| Scale AI | Scale AI | ❌ No | Data + eval infrastructure |

### US Tools for Running Models Locally & on Edge (All Verified US Companies)
For maximum sovereignty — desktop, server, mobile, Apple Silicon, edge:

| Tool | HQ | Best for | Notes |
|------|-----|----------|-------|
| Ollama | Palo Alto, CA | Desktop CLI | Easiest CLI, huge US model support |
| LM Studio | New York, NY | Desktop GUI | Polished GUI + model browser |
| Google LiteRT / LiteRT-LM | Mountain View, CA | Android / edge | On-device inference |
| Apple MLX | Cupertino, CA | Apple Silicon | Mac, iPad, iPhone — M-series optimized |
| NVIDIA NIM | Santa Clara, CA | Production | Enterprise-grade, highest performance |
| vLLM | UC Berkeley, CA | Production serving | High-throughput open serving |
| GPT4All | US (Nomic AI) | Beginners | Friendly desktop app |

**Recommendation**: Desktop → Ollama or LM Studio • Mac → MLX • Android/edge → LiteRT • Production → NIM or vLLM.

> Banner and hardware sovereignty vibe inspired by [@levelsio](https://x.com/levelsio) "Come and Take It" GPU memes — hoarding hardware for sovereign AI 🇺🇸

### US University Labs & Research Contributions
US universities drive much of the open innovation:

| Lab | Institution | Key contributions |
|-----|-------------|-------------------|
| Sky Computing Lab, BAIR, berkeley-nest, rail-berkeley | UC Berkeley | vLLM, Starling-LM, Octo robotics, medical imaging |
| CRFM, StanfordNLP, StanfordAIMI | Stanford | Alpaca, HELM, BioMedLM, CoreNLP/Stanza |

These academic efforts are 100% US open contributions and power much of the ecosystem.

### Discover More on Hugging Face
Search these orgs for additional American contributions:

| Org | Notable models & tools |
|-----|------------------------|
| [meta-llama](https://huggingface.co/meta-llama) | Llama 4 Scout/Maverick, Llama 3.3, Llama 3.2 Vision, Llama Guard |
| [google](https://huggingface.co/google) | Gemma 4, PaliGemma, CodeGemma, MedGemma, ShieldGemma |
| [allenai](https://huggingface.co/allenai) | OLMo (fully open foundation models + training data) |
| [stanford-crfm](https://huggingface.co/stanford-crfm) | BioMedLM, research models, datasets |
| [stanfordaimi](https://huggingface.co/stanfordaimi) | Medical imaging models |
| [nvidia](https://huggingface.co/nvidia) | Nemotron, optimized models |
| [primeintellect](https://huggingface.co/PrimeIntellect) | INTELLECT-1/2/3/3.1, `prime-rl`, verifiers, Environments Hub |
| [arcee-ai](https://huggingface.co/arcee-ai) | Trinity Large/Mini/Nano, AFM-4.5B |
| [LiquidAI](https://huggingface.co/LiquidAI) | LFM2.5 (230M–8B MoE), LFM2-24B, VL + Audio, ColBERT retrievers |
| [deepreinforce-ai](https://huggingface.co/deepreinforce-ai) | Ornith-1.0 (9B/35B/397B) — China-base Qwen 3.5 |

Use tags like `llama`, `gemma`, `phi`, `nemotron`, `lfm`, `intellect`, `ornith` + filter for open licenses to stay US-focused.

### Contributing
- Add new pure-US entries with **Released** date and USAbench score in `data/usabench.json`
- PRs welcome — help keep the pulse and open list updated!  
- See [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon)

Made with ❤️ for builders who want **sovereign American AI**.  
Star ⭐ if helpful. Contributions always welcome!

---

**License**: CC0 / MIT-style for awesome lists (feel free to use).
