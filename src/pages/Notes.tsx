import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StickyNote, Plus, Trash2 } from 'lucide-react';
import { useProfile } from '../lib/store';
import type { Note } from '../lib/store';

export const Notes: React.FC = () => {
  const { notes, setNotes } = useProfile();

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      date: new Date().toISOString().split('T')[0],
    };
    setNotes([newNote, ...notes]);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-forest dark:text-ivory-warm">Scratchpad</h1>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm">Quick thoughts, lecture bits, life admin.</p>
        </div>
        <Button onClick={addNote} className="flex items-center gap-2 shadow-float">
          <Plus size={20} /> New Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted opacity-50">
          <StickyNote size={64} strokeWidth={1} className="mb-4" />
          <p className="font-medium text-lg italic">Your scratchpad is empty. Start a thought.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map(note => (
            <Card key={note.id} className="p-6 relative group bg-white/50 backdrop-blur-sm border-white/20 transition-all hover:shadow-float">
              <button 
                onClick={() => deleteNote(note.id)}
                className="absolute top-4 right-4 text-text-muted hover:text-terracotta opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-terracotta-pale dark:bg-terracotta-darkpale text-terracotta dark:text-terracotta-light rounded-lg shrink-0">
                  <StickyNote size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <input 
                    className="w-full bg-transparent border-none text-xl font-bold text-text-primary dark:text-text-dark-primary focus:outline-none mb-2 placeholder:opacity-30"
                    value={note.title}
                    placeholder="Note Title"
                    onChange={(e) => updateNote(note.id, { title: e.target.value })}
                  />
                  <textarea 
                    className="w-full bg-transparent border-none text-text-secondary dark:text-text-dark-secondary focus:outline-none resize-none h-32 placeholder:opacity-30"
                    value={note.content}
                    placeholder="Start writing..."
                    onChange={(e) => updateNote(note.id, { content: e.target.value })}
                  />
                  <div className="text-[10px] uppercase tracking-widest text-text-muted mt-4 font-bold">{note.date}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
