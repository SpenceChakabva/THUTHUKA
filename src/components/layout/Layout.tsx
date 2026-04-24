import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import { ShieldCheck, X } from 'lucide-react';
import { Button } from '../ui/Button';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const Layout: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [showCookieBanner, setShowCookieBanner] = useState(() => {
    return !localStorage.getItem('thuthuka_consent');
  });
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    if (mainRef.current) {
      gsap.fromTo(mainRef.current, 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, { dependencies: [location.pathname], scope: mainRef });

  const acceptConsent = () => {
    localStorage.setItem('thuthuka_consent', 'true');
    setShowCookieBanner(false);
  };

  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Outlet />
        {showCookieBanner && (
          <div className="fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
            <div className="max-w-[500px] mx-auto bg-forest text-ivory p-6 rounded-[2.5rem] shadow-2xl border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck className="text-terracotta" size={24} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-sm mb-1 uppercase tracking-widest">Tactical Sovereignty</h4>
                <p className="text-[12px] opacity-70 leading-relaxed">
                  We use LocalStorage to maintain your offline intelligence. No trackers. No cookies. Just pure performance.
                </p>
              </div>
              <Button size="sm" onClick={acceptConsent} className="bg-ivory text-forest hover:bg-ivory-warm whitespace-nowrap px-6">
                Understood
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ivory dark:bg-dark overflow-x-hidden">
      {isDesktop && <Sidebar />}
      <main ref={mainRef} className={`flex-1 flex flex-col w-full ${isDesktop ? 'ml-[220px]' : ''}`}>
        <div className={`flex-1 w-full max-w-[1200px] mx-auto p-4 sm:p-6 md:p-8 ${isDesktop ? 'lg:p-12' : 'pb-32'}`}>
          <Outlet />
        </div>
      </main>
      {!isDesktop && <BottomTabBar />}
      <footer className={`mt-auto py-4 px-6 text-center border-t border-ivory-deep dark:border-forest-darkpale text-[12px] text-text-muted ${isDesktop ? 'ml-[220px]' : 'pb-28'}`}>
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 opacity-60">
          <span>© 2026 Thuthuka Engine v2.4</span>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-terracotta transition-colors underline decoration-dotted">About Engine</Link>
            <Link to="/privacy" className="hover:text-terracotta transition-colors underline decoration-dotted">Data Sovereignty</Link>
          </div>
        </div>
      </footer>

      {showCookieBanner && (
        <div className="fixed bottom-24 left-6 right-6 lg:left-[244px] lg:bottom-6 z-[100] animate-in slide-in-from-bottom-10 duration-700">
          <div className="max-w-[450px] bg-white/80 dark:bg-forest-darkpale/90 backdrop-blur-xl p-5 rounded-[2rem] shadow-2xl border border-ivory-deep dark:border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-sage/10 text-sage rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-text-secondary dark:text-text-dark-secondary leading-tight">
                This engine uses LocalStorage for offline tactical persistence. 
                <Link to="/privacy" className="text-terracotta ml-1 font-bold hover:underline">Read Sovereignty Protocols</Link>
              </p>
            </div>
            <button onClick={acceptConsent} className="p-2 text-text-muted hover:text-forest transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
