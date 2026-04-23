import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, MapPin, CalendarDays, Coins, FileText } from 'lucide-react';
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
    <div ref={containerRef}>
      <header className="flex justify-between items-center mb-8 stagger-item">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary font-display m-0">
            Good morning{profile?.year ? `, ${profile.year}` : ''}.
          </h1>
        </div>
        <div className="flex gap-4">
          <button className="bg-transparent border-none text-text-secondary hover:text-text-primary hover:bg-ivory-warm dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-forest-darkpale cursor-pointer p-2 flex items-center justify-center rounded-full transition-all">
            <Bell size={24} />
          </button>
          <button className="bg-transparent border-none text-text-secondary hover:text-text-primary hover:bg-ivory-warm dark:text-text-dark-secondary dark:hover:text-text-dark-primary dark:hover:bg-forest-darkpale cursor-pointer p-2 flex items-center justify-center rounded-full transition-all" onClick={() => navigate('/profile')}>
            <UserCircle size={24} />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-8 stagger-item">
        <Card accent="warning" className="flex flex-col sm:flex-row gap-4 items-start mb-2">
          <div className="text-amber dark:text-amber-light bg-amber-pale dark:bg-amber-darkpale p-3 rounded-2xl">
            <banner.icon size={28} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-text-primary dark:text-text-dark-primary mb-2">
              {banner.headline}
            </h2>
            <p className="text-[15px] text-text-secondary dark:text-text-dark-secondary mb-4 max-w-[500px]">
              {banner.body}
            </p>
            <Button size="sm" onClick={() => navigate(banner.href)}>
              {banner.cta} →
            </Button>
          </div>
        </Card>

        <div>
          <h3 className="text-[16px] font-semibold text-text-secondary dark:text-text-dark-secondary mb-4 uppercase tracking-widest">
            Your tools
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card interactive className="flex flex-col gap-3 items-start p-4" onClick={() => navigate('/accommodation')}>
              <div className="text-terracotta dark:text-terracotta-light">
                <MapPin size={24} />
              </div>
              <span className="text-[15px] font-medium text-text-primary dark:text-text-dark-primary">Accom checker</span>
            </Card>
            <Card interactive className="flex flex-col gap-3 items-start p-4" onClick={() => navigate('/exams')}>
              <div className="text-terracotta dark:text-terracotta-light">
                <CalendarDays size={24} />
              </div>
              <span className="text-[15px] font-medium text-text-primary dark:text-text-dark-primary">Exams planner</span>
            </Card>
            <Card interactive className="flex flex-col gap-3 items-start p-4" onClick={() => navigate('/funding')}>
              <div className="text-terracotta dark:text-terracotta-light">
                <Coins size={24} />
              </div>
              <span className="text-[15px] font-medium text-text-primary dark:text-text-dark-primary">NSFAS calc</span>
            </Card>
            <Card interactive className="flex flex-col gap-3 items-start p-4" onClick={() => navigate('/funding')}>
              <div className="text-terracotta dark:text-terracotta-light">
                <FileText size={24} />
              </div>
              <span className="text-[15px] font-medium text-text-primary dark:text-text-dark-primary">Bursary finder</span>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-8 stagger-item">
        <h3 className="text-[16px] font-semibold text-text-secondary dark:text-text-dark-secondary mb-4 uppercase tracking-widest">
          Quick stats
        </h3>
        <Card className="flex flex-col gap-3 bg-ivory-warm dark:bg-ivory-dark">
          <div className="flex justify-between items-center text-sm border-b border-ivory-deep dark:border-forest-darkpale pb-2">
            <span className="text-text-secondary dark:text-text-dark-secondary">Budget:</span>
            <span className="font-semibold text-text-primary dark:text-text-dark-primary">R{profile?.budget?.toLocaleString() || '0'}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-ivory-deep dark:border-forest-darkpale pb-2">
            <span className="text-text-secondary dark:text-text-dark-secondary">NSFAS:</span>
            <span className="font-semibold text-text-primary dark:text-text-dark-primary">{profile?.nsfasStatus || 'Unknown'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-secondary dark:text-text-dark-secondary">Faculty:</span>
            <span className="font-semibold text-text-primary dark:text-text-dark-primary">{profile?.faculty || 'Unknown'}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
