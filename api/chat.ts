import type { VercelRequest, VercelResponse } from '@vercel/node';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'AI service not configured' });

  const { messages, context } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages[] is required' });
  }

  // Sanitise messages — only allow role + content strings
  const sanitised = messages
    .filter((m: any) => m?.role && m?.content)
    .map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content).slice(0, 4000),
    }));

  if (sanitised.length === 0) {
    return res.status(400).json({ error: 'No valid messages' });
  }

  try {
    const systemPrompt = buildSystemPrompt(context);

    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: sanitised,
    };

    const apiRes = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text();
      console.error('Anthropic API error:', apiRes.status, errBody);
      return res.status(502).json({ error: 'AI service error' });
    }

    const data = await apiRes.json();
    const text =
      data.content?.[0]?.type === 'text' ? data.content[0].text : '';

    return res.status(200).json({ message: text });
  } catch (err) {
    console.error('Chat handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function buildSystemPrompt(context?: any): string {
  let prompt = `You are Thuthuka AI — a tactical study advisor for UCT (University of Cape Town) students.

Your capabilities:
- Creating personalised study plans and weekly schedules
- Exam preparation strategies and revision timetables
- Time management and productivity advice
- Academic goal setting and progress tracking
- Course planning and workload balancing
- NSFAS, bursary, and funding guidance
- Off-campus accommodation advice
- Mental health awareness and balanced scheduling

Guidelines:
- Be concise, practical, and encouraging
- Use South African English
- Give actionable advice specific to UCT's academic calendar
- Format responses with clear headings, bullet points, and numbered steps
- When creating plans, include specific dates and time blocks
- Always consider the student's context (year, faculty, NSFAS status)
- If you don't know something UCT-specific, say so honestly`;

  if (context) {
    prompt += '\n\n--- Student Context ---';
    if (context.faculty) prompt += `\nFaculty: ${context.faculty}`;
    if (context.year) prompt += `\nYear: ${context.year}`;
    if (context.nsfasStatus) prompt += `\nNSFAS Status: ${context.nsfasStatus}`;
    if (context.budget) prompt += `\nMonthly Budget: R${context.budget}`;
    if (context.homeProvince) prompt += `\nHome Province: ${context.homeProvince}`;
    if (context.registeredCredits)
      prompt += `\nRegistered Credits: ${context.registeredCredits}`;

    if (context.exams?.length) {
      prompt += '\n\nUpcoming exams:';
      context.exams.forEach((e: any) => {
        prompt += `\n  - ${e.subject || e.code || 'Exam'} on ${e.date || 'TBD'}${e.time ? ' at ' + e.time : ''}${e.venue ? ' in ' + e.venue : ''}`;
      });
    }

    if (context.events?.length) {
      prompt += '\n\nWeekly schedule:';
      context.events.forEach((e: any) => {
        prompt += `\n  - ${e.title} at ${e.time} (${e.location})`;
      });
    }
  }

  return prompt;
}
