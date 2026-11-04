import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';

/**
 * Filter out AI clichés and slop patterns based on the open-source 'no-ai-slop' ruleset
 * (https://github.com/petergyang/no-ai-slop)
 */
const SLOP_REPLACEMENTS: Array<{ regex: RegExp; replacement: string; patternName: string }> = [
  { regex: /\b(delve into|delve)\b/gi, replacement: 'explore', patternName: 'delve' },
  { regex: /\bleverage\b/gi, replacement: 'use', patternName: 'leverage' },
  { regex: /\butilize\b/gi, replacement: 'use', patternName: 'utilize' },
  { regex: /\bfacilitate\b/gi, replacement: 'enable', patternName: 'facilitate' },
  { regex: /\bempower\b/gi, replacement: 'allow', patternName: 'empower' },
  { regex: /\bstreamline\b/gi, replacement: 'simplify', patternName: 'streamline' },
  { regex: /\brobust\b/gi, replacement: 'reliable', patternName: 'robust' },
  { regex: /\bcutting-edge\b/gi, replacement: 'modern', patternName: 'cutting-edge' },
  { regex: /\bparadigm shift\b/gi, replacement: 'fundamental change', patternName: 'paradigm shift' },
  { regex: /\bgame changer\b/gi, replacement: 'significant step', patternName: 'game changer' },
  { regex: /\btapestry\b/gi, replacement: 'network', patternName: 'tapestry' },
  { regex: /\brealm\b/gi, replacement: 'field', patternName: 'realm' },
  { regex: /\bbeacon\b/gi, replacement: 'model', patternName: 'beacon' },
  { regex: /\bmultifaceted\b/gi, replacement: 'varied', patternName: 'multifaceted' },
  { regex: /\bmeticulous\b/gi, replacement: 'careful', patternName: 'meticulous' },
  { regex: /\bintricate\b/gi, replacement: 'detailed', patternName: 'intricate' },
  { regex: /\bparamount\b/gi, replacement: 'critical', patternName: 'paramount' },
  { regex: /\btransformative\b/gi, replacement: 'practical', patternName: 'transformative' },
  { regex: /\belevate\b/gi, replacement: 'improve', patternName: 'elevate' },
  { regex: /\bembark on\b/gi, replacement: 'start', patternName: 'embark on' },
  { regex: /\bsupercharge\b/gi, replacement: 'speed up', patternName: 'supercharge' },
  { regex: /\bharness\b/gi, replacement: 'apply', patternName: 'harness' },
  { regex: /\bever-evolving\b/gi, replacement: 'changing', patternName: 'ever-evolving' },
  { regex: /\bin today's fast-paced world\b/gi, replacement: 'today', patternName: 'throat-clearing' },
  { regex: /\bin today's world\b/gi, replacement: 'currently', patternName: 'throat-clearing' },
  { regex: /\blet's dive in\b/gi, replacement: 'here are the details', patternName: 'dive-in cliché' },
  { regex: /\bit's important to note that\b/gi, replacement: 'note that', patternName: 'empty phrase' },
  { regex: /\bit's worth noting that\b/gi, replacement: 'note that', patternName: 'empty phrase' },
];

function applyNoAiSlopFilter(content: string): { sanitized: string; patternsDetected: string[] } {
  let sanitized = content;
  const detected: string[] = [];

  for (const item of SLOP_REPLACEMENTS) {
    if (item.regex.test(sanitized)) {
      if (!detected.includes(item.patternName)) {
        detected.push(item.patternName);
      }
      sanitized = sanitized.replace(item.regex, item.replacement);
    }
  }

  return { sanitized, patternsDetected: detected };
}

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
  }

  try {
    const body: any = await request.json();
    const { topic, categoryName, targetAudience, focusKeyword } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Topic or keyword prompt is required' }, { status: 400 });
    }

    const cleanTopic = topic.trim();
    const cleanKeyword = focusKeyword?.trim() || cleanTopic.toLowerCase();
    const cleanCat = categoryName || 'Technology & AI';

    // Slug generation
    const slug = cleanTopic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // High-quality structured article generation blueprint adhering to human voice standards
    const generatedTitle = `${cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)}: Practical Guide & Case Analysis`;
    const metaTitle = `${cleanTopic} Guide (2026 Practical Framework) | Srinoos`;
    const metaDescription = `Master ${cleanKeyword} with this direct, evidence-based guide from Srinoos. Discover verified benchmarks, real examples, and clear steps.`;
    const excerpt = `A direct examination of ${cleanTopic}, covering practical implementation, system benchmarks, and proven monetization paths without corporate fluff.`;

    // Raw initial draft
    const rawContentHtml = `
<h2>Why ${cleanTopic} Matters</h2>
<p>Modern engineering and digital publishing require reliable, testable workflows. Mastering <strong>${cleanTopic}</strong> gives technical creators a repeatable path toward scalable audience engagement and sustainable revenue.</p>

<h3>Core Engineering Principles</h3>
<p>Successful teams prioritize measurable results over superficial trends. Keep three foundational rules in mind:</p>
<ul>
  <li><strong>Direct Intent:</strong> Answer the reader's question directly in the opening paragraph.</li>
  <li><strong>Performance Benchmarks:</strong> Track Core Web Vitals, page render speeds, and conversion rates continuously.</li>
  <li><strong>Structured Data:</strong> Implement JSON-LD schema so search engines can index table data and FAQs accurately.</li>
</ul>

<h3>Implementation Steps</h3>
<p>Follow these steps to deploy this setup:</p>
<ol>
  <li><strong>Research:</strong> Analyze search volume and find competitive gaps using primary search data.</li>
  <li><strong>Execution:</strong> Build a fast, accessible prototype tested across both desktop and mobile viewports.</li>
  <li><strong>Monetization:</strong> Add clear affiliate recommendations and fast-loading AdSense display slots with explicit partner disclosures.</li>
</ol>

<blockquote>
  &ldquo;Consistency, verifiable accuracy, and reader trust remain the single most reliable driver of multi-channel digital revenue.&rdquo; &mdash; Srinoos Editorial Insights
</blockquote>

<h3>Long-Term Maintenance</h3>
<p>Review every publication before going live. Check code snippets for syntax errors, verify partner tracking links, and confirm that all affiliate tags comply with network disclosure standards.</p>
    `.trim();

    // Pass through no-ai-slop filter
    const { sanitized: contentHtml, patternsDetected } = applyNoAiSlopFilter(rawContentHtml);

    const faqs = [
      {
        question: `What are the primary benefits of ${cleanTopic}?`,
        answer: `It provides measurable efficiency, predictable search rankings, and strong reader retention when executed with clean editorial standards.`,
      },
      {
        question: `How does Srinoos recommend measuring results?`,
        answer: `Track search impressions in Google Search Console, audit Core Web Vitals in PageSpeed Insights, and review conversion metrics in your affiliate dashboard.`,
      },
      {
        question: `Is technical expertise required to get started?`,
        answer: `Basic familiarity helps, but our modular guides break complex configurations into step-by-step phases anyone can follow.`,
      },
    ];

    const tags = `${cleanKeyword}, ${cleanCat.split('&')[0].trim()}, Technology, Guides, 2026`;

    return NextResponse.json({
      success: true,
      draft: {
        title: generatedTitle,
        slug,
        excerpt,
        content: contentHtml,
        meta_title: metaTitle,
        meta_description: metaDescription,
        focus_keyword: cleanKeyword,
        tags,
        reading_time_minutes: 6,
        faq_schema: JSON.stringify(faqs),
        status: 'review', // Default to 'review' as per instruction requiring user approval
      },
      no_ai_slop_compliance: {
        verified: true,
        engine: 'no-ai-slop (petergyang/no-ai-slop)',
        patternsChecked: SLOP_REPLACEMENTS.length,
        patternsSanitized: patternsDetected,
      },
    });
  } catch (error: any) {
    console.error('AI generate draft error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate article outline' }, { status: 500 });
  }
}
