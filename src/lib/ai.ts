import type { StudentProfile, CalendarEvent } from './store';

interface ChatPayload {
  messages: { role: 'user' | 'assistant'; content: string }[];
  context?: {
    faculty?: string;
    year?: string;
    nsfasStatus?: string;
    budget?: number;
    homeProvince?: string;
    registeredCredits?: number;
    exams?: any[];
    events?: CalendarEvent[];
  };
}

interface ChatResponse {
  message: string;
}

export async function sendChatMessage(payload: ChatPayload): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export function buildContext(
  profile: StudentProfile | null,
  exams: any[],
  events: CalendarEvent[],
) {
  if (!profile) return undefined;
  return { ...profile, exams, events };
}
