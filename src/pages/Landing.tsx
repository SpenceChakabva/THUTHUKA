import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { MapPin, CalendarDays, Coins, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Chip } from '../components/ui/Chip';
import { Slider } from '../components/ui/Slider';
import { useProfile } from '../lib/store';

gsap.registerPlugin(TextPlugin);

const profileSteps = [
  {
    id: 'faculty',
    question: 'What faculty are you in?',
    type: 'select-chips',
    options: ['Commerce', 'Engineering', 'Humanities', 'Health Sciences', 'Law', 'Science'],
  },
  {
    id: 'year',
    question: 'What year are you in?',
    type: 'select-chips',
    options: ['1st year', '2nd year', '3rd year', '4th year', 'Honours', 'Masters', 'PhD'],
  },
  {
    id: 'nsfasStatus',
    question: 'Are you NSFAS funded?',
    type: 'select-chips',
    options: ['Yes — approved', 'Pending / applied', 'Not applicable', 'Declined'],
  },
  {
    id: 'budget',
    question: "What's your monthly accommodation budget?",
    type: 'slider',
    min: 1000,
    max: 12000,
    step: 100,
    unit: 'ZAR',
    hint: 'NSFAS accommodation cap is R4,500/month',
  },
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempProfile, setTempProfile] = useState<Record<string, any>>({ budget: 4500 });

  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const setupRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const typingTextRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(() => {
    // Typing animation for the hero text
    if (typingTextRef.current) {
      gsap.to(typingTextRef.current, {
        duration: 1.5,
        text: "your move.",
        ease: "none",
        delay: 0.5
      });
    }

    // Initial page load animation
    gsap.fromTo('.stagger-item', 
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }, { scope: containerRef });

  const handleStart = contextSafe(() => {
    // Morph from intro to setup
    const tl = gsap.timeline({
      onComplete: () => setIsSettingUp(true)
    });

    tl.to(introRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.in'
    });

    if (window.innerWidth >= 1024) {
      tl.to(rightColRef.current, {
        x: '20%',
        opacity: 0.5,
        duration: 0.8,
        ease: 'power3.inOut'
      }, "<");
    }
  });

  useGSAP(() => {
    if (isSettingUp && setupRef.current) {
      gsap.fromTo(setupRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isSettingUp]);

  useGSAP(() => {
    if (isSettingUp && stepContentRef.current) {
      gsap.fromTo(stepContentRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [currentStep, isSettingUp]);

  const advanceStep = contextSafe(() => {
    if (currentStep < profileSteps.length - 1) {
      gsap.to(stepContentRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => setCurrentStep(prev => prev + 1)
      });
    } else {
      updateProfile(tempProfile);
      navigate('/home');
    }
  });

  const handleOptionSelect = (id: string, value: string) => {
    setTempProfile((prev) => ({ ...prev, [id]: value }));
    setTimeout(() => {
      advanceStep();
    }, 300);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempProfile((prev) => ({ ...prev, budget: parseInt(e.target.value) }));
  };

  return (
    <div ref={containerRef} className="max-w-[1200px] mx-auto min-h-full flex flex-col pt-8 pb-12 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-start lg:items-center mb-12 lg:mb-16 flex-1">
        
        {/* Left Column */}
        <div className="flex flex-col w-full">
          <h1 className="text-[clamp(36px,8vw,64px)] font-display font-bold text-forest dark:text-ivory-warm tracking-tight leading-[1.05] mb-8 stagger-item">
            Your UCT,<br />
            <span ref={typingTextRef} className="text-terracotta dark:text-terracotta-light inline-block min-h-[1.2em]"></span>
            <span className="animate-pulse inline-block w-1 h-[0.8em] bg-terracotta dark:bg-terracotta-light ml-1 align-baseline"></span>
          </h1>

          {/* Wrapper for overlap without collapsing using CSS Grid */}
          <div className="grid grid-cols-1 grid-rows-1 w-full">
            {!isSettingUp && (
              <div ref={introRef} className="col-start-1 row-start-1 w-full flex flex-col items-start">
                <p className="text-base sm:text-lg md:text-xl text-text-secondary dark:text-text-dark-secondary max-w-[480px] leading-relaxed mb-8 stagger-item">
                  From finding a flat to planning your finals — Thuthuka handles the admin so you can focus on what matters.
                </p>
                <Button size="lg" onClick={handleStart} className="stagger-item shadow-md w-auto px-8">
                  Start — 60 seconds
                </Button>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-5 text-[13px] sm:text-[14px] text-text-muted dark:text-text-dark-muted font-medium stagger-item">
                  <span>✓ No signup</span>
                  <span className="text-ivory-deep dark:text-forest-darkpale">·</span>
                  <span>✓ Free forever</span>
                  <span className="text-ivory-deep dark:text-forest-darkpale">·</span>
                  <span>✓ 60 sec setup</span>
                </div>
              </div>
            )}

            {isSettingUp && (
              <div ref={setupRef} className="col-start-1 row-start-1 w-full">
                <div className="text-sm font-semibold uppercase tracking-wider text-terracotta dark:text-terracotta-light mb-4">
                  Step {currentStep + 1} of {profileSteps.length}
                </div>
                
                <div ref={stepContentRef}>
                  <h2 className="text-2xl sm:text-3xl font-display text-text-primary dark:text-text-dark-primary mb-6 lg:mb-8 max-w-[500px] leading-tight">
                    {profileSteps[currentStep].question}
                  </h2>
                  
                  {profileSteps[currentStep].type === 'select-chips' && (
                    <div className="flex flex-wrap gap-3 max-w-[500px]">
                      {profileSteps[currentStep].options?.map((opt) => (
                        <Chip
                          key={opt}
                          selected={tempProfile[profileSteps[currentStep].id] === opt}
                          onClick={() => handleOptionSelect(profileSteps[currentStep].id, opt)}
                          className="px-5 py-3 text-[15px]"
                        >
                          {opt}
                        </Chip>
                      ))}
                    </div>
                  )}

                  {profileSteps[currentStep].type === 'slider' && (
                    <div className="max-w-[400px]">
                      <div className="text-3xl font-mono font-medium text-text-primary dark:text-text-dark-primary mb-8 tracking-tight">
                        R {tempProfile.budget.toLocaleString()} <span className="text-lg text-text-secondary dark:text-text-dark-secondary font-body">/ month</span>
                      </div>
                      <Slider
                        min={profileSteps[currentStep].min}
                        max={profileSteps[currentStep].max}
                        step={profileSteps[currentStep].step}
                        value={tempProfile.budget}
                        onChange={handleSliderChange}
                      />
                      <div className="mt-4 text-[14px] text-text-muted dark:text-text-dark-muted font-medium">
                        {profileSteps[currentStep].hint}
                      </div>
                      <Button size="lg" onClick={advanceStep} className="mt-8 w-auto px-8 shadow-md">
                        Complete Setup
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column (Illustration) */}
        <div ref={rightColRef} className="hidden lg:flex justify-end items-center">
          <div className="w-full max-w-[440px] aspect-square bg-ivory-warm dark:bg-ivory-dark rounded-3xl flex items-center justify-center relative overflow-hidden stagger-item shadow-sm">
            <div className="w-[150%] h-[150%] bg-terracotta-pale dark:bg-terracotta-darkpale rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[morph_8s_ease-in-out_infinite_alternate] shadow-inner"></div>
          </div>
        </div>
      </div>

      {/* Tools Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-item">
        <Card interactive onClick={() => navigate('/accommodation')} className="p-4 sm:p-6 flex flex-col h-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-terracotta-pale dark:bg-terracotta-darkpale text-terracotta dark:text-terracotta-light rounded-xl flex items-center justify-center mb-3 sm:mb-5">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[15px] sm:text-[20px] font-semibold text-text-primary dark:text-text-dark-primary mb-1 sm:mb-2 leading-tight">"Is this listing real?"</h3>
          <p className="text-[12px] sm:text-[15px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto">Verify against OCSAS.</p>
        </Card>
        <Card interactive onClick={() => navigate('/exams')} className="p-4 sm:p-6 flex flex-col h-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-terracotta-pale dark:bg-terracotta-darkpale text-terracotta dark:text-terracotta-light rounded-xl flex items-center justify-center mb-3 sm:mb-5">
            <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[15px] sm:text-[20px] font-semibold text-text-primary dark:text-text-dark-primary mb-1 sm:mb-2 leading-tight">"3 exams in 4 days."</h3>
          <p className="text-[12px] sm:text-[15px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto">Build a plan.</p>
        </Card>
        <Card interactive onClick={() => navigate('/funding')} className="p-4 sm:p-6 flex flex-col h-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-terracotta-pale dark:bg-terracotta-darkpale text-terracotta dark:text-terracotta-light rounded-xl flex items-center justify-center mb-3 sm:mb-5">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[15px] sm:text-[20px] font-semibold text-text-primary dark:text-text-dark-primary mb-1 sm:mb-2 leading-tight">"How much will I get?"</h3>
          <p className="text-[12px] sm:text-[15px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto">Calculate your gap.</p>
        </Card>
        <Card interactive onClick={() => navigate('/funding')} className="p-4 sm:p-6 flex flex-col h-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-terracotta-pale dark:bg-terracotta-darkpale text-terracotta dark:text-terracotta-light rounded-xl flex items-center justify-center mb-3 sm:mb-5">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-display text-[15px] sm:text-[20px] font-semibold text-text-primary dark:text-text-dark-primary mb-1 sm:mb-2 leading-tight">"What else can I apply for?"</h3>
          <p className="text-[12px] sm:text-[15px] text-text-secondary dark:text-text-dark-secondary leading-relaxed m-0 mt-auto">Find bursaries.</p>
        </Card>
      </div>

      <style>{`
        @keyframes morph {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          100% { border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; }
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
