# Local LLM Setup with Ollama on macOS

This is a guide for installing and running a local LLM (Ollama + `qwen2.5:7b`) on macOS (Apple Silicon). The model is used in an agentic pipeline that analyzes ad-campaign metrics and produces human-readable summary reports.

**Machine used:** MacBook Air, Apple Silicon, 16 GB RAM, macOS

## Step 1 - Prepare the Environment

Check your Mac's chip architecture (`arm64` means Apple Silicon) and make sure Homebrew (the macOS package manager) is installed.

```
uname -m
brew --version
```

If Homebrew is not installed, you can install it with:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Step 2 - Install Ollama

Ollama is a tool that makes installing and running local LLMs easy. It downloads the model and exposes a local background service that other programs can connect to. Install it via Homebrew.

```
brew install ollama
```

Verify the installation:

```
ollama --version
```

> The output should show a client version, e.g. `ollama version is 0.30.10`.

## Step 3 - Start the Ollama Service

Start the background service that handles communication with the model.

```
brew services start ollama
```

Verify that the service is running. The command below should run without a "could not connect" warning (an empty list is expected before any model is downloaded).

```
ollama list
```

## Step 4 - Download and Test the First Model (Phi-3 Mini)

Phi-3 Mini was downloaded first. Being small (~2.2 GB), it is a fast, low-risk way to confirm the setup works.

```
ollama pull phi3:mini
```

Test the model with a sample prompt:

```
ollama run phi3:mini "An ad campaign's CTR is normally 2% but dropped to 0.2% today. Explain this anomaly in one clear sentence."
```

> **Observation:** Phi-3 Mini produced clean output in English but unreliable output in Turkish, because it is trained mostly on English data. Since reports may need to be in Turkish, a multilingual model was chosen in the next step.

## Step 5 - Download and Select the Final Model (qwen2.5:7b)

`qwen2.5:7b` is a multilingual model that performs well in both Turkish and English, and runs comfortably on 16 GB of RAM. This is the model used by the project.

```
ollama pull qwen2.5:7b
```

Test the model in both languages:

```
ollama run qwen2.5:7b "Bir reklam kampanyasının CTR'ı normalde %2 iken bugün %0.2'ye düştü. Bu durumu tek bir net cümleyle açıkla."
```

```
ollama run qwen2.5:7b "An ad campaign's CTR is normally 2% but dropped to 0.2% today. Explain this anomaly in one clear sentence."
```

> The model produced clear, usable output in both languages.

## Notes

- **Model selection:** Phi-3 Mini was eliminated for weak Turkish; Qwen2.5 0.5B was considered too small for reliable report writing; Qwen2.5 3B was a viable backup, but 7B was selected since 16 GB RAM supports it and it offers higher quality.
- **Design decision:** During testing, the model wrote fluently but was unreliable with numbers (it miscalculated percentage changes and sometimes altered given values). For this reason, anomaly detection and all calculations are handled in Python (deterministic), while the model is only responsible for turning the ready result into a human-readable report.

## Stack

Python, Ollama, LangGraph
