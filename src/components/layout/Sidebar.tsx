import React, { useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, MapPin, CalendarDays, Coins, User, Moon, Sun, Calendar, StickyNote, Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const navItems = [
  { path: '/home', label: 'Dashboard', icon: Home },
  { path: '/calendar', label: 'Schedule', icon: Calendar },
  { path: '/notes', label: 'Scratchpad', icon: StickyNote },
  { path: '/accommodation', label: 'Accommodation', icon: MapPin },
  { path: '/exams', label: 'Exams', icon: CalendarDays },
  { path: '/funding', label: 'Funding', icon: Coins },
  { path: '/about', label: 'Engine (About)', icon: Info },
  { path: '/profile', label: 'Profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const sidebarRef = useRef<HTMLElement>(null);

  // Temporarily disabled for visibility troubleshooting
  /* useGSAP(() => {
    gsap.from('.nav-link', {
      x: -20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.2
    });
  }, { scope: sidebarRef }); */

  return (
    <aside ref={sidebarRef} className="fixed top-0 left-0 bottom-0 w-[220px] bg-ivory-warm dark:bg-dark-surface border-r border-ivory-deep dark:border-dark-border p-6 flex flex-col z-50 shadow-xl lg:shadow-none animate-in fade-in slide-in-from-left-4 duration-700">
      <Link to="/" className="flex items-center gap-2 mb-10 px-2 group no-underline">
        <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center text-ivory font-black group-hover:scale-110 transition-transform">T</div>
        <div className="font-display text-xl font-bold text-forest dark:text-ivory-warm tracking-tighter">
          THUTHUKA
        </div>
      </Link>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all duration-slow ease-spring group hover:scale-[1.05] active:scale-95 ${
                isActive 
                  ? 'bg-terracotta text-ivory shadow-md ring-4 ring-terracotta/10' 
                  : 'text-text-secondary dark:text-text-dark-secondary hover:bg-white/50 dark:hover:bg-white/5 hover:text-text-primary dark:hover:text-text-dark-primary shadow-none'
              }`
            }
          >
            <item.icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-slow" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium w-full text-text-secondary dark:text-text-dark-secondary hover:bg-ivory-deep hover:text-text-primary dark:hover:bg-white/5 dark:hover:text-text-dark-primary transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
};
