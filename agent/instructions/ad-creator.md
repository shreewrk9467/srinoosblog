# AD ASSET CREATOR INSTRUCTION HOOK: IMAGE & VIDEO PRODUCTION PIPELINE

## 1. Image Creative Asset Generation
When commanded to generate an image ad asset, output:
- **Aspect Ratio:**
  - 16:9 (1200x628) for Google Display Ads, Facebook Feed, Twitter Header.
  - 1:1 (1080x1080) for Instagram Feed, LinkedIn Feed.
  - 9:16 (1080x1920) for Instagram Stories, TikTok Ads, YouTube Shorts.
- **Midjourney / DALL-E 3 / Flux.1 Prompt Specification:**
  - Subject, environment, camera perspective, lighting, color grading (e.g., modern tech dark mode, neon cyan accents, cinematic rim lighting, 8k resolution, photorealistic).
- **Ad Copy Overlay Specification:**
  - Primary headline (max 5 words, high contrast).
  - Value proposition badge (e.g., "75% OFF + Free Domain").
  - Primary Call-to-Action button text ("Claim Deal", "Get Started Free").

## 2. Video Ad Asset Script & Storyboard Pipeline
When commanded to generate a video ad asset, produce a complete production sheet:
- **Duration:** 15s, 30s, or 45s vertical format (9:16).
- **Scene-by-Scene Breakdown:**
  | Second | Visual on Screen (B-Roll / Motion) | Spoken Audio / Voiceover (Word-for-Word) | On-Screen Text & Captions | Audio / SFX |
  | :--- | :--- | :--- | :--- | :--- |
  | 00:00 - 00:03 | Fast screen recording of slow website vs fast instant load | "Still paying \$40 a month for slow, bloated web hosting?" | "Stop Overpaying for Slow Hosting ❌" | Whoosh SFX |
  | 00:03 - 00:15 | Split screen comparison: Sricospace benchmark data | "We stress-tested the top 5 hosting providers under 10,000 visitors. Here is what actually happened." | "10k Visitors Live Test ⚡" | Upbeat tech synth |
  | 00:15 - 00:30 | Close up of cloud dashboard, free SSL, 1-click installer | "Hostinger delivered 99.98% uptime at 75% less cost. Plus you get a free domain and automated daily backups." | "99.98% Uptime • 75% Off" | Cash register ding |
  | 00:30 - 00:45 | Hand holding smartphone clicking the link at sricospace.com/go/hostinger-promo | "Tap the link below to lock in the 75% discount before this month's promo closes." | "Link in Bio 👉 sricospace.com/go/hostinger-promo" | Riser & CTA chime |

- **ElevenLabs Voiceover Prompt:** Recommended tone (e.g., Adam / Rachel - confident, fast-paced, authoritative American English, stability 0.50, similarity 0.75).
- **FFmpeg Automated Video Stitching Command:** (Integrates with `tools/video-use`).
