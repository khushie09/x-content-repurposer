import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { RepurposeResult } from '@/lib/types';

const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_BASE  = 'https://generativelanguage.googleapis.com/v1beta/models';

const FORMAT_META: Record<string, { type: string; platform: string }> = {
  'x-post':   { type: 'Tweet',   platform: 'X / Twitter'         },
  'x-thread': { type: 'Thread',  platform: 'X / Twitter'         },
  'linkedin': { type: 'Post',    platform: 'LinkedIn'             },
  'hooks':    { type: 'Hooks',   platform: 'Any Platform'        },
  'caption':  { type: 'Caption', platform: 'Instagram / TikTok'  },
  'cta':      { type: 'CTA',     platform: 'Any Platform'        },
};

const TONE_DESCRIPTIONS: Record<string, string> = {
  casual:        'conversational and relatable — like texting a friend who happens to be smart',
  professional:  'polished and authoritative — confident but not stiff',
  educational:   'clear and informative — teaches something actionable, no jargon',
  storytelling:  'narrative and personal — draws the reader in with a story arc',
  bold:          'punchy and direct — short sentences, strong opinions, no hedging',
};

function buildPrompt(content: string, formats: string[], tone: string): string {
  const toneDesc = TONE_DESCRIPTIONS[tone] ?? tone;
  const formatList = formats.join(', ');

  return `You are an expert content strategist and copywriter. Repurpose the user's content for the requested platforms using the specified tone.

TONE: ${tone} — ${toneDesc}

USER'S CONTENT:
<content>
${content}
</content>

REQUESTED FORMATS: ${formatList}

FORMAT SPECIFICATIONS:
- x-post: Single X/Twitter post. Hard max 280 characters. Hook-first. No hashtags unless natural.
- x-thread: X/Twitter thread. 4–7 numbered posts ("1/", "2/", … last is "🧵"). Each post ≤ 250 chars. Separate posts with a blank line. Make it feel like a complete narrative.
- linkedin: LinkedIn post. 150–300 words. Human, professional tone. Use line breaks and "→" bullets sparingly.
- hooks: 4 distinct hook variations labeled exactly "Hook 1 — Type:\\n\\"text\\"". Types can be: Contrast, Challenge, Reframe, Question, Story, Statistic. Each hook is one or two lines only.
- caption: Instagram/TikTok caption. 60–120 words, then a blank line, then 4–5 relevant hashtags on the last line.
- cta: 3 call-to-action variations labeled "CTA 1:", "CTA 2:", "CTA 3:". Each CTA is one sentence. Encourage share, comment, or save.

RULES:
- Stay faithful to the user's original ideas — do not invent unrelated topics.
- Match the requested tone throughout.
- Make every word earn its place.
- For x-thread, the first post should stand alone as a hook.
- Return ONLY the JSON, no markdown, no code fences.

RESPONSE FORMAT (valid JSON only):
{
  "results": [
    { "format": "<format_id>", "content": "<generated text — use \\n for line breaks>" }
  ]
}

Only include the formats listed in REQUESTED FORMATS.`;
}

interface GeminiCandidate {
  content: { parts: Array<{ text: string }> };
  finishReason?: string;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { message: string; code: number };
}

interface GeminiResult {
  format: string;
  content: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
  }

  /* ── Parse + validate body ── */
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { content, formats, tone } = body as {
    content?: unknown;
    formats?: unknown;
    tone?: unknown;
  };

  if (typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required.' }, { status: 400 });
  }
  if (!Array.isArray(formats) || formats.length === 0) {
    return NextResponse.json({ error: 'formats must be a non-empty array.' }, { status: 400 });
  }
  if (typeof tone !== 'string') {
    return NextResponse.json({ error: 'tone is required.' }, { status: 400 });
  }

  const validFormats = Object.keys(FORMAT_META);
  const cleanFormats = (formats as string[]).filter((f) => validFormats.includes(f));
  if (cleanFormats.length === 0) {
    return NextResponse.json({ error: 'No valid formats specified.' }, { status: 400 });
  }

  const cleanContent = content.trim().slice(0, 8000); // hard cap

  /* ── Call Gemini ── */
  const url = `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const prompt = buildPrompt(cleanContent, cleanFormats, tone);

  let geminiRaw: GeminiResponse;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.85,
          maxOutputTokens: 8192,
        },
      }),
    });

    geminiRaw = (await res.json()) as GeminiResponse;

    if (!res.ok) {
      const msg = geminiRaw?.error?.message ?? `Gemini returned ${res.status}`;
      console.error('[repurpose] Gemini error:', msg);
      return NextResponse.json({ error: 'AI generation failed. Please try again.' }, { status: 502 });
    }
  } catch (err) {
    console.error('[repurpose] fetch error:', err);
    return NextResponse.json({ error: 'Could not reach AI service. Check your connection.' }, { status: 502 });
  }

  /* ── Extract text from response ── */
  const rawText = geminiRaw?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    console.error('[repurpose] empty Gemini response:', JSON.stringify(geminiRaw).slice(0, 400));
    return NextResponse.json({ error: 'AI returned an empty response. Please try again.' }, { status: 502 });
  }

  /* ── Parse JSON from model output ── */
  let parsed: { results?: GeminiResult[] };
  try {
    parsed = JSON.parse(rawText) as { results?: GeminiResult[] };
  } catch {
    console.error('[repurpose] JSON parse error. Raw:', rawText.slice(0, 400));
    return NextResponse.json({ error: 'AI response was malformed. Please try again.' }, { status: 502 });
  }

  if (!Array.isArray(parsed?.results)) {
    return NextResponse.json({ error: 'Unexpected AI response shape.' }, { status: 502 });
  }

  /* ── Shape results ── */
  const results: RepurposeResult[] = parsed.results
    .filter((r): r is GeminiResult => !!r?.format && typeof r.content === 'string')
    .map((r) => {
      const meta = FORMAT_META[r.format] ?? { type: r.format, platform: 'Unknown' };
      return {
        id: r.format,
        type: meta.type,
        platform: meta.platform,
        content: r.content.trim(),
      };
    });

  if (results.length === 0) {
    return NextResponse.json({ error: 'AI did not generate any content. Please try again.' }, { status: 502 });
  }

  /* ── Persist to history ── */
  let historyId: string | undefined;
  try {
    const { data, error: dbErr } = await supabase
      .from('history')
      .insert({
        original_content: cleanContent,
        selected_formats: cleanFormats,
        tone,
        generated_results: results,
      })
      .select('id')
      .single();
    if (!dbErr && data) historyId = data.id as string;
  } catch {
    // Non-fatal: generation succeeded even if DB write fails
  }

  return NextResponse.json({ results, historyId });
}
