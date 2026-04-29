import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, CalendarDays, Bot, User } from 'lucide-react';

const navItems = [
  { path: '/home', label: 'Home', icon: Home },
  { path: '/planner', label: 'Planner', icon: Bot },
  { path: '/accommodation', label: 'Accom', icon: MapPin },
  { path: '/exams', label: 'Exams', icon: CalendarDays },
  { path: '/profile', label: 'Profile', icon: User },
];

export const BottomTabBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-ivory dark:bg-dark-surface border-t border-ivory-deep dark:border-dark-border p-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))] grid grid-cols-5 gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-fast ease-out ${
              isActive 
                ? 'text-terracotta dark:text-terracotta-light font-semibold' 
                : 'text-text-muted dark:text-text-dark-muted'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={`w-[22px] h-[22px] transition-transform duration-fast ease-spring ${isActive ? '' : 'active:scale-90'}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
