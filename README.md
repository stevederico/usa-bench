<img width="1456" height="1139" alt="comeandtake" src="https://github.com/user-attachments/assets/02664f18-a2e1-4a84-bfd4-b5e3b5ec330d" /> 
image credit @levelsio https://x.com/levelsio/status/2070979198928277842

# Awesome USA 🇺🇸

> Curated list of the **best AI models, LLMs, multimodal tools, and developer tools** from American companies and labs.  
> Strictly US-made. USAbench purity scores. Open-source & local emphasis. No China base models.

**US AI Pulse** • July 2026 • **0 days** since major US activity • 15+ open US models ready to run locally.

### Table of Contents
- [Frontier Models](#frontier-models)
- [US Open-Weights & Local Stack](#us-open-weights--local-stack)
- [Multimodal](#multimodal)
- [Dev Tools](#dev-tools)
- [US Tools for Running Models Locally & on Edge](#us-tools-for-running-models-locally--on-edge)
- [US University Labs & Research Contributions](#us-university-labs--research-contributions)
- [Discover More on Hugging Face](#discover-more-on-hugging-face)
- [Flagged](#flagged)
- [Contributing](#contributing)

### Criteria
- US-headquartered company + primary development in the USA  
- USAbench score (0–100) — **open-weights sovereignty + recency**, not raw capability alone  
- Flag any China fine-tunes  
- Strong emphasis on open-weights + self-hosting tools

**USAbench tiers** (scores refreshed against **July 2026** pulse date)
- **95–100** ⭐⭐⭐ — Pure US + open weights, released within ~6 months  
- **80–94** ⭐⭐ — Strong US open (aging) or closed API-only (caps here no matter how good)  
- **60–79** ⭐ — Older open releases, or hybrid/flagged (China base + US post-train)  
- **<60** — Mostly non-US or heavy China dependency → [Flagged](#flagged)

**Recency decay** (from pulse date): 0–3 mo → no penalty • 4–6 mo → −2 • 7–12 mo → −5 • 13–18 mo → −10 • 19+ mo → −15

Scores are computed from `data/usabench.json` — run `node scripts/usabench.mjs` after advancing the pulse date or updating releases.

Closed frontier models (Claude, GPT, Grok, etc.) can be excellent — they just don't score sovereign-open tier, and stale weights fall fast.

### Frontier Models

| Model / Family                  | Company     | Released   | Open Source | USAbench   | Access                  | Notes |
|-------------------------------|-------------|------------|-------------|------------|-------------------------|-------|
| Nemotron Super / Ultra / 3    | NVIDIA     | Jun 2026   | ✅ Yes      | **98** ⭐⭐⭐ | NGC + HF               | Enterprise, agentic |
| Gemma 4                       | Google     | May 2026   | ✅ Yes      | **98** ⭐⭐⭐ | HF                     | Efficient local + multimodal |
| Arcee Trinity Large           | Arcee AI   | Mar 2026   | ✅ Yes      | **95** ⭐⭐⭐ | HF                     | Agentic open |
| Claude Opus 4.6 / Fable 5     | Anthropic  | Jun 2026   | ❌ No       | **88** ⭐⭐ | claude.ai / API        | Reasoning, safety, agents |
| GPT-5.6 (Sol/Terra/Luna)      | OpenAI     | May 2026   | ❌ No       | **87** ⭐⭐ | API (vetted)           | All-round + elite |
| Grok 4.3 / 4.20 / 5           | xAI        | Apr 2026   | ❌ No       | **86** ⭐⭐ | x.ai / X / API         | Coding, real-time |
| Gemini 3 + Nano Banana / Veo  | Google     | Jun 2026   | ❌ No       | **85** ⭐⭐ | gemini.google.com      | Multimodal, video • use Gemma 4 for open |
| Llama 4 Maverick / Scout      | Meta       | Apr 2025   | ✅ Yes      | **85** ⭐⭐ | Hugging Face           | Open weights pioneer • ⚠️ aging (~15 mo) |
| **Muse Spark (Muse family)**  | **Meta**   | Mar 2026   | ❌ No       | **82** ⭐⭐ | meta.ai / apps / API   | Multimodal reasoning, agents • Meta's current frontier |
| Phi-4 + Reflection            | Microsoft / Reflection | Dec 2024 | ✅ Yes      | **81** ⭐⭐ | HF                     | Small & efficient open • ⚠️ aging (~19 mo) |
| MAI Code / Image / Thinking   | Microsoft  | Sep 2025   | ❌ No       | **78** ⭐ | Azure                  | In-house coding + multimodal • use Phi-4 / Nemotron for open |
| INTELLECT-1                   | Prime Intellect | Nov 2024 | ✅ Yes      | **74** ⭐ | HF                     | First fully decentralized 10B • ⚠️ aging (~20 mo) • Arcee post-train |

### US Open-Weights & Local Stack
**One-command sovereign stack** — freshest pure US open-weights first; private, zero cost.

- `ollama run nemotron-3-super` → NVIDIA Nemotron 3 (Jun 2026)  
- `ollama run gemma4` → Google Gemma 4 (May 2026)  
- `ollama run arcee-trinity` → Arcee Trinity Large (Mar 2026)  
- `ollama run phi4` → Microsoft Phi 4 (Dec 2024 — aging)  
- `ollama run llama4` → Meta Llama 4 (Apr 2025 — legacy, still widely deployed)  

Meta does both: **Muse Spark** for current hosted frontier + **Llama 4** for open control (due for refresh).

### Multimodal
- Grok Imagine (xAI)  
- Sora 2 / DALL·E (OpenAI)  
- Veo 3.1 + Imagen 4 + Nano Banana (Google)  
- Muse Spark (Meta)  
- Midjourney, Runway Gen-4, HeyGen, Krea  

### Dev Tools (All US)
- Cursor (<span style="color:red">❌</span> Composer 2.5) • GitHub Copilot • Claude Code • Cognition  
- LangChain / LangGraph • Vercel AI + v0 • Hugging Face (NYC)  
- Groq • Fireworks • Together.ai (US inference)  
- Perplexity • Sierra • Palantir • Databricks • Scale AI  

### US Tools for Running Models Locally & on Edge (All Verified US Companies)
For maximum sovereignty — desktop, server, mobile, Apple Silicon, edge:

- **Ollama** (Palo Alto, CA) — Easiest CLI, huge US model support
- **LM Studio** (Element Labs, New York) — Best polished GUI + model browser
- **Google LiteRT / LiteRT-LM** (Google, Mountain View) — **Best for Android / edge / on-device**
- **Apple MLX** (Apple, Cupertino) — **Best for Apple Silicon** (Mac, iPad, iPhone) — blazing fast on-device inference on M-series chips
- **NVIDIA NIM** (NVIDIA, Santa Clara) — Enterprise-grade, highest performance
- **vLLM** (UC Berkeley / US) — High-throughput serving
- **GPT4All** (Nomic AI, US) — Beginner-friendly desktop app

**Recommendation**: Desktop → Ollama or LM Studio • Mac → MLX • Android/edge → LiteRT • Production → NIM or vLLM.

> Banner and hardware sovereignty vibe inspired by [@levelsio](https://x.com/levelsio) "Come and Take It" GPU memes — hoarding hardware for sovereign AI 🇺🇸

### US University Labs & Research Contributions
US universities drive much of the open innovation:

- **UC Berkeley** (Sky Computing Lab, BAIR, berkeley-nest, rail-berkeley): vLLM (leading LLM inference/serving engine), Starling-LM (helpful assistant models), Octo robotics foundation models, medical imaging collaborations.
- **Stanford** (CRFM, StanfordNLP, StanfordAIMI): Alpaca (pioneering instruction-following dataset/model), HELM (gold-standard evaluation benchmark), BioMedLM and medical models on HF, CoreNLP/Stanza NLP toolkits.

These academic efforts are 100% US open contributions and power much of the ecosystem.

### Discover More on Hugging Face
Search these orgs for additional American contributions:

- **meta-llama** — Llama 4 Scout/Maverick, Llama 3.3, Llama 3.2 Vision, Llama Guard
- **google** — Gemma 4, PaliGemma, CodeGemma, MedGemma, ShieldGemma
- **allenai** — OLMo (fully open foundation models with training data)
- **stanford-crfm** — BioMedLM, research models, datasets
- **stanfordaimi** — Medical imaging models
- **nvidia** — Nemotron, optimized models
- **primeintellect** — INTELLECT-1/2/3/3.1, `prime-rl`, verifiers, Environments Hub

Use tags like "llama", "gemma", "phi", "nemotron", "intellect" + filter for open licenses to stay US-focused.

### Flagged
<span style="color:red">❌</span> = China base model. US company + foreign foundation; open weights still earn a bonus, but scores stay in the hybrid band.

| Model | Company | Released | Open Source | USAbench | Access | Notes |
|-------|---------|----------|-------------|----------|--------|-------|
| <span style="color:red">❌</span> INTELLECT-3.1 | Prime Intellect | Feb 2026 | ✅ Yes | **63** ⭐ | HF | INTELLECT-3 continuation • continued RL • GLM-4.5-Air base |
| <span style="color:red">❌</span> INTELLECT-3 | Prime Intellect | Nov 2025 | ✅ Yes | **58** | HF | 106B MoE (12B active) • US RL stack • GLM-4.5-Air base |
| <span style="color:red">❌</span> INTELLECT-2 | Prime Intellect | Mar 2025 | ✅ Yes | **52** | HF | 32B • globally distributed RL • QwQ-32B base • ⚠️ aging (~16 mo) |
| <span style="color:red">❌</span> Composer 2.5 | Cursor | — | ❌ No | **42** | Cursor | US company • closed |

### Contributing
- Add new pure-US entries with **Released** date, USAbench score + runtime command if available  
- PRs welcome — help keep the pulse and open list updated!  
- See [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon)

Made with ❤️ for builders who want **sovereign American AI**.  
Star ⭐ if helpful. Contributions always welcome!

---

**Banner Prompt** (generate with Grok Imagine):
> Create an insanely intense patriotic banner for GitHub README inspired by levelsio Come and Take It GPU meme: A ferocious bald eagle with glowing eyes, wings spread, defending a massive GPU cluster 'cannon' with 'COME AND TAKE IT' banner in bold, clutching a glowing AI orb and American flag, dramatic waving flag background with stars and stripes, lightning, fireworks, red white blue explosion, Silicon Valley skyline, bold 'AWESOME USA 🇺🇸 AI MODELS & TOOLS' text, 'Sovereign • Pure • Built in America' subtitle, intense patriotic power, ultra detailed, cinematic, maximum American pride and hardware sovereignty, 16:9 banner format, masterpiece.

Generate → upload as `banner.png` → add at top of this README.

---

**License**: CC0 / MIT-style for awesome lists (feel free to use).
