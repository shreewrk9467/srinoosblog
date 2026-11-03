'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Layers,
  Search,
  PenTool,
  Presentation,
  Video,
  ShieldCheck,
  Star,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  FolderGit2,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';

interface RepoTool {
  id: string;
  name: string;
  category: string;
  description: string;
  githubUrl: string;
  installCommand: string;
  usageNotes: string;
  icon: any;
  badge: string;
  starsCount?: string;
  howToUseInProject: string;
}

const REPOS: RepoTool[] = [
  {
    id: 'claude-mem',
    name: '1. claude-mem',
    category: 'Memory & State Persistence',
    description: 'Cross-session persistent memory for Claude and AI coding agents. Compresses session learnings into a local SQLite database and semantic vector store so your assistant remembers architectural decisions.',
    githubUrl: 'https://github.com/thedotmack/claude-mem',
    installCommand: 'npx claude-mem install',
    usageNotes: 'Runs silently in the background via lifecycle hooks (SessionStart, PostToolUse) to remember fixes and bug discoveries across chats.',
    icon: Brain,
    badge: '🧠 Context Memory',
    howToUseInProject: 'Keeps project history and conventions intact across repeated coding sessions so the assistant never suffers from amnesia.',
  },
  {
    id: 'gsd-core',
    name: '2. GSD Core (Get-Shit-Done)',
    category: 'Spec-Driven Development',
    description: 'Prevents context rot and quality degradation on large projects. Implements a 5-step phase loop (Discuss → Plan → Execute → Verify → Ship) using isolated fresh-context subagents.',
    githubUrl: 'https://github.com/open-gsd/gsd-core',
    installCommand: 'cd tools/gsd-core && npm install',
    usageNotes: 'Replaces messy multi-hour chat contexts with lightweight markdown roadmaps (.planning/) and atomic git commits.',
    icon: Layers,
    badge: '⚡ Defeats Context Rot',
    howToUseInProject: 'Maintains complex full-stack features without token bloat, architectural drift, or hallucinations.',
  },
  {
    id: 'agent-reach',
    name: '3. Agent-Reach',
    category: 'Multi-Platform Research',
    description: 'Universal command-line tool providing coding agents with real-time web research across Reddit, YouTube transcripts, X (Twitter), GitHub issues, and documentation without expensive API fees.',
    githubUrl: 'https://github.com/Panniantong/Agent-Reach',
    installCommand: 'cd tools/Agent-Reach && pip install -r requirements.txt',
    usageNotes: 'Uses native CLI scrapers and Jina Reader to gather community sentiment, trending discussions, and tech troubleshooting.',
    icon: Search,
    badge: '🌐 Zero-Fee Research',
    howToUseInProject: 'Researches viral topics on Reddit & YouTube to generate high-ranking blog articles and discover trending affiliate deals.',
  },
  {
    id: 'no-ai-slop',
    name: '4. no-ai-slop',
    category: 'Editorial Writing Standards',
    description: 'Purges predictable AI vocabulary, buzzwords (delve, tapestry, pivotal, landscape), rigid rule-of-three structures, and formulaic transitions to produce natural, human-sounding prose.',
    githubUrl: 'https://github.com/petergyang/no-ai-slop',
    installCommand: 'Integrated natively into Sricospace AI Assistant',
    usageNotes: 'Applied directly into your website AI Blog Generator (/api/ai-generate) to guarantee high search ranking and human reader trust.',
    icon: PenTool,
    badge: '✍️ Human-First Writing',
    howToUseInProject: 'Ensures articles pass Google helpful content guidelines and read authentically for visitors.',
  },
  {
    id: 'ppt-master',
    name: '5. PPT Master',
    category: 'Presentation Generation',
    description: 'Converts Markdown, blog posts, and research documents into real, natively editable PowerPoint (.pptx) presentation decks rather than flat screenshots.',
    githubUrl: 'https://github.com/hugohe3/ppt-master',
    installCommand: 'cd tools/ppt-master && npm install',
    usageNotes: 'Generates professional slide structures with editable vectors, typography styles, and corporate themes.',
    icon: Presentation,
    badge: '📊 Editable .pptx Decks',
    howToUseInProject: 'Repurposes top-performing blog articles into downloadable slide decks for digital product sales or sponsor presentations.',
  },
  {
    id: 'video-use',
    name: '6. video-use',
    category: 'Automated Video Production',
    description: 'AI-driven video editing and assembly using FFmpeg. Automatically removes filler words (um, uh), false starts, applies color grading, and styles captions to turn raw footage into final.mp4.',
    githubUrl: 'https://github.com/browser-use/video-use',
    installCommand: 'cd tools/video-use && pip install -r requirements.txt',
    usageNotes: 'Requires FFmpeg on system PATH and uses ElevenLabs Scribe for word-level transcript cutpoints.',
    icon: Video,
    badge: '🎬 Raw to Final.mp4',
    howToUseInProject: 'Automates video production for YouTube Reels, Instagram Shorts, and software tutorial walk-throughs.',
  },
  {
    id: 'skillspector',
    name: '7. SkillSpector by NVIDIA',
    category: 'AI Security & Vulnerability Scanner',
    description: 'Enterprise security scanner from NVIDIA designed to inspect open-source AI agent skills, MCP servers, and prompt scripts for prompt injections, data exfiltration, and supply-chain vulnerabilities.',
    githubUrl: 'https://github.com/NVIDIA/SkillSpector',
    installCommand: 'cd tools/SkillSpector && pip install -e .',
    usageNotes: 'Always scan third-party agent skills and repositories before integrating them into production environments.',
    icon: ShieldCheck,
    badge: '🛡️ NVIDIA Security Audit',
    howToUseInProject: 'Protects your codebase, database credentials, and server environment against rogue skills or malicious injections.',
  },
  {
    id: 'awesome-claude-code',
    name: '8. awesome-claude-code',
    category: 'Ecosystem Catalog',
    description: 'Curated index of high-utility agent skills, custom slash commands, lifecycle hooks, and productivity plugins maintained by the open-source community.',
    githubUrl: 'https://github.com/hesreallyhim/awesome-claude-code',
    installCommand: 'git clone https://github.com/hesreallyhim/awesome-claude-code.git',
    usageNotes: 'Explore emerging extensions, community skills, and workflow automations to continuously upgrade your developer toolkit.',
    icon: Star,
    badge: '⭐ Community Directory',
    howToUseInProject: 'Source new monetization plugins and workflow accelerators as the agent ecosystem evolves.',
  },
];

