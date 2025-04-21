# 🧠 Run ChatGPT Locally using WebLLM

WebLLM allows you to run large language models (LLMs) directly in your browser — **without using any cloud servers**! This project guides you through setting up WebLLM to run ChatGPT-like conversations locally on your machine.

---

## 🚀 What is WebLLM?

**WebLLM** is an open-source project developed by [MLC AI](https://mlc.ai/web-llm/) that brings transformer-based large language models to web browsers using WebGPU, enabling **offline**, **private**, and **serverless** LLM inference.

### ✅ Key Features
- No internet/cloud API required
- Fully runs in your local browser
- Powered by WebGPU (hardware-accelerated)
- Open-source and privacy-respecting
- Lightweight and easy to set up

---

## 📦 Prerequisites

Before running WebLLM, ensure you have the following:

- ✅ A **modern browser** that supports WebGPU:
  - Chrome Canary with WebGPU enabled
  - Edge or Safari Technology Preview (experimental)
- ✅ Your **GPU drivers** are up to date
- ✅ Git and Python (if building locally)

---

## 🔧 How It Works

WebLLM compiles LLM models into WASM + WebGPU binaries using TVM and runs them directly in your browser. It utilizes the **LLM Web Runtime** (LWR) to infer responses in real-time using your local hardware (GPU).

---

## 🛠️ Setup Instructions

### Option 1: Use WebLLM in Your Browser (Quick Start)

1. Open your browser (Chrome Canary recommended)
2. Navigate to the official WebLLM demo:  
   👉 [https://mlc.ai/web-llm](https://mlc.ai/web-llm)
3. Choose a model (e.g., `RedPajama-3B`, `LLaMA2`, or `Mistral`)
4. Wait for model to load (~few seconds to minutes)
5. Start chatting locally — no cloud API involved!

---

### Option 2: Run WebLLM Locally via GitHub

1. **Clone the repository**

```bash
git clone https://github.com/mlc-ai/web-llm.git
cd web-llm
