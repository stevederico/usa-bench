Refresh USA-Bench in this checkout. You are on a GitHub Actions runner, not a laptop. The git remote is already authenticated. Push to origin master and push the tag. Do not change the remote URL. Do not force-push.

Follow Agents.md in this repo. One table. Do not split LLM and non-LLM.

## Stop if nothing changed

1. Read data/usabench.json and note pulseDate plus every frontier and flagged model name.
2. Search X for US model releases in the last 7 days.
3. Search Hugging Face trending pages p=0 through p=5 (https://huggingface.co/models?sort=trending&p=N).
4. Keep US HQ orgs only. Skip China labs, non-US labs, community GGUF packs of foreign bases, and LoRA spam.
5. If every real US release is already scored at the current family version, stop. Do not edit files. Do not commit. Report "no change" and the pulse date.

## If something is new or a family is stale

- US own weights, or a closed US model: add or update a frontier family row.
- US org on a foreign weight foundation (Qwen, GLM, Kimi, DeepSeek, and the same class): flagged, chinaBase true, score stays 0.
- Own US pretrain plus a foreign SFT or RL teacher: stay on frontier with foreignTeacher true. Do not hard-zero.
- Prefer one family row over quant and GGUF variants.
- Closed models stay closed. The script caps them.
- Set released to an ISO date you verified. Set baseScore against peers already in the file.
- Set pulseDate to today, pulseLabel to the current month and year, and daysSinceMajorRelease from the newest major US release.

## Scoring loop

1. Edit data/usabench.json only. Never hand-edit score numbers in README.
2. Run node scripts/usabench.mjs.
3. Replace the README ### Models table with the script rows, through the last rank row. Keep the pulse callout after it and update that callout from the script.
4. If you add a US org, add its Hugging Face slug in scripts/usabench.mjs COMPANY_LINKS.
5. CHANGELOG is append-only. Latest git tag is the version. Bump minor. New block goes under the to-do list and above the previous version. Three words or less per line. Present tense. No dashes on those lines.
6. Commit only the USA-Bench files you changed. Message starts with the version. No AI attribution.
7. Push origin master, tag that version, push the tag.
8. Confirm the tag on HEAD matches the first version line in CHANGELOG.

## Do not

- Do not commit when the tree was already dirty before you started. Report that and stop.
- Do not brew, touch Railway, open a repo, or file issues or PRs on repos this user does not own.
- Do not rewrite old CHANGELOG entries.
