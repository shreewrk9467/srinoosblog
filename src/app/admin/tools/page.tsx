'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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
  X,
  Filter,
  Play,
  Sliders,
  Wand2,
  FileCode,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  Command,
  BookOpen,
} from 'lucide-react';

interface QuickCommand {
  label: string;
  cmd: string;
  description: string;
}

interface RepoTool {
  id: string;
  name: string;
  category: string;
  categoryKey: string;
  description: string;
  githubUrl: string;
  installCommand: string;
  usageNotes: string;
  icon: any;
  badge: string;
  statusBadge: string;
  statusColor: 'emerald' | 'blue' | 'purple' | 'amber';
  howToUseInProject: string;
  tags: string[];
  quickCommands: QuickCommand[];
  interactiveType:
    | 'claude-mem'
    | 'gsd-core'
    | 'agent-reach'
    | 'no-ai-slop'
    | 'ppt-master'
    | 'video-use'
    | 'skillspector'
    | 'awesome-claude-code';
}

const CATEGORIES = [
  { key: 'all', label: 'All Tools' },
  { key: 'memory', label: '🧠 Memory & State' },
  { key: 'spec', label: '⚡ Spec & Anti-Rot' },
  { key: 'research', label: '🌐 Web & Social Research' },
  { key: 'writing', label: '✍️ Anti-Slop Writing' },
  { key: 'presentation', label: '📊 PPT & Slides' },
  { key: 'video', label: '🎬 Video AI Automation' },
  { key: 'security', label: '🛡️ Security & Auditing' },
  { key: 'directory', label: '⭐ Ecosystem Catalog' },
];

const QUICK_GOALS = [
  { label: '🔍 Research Reddit & YouTube', query: 'reddit' },
  { label: '✍️ Clean AI Buzzwords', query: 'slop' },
  { label: '🧠 Query Past Memories', query: 'memory' },
  { label: '🛡️ NVIDIA Security Audit', query: 'security' },
  { label: '📊 Convert Post to Slides', query: 'ppt' },
  { label: '🎬 Edit Video & Cut Umms', query: 'video' },
  { label: '🗺️ Plan Multi-Phase Feature', query: 'spec' },
];

