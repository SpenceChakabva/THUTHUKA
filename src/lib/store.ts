import { useState, useEffect } from 'react';

export interface StudentProfile {
  faculty?: string;
  year?: string;
  nsfasStatus?: string;
  budget?: number;
  homeProvince?: string;
  registeredCredits?: number;
}

const PROFILE_KEY = 'thuthuka_profile';

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse profile from localStorage', e);
    }
    return null;
  });

  useEffect(() => {
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_KEY);
    }
  }, [profile]);

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const clearProfile = () => {
    setProfile(null);
  };

  return { profile, updateProfile, clearProfile };
}
