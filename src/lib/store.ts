import { useState, useEffect } from 'react';
import { secureStorage } from './crypto';

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

export interface PlannerMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const PROFILE_KEY = 'thuthuka_profile';
const NOTES_KEY = 'thuthuka_notes';
const EVENTS_KEY = 'thuthuka_events';
const EXAMS_KEY = 'thuthuka_exams_list';
const PLANNER_KEY = 'thuthuka_planner_history';

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const stored = secureStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const stored = secureStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const stored = secureStorage.getItem(EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [exams, setExams] = useState<any[]>(() => {
    const stored = secureStorage.getItem(EXAMS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [plannerHistory, setPlannerHistory] = useState<PlannerMessage[]>(() => {
    const stored = secureStorage.getItem(PLANNER_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    secureStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    secureStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    secureStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    secureStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    secureStorage.setItem(PLANNER_KEY, JSON.stringify(plannerHistory));
  }, [plannerHistory]);

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const clearProfile = () => {
    setProfile(null);
    setNotes([]);
    setEvents([]);
    setExams([]);
    setPlannerHistory([]);
    secureStorage.clear();
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
    plannerHistory, setPlannerHistory,
    syncTimetable
  };
}
