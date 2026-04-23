import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, CalendarDays, Coins, User, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/accommodation', label: 'Accommodation', icon: MapPin },
  { path: '/exams', label: 'Exams', icon: CalendarDays },
  { path: '/funding', label: 'Funding', icon: Coins },
  { path: '/profile', label: 'Profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[220px] bg-ivory-warm dark:bg-ivory-dark border-r border-ivory-deep dark:border-forest-darkpale p-6 flex flex-col z-50">
      <div className="font-display text-xl font-bold text-terracotta dark:text-terracotta-light tracking-tight mb-8 px-2">
        THUTHUKA
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-fast ease-out ${
                isActive 
                  ? 'bg-terracotta-pale text-terracotta dark:bg-terracotta-darkpale dark:text-terracotta-light font-semibold' 
                  : 'text-text-secondary hover:bg-ivory-deep hover:text-text-primary dark:text-text-dark-secondary dark:hover:bg-forest-darkpale dark:hover:text-text-dark-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium w-full text-text-secondary hover:bg-ivory-deep hover:text-text-primary dark:text-text-dark-secondary dark:hover:bg-forest-darkpale dark:hover:text-text-dark-primary transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
};
