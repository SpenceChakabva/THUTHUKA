import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProfile } from '../lib/store';
import { sendChatMessage, buildContext } from '../lib/ai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { Badge } from '../components/ui/Badge';
import { CheckCircle2, AlertTriangle, FileText, Copy, Check, ExternalLink } from 'lucide-react';

interface Bursary {
  name: string;
  provider: string;
  fields: string[];
  value: string;
  deadline: string;
  url: string;
  requirements: string;
}

const BURSARIES: Bursary[] = [
  {
    name: 'NSFAS Bursary',
    provider: 'National Student Financial Aid Scheme',
    fields: ['All faculties'],
    value: 'Full tuition + living allowances',
    deadline: '30 November (annually)',
    url: 'https://www.nsfas.org.za',
    requirements: 'SA citizen, household income under R350,000/year',
  },
  {
    name: 'Allan Gray Orbis Foundation Fellowship',
    provider: 'Allan Gray Orbis Foundation',
    fields: ['Commerce', 'Science', 'Engineering', 'Law'],
    value: 'Full tuition + mentorship + stipend',
    deadline: '1 March (annually)',
    url: 'https://www.allangrayorbis.org',
    requirements: 'SA citizen, strong academics, entrepreneurial mindset',
  },
  {
    name: 'Funza Lushaka Bursary',
    provider: 'Department of Basic Education',
    fields: ['Humanities (Education)'],
    value: 'Full cost of study',
    deadline: '31 January (annually)',
    url: 'https://www.funzalushaka.doe.gov.za',
    requirements: 'SA citizen, studying towards teaching qualification',
  },
  {
    name: 'Sasol Bursary Programme',
    provider: 'Sasol Limited',
    fields: ['Engineering', 'Science'],
    value: 'Full tuition + accommodation + book allowance',
    deadline: '31 March (annually)',
    url: 'https://www.sasol.com/careers/students-and-graduates',
    requirements: 'SA citizen, studying Chemical/Mechanical/Electrical Engineering or Chemistry',
  },
  {
    name: 'Anglo American Bursary',
    provider: 'Anglo American',
    fields: ['Engineering', 'Science'],
    value: 'Full tuition + living expenses',
    deadline: '30 April (annually)',
    url: 'https://www.angloamerican.com/careers/students',
    requirements: 'SA citizen, Mining/Mechanical/Electrical Engineering or Geology',
  },
  {
    name: 'Standard Bank Derek Cooper Scholarship',
    provider: 'Standard Bank',
    fields: ['Commerce', 'Science', 'Engineering'],
    value: 'Up to R120,000/year',
    deadline: '30 June (annually)',
    url: 'https://www.standardbank.com/sbg/standard-bank-group/careers/early-careers',
    requirements: 'SA citizen, academic merit, financial need',
  },
  {
    name: 'Old Mutual Education Trust Bursary',
    provider: 'Old Mutual',
    fields: ['Commerce', 'Science', 'Engineering', 'Health Sciences'],
    value: 'Up to R80,000/year',
    deadline: '30 September (annually)',
    url: 'https://www.oldmutual.co.za/about/responsible-business/education/',
    requirements: 'SA citizen, household income under R600,000/year',
  },
  {
    name: 'UCT Financial Aid (GAP Funding)',
    provider: 'University of Cape Town',
    fields: ['All faculties'],
    value: 'Covers tuition/accommodation shortfall',
    deadline: 'Rolling (apply via Student Financial Aid)',
    url: 'https://www.uct.ac.za/main/students/fees-funding',
    requirements: 'Registered UCT student with demonstrated financial need',
  },
  {
    name: 'Motsepe Foundation Bursary',
    provider: 'Motsepe Foundation',
    fields: ['All faculties'],
    value: 'Full tuition + living allowance',
    deadline: '31 August (annually)',
    url: 'https://www.motsepefoundation.org',
    requirements: 'SA citizen, academic merit, financial need, community involvement',
  },
  {
    name: 'Eskom Bursary Programme',
    provider: 'Eskom Holdings',
    fields: ['Engineering', 'Science'],
    value: 'Full tuition + accommodation + stipend',
    deadline: '30 September (annually)',
    url: 'https://www.eskom.co.za/careers/',
    requirements: 'SA citizen, Electrical/Mechanical/Civil Engineering or related Science degree',
  },
];