export default function AdminToolsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/20 border border-brand-400/30 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>Open Source AI Developer Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
            AI Tools, Agent Skills &amp; Maintenance Repositories
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            All 8 viral open-source repositories from the developer briefing—curated and organized to maintain Sricospace.com with memory persistence, context-rot prevention, web research, human-grade writing, and security auditing.
          </p>
        </div>
      </div>

      {/* Quick Setup Notice */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs text-slate-700">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 text-sm">Local Workspace Installation Status</h4>
          <p className="leading-relaxed">
            All repositories have been cloned locally into your workspace&apos;s isolated <code className="bg-blue-100/80 px-1.5 py-0.5 rounded font-mono text-[11px]">tools/</code> directory (git-ignored to protect your production Vercel bundle). You can execute their CLI commands from your terminal or trigger their features directly below.
          </p>
        </div>
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REPOS.map((tool) => {
          const Icon = tool.icon;
          const isCopied = copiedId === tool.id;

          return (
            <div
              key={tool.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:bg-brand-600 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">{tool.name}</h3>
                      <span className="text-xs font-semibold text-slate-500">{tool.category}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full whitespace-nowrap">
                    {tool.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">{tool.description}</p>

                {/* Role in Sricospace */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <strong className="text-slate-900 block font-bold">🎯 Role in Maintaining Sricospace:</strong>
                  <p>{tool.howToUseInProject}</p>
                </div>

                {/* Install / Run Command Box */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Execution / Install Command:
                  </span>
                  <div className="bg-slate-900 text-slate-200 p-2.5 rounded-xl font-mono text-[11px] flex items-center justify-between gap-2 border border-slate-800">
                    <span className="truncate">{tool.installCommand}</span>
                    <button
                      onClick={() => handleCopy(tool.id, tool.installCommand)}
                      className="p-1 text-slate-400 hover:text-white transition flex-shrink-0"
                      title="Copy command"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-brand-600 transition"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                {tool.id === 'no-ai-slop' ? (
                  <Link
                    href="/admin/blogs/new"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-xs transition"
                  >
                    Active in AI Assistant
                  </Link>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">Cloned in tools/</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