const REPOS: RepoTool[] = [
  {
    id: 'claude-mem',
    name: '1. claude-mem',
    category: 'Memory & State Persistence',
    categoryKey: 'memory',
    description:
      'Cross-session persistent memory for AI coding agents. Compresses session learnings into a local SQLite database and semantic vector store so your assistant remembers architectural decisions and past bug fixes.',
    githubUrl: 'https://github.com/thedotmack/claude-mem',
    installCommand: 'npx claude-mem install',
    usageNotes:
      'Runs silently in the background via lifecycle hooks (SessionStart, PostToolUse) to remember fixes and bug discoveries across chats.',
    icon: Brain,
    badge: '🧠 Context Memory',
    statusBadge: 'Active & Hooked',
    statusColor: 'emerald',
    howToUseInProject:
      'Keeps project history and conventions intact across repeated coding sessions so the assistant never suffers from amnesia.',
    tags: ['memory', 'sqlite', 'vector-store', 'session-persistence', 'anti-amnesia', 'context-cache'],
    interactiveType: 'claude-mem',
    quickCommands: [
      {
        label: 'Search Memories',
        cmd: 'npx claude-mem query "Supabase website_settings schema"',
        description: 'Semantic vector search through all recorded memories from past conversations.',
      },
      {
        label: 'Check Memory Status',
        cmd: 'npx claude-mem status',
        description: 'Verify active hooks, SQLite database size, and indexed session count.',
      },
      {
        label: 'Sync Memory Store',
        cmd: 'npx claude-mem sync',
        description: 'Forces indexing of newly completed conversation transcripts and decisions.',
      },
    ],
  },
  {
    id: 'gsd-core',
    name: '2. GSD Core (Get-Shit-Done)',
    category: 'Spec-Driven Development',
    categoryKey: 'spec',
    description:
      'Prevents context rot and quality degradation on large projects. Implements a 5-step phase loop (Discuss → Plan → Execute → Verify → Ship) using isolated fresh-context subagents.',
    githubUrl: 'https://github.com/open-gsd/gsd-core',
    installCommand: 'cd tools/gsd-core && npm install',
    usageNotes:
      'Replaces messy multi-hour chat contexts with lightweight markdown roadmaps (.planning/) and atomic git commits.',
    icon: Layers,
    badge: '⚡ Defeats Context Rot',
    statusBadge: 'Skills Installed in .gemini/skills',
    statusColor: 'emerald',
    howToUseInProject:
      'Maintains complex full-stack features without token bloat, architectural drift, or hallucinations.',
    tags: ['spec-driven', 'anti-rot', 'subagents', 'planning', 'atomic-commits', 'roadmap', 'code-review'],
    interactiveType: 'gsd-core',
    quickCommands: [
      {
        label: 'Plan New Phase',
        cmd: 'npx gsd plan --phase "Integrate Affiliate Auto-Sync"',
        description: 'Generates a lightweight specification roadmap in .planning/ before writing code.',
      },
      {
        label: 'Map Codebase Architecture',
        cmd: 'npx gsd map',
        description: 'Analyzes dependencies, routes, and exports into an agent-digestible structure.',
      },
      {
        label: 'Verify Completed Work',
        cmd: 'npx gsd verify',
        description: 'Runs automated linter, builds, and type checks to confirm deliverables.',
      },
    ],
  },
  {
    id: 'agent-reach',
    name: '3. Agent-Reach',
    category: 'Multi-Platform Research',
    categoryKey: 'research',
    description:
      'Universal command-line tool providing coding agents with real-time web research across Reddit, YouTube transcripts, X (Twitter), GitHub issues, and documentation without expensive API fees.',
    githubUrl: 'https://github.com/Panniantong/Agent-Reach',
    installCommand: 'cd tools/Agent-Reach && pip install -r requirements.txt',
    usageNotes:
      'Uses native CLI scrapers and Jina Reader to gather community sentiment, trending discussions, and tech troubleshooting.',
    icon: Search,
    badge: '🌐 Zero-Fee Research',
    statusBadge: 'Executable at ~/.local/bin/agent-reach',
    statusColor: 'emerald',
    howToUseInProject:
      'Researches viral topics on Reddit & YouTube to generate high-ranking blog articles and discover trending affiliate deals.',
    tags: ['reddit', 'youtube', 'scraping', 'research', 'sentiment', 'trends', 'affiliate-research'],
    interactiveType: 'agent-reach',
    quickCommands: [
      {
        label: 'Search Reddit Sentiment',
        cmd: 'agent-reach reddit search "best web hosting 2026 reddit" --limit 10',
        description: 'Extracts real user reviews and complaints to inform affiliate blog recommendations.',
      },
      {
        label: 'Extract YouTube Transcript',
        cmd: 'agent-reach transcript "https://www.youtube.com/watch?v=..." --clean',
        description: 'Converts long-form video tutorials into clean Markdown summaries with timestamps.',
      },
      {
        label: 'Fetch Documentation via Jina Reader',
        cmd: 'agent-reach fetch "https://docs.hostinger.com/api" --format markdown',
        description: 'Cleans web pages into high-density Markdown free of popups and ads.',
      },
    ],
  },
  {
    id: 'no-ai-slop',
    name: '4. no-ai-slop',
    category: 'Editorial Writing Standards',
    categoryKey: 'writing',
    description:
      'Purges predictable AI vocabulary, buzzwords (delve, tapestry, pivotal, landscape), rigid rule-of-three structures, and formulaic transitions to produce natural, human-sounding prose.',
    githubUrl: 'https://github.com/petergyang/no-ai-slop',
    installCommand: 'Integrated natively into Sricospace AI Assistant',
    usageNotes:
      'Applied directly into your website AI Blog Generator (/api/ai-generate) to guarantee high search ranking and human reader trust.',
    icon: PenTool,
    badge: '✍️ Human-First Writing',
    statusBadge: 'Native Integration in /api/ai-generate',
    statusColor: 'emerald',
    howToUseInProject:
      'Ensures articles pass Google helpful content guidelines and read authentically for visitors.',
    tags: ['anti-slop', 'seo', 'human-writing', 'vocabulary-filter', 'content-quality', 'blog-generator'],
    interactiveType: 'no-ai-slop',
    quickCommands: [
      {
        label: 'Active in AI Blog Assistant',
        cmd: 'GET /admin/blogs/new',
        description: 'Automatically scans and strips 28+ AI buzzword patterns on every generated article.',
      },
      {
        label: 'Inspect Filter Dictionary',
        cmd: 'cat src/app/api/ai-generate/route.ts | grep SLOP_REPLACEMENTS -A 35',
        description: 'View the active regex dictionary used to humanize generated articles.',
      },
    ],
  },
  {
    id: 'ppt-master',
    name: '5. PPT Master',
    category: 'Presentation Generation',
    categoryKey: 'presentation',
    description:
      'Converts Markdown, blog posts, and research documents into real, natively editable PowerPoint (.pptx) presentation decks rather than flat screenshots.',
    githubUrl: 'https://github.com/hugohe3/ppt-master',
    installCommand: 'cd tools/ppt-master && npm install',
    usageNotes:
      'Generates professional slide structures with editable vectors, typography styles, and corporate themes.',
    icon: Presentation,
    badge: '📊 Editable .pptx Decks',
    statusBadge: 'Installed in tools/ppt-master',
    statusColor: 'blue',
    howToUseInProject:
      'Repurposes top-performing blog articles into downloadable slide decks for digital product sales or sponsor presentations.',
    tags: ['powerpoint', 'pptx', 'slide-decks', 'markdown-to-slides', 'presentations', 'monetization'],
    interactiveType: 'ppt-master',
    quickCommands: [
      {
        label: 'Generate Deck from Markdown',
        cmd: 'node tools/ppt-master/index.js --input article.md --theme modern-dark --output presentation.pptx',
        description: 'Parses headings and bullet points into styled PowerPoint slides with vector layout.',
      },
      {
        label: 'Preview Slide Templates',
        cmd: 'node tools/ppt-master/index.js --list-themes',
        description: 'Lists all pre-configured typography, palette, and layout templates.',
      },
    ],
  },
  {
    id: 'video-use',
    name: '6. video-use',
    category: 'Automated Video Production',
    categoryKey: 'video',
    description:
      'AI-driven video editing and assembly using FFmpeg. Automatically removes filler words (um, uh), false starts, applies color grading, and styles captions to turn raw footage into final.mp4.',
    githubUrl: 'https://github.com/browser-use/video-use',
    installCommand: 'cd tools/video-use && pip install -r requirements.txt',
    usageNotes:
      'Requires FFmpeg on system PATH and uses ElevenLabs Scribe for word-level transcript cutpoints.',
    icon: Video,
    badge: '🎬 Raw to Final.mp4',
    statusBadge: 'Installed in tools/video-use',
    statusColor: 'blue',
    howToUseInProject:
      'Automates video production for YouTube Reels, Instagram Shorts, and software tutorial walk-throughs.',
    tags: ['video', 'ffmpeg', 'filler-removal', 'subtitles', 'social-media', 'reels', 'shorts'],
    interactiveType: 'video-use',
    quickCommands: [
      {
        label: 'Remove Filler Words & Cut Speech',
        cmd: 'python3 tools/video-use/main.py --input raw_clip.mp4 --cut-fillers --output clean_clip.mp4',
        description: 'Cuts out hesitation pauses, "umms", and "uhhs" using word-level timestamp analysis.',
      },
      {
        label: 'Generate Animated Subtitles',
        cmd: 'python3 tools/video-use/main.py --input raw_clip.mp4 --burn-subtitles --style bold-yellow',
        description: 'Generates viral TikTok/Reels style karaoke-highlighted captions.',
      },
    ],
  },
  {
    id: 'skillspector',
    name: '7. SkillSpector by NVIDIA',
    category: 'AI Security & Vulnerability Scanner',
    categoryKey: 'security',
    description:
      'Enterprise security scanner from NVIDIA designed to inspect open-source AI agent skills, MCP servers, and prompt scripts for prompt injections, data exfiltration, and supply-chain vulnerabilities.',
    githubUrl: 'https://github.com/NVIDIA/SkillSpector',
    installCommand: 'cd tools/SkillSpector && pip install -e .',
    usageNotes:
      'Always scan third-party agent skills and repositories before integrating them into production environments.',
    icon: ShieldCheck,
    badge: '🛡️ NVIDIA Security Audit',
    statusBadge: 'Installed in tools/SkillSpector',
    statusColor: 'purple',
    howToUseInProject:
      'Protects your codebase, database credentials, and server environment against rogue skills or malicious injections.',
    tags: ['security', 'nvidia', 'audit', 'prompt-injection', 'vulnerability-scanner', 'supply-chain', 'mcp-audit'],
    interactiveType: 'skillspector',
    quickCommands: [
      {
        label: 'Audit Project Agent Skills',
        cmd: 'skillspector scan --path .gemini/skills/ --severity high',
        description: 'Scans all local agent skills for unsafe bash executions, credential leaks, and injection vectors.',
      },
      {
        label: 'Audit MCP Servers & Config',
        cmd: 'skillspector scan --config ~/.gemini/config/hooks.json',
        description: 'Validates lifecycle hooks and MCP endpoints against dangerous system commands.',
      },
    ],
  },
  {
    id: 'awesome-claude-code',
    name: '8. awesome-claude-code',
    category: 'Ecosystem Catalog',
    categoryKey: 'directory',
    description:
      'Curated index of high-utility agent skills, custom slash commands, lifecycle hooks, and productivity plugins maintained by the open-source community.',
    githubUrl: 'https://github.com/hesreallyhim/awesome-claude-code',
    installCommand: 'git clone https://github.com/hesreallyhim/awesome-claude-code.git tools/awesome-claude-code',
    usageNotes:
      'Explore emerging extensions, community skills, and workflow automations to continuously upgrade your developer toolkit.',
    icon: Star,
    badge: '⭐ Community Directory',
    statusBadge: 'Cloned in tools/awesome-claude-code',
    statusColor: 'amber',
    howToUseInProject:
      'Source new monetization plugins and workflow accelerators as the agent ecosystem evolves.',
    tags: ['catalog', 'skills-directory', 'awesome-list', 'agent-extensions', 'community-plugins'],
    interactiveType: 'awesome-claude-code',
    quickCommands: [
      {
        label: 'Browse Cloned Directory',
        cmd: 'cat tools/awesome-claude-code/README.md | grep -E "^### " | head -n 25',
        description: 'Quickly preview top community-curated categories and skills available for install.',
      },
      {
        label: 'Update Ecosystem Catalog',
        cmd: 'cd tools/awesome-claude-code && git pull origin main',
        description: 'Pulls the latest viral agent skills and extensions published this week.',
      },
    ],
  },
];

