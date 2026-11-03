# 🤖 Sricospace Open-Source AI Agent Framework
**Brand:** [Sricospace.com](https://www.sricospace.com/) | **Attribution:** Made by Srinoos
**Version:** 2.0.0-PROD

An enterprise-grade, open-source AI agent system integrated into the Sricospace platform to automate:
1. **Humanized, Anti-Plagiarism Blog & Article Writing** (with `no-ai-slop` compliance).
2. **Text-to-Image & Video Ad Creative Generation** (DALL-E 3, Flux, TikTok/Reels 30s storyboards).
3. **Automated Marketing & Affiliate Campaign Publishing** (CPA, CPL, CPS, CPI, FTC compliant).

---

## 📁 Project Structure

```text
srinoosblog/
├── .env.example                     # Environment template for AI tokens & DB
├── .env                             # Local secure keys (git-ignored)
├── agent/
│   ├── README.md                    # This documentation file
│   ├── srinoos-agent.js             # High-performance Node.js Agent Runner
│   ├── srinoos-agent.py             # Python Companion Runner
│   ├── requirements.txt             # Python dependencies
│   ├── instructions/
│   │   ├── system-rules.md          # Master agent system prompt & constraints
│   │   ├── content-writer.md        # Anti-plagiarism & no-ai-slop writing rules
│   │   ├── ad-creator.md            # Image & vertical video ad script pipeline
│   │   └── campaign-manager.md      # Marketing campaign auto-formatter & publisher
│   └── output/                      # Generated articles, ad specs, and JSONs
└── tools/                           # Cloned open-source repos (claude-mem, gsd, video-use, etc.)
```

---

## 🛠️ Step 1: Install Dependencies

### Option A: Node.js (Built-in, Zero external install required)
The Node.js agent runner is natively compatible with Node 22+ using standard libraries:
```bash
# Verify it runs
npm run agent
# or
node agent/srinoos-agent.js
```

### Option B: Python Companion Runner
If you plan to use Python tools (like `Agent-Reach` or `video-use`):
```bash
pip install -r agent/requirements.txt
```

---

## 🔐 Step 2: Configure Environment Variables

1. Your `.env` file is generated in the root directory.
2. Edit `.env` to supply your private API keys:
```bash
# Primary LLMs
OPENAI_API_KEY=sk-proj-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GEMINI_API_KEY=your-gemini-key-here

# Media Generation
REPLICATE_API_TOKEN=your_token_here
ELEVENLABS_API_KEY=your_key_here
```

---

## ⚡ Step 3: Run Agent Commands

### 1. Generate Humanized, Anti-Plagiarism Content
```bash
npm run agent:write -- --topic "Next.js 14 Server Actions Architecture" --category "Technology & AI"
```
*Outputs clean, human-sounding Markdown with comparison tables, zero AI buzzwords, and JSON-LD FAQ schema to `agent/output/`.*

### 2. Generate Image & Video Ad Creative Assets
```bash
npm run agent:ad -- --product "Hostinger Cloud 75% Off" --platform "instagram_reels"
```
*Generates an 8k DALL-E 3 / Flux image prompt, plus a second-by-second 30s viral vertical video script with visual cutpoints, audio hooks, and call-to-action overlays.*

### 3. Auto-Format & Deploy Affiliate Campaigns
```bash
npm run agent:campaign -- --offer "Hostinger Cloud Hosting" --model "CPS" --payout "75% Commission" --network "Impact"
```
*Creates an FTC-compliant offer payload with automated tracking redirect URL (`https://www.sricospace.com/go/...`) and schema ready for deployment.*
