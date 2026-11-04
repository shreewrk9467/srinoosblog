#!/usr/bin/env python3
"""
==============================================================================
SRICOSPACE AI AGENT (Python Companion Engine)
Made by Srinoos — https://www.sricospace.com/
==============================================================================
"""

import os
import sys
import json
import argparse
from pathlib import Path

# Load environment
def load_env():
    env_paths = [Path('.env.local'), Path('.env')]
    for env_path in env_paths:
        if env_path.exists():
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, v = line.split('=', 1)
                        if k.strip() not in os.environ:
                            os.environ[k.strip()] = v.strip().strip("'\"")

load_env()

BANNED_WORDS = [
    'delve', 'foster', 'leverage', 'utilize', 'facilitate', 'empower',
    'streamline', 'robust', 'cutting-edge', 'paradigm shift', 'game changer',
    'tapestry', 'realm', 'beacon', 'multifaceted', 'meticulous', 'intricate',
    'paramount', 'transformative', 'elevate', 'embark', 'supercharge', 'harness'
]

def sanitize_text(text: str) -> str:
    cleaned = text
    for word in BANNED_WORDS:
        cleaned = cleaned.replace(word, f"[humanized]")
    return cleaned

def write_article(topic: str, category: str):
    print(f"\n🚀 [PYTHON AGENT] Generating humanized article on: {topic}...")
    slug = topic.lower().replace(' ', '-').replace('/', '-')
    out_dir = Path('agent/output')
    out_dir.mkdir(parents=True, exist_ok=True)
    
    out_file = out_dir / f"{slug}.md"
    content = f"""# {topic}: Practical Implementation Guide & Strategy (2026)

Mastering {topic} requires verifiable benchmarks rather than generic abstractions. This guide outlines actionable steps and architectural principles for digital builders.

## Key Performance Indicators
- **Latency Target:** Sub-100ms response time.
- **Conversion Optimization:** Clear affiliate value propositions.
- **Full Compliance:** Disclosed partner relationships.

*Made by Srinoos — Sricospace Technical Research*
"""
    out_file.write_text(content, encoding='utf-8')
    print(f"✅ Generated article saved to: {out_file}")

def create_ad(product: str, platform: str):
    print(f"\n🎬 [PYTHON AGENT] Generating ad creative for: {product} ({platform})...")
    out_dir = Path('agent/output')
    out_dir.mkdir(parents=True, exist_ok=True)
    safe_name = product.lower().replace(' ', '-')
    out_file = out_dir / f"{safe_name}-ad-asset.md"
    
    content = f"""# Ad Asset Production Sheet: {product}
Platform: {platform}
Prompt: Ultra-crisp 8k commercial photography of a high-tech workstation with neon accents, 1:1 square aspect ratio.
Video Script: 30s vertical TikTok/Shorts script with 3s pattern interrupt, 15s proof, and direct call-to-action to sricospace.com.
"""
    out_file.write_text(content, encoding='utf-8')
    print(f"✅ Ad production sheet saved to: {out_file}")

def post_campaign(offer: str, model: str, payout: str):
    print(f"\n💼 [PYTHON AGENT] Formatting campaign: {offer} ({model})...")
    out_dir = Path('agent/output')
    out_dir.mkdir(parents=True, exist_ok=True)
    slug = offer.lower().replace(' ', '-')
    out_file = out_dir / f"{slug}-campaign.json"
    
    campaign = {
        "title": offer,
        "commission_model": model,
        "payout": payout,
        "redirect_url": f"https://www.sricospace.com/go/{slug}",
        "compliance": "FTC & ASCI Verified",
        "author": "Srinoos"
    }
    out_file.write_text(json.dumps(campaign, indent=2), encoding='utf-8')
    print(f"✅ Campaign JSON saved to: {out_file}")

def main():
    parser = argparse.ArgumentParser(description="Sricospace Open-Source AI Agent")
    subparsers = parser.add_subparsers(dest="command", help="Agent command to execute")
    
    p_write = subparsers.add_parser("write", help="Generate humanized article")
    p_write.add_argument("--topic", default="Modern Cloud Architecture", help="Article topic")
    p_write.add_argument("--category", default="Technology", help="Category")
    
    p_ad = subparsers.add_parser("ad", help="Create image & video ad creative")
    p_ad.add_argument("--product", default="Cloud Hosting", help="Product name")
    p_ad.add_argument("--platform", default="instagram", help="Platform")
    
    p_camp = subparsers.add_parser("campaign", help="Format affiliate campaign")
    p_camp.add_argument("--offer", default="Hostinger Cloud", help="Offer title")
    p_camp.add_argument("--model", default="CPS", help="CPA, CPL, CPS, or CPI")
    p_camp.add_argument("--payout", default="75%", help="Payout")
    
    args = parser.parse_args()
    if args.command == "write":
        write_article(args.topic, args.category)
    elif args.command == "ad":
        create_ad(args.product, args.platform)
    elif args.command == "campaign":
        post_campaign(args.offer, args.model, args.payout)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()

