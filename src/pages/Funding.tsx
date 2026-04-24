import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProfile } from '../lib/store';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, AlertTriangle, FileText, Copy } from 'lucide-react';

export const Funding: React.FC = () => {
  const { profile } = useProfile();
  const [activeTab, setActiveTab] = useState<'nsfas' | 'bursary'>('nsfas');
  const [rent, setRent] = useState(profile?.budget || 4500);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleTabChange = contextSafe((tab: 'nsfas' | 'bursary') => {
    if (tab === activeTab) return;
    
    gsap.to(contentRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        setActiveTab(tab);
      }
    });
  });

  useLayoutEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  const handleDraft = contextSafe(() => {
    setIsDrafting(true);
    setDraftResult('');
    setTimeout(() => {
      setDraftResult(`Dear Selection Committee,\n\nI am writing to express my strong interest in the ESKOM Engineering Bursary. As a ${profile?.year || 'student'} studying ${profile?.faculty || 'at UCT'} from ${profile?.homeProvince || 'South Africa'}, I am deeply committed to my academic journey despite financial constraints. Currently, I rely on NSFAS (${profile?.nsfasStatus || 'Pending'}) which unfortunately leaves a shortfall for my accommodation and living expenses.\n\nThis bursary would significantly alleviate my financial burden, allowing me to focus entirely on my rigorous coursework and achieve my academic goals.\n\nThank you for considering my application.`);
      setIsDrafting(false);
    }, 1500);
  });

  useGSAP(() => {
    if (draftResult && draftRef.current) {
      gsap.fromTo(draftRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [draftResult]);

  const nsfasCap = 4500;
  const gap = Math.max(0, rent - nsfasCap);

  const mockBursaries = [
    { name: 'ESKOM Engineering Bursary', match: '★★★★★ Strong match', upTo: 'R80,000/year', deadline: '30 June 2026' },
    { name: 'UCT GAP Funding', match: '★★★★☆ Good match', upTo: 'Tuition shortfall', deadline: 'Rolling' }
  ];

  return (
    <div ref={containerRef} className="max-w-[800px] mx-auto stagger-in">
      <div className="flex mb-6 border-b-2 border-ivory-deep dark:border-forest-darkpale relative">
        <button 
          className={`flex-1 bg-transparent border-none p-3 font-body font-semibold text-base cursor-pointer relative transition-colors ${activeTab === 'nsfas' ? 'text-terracotta dark:text-terracotta-light' : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'}`}
          onClick={() => handleTabChange('nsfas')}
        >
          NSFAS Calculator
          {activeTab === 'nsfas' && (
            <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-terracotta dark:bg-terracotta-light" />
          )}
        </button>
        <button 
          className={`flex-1 bg-transparent border-none p-3 font-body font-semibold text-base cursor-pointer relative transition-colors ${activeTab === 'bursary' ? 'text-terracotta dark:text-terracotta-light' : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'}`}
          onClick={() => handleTabChange('bursary')}
        >
          Bursary Finder
          {activeTab === 'bursary' && (
            <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-terracotta dark:bg-terracotta-light" />
          )}
        </button>
      </div>

      <div ref={contentRef}>
        {activeTab === 'nsfas' && (
          <div>
            <h1 className="text-3xl mb-2">NSFAS Calculator</h1>
            <p className="text-text-secondary dark:text-text-dark-secondary text-base mb-6">What will you actually receive each month?</p>

            <Card className="mb-6 p-4 bg-ivory-warm dark:bg-ivory-dark">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary dark:text-text-dark-secondary text-sm">
                  Faculty: {profile?.faculty || 'N/A'} · Year: {profile?.year || 'N/A'}
                </span>
                <Badge variant={profile?.nsfasStatus?.includes('approved') ? 'verified' : 'warning'}>
                  {profile?.nsfasStatus || 'Status Unknown'}
                </Badge>
              </div>
            </Card>

            <div className="mb-8">
              <label className="block font-semibold mb-3">Monthly rent: R{rent.toLocaleString()}</label>
              <Slider 
                min={0} max={10000} step={100} 
                value={rent} 
                onChange={(e) => setRent(parseInt(e.target.value))} 
              />
            </div>

            <Card className="mb-6">
              <h3 className="text-lg mb-4">Your monthly breakdown</h3>
              
              <div className="flex justify-between mb-2 text-[15px]">
                <span>Tuition bursary</span>
                <span className="text-text-muted dark:text-text-dark-muted">Paid directly to UCT</span>
              </div>
              <hr className="border-0 border-t border-dashed border-ivory-deep dark:border-forest-darkpale my-3" />
              <div className="flex justify-between mb-2 text-[15px]">
                <span>Accommodation allow.</span>
                <span>R{nsfasCap.toLocaleString()} <CheckCircle2 size={16} className="inline text-sage dark:text-sage-light" /></span>
              </div>
              <div className="flex justify-between mb-2 text-[15px]">
                <span>Food allowance</span>
                <span>R1,500 <CheckCircle2 size={16} className="inline text-sage dark:text-sage-light" /></span>
              </div>
              <div className="flex justify-between mb-2 text-[15px]">
                <span>Learning materials</span>
                <span className="text-text-muted dark:text-text-dark-muted">R5,460 (once per year)</span>
              </div>
              <hr className="border-0 border-t border-dashed border-ivory-deep dark:border-forest-darkpale my-3" />
              <div className="flex justify-between font-bold text-[15px]">
                <span>TOTAL per month</span>
                <span>R6,000</span>
              </div>
            </Card>

            <Card accent={gap > 0 ? "warning" : "verified"} className="mb-6">
              <h3 className="text-lg mb-4">Your gap</h3>
              <p className="text-[15px] mb-2">Actual rent (R{rent.toLocaleString()}) vs NSFAS allowance (R{nsfasCap.toLocaleString()})</p>
              
              {gap > 0 ? (
                <>
                  <p className="text-amber dark:text-amber-light font-semibold mt-2 flex items-center gap-2">
                    <AlertTriangle size={18} /> Shortfall: R{gap.toLocaleString()}/month · R{(gap * 10).toLocaleString()}/year
                  </p>
                  <p className="mt-4 text-[15px]"><strong>What to do:</strong><br/>
                    → Apply for UCT GAP funding<br/>
                    → Check the Bursary Finder
                  </p>
                </>
              ) : (
                <p className="text-sage dark:text-sage-light font-semibold mt-2 flex items-center gap-2">
                  <CheckCircle2 size={18} /> Your rent is fully covered.
                </p>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'bursary' && (
          <div>
            <h1 className="text-3xl mb-2">Bursary Finder</h1>
            <p className="text-text-secondary dark:text-text-dark-secondary text-base mb-6">Based on your profile, here are bursaries you may qualify for.</p>

            <div className="flex flex-col gap-4">
              {mockBursaries.map((b, idx) => (
                <Card key={idx}>
                  <h3 className="text-lg mb-2">{b.name}</h3>
                  <div className="flex flex-col gap-1 text-text-secondary dark:text-text-dark-secondary text-sm mb-4">
                    <span className="text-terracotta dark:text-terracotta-light font-semibold">{b.match}</span>
                    <span>Up to: {b.upTo}</span>
                    <span>Deadline: {b.deadline}</span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="sm">Apply →</Button>
                    <Button variant="ghost" size="sm" onClick={handleDraft} isLoading={isDrafting && !draftResult}>
                      <FileText size={16} /> Draft motivation
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {draftResult && (
              <div ref={draftRef} className="mt-6 overflow-hidden">
                <div className="bg-ivory-warm dark:bg-ivory-dark p-4 rounded-lg border border-ivory-deep dark:border-forest-darkpale">
                  <h4 className="mb-3 text-lg font-bold">Heuristic Draft Analysis</h4>
                  <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-text-primary dark:text-text-dark-primary mb-4">
                    {draftResult}
                  </pre>
                  <Button size="sm">
                    <Copy size={16} /> Copy to clipboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
