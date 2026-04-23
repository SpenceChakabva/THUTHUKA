import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';

export const Layout: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <div className="flex flex-col min-h-screen">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {isDesktop && <Sidebar />}
      <main className={`flex-1 flex flex-col ${isDesktop ? 'ml-[220px]' : ''}`}>
        <div className={`flex-1 w-full max-w-[1200px] mx-auto p-6 ${isDesktop ? 'lg:p-12' : 'pb-24'}`}>
          <Outlet />
        </div>
      </main>
      {!isDesktop && <BottomTabBar />}
    </div>
  );
};
