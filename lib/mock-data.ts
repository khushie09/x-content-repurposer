export interface OutputResult {
  id: string;
  type: string;
  platform: string;
  content: string;
}

export const MOCK_OUTPUTS: Record<string, OutputResult> = {
  'x-post': {
    id: 'x-post',
    type: 'Tweet',
    platform: 'X / Twitter',
    content: `Most creators are obsessed with posting more.

The best ones are obsessed with being more clear.

Clarity compounds. Frequency doesn't.

Stop scheduling. Start sharpening.`,
  },
  'x-thread': {
    id: 'x-thread',
    type: 'Thread',
    platform: 'X / Twitter',
    content: `1/ Most creators are building an audience.
The best are building a body of work.

There's a difference — and it changes everything. 🧵

2/ An audience is a lagging indicator.
Your body of work is the leading one.

Focus on the work. The rest follows.

3/ Body of work means:
→ ideas you return to
→ perspectives you've earned
→ formats you've mastered

Not posts. Work.

4/ Most people post to be seen.
The best post because they have something to say.

One forces you. The other fuels you.

5/ The metric isn't followers.

It's: "Would someone read everything I've written?"

If yes — you're compounding.`,
  },
  linkedin: {
    id: 'linkedin',
    type: 'Post',
    platform: 'LinkedIn',
    content: `I've been thinking about what separates creators who grow slowly from those who compound.

It's not consistency. Not niche. Not frequency.

It's depth.

The creators who compound go deeper than anyone expects. They write the post after the post. They share the insight behind the insight.

Three questions worth sitting with:
→ What do you understand that most people don't?
→ What would you write if you knew no one was watching?
→ What's the idea you keep returning to?

That's your content strategy.

The answer to all three is probably the same thing.`,
  },
  hooks: {
    id: 'hooks',
    type: 'Hooks',
    platform: 'Any Platform',
    content: `Hook 1 — Contrast:
"Most creators are building an audience. The best are building a body of work."

Hook 2 — Challenge:
"Stop optimizing for reach. Start optimizing for depth."

Hook 3 — Reframe:
"Your best content isn't a growth hack. It's the thing you almost didn't share."

Hook 4 — Question:
"What if your most impactful post isn't your most viral one?"`,
  },
  caption: {
    id: 'caption',
    type: 'Caption',
    platform: 'Instagram / TikTok',
    content: `Depth > frequency.

The content that compounds isn't the most posted — it's the most honest.

Share the insight behind the insight. That's what people remember.

↓ Save this for the next time you feel pressured to post more instead of better.

#contentcreator #creatoreconomy #writingcommunity #contentmarketing`,
  },
  cta: {
    id: 'cta',
    type: 'CTA',
    platform: 'Any Platform',
    content: `CTA 1 — Share:
"If this hit different, share it with one creator who needs to hear it."

CTA 2 — Engage:
"Overthinking your content strategy? Drop a comment — let's figure it out together."

CTA 3 — Save:
"Save this for the next time you feel pressured to post more instead of better."`,
  },
};