export const Funding: React.FC = () => {
  const { profile, exams, events } = useProfile();
  const [activeTab, setActiveTab] = useState<'nsfas' | 'bursary'>('nsfas');
  const [rent, setRent] = useState(profile?.budget || 4500);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState('');
  const [draftTarget, setDraftTarget] = useState('');
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleTabChange = contextSafe((tab: 'nsfas' | 'bursary') => {
    if (tab === activeTab) return;
    gsap.to(contentRef.current, {
      opacity: 0, y: 10, duration: 0.2,
      onComplete: () => setActiveTab(tab),
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

  const filteredBursaries = BURSARIES.filter(b => {
    if (!profile?.faculty) return true;
    return b.fields.includes('All faculties') || b.fields.includes(profile.faculty);
  });

  const handleDraft = async (bursaryName: string) => {
    setIsDrafting(true);
    setDraftResult('');
    setDraftTarget(bursaryName);

    const hasAI = profile?.apiKey || profile?.apiProvider === 'server';

    if (hasAI) {
      try {
        const context = buildContext(profile, exams, events);
        const data = await sendChatMessage({
          messages: [{
            role: 'user',
            content: `Write a concise, professional motivation letter for the "${bursaryName}" bursary application. Keep it under 250 words. Use a formal but warm tone. Include specific details from my profile. Do not use any emojis. Structure: Opening paragraph (who I am, what I'm studying), middle paragraph (why I need this bursary, my circumstances), closing paragraph (what I will achieve, gratitude). Sign off with "[Your Full Name]".`,
          }],
          context,
          ...(profile?.apiProvider && profile.apiProvider !== 'server' && profile?.apiKey
            ? { clientKey: profile.apiKey }
            : {}),
          ...(profile?.apiProvider === 'openai' ? { provider: 'openai' } : {}),
        });
        setDraftResult(data.message);
      } catch {
        // Fallback to template if AI fails
        setDraftResult(buildTemplateLetter(bursaryName));
      }
    } else {
      setDraftResult(buildTemplateLetter(bursaryName));
    }
    setIsDrafting(false);
  };

  const buildTemplateLetter = (bursaryName: string) => {
    return `Dear Selection Committee,

I am writing to apply for the ${bursaryName}. I am currently a ${profile?.year || '[year]'} student in the Faculty of ${profile?.faculty || '[faculty]'} at the University of Cape Town, from ${profile?.homeProvince || '[province]'}.

My NSFAS status is "${profile?.nsfasStatus || 'Pending'}", which ${profile?.nsfasStatus?.includes('approved') ? 'covers my tuition but leaves a shortfall for accommodation and living expenses' : 'does not fully cover my financial needs'}. My monthly accommodation budget is R${(profile?.budget || 4500).toLocaleString()}, and I face ongoing financial pressure that affects my ability to focus on my studies.

This bursary would allow me to dedicate myself fully to my academic work and contribute meaningfully to my field. I am committed to maintaining strong academic performance and giving back to my community upon graduation.

Thank you for considering my application. I would welcome the opportunity to discuss my candidacy further.

Yours sincerely,
[Your Full Name]
[Student Number]
[Contact Email]`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draftResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = draftResult;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  return (
    <div ref={containerRef} className="max-w-[800px] mx-auto stagger-in">
      <div className="flex mb-6 border-b-2 border-ivory-deep dark:border-forest-darkpale relative">
        <button
          className={`flex-1 bg-transparent border-none p-3 font-body font-semibold text-base cursor-pointer relative transition-colors ${activeTab === 'nsfas' ? 'text-terracotta dark:text-terracotta-light' : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'}`}
          onClick={() => handleTabChange('nsfas')}
        >
          NSFAS Calculator
          {activeTab === 'nsfas' && <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-terracotta dark:bg-terracotta-light" />}
        </button>
        <button
          className={`flex-1 bg-transparent border-none p-3 font-body font-semibold text-base cursor-pointer relative transition-colors ${activeTab === 'bursary' ? 'text-terracotta dark:text-terracotta-light' : 'text-text-secondary dark:text-text-dark-secondary hover:text-text-primary dark:hover:text-text-dark-primary'}`}
          onClick={() => handleTabChange('bursary')}
        >
          Bursary Finder
          {activeTab === 'bursary' && <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-terracotta dark:bg-terracotta-light" />}
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
                  Faculty: {profile?.faculty || 'N/A'} | Year: {profile?.year || 'N/A'}
                </span>
                <Badge variant={profile?.nsfasStatus?.includes('approved') ? 'verified' : 'warning'}>
                  {profile?.nsfasStatus || 'Status Unknown'}
                </Badge>
              </div>
            </Card>

            <div className="mb-8">
              <label className="block font-semibold mb-3">Monthly rent: R{rent.toLocaleString()}</label>
              <Slider min={0} max={10000} step={100} value={rent} onChange={(e) => setRent(parseInt(e.target.value))} />
            </div>

            <Card className="mb-6">
              <h3 className="text-lg mb-4">Your monthly breakdown</h3>
              <div className="flex justify-between mb-2 text-[15px]">
                <span>Tuition bursary</span>
                <span className="text-text-muted dark:text-text-dark-muted">Paid directly to UCT</span>
              </div>
              <hr className="border-0 border-t border-dashed border-ivory-deep dark:border-forest-darkpale my-3" />
              <div className="flex justify-between mb-2 text-[15px]">
                <span>Accommodation allowance</span>
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

            <Card accent={gap > 0 ? 'warning' : 'verified'} className="mb-6">
              <h3 className="text-lg mb-4">Your gap</h3>
              <p className="text-[15px] mb-2">Actual rent (R{rent.toLocaleString()}) vs NSFAS allowance (R{nsfasCap.toLocaleString()})</p>
              {gap > 0 ? (
                <>
                  <p className="text-amber dark:text-amber-light font-semibold mt-2 flex items-center gap-2">
                    <AlertTriangle size={18} /> Shortfall: R{gap.toLocaleString()}/month | R{(gap * 10).toLocaleString()}/year
                  </p>
                  <p className="mt-4 text-[15px]">
                    <strong>What to do:</strong><br />
                    -- Apply for UCT GAP funding<br />
                    -- Check the Bursary Finder tab
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
            <p className="text-text-secondary dark:text-text-dark-secondary text-base mb-2">
              {profile?.faculty
                ? `Showing bursaries matching "${profile.faculty}" faculty.`
                : 'Set your faculty in Profile to see personalised matches.'}
            </p>
            <p className="text-text-muted text-xs mb-6">
              {filteredBursaries.length} bursaries found | Deadlines are indicative -- always verify on the provider's website.
            </p>

            <div className="flex flex-col gap-4">
              {filteredBursaries.map((b, idx) => (
                <Card key={idx} className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary dark:text-text-dark-primary mb-1">{b.name}</h3>
                      <p className="text-xs text-text-muted">{b.provider}</p>
                    </div>
                    <Badge variant="info" className="shrink-0 ml-2">{b.fields[0]}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
                    <span><strong>Value:</strong> {b.value}</span>
                    <span><strong>Deadline:</strong> {b.deadline}</span>
                    <span className="col-span-2 mt-1 text-xs text-text-muted">{b.requirements}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => window.open(b.url, '_blank', 'noopener,noreferrer')} className="flex items-center gap-1.5">
                      <ExternalLink size={14} /> Visit site
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDraft(b.name)} isLoading={isDrafting && draftTarget === b.name} className="flex items-center gap-1.5">
                      <FileText size={14} /> Draft letter
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {draftResult && (
              <div ref={draftRef} className="mt-6 overflow-hidden">
                <Card className="p-6 bg-ivory-warm/60 dark:bg-dark-surface/60 border-none">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-text-primary dark:text-text-dark-primary">Motivation Letter Draft</h4>
                    <Button size="sm" variant="secondary" onClick={handleCopy} className="flex items-center gap-1.5">
                      {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap font-body text-sm leading-relaxed text-text-primary dark:text-text-dark-primary">
                    {draftResult}
                  </pre>
                  <p className="text-[11px] text-text-muted mt-4">
                    Review and personalise this draft before submitting. Replace placeholders in [brackets] with your details.
                  </p>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
