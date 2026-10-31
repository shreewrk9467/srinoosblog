import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
  }

  try {
    const { topic, categoryName, targetAudience, focusKeyword } = await request.json();

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

    // High-quality structured article generation blueprint
    const generatedTitle = `${cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)}: Comprehensive Guide & Analysis`;
    const metaTitle = `${cleanTopic} Guide (2026 Strategy & Benchmarks) | Srinoos`;
    const metaDescription = `Master ${cleanKeyword} with this comprehensive, research-backed guide from Srinoos. Discover actionable steps, verified comparisons, and expert tips.`;
    const excerpt = `An in-depth exploration of ${cleanTopic}, examining practical applications, architectural best practices, and high-impact monetization opportunities for digital builders.`;

    const contentHtml = `
<h2>Introduction: Why ${cleanTopic} Matters Today</h2>
<p>In modern digital publishing and software architecture, mastering <strong>${cleanTopic}</strong> has become essential for sustained organic growth and digital efficiency. Rather than relying on surface-level tactics, high-performing creators focus on verified workflows that deliver quantifiable value.</p>

<h3>Core Principles & Foundational Architecture</h3>
<p>To successfully execute this strategy, consider the following technical prerequisites:</p>
<ul>
  <li><strong>Intent Alignment:</strong> Ensure every paragraph directly addresses the primary search query without fluff.</li>
  <li><strong>Performance Benchmarking:</strong> Monitor response times, conversion paths, and user engagement metrics continuously.</li>
  <li><strong>Structured Data Integration:</strong> Always deploy JSON-LD Schema to ensure search engine crawlability and eligibility for rich search snippets.</li>
</ul>

<h3>Step-by-Step Implementation Framework</h3>
<p>Follow these structured steps to put this into practice:</p>
<ol>
  <li><strong>Discovery & Research:</strong> Analyze market intent and competitive gaps using long-tail keyword research.</li>
  <li><strong>Execution & Prototyping:</strong> Build a clean, modular solution designed for mobile and desktop speed.</li>
  <li><strong>Optimization & Monetization:</strong> Strategically introduce compliant AdSense units and disclosed affiliate recommendations.</li>
</ol>

<blockquote>
  &ldquo;Consistency, verifiable accuracy, and reader trust remain the single most reliable driver of multi-channel digital revenue.&rdquo; &mdash; Srinoos Editorial Insights
</blockquote>

<h3>Recommended Best Practices for Long-Term Growth</h3>
<p>Avoid rushing low-value automated iterations. Every publication should undergo editorial review to verify factual accuracy, code syntax, and partner disclosure integrity before reaching production readers.</p>
    `.trim();

    const faqs = [
      {
        question: `What are the primary benefits of ${cleanTopic}?`,
        answer: `It provides scalable efficiency, higher search discoverability, and proven organic audience retention when executed with proper editorial standards.`,
      },
      {
        question: `How does Srinoos recommend measuring results?`,
        answer: `Track organic impressions via Google Search Console, monitor Core Web Vitals, and review server-side affiliate click attribution.`,
      },
      {
        question: `Is technical expertise required to get started?`,
        answer: `While foundational knowledge helps, our step-by-step guides break down complex implementations into accessible, modular phases.`,
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
    });
  } catch (error: any) {
    console.error('AI generate draft error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate article outline' }, { status: 500 });
  }
}

