import type { StudentProfile, CalendarEvent } from './store';
import { secureStorage } from './crypto';

interface ChatPayload {
  messages: { role: 'user' | 'assistant'; content: string }[];
  context?: Record<string, any>;
  clientKey?: string;
  provider?: string;
}

interface ChatResponse {
  message: string;
}

const RATE_KEY = 'thuthuka_rate_log';
const MAX_REQUESTS_PER_HOUR = 30;

/** Returns remaining requests this hour, or -1 if blocked. */
export function checkRateLimit(): number {
  const now = Date.now();
  const hourAgo = now - 3_600_000;
  const raw = secureStorage.getItem(RATE_KEY);
  const log: number[] = raw ? JSON.parse(raw).filter((t: number) => t > hourAgo) : [];
  return MAX_REQUESTS_PER_HOUR - log.length;
}

function recordRequest(): boolean {
  const now = Date.now();
  const hourAgo = now - 3_600_000;
  const raw = secureStorage.getItem(RATE_KEY);
  const log: number[] = raw ? JSON.parse(raw).filter((t: number) => t > hourAgo) : [];

  if (log.length >= MAX_REQUESTS_PER_HOUR) return false;

  log.push(now);
  secureStorage.setItem(RATE_KEY, JSON.stringify(log));
  return true;
}

export async function sendChatMessage(payload: ChatPayload): Promise<ChatResponse> {
  if (!recordRequest()) {
    throw new Error('Rate limit reached. You can send up to 30 messages per hour. Try again later.');
  }

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
  const { apiKey, apiProvider, ...safeProfile } = profile;
  return { ...safeProfile, exams, events };
}
