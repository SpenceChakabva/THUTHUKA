import React, { useState, useRef, useEffect } from 'react';
import { useProfile, type PlannerMessage } from '../lib/store';
import { sendChatMessage, buildContext } from '../lib/ai';
import { Button } from '../components/ui/Button';
import {
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  CalendarDays,
  Target,
  Trash2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const QUICK_ACTIONS = [
  {
    label: 'Study plan',
    prompt:
      'Create a detailed weekly study plan based on my courses and exams. Break it into daily time blocks.',
    icon: BookOpen,
  },
  {
    label: 'Exam strategy',
    prompt:
      'Help me prepare an exam strategy. What topics should I prioritise and in what order?',
    icon: CalendarDays,
  },
  {
    label: 'Weekly reset',
    prompt:
      'Plan my week — balance lectures, study time, exercise, and rest. Be realistic.',
    icon: Target,
  },
  {
    label: 'Motivate me',
    prompt:
      "I'm feeling overwhelmed with my workload. Give me a tactical pep talk and help me prioritise what matters most right now.",
    icon: Sparkles,
  },
];

export const Planner: React.FC = () => {
  const { profile, exams, events, plannerHistory, setPlannerHistory } =
    useProfile();
  const [messages, setMessages] = useState<PlannerMessage[]>(plannerHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist messages
  useEffect(() => {
    setPlannerHistory(messages);
  }, [messages, setPlannerHistory]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    setError(null);

    const userMsg: PlannerMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      const context = buildContext(profile, exams, events);
      const data = await sendChatMessage({
        messages: updated.map((m) => ({ role: m.role, content: m.content })),
        context,
      });

      const assistantMsg: PlannerMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(
        err.message === 'AI service not configured'
          ? 'The AI service is not configured yet. Add your ANTHROPIC_API_KEY to the Vercel environment variables.'
          : 'Could not reach the AI service. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-forest dark:text-ivory-warm">
          AI Study Planner
        </h1>
        <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
          Tactical intelligence powered by Claude.
        </p>
      </div>

      {messages.length === 0 ? (
        /* ---------- Empty state ---------- */
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-16 h-16 bg-terracotta/10 text-terracotta rounded-3xl flex items-center justify-center mb-6">
            <Bot size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-primary dark:text-text-dark-primary mb-2 text-center">
            What can I help with?
          </h2>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm mb-8 text-center max-w-md">
            I know your profile, schedule, and exams. Ask me anything about your
            academic game plan.
          </p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.prompt)}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-dark-card/50 border border-ivory-deep dark:border-dark-border text-left hover:shadow-float hover:-translate-y-0.5 transition-all group"
              >
                <div className="p-2 rounded-xl bg-terracotta/10 text-terracotta group-hover:bg-terracotta group-hover:text-ivory transition-colors shrink-0">
                  <action.icon size={18} />
                </div>
                <span className="text-sm font-bold text-text-primary dark:text-text-dark-primary">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ---------- Chat messages ---------- */
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-forest text-ivory rounded-br-md'
                    : 'bg-white/60 dark:bg-dark-card/60 text-text-primary dark:text-text-dark-primary border border-ivory-deep dark:border-dark-border rounded-bl-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-forest/10 text-forest dark:bg-ivory/10 dark:text-ivory rounded-xl flex items-center justify-center shrink-0 mt-1">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white/60 dark:bg-dark-card/60 rounded-2xl rounded-bl-md p-4 border border-ivory-deep dark:border-dark-border">
                <div className="flex items-center gap-2 text-text-muted">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 p-3 mb-3 bg-clay-pale dark:bg-clay-red/10 text-clay-red rounded-xl text-sm shrink-0">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input bar */}
      <div className="flex gap-3 items-end bg-white/40 dark:bg-dark-card/40 backdrop-blur-sm p-3 rounded-2xl border border-ivory-deep dark:border-dark-border shrink-0">
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="p-2.5 text-text-muted hover:text-terracotta transition-colors rounded-xl hover:bg-terracotta/10"
            title="Clear chat"
          >
            <Trash2 size={18} />
          </button>
        )}
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about study plans, exams, time management..."
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-text-primary dark:text-text-dark-primary placeholder:text-text-muted/50 min-h-[40px] max-h-[120px] py-2 px-1"
          style={{ height: 'auto', overflow: 'hidden' }}
          onInput={(e) => {
            const t = e.target as HTMLTextAreaElement;
            t.style.height = 'auto';
            t.style.height = Math.min(t.scrollHeight, 120) + 'px';
          }}
        />
        <Button
          size="sm"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="rounded-xl px-4 shrink-0"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};
