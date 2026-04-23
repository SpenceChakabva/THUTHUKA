import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useProfile } from '../lib/store';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

type ResultType = 'verified' | 'not_found' | 'scam' | 'nsfas_warning' | null;

interface CheckResult {
  type: ResultType;
  landlord?: string;
  address?: string;
  askingPrice?: number;
  flags?: string[];
}

export const Accommodation: React.FC = () => {
  const { profile } = useProfile();
  const [listingText, setListingText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleCheck = contextSafe(() => {
    if (!listingText.trim()) return;
    
    setIsChecking(true);
    
    // If a result is already showing, hide it first
    if (result && resultRef.current) {
      gsap.to(resultRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        onComplete: runCheck
      });
    } else {
      runCheck();
    }
  });

  const runCheck = () => {
    setResult(null);

    // Mock API call
    setTimeout(() => {
      setIsChecking(false);
      
      const lower = listingText.toLowerCase();
      let newResult: CheckResult;
      
      if (lower.includes('scam') || lower.includes('deposit before')) {
        newResult = {
          type: 'scam',
          flags: [
            'Requires deposit before viewing',
            'No physical address provided',
            'Price unusually low for area'
          ]
        };
      } else if (lower.includes('private') && profile?.nsfasStatus?.includes('approved')) {
        newResult = { type: 'nsfas_warning' };
      } else if (lower.includes('trusted') || lower.includes('ocsas')) {
        newResult = {
          type: 'verified',
          landlord: 'J. Doe Properties',
          address: '12 Main Rd, Rondebosch',
          askingPrice: 4200
        };
      } else {
        newResult = { type: 'not_found', askingPrice: 5500 };
      }

      setResult(newResult);
    }, 1500);
  };

  useGSAP(() => {
    if (result && resultRef.current) {
      gsap.fromTo(resultRef.current,
        { opacity: 0, y: 16, clipPath: 'inset(8px 0 0 0 round 16px)' },
        { opacity: 1, y: 0, clipPath: 'inset(0 0 0 0 round 16px)', duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [result]);

  const renderResult = () => {
    if (!result) return null;

    const budget = profile?.budget || 4500;
    const isWithinBudget = result.askingPrice ? result.askingPrice <= budget : true;
    const gap = result.askingPrice ? result.askingPrice - budget : 0;

    switch (result.type) {
      case 'verified':
        return (
          <Card accent="verified" className="overflow-hidden p-0">
            <div className="flex items-center gap-3 p-4 px-6 bg-sage-pale text-sage dark:bg-sage-darkpale dark:text-sage-pale border-b border-sage/20 dark:border-sage-pale/20">
              <CheckCircle2 size={20} />
              <h3 className="m-0 text-inherit font-body text-base">OCSAS Accredited</h3>
            </div>
            <div className="p-6 text-[15px] text-text-primary dark:text-text-dark-primary leading-relaxed space-y-3">
              <p><strong>Landlord:</strong> {result.landlord}</p>
              <p><strong>Address:</strong> {result.address}</p>
              <p>OCSAS listing: Found — accredited since 2023</p>
              <hr className="border-0 border-t border-dashed border-ivory-deep dark:border-forest-darkpale my-4" />
              <p>Budget check:<br/>
                Asking R{result.askingPrice?.toLocaleString()}/month<br/>
                {isWithinBudget 
                  ? <span className="text-sage dark:text-sage-light font-medium">✓ Within your budget (R{budget.toLocaleString()})</span>
                  : <span className="text-amber dark:text-amber-light font-medium">⚠ Above your budget. Gap: R{gap.toLocaleString()}/month</span>
                }
              </p>
              <p>Lease flags: None detected</p>
            </div>
          </Card>
        );
      case 'not_found':
        return (
          <Card accent="warning" className="overflow-hidden p-0">
            <div className="flex items-center gap-3 p-4 px-6 bg-amber-pale text-amber dark:bg-amber-darkpale dark:text-amber-pale border-b border-amber/20 dark:border-amber-pale/20">
              <AlertTriangle size={20} />
              <h3 className="m-0 text-inherit font-body text-base">Not on OCSAS accredited list</h3>
            </div>
            <div className="p-6 text-[15px] text-text-primary dark:text-text-dark-primary leading-relaxed space-y-3">
              <p>This landlord was not found in the OCSAS database. That doesn't mean it's a scam — it means you should verify before signing.</p>
              <p><strong>What to do:</strong><br/>
                → Email OCSAS: res@uct.ac.za<br/>
                → Request an inspection before signing<br/>
                → Never pay a deposit before viewing in person
              </p>
              <hr className="border-0 border-t border-dashed border-ivory-deep dark:border-forest-darkpale my-4" />
              <p>Budget check: R{result.askingPrice?.toLocaleString()}/month<br/>
                {isWithinBudget 
                  ? <span className="text-sage dark:text-sage-light font-medium">✓ Within your budget.</span>
                  : <span className="text-amber dark:text-amber-light font-medium">⚠ Above your budget. Gap: R{gap.toLocaleString()}/month</span>
                }
              </p>
            </div>
          </Card>
        );
      case 'scam':
        return (
          <Card accent="danger" className="overflow-hidden p-0">
            <div className="flex items-center gap-3 p-4 px-6 bg-clay-pale text-clay-red dark:bg-clay-darkpale dark:text-clay-pale border-b border-clay-red/20 dark:border-clay-pale/20">
              <XCircle size={20} />
              <h3 className="m-0 text-inherit font-body text-base">High risk — multiple flags detected</h3>
            </div>
            <div className="p-6 text-[15px] text-text-primary dark:text-text-dark-primary leading-relaxed space-y-3">
              <p>Flags found:</p>
              <ul className="list-none p-0 m-0 text-clay-red dark:text-clay-light font-medium space-y-2 mb-4">
                {result.flags?.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <XCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
              <p>This listing shows common patterns of accommodation scams targeting UCT students. <strong>Do not transfer any money.</strong></p>
              <p>Report to: saps.gov.za or uct.ac.za/security</p>
            </div>
          </Card>
        );
      case 'nsfas_warning':
        return (
          <Card accent="info" className="overflow-hidden p-0">
            <div className="flex items-center gap-3 p-4 px-6 bg-forest-pale text-forest-mid dark:bg-forest-darkpale dark:text-forest-pale border-b border-forest-mid/20 dark:border-forest-pale/20">
              <Info size={20} />
              <h3 className="m-0 text-inherit font-body text-base">Accredited but requires NSFAS approval</h3>
            </div>
            <div className="p-6 text-[15px] text-text-primary dark:text-text-dark-primary leading-relaxed space-y-3">
              <p>The listing appears legitimate, but if you're NSFAS funded:</p>
              <p>
                → Private accommodation must be NSFAS-accredited<br/>
                → You must submit your lease to SFA before moving<br/>
                → Funding will not be paid for non-accredited private accommodation
              </p>
              <hr className="border-0 border-t border-dashed border-ivory-deep dark:border-forest-darkpale my-4" />
              <p>Your profile: NSFAS Approved<br/>
                Action required: Verify with SFA before signing
              </p>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="max-w-[800px]">
      <h1 className="text-3xl mb-2">Accommodation checker</h1>
      <p className="text-text-secondary dark:text-text-dark-secondary text-base mb-8 max-w-[600px]">
        Verify any listing against UCT's accredited landlord database before you sign anything.
      </p>

      <div>
        <div className="mb-6">
          <Textarea 
            placeholder="Paste anything — a WhatsApp message, a Gumtree link, an email, even a photo caption. We'll handle the rest."
            value={listingText}
            onChange={(e) => setListingText(e.target.value)}
          />
        </div>
        
        <Button 
          size="lg" 
          onClick={handleCheck} 
          isLoading={isChecking}
          disabled={!listingText.trim()}
          className="mb-8"
        >
          Check this listing →
        </Button>
      </div>

      <div ref={resultRef} className="mt-8">
        {result && (
          <>
            <hr className="border-0 border-t border-ivory-deep dark:border-forest-darkpale mb-8" />
            {renderResult()}
          </>
        )}
      </div>
    </div>
  );
};
