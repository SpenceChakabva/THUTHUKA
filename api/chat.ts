import type { VercelRequest, VercelResponse } from '@vercel/node';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, context, clientKey, provider } = req.body ?? {};

  const isOpenAI = provider === 'openai';

  // Resolve key: client BYOK first, then server env
  const apiKey = clientKey
    || (isOpenAI ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY);

  if (!apiKey) {
    return res.status(400).json({
      error: 'No API key available. Set the key on the server or enter your own in Profile.',
      code: 'NO_KEY',
    });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages[] is required' });
  }

  const sanitised = messages
    .filter((m: any) => m?.role && m?.content)
    .map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content).slice(0, 4000),
    }));

  if (sanitised.length === 0) {
    return res.status(400).json({ error: 'No valid messages' });
  }

  const systemPrompt = buildSystemPrompt(context);

  try {
    const text = isOpenAI
      ? await callOpenAI(apiKey, systemPrompt, sanitised)
      : await callAnthropic(apiKey, systemPrompt, sanitised);

    return res.status(200).json({ message: text });
  } catch (err: any) {
    console.error('Chat handler error:', err);
    if (err.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Check your key and try again.', code: 'INVALID_KEY' });
    }
    return res.status(502).json({ error: 'AI service error. Try again.' });
  }
}

// ───── Anthropic ─────

async function callAnthropic(apiKey: string, system: string, messages: any[]): Promise<string> {
  const r = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system,
      messages,
    }),
  });

  if (!r.ok) {
    const err: any = new Error('Anthropic error');
    err.status = r.status;
    throw err;
  }

  const data = await r.json();
  return data.content?.[0]?.type === 'text' ? data.content[0].text : '';
}

// ───── OpenAI ─────

async function callOpenAI(apiKey: string, system: string, messages: any[]): Promise<string> {
  const r = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: system },
        ...messages,
      ],
    }),
  });

  if (!r.ok) {
    const err: any = new Error('OpenAI error');
    err.status = r.status;
    throw err;
  }

  const data = await r.json();
  return data.choices?.[0]?.message?.content || '';
}

// ───── System Prompt ─────

function buildSystemPrompt(context?: any): string {
  let prompt = `You are Thuthuka AI, a tactical study advisor for UCT (University of Cape Town) students.

Capabilities: study plans, exam strategies, time management, academic goals, course planning, NSFAS/bursary guidance, accommodation advice, balanced scheduling.

Guidelines:
- Concise, practical, encouraging
- South African English
- Actionable advice specific to UCT
- Use headings, bullet points, numbered steps
- Include specific dates and time blocks in plans
- Consider the student's context
- Be honest when unsure about UCT-specific details
- Never use emojis`;

  if (context) {
    prompt += '\n\n--- Student Context ---';
    if (context.faculty) prompt += `\nFaculty: ${context.faculty}`;
    if (context.year) prompt += `\nYear: ${context.year}`;
    if (context.nsfasStatus) prompt += `\nNSFAS: ${context.nsfasStatus}`;
    if (context.budget) prompt += `\nBudget: R${context.budget}/month`;
    if (context.homeProvince) prompt += `\nProvince: ${context.homeProvince}`;
    if (context.registeredCredits) prompt += `\nCredits: ${context.registeredCredits}`;

    if (context.exams?.length) {
      prompt += '\n\nExams:';
      context.exams.forEach((e: any) => {
        prompt += `\n- ${e.subject || e.code || 'Exam'} ${e.date || ''} ${e.time ? 'at ' + e.time : ''} ${e.venue ? 'in ' + e.venue : ''}`;
      });
    }

    if (context.events?.length) {
      prompt += '\n\nSchedule:';
      context.events.forEach((e: any) => {
        prompt += `\n- ${e.title} ${e.time} (${e.location})`;
      });
    }
  }

  return prompt;
}
