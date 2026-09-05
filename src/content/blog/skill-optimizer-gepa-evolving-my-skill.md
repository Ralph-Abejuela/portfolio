---
title: "I Let an Evolutionary Algorithm Rewrite My AI Skill (Full Story)"
description: "How I built skill-optimizer-gepa: an eval set from my real job applications, a scoring harness with hard checks and an LLM judge, and a GEPA run that plateaued, hallucinated a rule, and still ended 12.5 points above my hand-written skill. Every failure included."
pubDate: 2026-09-05
tags: ["AI", "LLM", "Open Source", "Prompt Engineering"]
---

I maintain a skill that tailors my LaTeX resume and writes a cover letter for any job I paste in. It has produced dozens of real applications. It was also a pile of hand-tuned prompt prose that I had never measured once. "It seems to work" was the entire quality process.

This is the full story of fixing that: building an eval set out of my real job hunt, writing a scoring harness, running GEPA (an evolutionary prompt optimizer) against my skill, watching it plateau and hallucinate, switching from a cloud model to a local one mid-project, and finally shipping the whole apparatus as an open-source toolkit — [skill-optimizer-gepa](https://github.com/Ralph-Abejuela/skill-optimizer-gepa).

## The baseline I didn't want to know

The skill (I called it `tailor-application`) lived as a markdown file: a When-to-Use section, a twelve-step procedure, pitfalls, output rules. Things I knew it should do: keep the resume to one page, never use em dashes (they read as AI slop), never fabricate achievements, sign off with the name on its own line.

Step one was humbling. I mined twenty-six of my past tailored applications, matched them to the original job descriptions from my research folder (360 listings across 214 companies), and assembled ten eval pairs — eight for training, two held out for validation. Then I ran the skill against all ten and scored each output on two axes:

- **Hard checks** — ten pass/fail rules: no em dashes, valid LaTeX, one-page length, greeting first, no "To whom it may concern", proper sign-off, and so on.
- **LLM judge** — a rubric scoring JD keyword coverage (0–3), truthfulness against the original resume (0–3), pain-point relevance (0–2), and letter quality (0–2).

My hand-written, carefully iterated skill scored **0.725**. A quarter of the rubric was failing and I had no idea. If you haven't scored your prompt, you don't know how good it is — that's the first thing this project taught me.

## Wiring up the optimizer

I picked [GEPA](https://github.com/gepa-ai/gepa) — an open-source optimizer that evolves prompts the way genetic algorithms evolve programs. Its loop: run the current prompt (the "candidate") on training instances, score it, reflect on the failures with an LLM, propose a mutation, evaluate, keep it if it wins. It's a reflection-heavy variant of the ideas in the [GEPA paper](https://arxiv.org/abs/2507.19457), and it plugs into any task via an adapter: you give it a task model, a metric, and a budget of metric calls.

The wiring was genuinely the easy part. The task model gets my skill text as the system prompt and a bundle (job description, resume source, synthetic personality answers) as the user message; it must return a JSON object with a full tailored LaTeX resume and a plain-text cover letter. My metric parses that, runs the hard checks, calls the judge, and returns a score plus written feedback — which is what GEPA's reflection model reads when it decides how to mutate.

I started on z.ai's `glm-4.5-flash` — a free, fast cloud endpoint — and gave the run a budget of 120 metric calls, which I confidently assumed would take a couple of hours.

## The plateau

Iteration 2 produced a restructured skill that scored **0.825** — a real jump, +10 points over baseline, locked in as the champion. Then came six consecutive rejections. Iteration 3: 0.675. Iterations 5, 6, 7: 0.725, 0.725, 0.725. Over two hours, the champion never moved. At 53 of 120 calls, doing the math (about 156 seconds per rollout, roughly 3.2 hours remaining), I stopped the run and took the champion.

This was the first real lesson of the project: **evolutionary optimization plateaus, and the plateau is information.** The mutations kept circling the same text; the reflection model kept proposing variations that scored the same. My instinct to watch the log like a hawk was also wrong — the lazy-correct move was a checkpointed run dir I could stop and resume at will, because every candidate is saved the moment it's evaluated.

## The hallucinated rule

When I diffed the champion against my skill, I found the optimizer's most instructive failure. Buried in its new "CRITICAL HARD FORMAT CHECKS" section was this:

> **NO COMPANY NAME IN COVER LETTER**: The cover letter must NOT mention the company by name.

My harness contains a check called `mentions company` that requires the opposite — the letter *should* address the company by name. The reflection model had invented a plausible-sounding professional convention and written it into the skill as a non-negotiable rule. The champion's hard-check score of 0.9 wasn't a near-perfect run; it was 9/10 *because* it was failing exactly that check on every instance.

An automated optimizer will happily propagate a hallucinated constraint forever, because within the loop, a confident rule looks identical to a correct one. The fix is process, not cleverness: **diff every candidate against the actual scorer before adopting anything.** I stripped the rule manually.

## Switching to local models — the accidental spec audit

Halfway through, I switched the worker model from the cloud API to a local one: `Ornith-1.5-35B-A3B` running through llama.cpp on my own GPU (I wrote about why I run local models [here](/blog/running-local-llms)). Before landing on it I had tried a dense 27B model at IQ3 quantization first — a genuinely bad idea, at 3.4 tokens/second it would have made each rollout twenty minutes. The MoE (3B active parameters) ran about 30 tok/s and matched the cloud rollout time almost exactly.

The local model immediately broke things the cloud model never did:

- **Trailing commas in JSON.** The outputs were good, but Ornith emits `"...last value",` before the closing brace, which is invalid JSON — so my parser scored two perfect outputs at 0.000. One regex in the parser fixed it permanently.
- **Ignoring the output format entirely.** Running the *original* skill, it answered with fenced LaTeX and a prose letter instead of the required JSON envelope. The cloud model had always complied. The new skill's explicit output-format section held it in line where the old one failed.
- **Literal-mindedness.** This was the gift. Both validation instances failed the *same two hard checks*: nothing in my skill said the sign-off name must be the final line of the letter, and nothing forced the company name into the greeting. Cloud models "habitually" did both right; the local model did exactly what the spec said, which was less than I meant. Two sentences of amendment later, hard checks went from 0.80 to 0.90 on both instances.

That's when it clicked: **cheap literal models are fuzzer for prompt specs.** If a cloud model passes your skill, you don't know whether it's good or whether the model is bailing you out. A smaller model that follows instructions literally exposes every vagueness as a defect.

## One mystery that wasn't the skill's fault

Even after the amendments, `mentions company` kept failing. I almost "fixed" the skill again before actually reading the letters — which were correct, naming the real organization from the job description. The eval data was the bug: my validation slugs (`guild-solutions`, `unison`) came from folder names, and the corresponding JDs never contained those tokens. The check was unwinnable by design — a hard-score ceiling of 0.90 that no skill could pass. Knowing the difference between a spec gap, a model quirk, and an eval artifact is most of the game.

## Proof on a fresh job

With v29 finalized, I ran a true A/B on a job description the pipeline had never seen (an internal-developer role at a cafe chain, real posting). Both skills, same model, same instance:

| | v28 (original) | v29 (evolved + amended) |
|---|---|---|
| Overall | 0.85 | **0.95** |
| Hard checks | 0.90 | **1.00** |
| Judge quality | 0.80 | **0.90** |
| Output format | broke under the local model | clean JSON |

I applied v29 to the live skill, and the whole toolkit — harness, runners, evaluator, proposal tooling — became [skill-optimizer-gepa](https://github.com/Ralph-Abejuela/skill-optimizer-gepa): config-driven, pluggable evaluator, works with any OpenAI-compatible endpoint, MIT-licensed.

## What I'd tell anyone doing this

1. **Write the metric first.** The optimizer is ~100 lines of glue; the eval set and the judge rubric are the actual engineering. Biased evals produce confidently optimized garbage.
2. **Budget in metric calls, not hours.** Estimate rollout latency before launching; decide your stop condition before you start watching logs.
3. **Plateaus are normal.** Five rejections in a row means take the champion and move on.
4. **Never adopt the optimizer's prose.** Its reasoning is plausible by construction. Score outputs, diff against ground truth, strip hallucinated rules.
5. **Test with a dumb model before shipping.** If a cheap local model follows your prompt correctly, a strong model will too. The reverse is not true.
6. **Parse failures are usually data, not garbage.** Look at the raw output before blaming the model — ours were valid outputs with a trailing comma.

## Resources

- [GEPA](https://github.com/gepa-ai/gepa) — the optimizer; the [paper](https://arxiv.org/abs/2507.19457) explains the reflective mutation loop
- [skill-optimizer-gepa](https://github.com/Ralph-Abejuela/skill-optimizer-gepa) — my toolkit: eval harness, GEPA runners, proposal diffing, A/B testing
- [llama.cpp](https://github.com/ggml-org/llama.cpp) + [GGUF quants](https://huggingface.co/unsloth) — local inference; MoE A3B-class models hit the sweet spot on consumer GPUs
- [litellm](https://github.com/BerriAI/litellm) — one interface across cloud and local OpenAI-compatible endpoints
- [DSPy](https://github.com/stanfordnlp/dspy) — the broader prompt-optimization ecosystem this approach sits in
