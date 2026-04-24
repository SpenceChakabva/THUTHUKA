import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Textarea, Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { AlertTriangle, CheckCircle2, CalendarPlus, Trash2, Plus, Sparkles, Edit2, Save, X, MapPin, Clock, BookOpen } from 'lucide-react';
import { DatePicker } from '../components/ui/DatePicker';
import { Badge } from '../components/ui/Badge';

interface Exam {
  id: string;
  subject: string;
  code: string;
  date: string;
  time: string;
  venue: string;
}

const EXAMS_KEY = 'thuthuka_exams_list';

export const Exams: React.FC = () => {
  const [timetableText, setTimetableText] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Exam | null>(null);
  
  const [exams, setExams] = useState<Exam[]>(() => {
    const stored = localStorage.getItem(EXAMS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  }, [exams]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleAnalyse = contextSafe(() => {
    if (!timetableText.trim()) return;
    setIsAnalysing(true);

    setTimeout(() => {
      const newExams: Exam[] = [
        { id: Date.now().toString() + '1', subject: 'Computer Science 2A', code: 'CSC2001F', date: '2026-06-02', time: '09:00', venue: 'Sports Hall' },
        { id: Date.now().toString() + '2', subject: 'Maths 2000W', code: 'MAM2000W', date: '2026-06-05', time: '14:00', venue: 'Jameson Hall' },
      ];
      setExams([...exams, ...newExams]);
      setIsAnalysing(false);
      setTimetableText('');
      
      gsap.from('.exam-card', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power3.out'
      });
    }, 1500);
  });

  const deleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const startEditing = (exam: Exam) => {
    setEditingId(exam.id);
    setEditFormData({ ...exam });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const saveEdit = () => {
    if (editFormData && editingId) {
      setExams(exams.map(e => e.id === editingId ? editFormData : e));
      setEditingId(null);
      setEditFormData(null);
    }
  };

  const addManualExam = () => {
    const newExam: Exam = {
      id: Date.now().toString(),
      subject: 'New Course',
      code: 'COURSE101',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      venue: 'Exam Hall',
    };
    setExams([newExam, ...exams]);
    startEditing(newExam);
  };

  return (
    <div ref={containerRef} className="max-w-[900px] py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
        <div className="stagger-item">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="danger" className="px-3 py-1">Tactical Readiness</Badge>
            <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black text-forest dark:text-ivory-warm tracking-tighter leading-none mb-4">
            Exam<br />Planner.
          </h1>
          <p className="text-lg text-text-secondary dark:text-text-dark-secondary font-medium">
            Stay ahead of the registration density.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 stagger-item">
          <Button onClick={addManualExam} className="shadow-md px-8">
            <Plus size={18} /> Add Paper
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Left Col: The List */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-text-muted">Deployment Papers</h2>
            <div className="h-[1px] flex-1 mx-4 bg-ivory-deep dark:bg-dark-border opacity-30" />
          </div>

          {exams.length === 0 ? (
            <div className="py-12 px-8 bg-ivory-warm/30 dark:bg-ivory-dark/30 rounded-[2rem] border-2 border-dashed border-ivory-deep dark:border-forest-darkpale text-center">
              <Sparkles className="mx-auto mb-4 text-terracotta opacity-40" size={40} />
              <p className="text-text-secondary dark:text-text-dark-secondary font-medium italic">
                Scan your timetable or add your first exam to get started.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {exams.map((exam) => (
                <Card key={exam.id} className={`exam-card p-5 group transition-all border-none ${editingId === exam.id ? 'bg-white shadow-xl ring-2 ring-terracotta/20' : 'bg-white/60 backdrop-blur-sm hover:shadow-float'}`}>
                  {editingId === exam.id ? (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase text-text-muted">Subject</label>
                          <Input value={editFormData?.subject} onChange={(e) => setEditFormData(prev => prev ? {...prev, subject: e.target.value} : null)} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase text-text-muted">Code</label>
                          <Input value={editFormData?.code} onChange={(e) => setEditFormData(prev => prev ? {...prev, code: e.target.value} : null)} />
                        </div>
                      </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <DatePicker 
                            label="Deployment Date" 
                            value={editFormData?.date} 
                            onChange={(e) => setEditFormData(prev => prev ? {...prev, date: e.target.value} : null)} 
                          />
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase text-text-muted">Time</label>
                            <Input type="time" value={editFormData?.time} onChange={(e) => setEditFormData(prev => prev ? {...prev, time: e.target.value} : null)} />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold uppercase text-text-muted">Venue</label>
                            <Input placeholder="e.g. Jameson Hall" value={editFormData?.venue} onChange={(e) => setEditFormData(prev => prev ? {...prev, venue: e.target.value} : null)} />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="ghost" size="sm" onClick={cancelEditing} className="text-text-muted">Cancel</Button>
                          <Button size="sm" onClick={saveEdit} className="bg-terracotta text-white hover:bg-terracotta-light shadow-md"><Save size={16} /> Save Paper</Button>
                        </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-forest text-ivory rounded-2xl flex flex-col items-center justify-center shrink-0">
                           <span className="text-[10px] font-bold uppercase opacity-60">{new Date(exam.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                           <span className="text-xl font-black">{new Date(exam.date).getDate()}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="font-mono font-black text-[12px] text-terracotta bg-terracotta/5 px-2 py-0.5 rounded-md">{exam.code}</span>
                             <Badge variant="neutral" className="text-[9px]">Confirmed</Badge>
                          </div>
                          <h3 className="text-xl font-bold text-text-primary dark:text-text-dark-primary m-0 leading-tight">{exam.subject}</h3>
                          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
                            <div className="flex items-center gap-1.5 text-[13px] text-text-secondary dark:text-text-dark-secondary">
                              <Clock size={14} className="opacity-40" />
                              <span>{exam.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[13px] text-text-secondary dark:text-text-dark-secondary">
                              <MapPin size={14} className="opacity-40" />
                              <span>{exam.venue}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => startEditing(exam)}
                          className="p-2 text-text-muted hover:text-forest transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteExam(exam.id)}
                          className="p-2 text-text-muted hover:text-terracotta transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: The Buddy/Input */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 bg-forest text-ivory border-none shadow-float overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-amber animate-pulse" /> Buddy Quick-Scan
              </h3>
              <p className="text-sm opacity-80 mb-6 leading-relaxed">
                Paste your timetable text from the UCT portal, and I'll extract all the dates and venues for you.
              </p>
              <Textarea 
                placeholder="Paste here..."
                className="bg-white/10 border-white/20 text-ivory placeholder:text-ivory/30 min-h-[120px] mb-4 text-sm focus:bg-white/20 transition-all"
                value={timetableText}
                onChange={(e) => setTimetableText(e.target.value)}
              />
              <Button 
                variant="primary" 
                className="w-full bg-ivory text-forest hover:bg-ivory-warm active:scale-95"
                onClick={handleAnalyse}
                isLoading={isAnalysing}
                disabled={!timetableText.trim()}
              >
                Scan Timetable
              </Button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-terracotta/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
          </Card>

          {exams.length > 0 && (
            <Card className="p-6 bg-amber-pale border-none text-text-primary animate-in zoom-in-95 duration-500">
              <div className="flex gap-3 mb-4">
                <AlertTriangle className="text-amber shrink-0" size={24} />
                <h4 className="font-bold m-0">Buddy Insight</h4>
              </div>
              <p className="text-sm leading-relaxed m-0 opacity-80">
                Found {exams.length} papers. I've highlighted the most critical sessions based on your registration density.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
