import { useState, useEffect } from 'react';

export interface StudentProfile {
  faculty?: string;
  year?: string;
  nsfasStatus?: string;
  budget?: number;
  homeProvince?: string;
  registeredCredits?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  location: string;
  type: 'lecture' | 'tutorial' | 'other';
  days?: string[];
}

const PROFILE_KEY = 'thuthuka_profile';
const NOTES_KEY = 'thuthuka_notes';
const EVENTS_KEY = 'thuthuka_events';
const EXAMS_KEY = 'thuthuka_exams_list';

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const stored = localStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const stored = localStorage.getItem(EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [exams, setExams] = useState<any[]>(() => {
    const stored = localStorage.getItem(EXAMS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  }, [exams]);

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const clearProfile = () => {
    setProfile(null);
    setNotes([]);
    setEvents([]);
    setExams([]);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(NOTES_KEY);
    localStorage.removeItem(EVENTS_KEY);
    localStorage.removeItem(EXAMS_KEY);
  };

  const syncTimetable = () => {
    const uctEvents: CalendarEvent[] = [
      { id: 1, title: 'CSC2001F Lecture', time: '09:00 - 09:45', location: 'RW James 3A', type: 'lecture' },
      { id: 2, title: 'MAM2000W Tutorial', time: '11:00 - 12:45', location: 'PD Hahn 4', type: 'tutorial' },
      { id: 3, title: 'Sports Club Meeting', time: '17:00 - 18:00', location: 'Sports Center', type: 'other' },
    ];
    setEvents(uctEvents);
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = { ...event, id: Date.now() };
    setEvents(prev => [...prev, newEvent]);
  };

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const updateEvent = (id: number, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  return { 
    profile, updateProfile, clearProfile,
    notes, setNotes, 
    events, setEvents, addEvent, deleteEvent, updateEvent,
    exams, setExams,
    syncTimetable 
  };
}
