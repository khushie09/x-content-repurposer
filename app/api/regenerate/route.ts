import { NextRequest, NextResponse } from 'next/server';
import type { RepurposeResult } from '@/lib/types';

const GEMINI_MODEL = 'gemini-3.6-flash';
const GEMINI_BASE  = 'https://generativelanguage.googleapis.com/v1beta/models';

const FORMAT_META: Record<string, { type: string; platform: string }> = {
  'x-post':   { type: 'Tweet',   platform: 'X / Twitter'        },
  'x-thread': { type: 'Thread',  platform: 'X / Twitter'        },
  'linkedin': { type: 'Post',    platform: 'LinkedIn'            },
  'hooks':    { type: 'Hooks',   platform: 'Any Platform'       },
  'caption':  { type: 'Caption', platform: 'Instagram / TikTok' },
  'cta':      { type: 'CTA',     platform: 'Any Platform'       },
};

const FORMAT_SPECS: Record<string, string> = {
  'x-post':   'Single X/Twitter post. Hard max 280 characters. Hook-first. No hashtags unless natural.',
  'x-thread': 'X/Twitter thread. 4–7 numbered posts ("1/", "2/", … last is "🧵"). Each post ≤ 250 chars. Separate posts with a blank line.',
  'linkedin': 'LinkedIn post. 150–300 words. Human, professional tone. Use line breaks and "→" bullets sparingly.',
  'hooks':    '4 distinct hook variations labeled exactly "Hook 1 — Type:\\n\\"text\\"". Types can be: Contrast, Challenge, Reframe, Question, Story, Statistic.',
  'caption':  'Instagram/TikTok caption. 60–120 words, then a blank line, then 4–5 relevant hashtags on the last line.',
  'cta':      '3 call-to-action variations labeled "CTA 1:", "CTA 2:", "CTA 3:". Each CTA is one sentence.',
};

const TONE_DESCRIPTIONS: Record<string, string> = {
  casual:       'conversational and relatable — like texting a friend who happens to be smart',
  professional: 'polished and authoritative — confident but not stiff',
  educational:  'clear and informative — teaches something actionable, no jargon',
  storytelling: 'narrative and personal — draws the reader in with a story arc',
  bold:         'punchy and direct — short sentences, strong opinions, no hedging',
};

interface GeminiResponse {
  candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
  error?: { message: string };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured.' }, { status: 500 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { content, format, tone } = body as {
    content?: unknown;
    format?: unknown;
    tone?: unknown;
  };

  if (typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required.' }, { status: 400 });
  }
  if (typeof format !== 'string' || !FORMAT_META[format]) {
    return NextResponse.json({ error: 'Invalid format.' }, { status: 400 });
  }
  if (typeof tone !== 'string') {
    return NextResponse.json({ error: 'tone is required.' }, { status: 400 });
  }

  const toneDesc = TONE_DESCRIPTIONS[tone] ?? tone;
  const formatSpec = FORMAT_SPECS[format];

  const prompt = `You are an expert content strategist. Regenerate a single piece of content.

TONE: ${tone} — ${toneDesc}

USER'S ORIGINAL CONTENT:
<content>
${content.trim().slice(0, 8000)}
</content>

FORMAT: ${format}
SPECIFICATION: ${formatSpec}

RULES:
- Stay faithful to the user's original ideas.
- Match the requested tone throughout.
- Make every word earn its place.
- Return ONLY valid JSON, no markdown, no code fences.

RESPONSE FORMAT:
{ "content": "<generated text — use \\n for line breaks>" }`;

  let geminiRaw: GeminiResponse;
  try {
    const res = await fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.9,
          maxOutputTokens: 2048,
        },
      }),
    });
    geminiRaw = (await res.json()) as GeminiResponse;
    if (!res.ok) {
      return NextResponse.json({ error: 'AI generation failed.' }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: 'Could not reach AI service.' }, { status: 502 });
  }

  const rawText = geminiRaw?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    return NextResponse.json({ error: 'AI returned an empty response.' }, { status: 502 });
  }

  let parsed: { content?: string };
  try { parsed = JSON.parse(rawText) as { content?: string }; } catch {
    return NextResponse.json({ error: 'AI response was malformed.' }, { status: 502 });
  }

  if (!parsed.content) {
    return NextResponse.json({ error: 'AI did not generate content.' }, { status: 502 });
  }

  const meta = FORMAT_META[format];
  const result: RepurposeResult = {
    id: format,
    type: meta.type,
    platform: meta.platform,
    content: parsed.content.trim(),
  };

  return NextResponse.json({ result });
}
