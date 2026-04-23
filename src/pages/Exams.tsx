import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AlertTriangle, CheckCircle2, CalendarPlus } from 'lucide-react';

// Mock types
interface Exam {
  subject: string;
  code: string;
  date: Date;
  time: string;
  venue: string;
}

interface StudySession {
  subject: string;
  topics: string[];
  hours: number;
  start?: Date;
  end?: Date;
}

interface StudyDay {
  date: Date;
  sessions: StudySession[];
}

export const Exams: React.FC = () => {
  const [timetableText, setTimetableText] = useState('');
  
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data state
  const [parsedExams, setParsedExams] = useState<Exam[]>([]);
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleAnalyse = contextSafe(() => {
    if (!timetableText.trim()) return;
    setIsAnalysing(true);

    // Mock parsing
    setTimeout(() => {
      setParsedExams([
        { subject: 'Computer Science', code: 'CSC3022', date: new Date(2026, 4, 23), time: '09:00', venue: 'Sports Hall' },
        { subject: 'Information Systems', code: 'INF3011', date: new Date(2026, 4, 25), time: '14:00', venue: 'Jameson Hall' },
        { subject: 'Software Engineering', code: 'CSC3023', date: new Date(2026, 4, 27), time: '09:00', venue: 'Sports Hall' },
      ]);
      setPhase(2);
      setIsAnalysing(false);
    }, 1500);
  });

  const handleGeneratePlan = contextSafe(() => {
    setIsGenerating(true);

    // Mock generation
    setTimeout(() => {
      setStudyDays([
        {
          date: new Date(2026, 4, 15),
          sessions: [
            { 
              subject: 'Computer Science', 
              topics: ['Networking', 'OS Concepts'], 
              hours: 4,
              start: new Date(2026, 4, 15, 9, 0),
              end: new Date(2026, 4, 15, 13, 0)
            },
            { 
              subject: 'Information Systems', 
              topics: ['Agile', 'UML'], 
              hours: 3,
              start: new Date(2026, 4, 15, 14, 0),
              end: new Date(2026, 4, 15, 17, 0)
            }
          ]
        },
        {
          date: new Date(2026, 4, 16),
          sessions: [
            { 
              subject: 'Software Engineering', 
              topics: ['Design Patterns', 'Testing'], 
              hours: 5,
              start: new Date(2026, 4, 16, 9, 0),
              end: new Date(2026, 4, 16, 14, 0)
            }
          ]
        }
      ]);
      setPhase(3);
      setIsGenerating(false);
    }, 2000);
  });

  useGSAP(() => {
    if (phase >= 2 && analysisRef.current) {
      gsap.fromTo(analysisRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [phase]);

  useGSAP(() => {
    if (phase === 3 && planRef.current) {
      gsap.fromTo(planRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power3.out' }
      );
    }
  }, [phase]);

  const generateGCalLink = (session: StudySession) => {
    if (!session.start || !session.end) return '#';
    
    const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const baseUrl = 'https://calendar.google.com/calendar/r/eventedit';
    const params = new URLSearchParams({
      text: `Study: ${session.subject}`,
      dates: `${formatDate(session.start)}/${formatDate(session.end)}`,
      details: `Topics to cover:\n${session.topics.map(t => `- ${t}`).join('\n')}`,
    });

    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div ref={containerRef} className="max-w-[800px]">
      <h1 className="text-3xl mb-2">Exam planner</h1>
      <p className="text-text-secondary dark:text-text-dark-secondary text-base mb-8 max-w-[600px]">
        Paste your timetable, get an analysis, and generate a day-by-day study plan.
      </p>

      {/* PHASE 1: INPUT */}
      <div>
        <div className="mb-6">
          <div className="font-semibold text-terracotta dark:text-terracotta-light text-sm mb-2">
            Step 1 of 3: Paste your exam timetable
          </div>
          <Textarea 
            placeholder="Paste text from examtimetable.uct.ac.za..."
            value={timetableText}
            onChange={(e) => setTimetableText(e.target.value)}
            disabled={phase > 1}
          />
        </div>
        
        {phase === 1 && (
          <Button 
            size="lg" 
            onClick={handleAnalyse} 
            isLoading={isAnalysing}
            disabled={!timetableText.trim()}
          >
            Analyse my timetable →
          </Button>
        )}
      </div>

      {/* PHASE 2: ANALYSIS */}
      {phase >= 2 && (
        <div ref={analysisRef} className="mt-8">
          <Card className="bg-ivory dark:bg-ivory-dark">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-ivory-deep dark:border-forest-darkpale">
              <h3 className="text-sage dark:text-sage-light text-[18px] m-0 flex items-center gap-2">
                <CheckCircle2 size={20} /> Parsed {parsedExams.length} exams
              </h3>
              {phase === 2 && (
                <Button variant="ghost" size="sm" onClick={() => setPhase(1)}>Edit</Button>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between font-medium mb-2">
                <span className="text-text-primary dark:text-text-dark-primary">Density score: 7/10</span>
                <span className="text-clay-red dark:text-clay-light flex items-center gap-1"><AlertTriangle size={16} /> HEAVY</span>
              </div>
              <div className="w-full h-3 bg-ivory-deep dark:bg-forest-darkpale rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-clay-red dark:bg-clay-light"></div>
              </div>
            </div>

            <div className="bg-amber-pale dark:bg-amber-darkpale border border-amber/20 dark:border-amber-pale/20 p-4 rounded-lg text-forest dark:text-ivory-warm text-sm">
              <strong><AlertTriangle size={14} className="inline mr-1" /> Back-to-back concern:</strong><br/>
              CSC3022 and INF3011 have only 1 day between them.
            </div>

            {phase === 2 && (
              <div className="mt-6">
                <Button 
                  size="lg" 
                  onClick={handleGeneratePlan}
                  isLoading={isGenerating}
                >
                  Generate my study plan →
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* PHASE 3: PLAN */}
      {phase === 3 && (
        <div ref={planRef} className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[22px] m-0">Your study plan</h2>
          </div>
          
          <p className="text-text-secondary dark:text-text-dark-secondary leading-relaxed mb-6">
            Summary: 14 study days. Focus on CSC3022 first — it comes earliest and has a tight prep window.
          </p>

          <div className="flex flex-col gap-6">
            {studyDays.map((day, idx) => (
              <div key={idx}>
                <h4 className="m-0 mb-3 text-[16px] text-terracotta dark:text-terracotta-light">
                  {day.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                </h4>
                {day.sessions.map((session, sIdx) => (
                  <Card key={sIdx} className="bg-ivory-warm dark:bg-ivory-dark border border-ivory-deep dark:border-forest-darkpale p-4 mb-2 shadow-none flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-text-primary dark:text-text-dark-primary mb-1">{session.subject}</div>
                        <div className="text-[14px] text-text-secondary dark:text-text-dark-secondary">
                          Topics: {session.topics.join(', ')}
                        </div>
                      </div>
                      <span className="font-mono text-sm text-text-secondary dark:text-text-dark-secondary bg-ivory dark:bg-forest-darkpale px-2 py-1 rounded">
                        ~{session.hours}h
                      </span>
                    </div>
                    <div className="flex justify-end">
                       <a 
                        href={generateGCalLink(session)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-sage hover:text-sage-light transition-colors"
                      >
                        <CalendarPlus size={16} /> Add to GCal
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
