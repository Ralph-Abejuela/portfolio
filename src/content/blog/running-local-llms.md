---
title: "Why I Run Local LLMs Instead of Cloud Chatbots"
description: "Running local LLMs means private data stays on your machine, zero per-token costs, and full control over models and prompts. Here is why local models are my default for daily AI tooling."
pubDate: 2026-08-10
tags: ["AI", "Local LLMs", "Linux", "Privacy"]
---

**Local LLMs are my default for daily AI tooling.** Instead of sending every prompt to a cloud chatbot, I run models on my own hardware — and the practical benefits are hard to argue with.

## Three reasons I prefer local models

1. **Privacy.** Prompts, code, and documents never leave the machine. No third party sees what I'm working on.
2. **Zero marginal cost.** No per-token pricing. Experiment as much as I want.
3. **Control.** I choose the model, the quantization, the system prompt, and the tooling around it.

## Where local models still lag

- Small models can't match frontier models on complex reasoning — I keep a cloud model for hard one-off questions.
- Hardware matters: a GPU or a lot of RAM changes what you can run comfortably.

## Practical setup notes

- **Linux is the friendliest host** for local inference tooling — most frameworks target it first.
- Quantized models (GGUF and similar) make 7B–14B parameter models practical on consumer hardware.
- A modest setup covers most daily use: summarization, drafting, and code assistance.

My interest in local LLMs started as a curiosity and became a default workflow — and it directly shaped projects like [ejobtrack](/blog/ejobtrack-zero-server-job-tracker), where ML inference runs on-device by design.