// Sample AI slop text for interactive tester
const SAMPLE_SLOP_TEXT =
  "In today's fast-paced digital world, we must delve into the multifaceted tapestry of cutting-edge AI solutions. It is paramount that forward-thinking enterprises leverage robust, transformative paradigms to empower creators and supercharge operational efficiency. Embarking on this journey marks a significant game changer that will elevate your brand beyond the ever-evolving landscape.";

export default function AdminToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModalTool, setActiveModalTool] = useState<RepoTool | null>(null);

  // Interactive playground states
  const [agentReachTopic, setAgentReachTopic] = useState('Best tech deals & affiliate products 2026');
  const [agentReachPlatform, setAgentReachPlatform] = useState('reddit');
  const [agentReachLimit, setAgentReachLimit] = useState('10');

  const [claudeMemQuery, setClaudeMemQuery] = useState('Supabase website_settings schema & visual builder persistence');

  const [slopInput, setSlopInput] = useState(SAMPLE_SLOP_TEXT);
  const [slopCleaned, setSlopCleaned] = useState('');
  const [slopDetectedCount, setSlopDetectedCount] = useState<number | null>(null);

  const [pptTopic, setPptTopic] = useState('Top 10 AI Tools for Developers in 2026.md');
  const [pptTheme, setPptTheme] = useState('modern-dark');

  const [videoInputPath, setVideoInputPath] = useState('raw_tutorial.mp4');
  const [videoCutFillers, setVideoCutFillers] = useState(true);
  const [videoSubtitles, setVideoSubtitles] = useState(true);

  const [skillSpectorPath, setSkillSpectorPath] = useState('.gemini/skills/');
  const [skillSpectorSeverity, setSkillSpectorSeverity] = useState('high');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to focus search input: '/' or 'Cmd+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (activeModalTool) {
          setActiveModalTool(null);
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalTool, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run instant Anti-Slop Cleaner in-browser
  const runSlopCleaner = (textToClean: string) => {
    const SLOP_RULES: Array<{ regex: RegExp; replacement: string }> = [
      { regex: /\b(delve into|delve)\b/gi, replacement: 'explore' },
      { regex: /\bleverage\b/gi, replacement: 'use' },
      { regex: /\butilize\b/gi, replacement: 'use' },
      { regex: /\bfacilitate\b/gi, replacement: 'enable' },
      { regex: /\bempower\b/gi, replacement: 'allow' },
      { regex: /\bstreamline\b/gi, replacement: 'simplify' },
      { regex: /\brobust\b/gi, replacement: 'reliable' },
      { regex: /\bcutting-edge\b/gi, replacement: 'modern' },
      { regex: /\bparadigm shift\b/gi, replacement: 'fundamental change' },
      { regex: /\bparadigm\b/gi, replacement: 'model' },
      { regex: /\bgame changer\b/gi, replacement: 'significant step' },
      { regex: /\btapestry\b/gi, replacement: 'network' },
      { regex: /\brealm\b/gi, replacement: 'field' },
      { regex: /\bmultifaceted\b/gi, replacement: 'varied' },
      { regex: /\bparamount\b/gi, replacement: 'critical' },
      { regex: /\btransformative\b/gi, replacement: 'practical' },
      { regex: /\belevate\b/gi, replacement: 'improve' },
      { regex: /\bembark on\b/gi, replacement: 'start' },
      { regex: /\bsupercharge\b/gi, replacement: 'speed up' },
      { regex: /\bharness\b/gi, replacement: 'apply' },
      { regex: /\bever-evolving\b/gi, replacement: 'changing' },
      { regex: /\bin today's fast-paced digital world\b/gi, replacement: 'today' },
      { regex: /\bin today's fast-paced world\b/gi, replacement: 'today' },
      { regex: /\bin today's world\b/gi, replacement: 'currently' },
    ];

    let sanitized = textToClean;
    let count = 0;
    for (const rule of SLOP_RULES) {
      const matches = sanitized.match(rule.regex);
      if (matches) {
        count += matches.length;
        sanitized = sanitized.replace(rule.regex, rule.replacement);
      }
    }
    setSlopCleaned(sanitized);
    setSlopDetectedCount(count);
  };

  // Filter tools based on query and category
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return REPOS.filter((tool) => {
      // Category check
      if (selectedCategory !== 'all' && tool.categoryKey !== selectedCategory) {
        return false;
      }

      // Query check
      if (!q) return true;

      const inName = tool.name.toLowerCase().includes(q);
      const inCategory = tool.category.toLowerCase().includes(q);
      const inDescription = tool.description.toLowerCase().includes(q);
      const inHowTo = tool.howToUseInProject.toLowerCase().includes(q);
      const inInstall = tool.installCommand.toLowerCase().includes(q);
      const inTags = tool.tags.some((tag) => tag.toLowerCase().includes(q));
      const inCommands = tool.quickCommands.some(
        (qc) => qc.label.toLowerCase().includes(q) || qc.cmd.toLowerCase().includes(q) || qc.description.toLowerCase().includes(q)
      );

      return inName || inCategory || inDescription || inHowTo || inInstall || inTags || inCommands;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/20 border border-brand-400/30 text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-brand-400" />
            <span>AI Developer Ecosystem &amp; Command Suite</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-display">
            AI Tools Search, Launcher &amp; Maintenance Suite
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Search, filter, test, and launch all 8 integrated open-source AI tools. Powering Sricospace with persistent memory,
            spec-driven planning, zero-fee web research, humanized writing, slide decks, video editing, and NVIDIA security audits.
          </p>
        </div>
      </div>

      {/* Main Search Bar & Quick Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI developer tools by name, tag, category, command, or use-case (e.g., reddit, memory, security)..."
            className="w-full pl-12 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white transition"
          />

          <div className="absolute right-3 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-200/80 text-slate-600 rounded-md text-[11px] font-mono font-medium">
              <Command className="w-3 h-3" /> /
            </div>
          </div>
        </div>

        {/* Quick Goal Selector Tags */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-bold flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Tasks:
          </span>
          {QUICK_GOALS.map((goal) => (
            <button
              key={goal.label}
              onClick={() => {
                setSearchQuery(goal.query);
                setSelectedCategory('all');
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                searchQuery.toLowerCase() === goal.query
                  ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {goal.label}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-xs text-brand-600 hover:text-brand-800 font-bold ml-1 underline"
            >
              Reset
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-slate-100">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {CATEGORIES.map((cat) => {
            const count =
              cat.key === 'all'
                ? REPOS.length
                : REPOS.filter((t) => t.categoryKey === cat.key).length;
            const isSelected = selectedCategory === cat.key;

            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-slate-800 text-brand-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            Showing <strong className="text-slate-900 font-bold">{filteredTools.length}</strong> of{' '}
            <strong className="text-slate-900 font-bold">{REPOS.length}</strong> AI developer tools
            {searchQuery && (
              <span>
                {' '}
                matching &quot;<span className="text-brand-600 font-bold">{searchQuery}</span>&quot;
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All 8 Tools Configured &amp; Ready
          </span>
        </div>
      </div>

      {/* No Results Empty State */}
      {filteredTools.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No AI Developer Tools Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No tools matched your search query &quot;{searchQuery}&quot; in category &quot;{selectedCategory}&quot;. Try adjusting your keywords or clearing the filter.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-500 transition"
          >
            Clear Search &amp; Show All Tools
          </button>
        </div>
      )}

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          const isCopied = copiedId === tool.id;

          return (
            <div
              key={tool.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group space-y-4 relative"
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:bg-brand-600 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                        {tool.name}
                      </h3>
                      <span className="text-xs font-semibold text-slate-500">{tool.category}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full whitespace-nowrap">
                    {tool.badge}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {tool.statusBadge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">{tool.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/70 rounded-md text-[10px] font-mono transition"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                {/* Role in Sricospace */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <strong className="text-slate-900 block font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Role in Maintaining Sricospace:
                  </strong>
                  <p>{tool.howToUseInProject}</p>
                </div>

                {/* Primary Install / Execution Command Box */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Execution Command:
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

                {/* Quick Commands Snippets Accordion / Mini List */}
                {tool.quickCommands && tool.quickCommands.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Ready-to-Run Snippets:
                    </span>
                    <div className="space-y-1.5">
                      {tool.quickCommands.map((qc, idx) => {
                        const qcId = `${tool.id}-qc-${idx}`;
                        const isQcCopied = copiedId === qcId;

                        return (
                          <div
                            key={qc.label}
                            className="bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-lg p-2 flex items-center justify-between gap-2 text-[11px] transition"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-slate-800 block truncate">{qc.label}</span>
                              <span className="font-mono text-[10px] text-slate-500 block truncate">{qc.cmd}</span>
                            </div>
                            <button
                              onClick={() => handleCopy(qcId, qc.cmd)}
                              className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded font-semibold text-[10px] flex items-center gap-1 flex-shrink-0 transition"
                              title="Copy snippet"
                            >
                              {isQcCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-600">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-slate-700 hover:text-brand-600 transition"
                >
                  <FolderGit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">GitHub Repository</span>
                  <span className="sm:hidden">GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <div className="flex items-center gap-2">
                  {tool.id === 'no-ai-slop' && (
                    <Link
                      href="/admin/blogs/new"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow-xs transition"
                    >
                      AI Blog Writer
                    </Link>
                  )}

                  <button
                    onClick={() => setActiveModalTool(tool)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-brand-600 text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5 text-brand-300" />
                    <span>Use &amp; Test Tool</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Tool Launcher Modal */}
      {activeModalTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30 text-brand-400 flex items-center justify-center">
                  <activeModalTool.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">{activeModalTool.name}</h3>
                  <p className="text-xs text-slate-400">{activeModalTool.category}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalTool(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Interactive Playgrounds */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Agent-Reach Interactive Research Generator */}
              {activeModalTool.interactiveType === 'agent-reach' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">Interactive Research Query Generator</h4>
                    <p className="text-xs text-slate-500">
                      Configure your real-time research query across Reddit, YouTube, X, or documentation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Search Topic / Keywords</label>
                      <input
                        type="text"
                        value={agentReachTopic}
                        onChange={(e) => setAgentReachTopic(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Target Platform</label>
                        <select
                          value={agentReachPlatform}
                          onChange={(e) => setAgentReachPlatform(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        >
                          <option value="reddit">Reddit (Discussions &amp; Sentiment)</option>
                          <option value="youtube">YouTube (Video Transcripts)</option>
                          <option value="twitter">X / Twitter (Live Pulse)</option>
                          <option value="github">GitHub (Issues &amp; Discussions)</option>
                          <option value="web">Web / Docs (Jina Reader &amp; Exa)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Max Results</label>
                        <select
                          value={agentReachLimit}
                          onChange={(e) => setAgentReachLimit(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        >
                          <option value="5">5 results</option>
                          <option value="10">10 results (Recommended)</option>
                          <option value="25">25 results</option>
                        </select>
                      </div>
                    </div>

                    {/* Generated Command Box */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Generated Command to Run:</span>
                      <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between gap-2 border border-slate-800">
                        <span className="truncate">
                          agent-reach {agentReachPlatform} search &quot;{agentReachTopic}&quot; --limit {agentReachLimit}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              'agent-reach-gen',
                              `agent-reach ${agentReachPlatform} search "${agentReachTopic}" --limit ${agentReachLimit}`
                            )
                          }
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          title="Copy command"
                        >
                          {copiedId === 'agent-reach-gen' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Paste this into your terminal or ask the Antigravity assistant to run it for you.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* No-AI-Slop Interactive Scanner & Cleaner */}
              {activeModalTool.interactiveType === 'no-ai-slop' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Live AI Slop Scanner &amp; Rewriter</h4>
                      <p className="text-xs text-slate-500">
                        Test how the filter detects clichés and humanizes synthetic text in real time.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSlopInput(SAMPLE_SLOP_TEXT);
                        setSlopCleaned('');
                        setSlopDetectedCount(null);
                      }}
                      className="text-xs text-brand-600 font-bold hover:underline"
                    >
                      Reset Sample
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Input Text (AI Draft)</label>
                      <textarea
                        rows={4}
                        value={slopInput}
                        onChange={(e) => setSlopInput(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={() => runSlopCleaner(slopInput)}
                      className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Wand2 className="w-4 h-4" />
                      <span>Scan &amp; Clean Slop Buzzwords</span>
                    </button>

                    {slopCleaned && (
                      <div className="space-y-2 pt-2 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Clean Humanized Output ({slopDetectedCount} buzzwords replaced):
                          </span>
                          <button
                            onClick={() => handleCopy('slop-cleaned', slopCleaned)}
                            className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
                          >
                            {copiedId === 'slop-cleaned' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>Copy Clean Text</span>
                          </button>
                        </div>
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-slate-800 leading-relaxed font-sans">
                          {slopCleaned}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Claude-Mem Memory Explorer */}
              {activeModalTool.interactiveType === 'claude-mem' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">Query Persistent Session Memories</h4>
                    <p className="text-xs text-slate-500">
                      Search through cross-session learnings, Supabase table definitions, and architecture rules.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Memory Search Query</label>
                      <input
                        type="text"
                        value={claudeMemQuery}
                        onChange={(e) => setClaudeMemQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Command to Query Claude-Mem:</span>
                      <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between gap-2 border border-slate-800">
                        <span className="truncate">npx claude-mem query &quot;{claudeMemQuery}&quot;</span>
                        <button
                          onClick={() => handleCopy('claude-mem-q', `npx claude-mem query "${claudeMemQuery}"`)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          title="Copy command"
                        >
                          {copiedId === 'claude-mem-q' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-slate-900 block">Active Integration Details:</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        <li>SQLite Database stored at: <code className="font-mono text-[11px] bg-slate-200 px-1 py-0.5 rounded">~/.claude-mem/memory.db</code></li>
                        <li>Lifecycle hooks registered in: <code className="font-mono text-[11px] bg-slate-200 px-1 py-0.5 rounded">~/.gemini/config/hooks.json</code></li>
                        <li>Session memory is automatically queried before each new task.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* GSD Core Spec-Driven Loop */}
              {activeModalTool.interactiveType === 'gsd-core' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">Spec-Driven 5-Step Phase Loop</h4>
                    <p className="text-xs text-slate-500">
                      Run fresh-context subagents to prevent context rot on large full-stack features.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { step: '1. Discuss', desc: 'Clarify feature scope without writing code' },
                      { step: '2. Plan', desc: 'Create .planning/ roadmap & milestone goals' },
                      { step: '3. Execute', desc: 'Fresh-context subagent writes atomic diffs' },
                      { step: '4. Verify', desc: 'Check build, types, and database persistence' },
                    ].map((phase) => (
                      <div key={phase.step} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <span className="font-bold text-slate-900 text-xs block">{phase.step}</span>
                        <p className="text-[11px] text-slate-500">{phase.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block">Prompt to Use in Antigravity Chat:</span>
                    <div className="bg-slate-900 text-amber-300 p-3 rounded-xl font-mono text-xs flex items-center justify-between gap-2 border border-slate-800">
                      <span className="truncate">Use skill gsd-plan-phase to design roadmap for [feature]</span>
                      <button
                        onClick={() =>
                          handleCopy(
                            'gsd-chat-prompt',
                            'Use skill gsd-plan-phase to design roadmap for [feature]'
                          )
                        }
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      >
                        {copiedId === 'gsd-chat-prompt' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PPT Master Presentation Deck Generator */}
              {activeModalTool.interactiveType === 'ppt-master' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">Convert Article to PowerPoint Presentation</h4>
                    <p className="text-xs text-slate-500">
                      Turns blog articles into editable .pptx vector slides for monetization or courses.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Source Article / Markdown File</label>
                      <input
                        type="text"
                        value={pptTopic}
                        onChange={(e) => setPptTopic(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Presentation Theme</label>
                      <select
                        value={pptTheme}
                        onChange={(e) => setPptTheme(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      >
                        <option value="modern-dark">Modern Dark (Developer / Tech Theme)</option>
                        <option value="corporate-blue">Corporate Slate (Business / Enterprise)</option>
                        <option value="emerald-minimal">Emerald Minimal (Clean &amp; High Contrast)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Command to Generate Presentation:</span>
                      <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between gap-2 border border-slate-800">
                        <span className="truncate">
                          node tools/ppt-master/index.js --input &quot;{pptTopic}&quot; --theme {pptTheme} --output deck.pptx
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              'ppt-gen',
                              `node tools/ppt-master/index.js --input "${pptTopic}" --theme ${pptTheme} --output deck.pptx`
                            )
                          }
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        >
                          {copiedId === 'ppt-gen' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Video-Use FFmpeg Automation */}
              {activeModalTool.interactiveType === 'video-use' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">Automated Video Assembly &amp; Subtitles</h4>
                    <p className="text-xs text-slate-500">
                      Removes pauses, cuts filler words, color-grades, and burns in viral subtitles.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Input Video File</label>
                      <input
                        type="text"
                        value={videoInputPath}
                        onChange={(e) => setVideoInputPath(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={videoCutFillers}
                          onChange={(e) => setVideoCutFillers(e.target.checked)}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span>Cut Filler Words (&quot;umm&quot;, &quot;uhh&quot;)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={videoSubtitles}
                          onChange={(e) => setVideoSubtitles(e.target.checked)}
                          className="rounded text-brand-600 focus:ring-brand-500"
                        />
                        <span>Generate Animated Subtitles</span>
                      </label>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Command to Process Video:</span>
                      <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between gap-2 border border-slate-800">
                        <span className="truncate">
                          python3 tools/video-use/main.py --input {videoInputPath}{' '}
                          {videoCutFillers ? '--cut-fillers ' : ''}
                          {videoSubtitles ? '--subtitles ' : ''}--output final.mp4
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              'video-gen',
                              `python3 tools/video-use/main.py --input ${videoInputPath} ${
                                videoCutFillers ? '--cut-fillers ' : ''
                              }${videoSubtitles ? '--subtitles ' : ''}--output final.mp4`
                            )
                          }
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        >
                          {copiedId === 'video-gen' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SkillSpector Security Scanner */}
              {activeModalTool.interactiveType === 'skillspector' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">NVIDIA Enterprise Security Scanner</h4>
                    <p className="text-xs text-slate-500">
                      Audit third-party skills, MCP tools, and prompts for injection or credential exfiltration.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Target Directory to Scan</label>
                        <select
                          value={skillSpectorPath}
                          onChange={(e) => setSkillSpectorPath(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        >
                          <option value=".gemini/skills/">.gemini/skills/ (Local Agent Skills)</option>
                          <option value="tools/">tools/ (Cloned AI Tools)</option>
                          <option value="src/">src/ (Application Codebase)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Severity</label>
                        <select
                          value={skillSpectorSeverity}
                          onChange={(e) => setSkillSpectorSeverity(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        >
                          <option value="high">High &amp; Critical Only</option>
                          <option value="medium">Medium, High &amp; Critical</option>
                          <option value="all">All Vulnerability Checks</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Command to Execute Security Audit:</span>
                      <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between gap-2 border border-slate-800">
                        <span className="truncate">
                          skillspector scan --path {skillSpectorPath} --severity {skillSpectorSeverity}
                        </span>
                        <button
                          onClick={() =>
                            handleCopy(
                              'skillspector-gen',
                              `skillspector scan --path ${skillSpectorPath} --severity ${skillSpectorSeverity}`
                            )
                          }
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        >
                          {copiedId === 'skillspector-gen' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Awesome Claude Code Ecosystem */}
              {activeModalTool.interactiveType === 'awesome-claude-code' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">Community Catalog &amp; Extension Explorer</h4>
                    <p className="text-xs text-slate-500">
                      Explore curated extensions, plugins, and slash commands from the community repository.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <span className="font-bold text-slate-900 block">Top Ecosystem Categories:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li><strong>Architecture &amp; Code Review:</strong> Fresh subagent reviewers and linters</li>
                      <li><strong>SEO &amp; Content Generators:</strong> Auto-tagging and metadata enrichers</li>
                      <li><strong>Database &amp; Supabase Tools:</strong> Schema migrators and RLS policy verifiers</li>
                      <li><strong>Deployment Automations:</strong> Hostinger, Cloudflare, and Vercel pipeline helpers</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block">Open Cloned Repository in Terminal:</span>
                    <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs flex items-center justify-between gap-2 border border-slate-800">
                      <span className="truncate">cd tools/awesome-claude-code &amp;&amp; git status</span>
                      <button
                        onClick={() =>
                          handleCopy('awesome-cd', 'cd tools/awesome-claude-code && git status')
                        }
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      >
                        {copiedId === 'awesome-cd' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <a
                href={activeModalTool.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <FolderGit2 className="w-4 h-4 text-slate-400" />
                <span>View on GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <button
                onClick={() => setActiveModalTool(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Close Launcher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
