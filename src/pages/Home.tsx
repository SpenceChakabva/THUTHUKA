import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, MapPin, CalendarDays, Coins, FileText, Calendar, StickyNote, RefreshCw, TrendingUp, MessageSquare, Bot } from 'lucide-react';
import { useProfile } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function getContextualMessage() {
  const month = new Date().getMonth(); // 0-indexed
  
  if (month <= 1) { // Jan-Feb
    return {
      icon: MapPin,
      headline: 'Housing season is now.',
      body: 'Verify your off-campus listing before you sign anything.',
      cta: 'Check listing',
      href: '/accommodation',
    };
  }
  if (month >= 2 && month <= 4) { // Mar-May (extended to include May exams)
    return {
      icon: CalendarDays,
      headline: 'Mid-year exams are approaching.',
      body: 'Upload your timetable now and get a personalised study plan.',
      cta: 'Plan my exams',
      href: '/exams',
    };
  }
  if (month >= 8 && month <= 9) { // Sep-Oct
    return {
      icon: FileText,
      headline: 'Bursary deadlines are approaching.',
      body: 'Several funding opportunities close in October. Check what you qualify for.',
      cta: 'See my bursaries',
      href: '/funding',
    };
  }
  // Default
  return {
    icon: Coins,
    headline: 'Do you know your NSFAS gap?',
    body: 'Many students discover a shortfall too late. Calculate yours now.',
    cta: 'Calculate',
    href: '/funding',
  };
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  
  const banner = getContextualMessage();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night';

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.stagger-item', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pb-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-center mb-8 stagger-item">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-forest dark:text-ivory-warm font-display m-0 leading-tight">
            {greeting}{profile?.year ? `, ${profile.year} buddy` : ''}.
          </h1>
          <p className="text-text-secondary dark:text-text-dark-secondary text-sm md:text-base mt-1">Ready for the tactical push?</p>
        </div>
        <div className="flex gap-2 md:gap-4">
          <button className="bg-transparent border-none text-text-secondary hover:text-text-primary hover:bg-ivory-warm dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-forest-darkpale cursor-pointer p-2 flex items-center justify-center rounded-full transition-all">
            <Bell size={24} />
          </button>
          <button className="bg-transparent border-none text-text-secondary hover:text-text-primary hover:bg-ivory-warm dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-forest-darkpale cursor-pointer p-2 flex items-center justify-center rounded-full transition-all" onClick={() => navigate('/profile')}>
            <UserCircle size={24} />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-8">
        {/* Main Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 stagger-item">
          <Card accent="warning" className="flex flex-col md:flex-row gap-6 items-start bg-gradient-to-br from-ivory-warm/80 to-white dark:from-dark-card dark:to-dark-surface border-none shadow-md hover:shadow-float transition-all duration-slow p-6 md:p-8 relative overflow-hidden group">
            <div className="text-amber dark:text-amber-light bg-white dark:bg-amber-darkpale p-5 rounded-[2rem] shadow-sm shrink-0 group-hover:scale-110 transition-transform duration-slow">
              <banner.icon size={40} />
            </div>
            <div className="flex-1 relative z-10">
              <h2 className="font-display text-xl md:text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-3">
                {banner.headline}
              </h2>
              <p className="text-[15px] md:text-[16px] text-text-secondary dark:text-text-dark-secondary mb-6 max-w-[550px] leading-relaxed">
                {banner.body}
              </p>
              <Button size="lg" onClick={() => navigate(banner.href)} className="shadow-md hover:scale-105 active:scale-95 transition-transform px-8">
                {banner.cta} — I'm ready
              </Button>
            </div>
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
          </Card>

          <Card className="flex flex-col gap-4 bg-forest dark:bg-dark-card text-ivory border-none shadow-md overflow-hidden relative group p-6">
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber rounded-full animate-pulse shadow-[0_0_8px_rgba(212,130,10,0.5)]" />
                  <h3 className="font-display text-lg font-bold italic">Synthetic Insight</h3>
                </div>
               <p className="text-[14px] opacity-80 leading-relaxed mb-auto">
                 "You've cleared 3 tasks today. Statistics show students who maintain this pace are 40% more likely to hit their GPA targets."
               </p>
               <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ivory/60">
                 <TrendingUp size={14} /> Efficiency: +12% this week
               </div>
             </div>
             <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <RefreshCw size={120} className="animate-spin-slow" />
             </div>
          </Card>
        </div>

        {/* Tools Section */}
        <div>
          <h3 className="text-[14px] md:text-[16px] font-bold text-text-muted dark:text-text-dark-muted mb-6 uppercase tracking-[0.2em] stagger-item">
            Tactical Deployment
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 stagger-item">
            <Card interactive className="flex flex-col gap-4 items-start p-5 hover:shadow-float transition-all hover:-translate-y-1 group bg-gradient-to-br from-terracotta/5 to-white/40 dark:from-terracotta/10 dark:to-dark-card/40 backdrop-blur-sm border-none" onClick={() => navigate('/planner')}>
              <div className="text-terracotta bg-terracotta/10 p-3 rounded-2xl group-hover:bg-terracotta group-hover:text-ivory transition-colors duration-slow">
                <Bot size={24} />
              </div>
              <span className="text-[15px] font-bold text-text-primary dark:text-text-dark-primary leading-tight">AI Planner</span>
            </Card>
            <Card interactive className="flex flex-col gap-4 items-start p-5 hover:shadow-float transition-all hover:-translate-y-1 group bg-white/40 dark:bg-dark-card/40 backdrop-blur-sm border-none" onClick={() => navigate('/accommodation')}>
              <div className="text-terracotta bg-terracotta/10 p-3 rounded-2xl group-hover:bg-terracotta group-hover:text-ivory transition-colors duration-slow">
                <MapPin size={24} />
              </div>
              <span className="text-[15px] font-bold text-text-primary dark:text-text-dark-primary leading-tight">Accommodation</span>
            </Card>
            <Card interactive className="flex flex-col gap-4 items-start p-5 hover:shadow-float transition-all hover:-translate-y-1 group bg-white/40 dark:bg-dark-card/40 backdrop-blur-sm border-none" onClick={() => navigate('/exams')}>
              <div className="text-terracotta bg-terracotta/10 p-3 rounded-2xl group-hover:bg-terracotta group-hover:text-ivory transition-colors duration-slow">
                <CalendarDays size={24} />
              </div>
              <span className="text-[15px] font-bold text-text-primary dark:text-text-dark-primary leading-tight">Exam Planner</span>
            </Card>
            <Card interactive className="flex flex-col gap-4 items-start p-5 hover:shadow-float transition-all hover:-translate-y-1 group bg-white/40 dark:bg-dark-card/40 backdrop-blur-sm border-none" onClick={() => navigate('/calendar')}>
              <div className="text-terracotta bg-terracotta/10 p-3 rounded-2xl group-hover:bg-terracotta group-hover:text-ivory transition-colors duration-slow">
                <Calendar size={24} />
              </div>
              <span className="text-[15px] font-bold text-text-primary dark:text-text-dark-primary leading-tight">Schedule</span>
            </Card>
            <Card interactive className="flex flex-col gap-4 items-start p-5 hover:shadow-float transition-all hover:-translate-y-1 group bg-white/40 dark:bg-dark-card/40 backdrop-blur-sm border-none" onClick={() => navigate('/notes')}>
              <div className="text-terracotta bg-terracotta/10 p-3 rounded-2xl group-hover:bg-terracotta group-hover:text-ivory transition-colors duration-slow">
                <StickyNote size={24} />
              </div>
              <span className="text-[15px] font-bold text-text-primary dark:text-text-dark-primary leading-tight">Scratchpad</span>
            </Card>
            <Card interactive className="flex flex-col gap-4 items-start p-5 hover:shadow-float transition-all hover:-translate-y-1 group bg-white/40 dark:bg-dark-card/40 backdrop-blur-sm border-none" onClick={() => navigate('/funding')}>
              <div className="text-terracotta bg-terracotta/10 p-3 rounded-2xl group-hover:bg-terracotta group-hover:text-ivory transition-colors duration-slow">
                <Coins size={24} />
              </div>
              <span className="text-[15px] font-bold text-text-primary dark:text-text-dark-primary leading-tight">NSFAS Calc</span>
            </Card>
            <Card interactive className="flex flex-col gap-4 items-start p-5 hover:shadow-float transition-all hover:-translate-y-1 group bg-white/40 dark:bg-dark-card/40 backdrop-blur-sm border-none" onClick={() => navigate('/funding')}>
              <div className="text-terracotta bg-terracotta/10 p-3 rounded-2xl group-hover:bg-terracotta group-hover:text-ivory transition-colors duration-slow">
                <FileText size={24} />
              </div>
              <span className="text-[15px] font-bold text-text-primary dark:text-text-dark-primary leading-tight">Bursaries</span>
            </Card>
            <Card interactive className="flex flex-col gap-4 items-start p-5 hover:shadow-float transition-all hover:-translate-y-1 group bg-terracotta/5 backdrop-blur-sm border-none" onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScxSNtyqh9dPO-Gv5IlQl6ufZgO_VF3f06nhD1b0j965d2szA/viewform?usp=header', '_blank')}>
              <div className="text-terracotta bg-terracotta/10 p-3 rounded-2xl group-hover:bg-terracotta group-hover:text-ivory transition-colors duration-slow">
                <MessageSquare size={24} />
              </div>
              <span className="text-[15px] font-bold text-terracotta dark:text-terracotta-light leading-tight">Feedback</span>
            </Card>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-item">
          <Card className="flex flex-col gap-1 bg-ivory-warm dark:bg-ivory-dark/40 border-none shadow-sm p-5">
             <span className="text-xs font-bold uppercase text-text-muted tracking-wider">Target Budget</span>
             <span className="text-2xl font-black text-forest dark:text-ivory-warm">R{profile?.budget?.toLocaleString() || '0'}</span>
          </Card>
          <Card className="flex flex-col gap-1 bg-ivory-warm dark:bg-ivory-dark/40 border-none shadow-sm p-5">
             <span className="text-xs font-bold uppercase text-text-muted tracking-wider">NSFAS Status</span>
             <span className="text-2xl font-black text-forest dark:text-ivory-warm truncate">{profile?.nsfasStatus || 'Unknown'}</span>
          </Card>
          <Card className="flex flex-col gap-1 bg-ivory-warm dark:bg-ivory-dark/40 border-none shadow-sm p-5">
             <span className="text-xs font-bold uppercase text-text-muted tracking-wider">Primary Faculty</span>
             <span className="text-2xl font-black text-forest dark:text-ivory-warm">{profile?.faculty || 'Unknown'}</span>
          </Card>
        </div>
      </div>
    </div>
  );
};
