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

## Picking a model: MoE beats dense on one GPU

My GPU is an RX 6800 (16 GB VRAM), and the model choice turned out to matter more than anything else in the stack. I didn't start from scratch: [localmaxxing.com](https://www.localmaxxing.com/en/hardware) is a community leaderboard of benchmarked inference runs for specific GPUs, and I lifted a tuned `llama-server` command from an [RX 6800 run](https://www.localmaxxing.com/en/hardware/DISCRETE_GPU%3Arx%206800?name=RX+6800&run=cmoihh0gb000kl5046d781b36) — speculative MTP decoding, Q8_0 KV cache, flash attention — and adjusted from there.

The interesting decision was dense vs. mixture-of-experts:

- **Dense 27B (Qwen3.8 at ~3.5-bit quant)** — technically fits, and quality-per-bit claims are seductive. In practice: 3.4 tokens/second on Vulkan. For long generations that's twenty minutes per output. Unusable.
- **MoE 35B-A3B (Ornith-1.5)** — 35B total parameters but only ~3B active per token, so it runs at ~30 tok/s on the same card while keeping most of the quality. Nearly 10× the throughput for a negligible quality difference on my workloads.

Two setup notes from the fight: the model thinks by default, which you control with `--jinja --chat-template-kwargs '{"preserve_thinking": true}'` so reasoning lands in a separate `reasoning_content` field instead of polluting the response; and always sanity-check tokens/second with a real prompt before committing to a workload — spec decode acceptance rates and prompt length swing the numbers more than any benchmark predicts.

## Practical setup notes

- **Linux is the friendliest host** for local inference tooling — most frameworks target it first.
- Quantized models (GGUF and similar) make 7B–14B parameter models practical on consumer hardware.
- A modest setup covers most daily use: summarization, drafting, and code assistance.

My interest in local LLMs started as a curiosity and became a default workflow — and it directly shaped projects like [ejobtrack](/blog/ejobtrack-zero-server-job-tracker), where ML inference runs on-device by design.
