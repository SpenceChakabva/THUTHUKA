import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variants = {
  primary: 'bg-terracotta text-ivory hover:bg-terracotta-light hover:shadow-float shadow-md disabled:hover:bg-terracotta disabled:hover:shadow-none dark:bg-terracotta dark:text-ivory dark:hover:bg-terracotta-light',
  secondary: 'bg-ivory-warm text-text-primary border-2 border-ivory-deep hover:bg-ivory-deep hover:border-forest-light dark:bg-dark-card dark:border-dark-border dark:text-text-dark-primary dark:hover:bg-dark-surface',
  ghost: 'bg-transparent text-text-secondary hover:bg-ivory-warm hover:text-text-primary dark:text-text-dark-secondary dark:hover:bg-dark-surface dark:hover:text-text-dark-primary',
  danger: 'bg-clay-pale text-clay-red border-2 border-clay-red/20 hover:bg-clay-red hover:text-text-inverse dark:bg-dark-card dark:text-clay-red dark:border-clay-red/20 dark:hover:bg-clay-red dark:hover:text-ivory',
};

const sizes = {
  sm: 'text-[13px] py-2 px-4',
  md: 'text-[15px] py-3 px-6',
  lg: 'text-[16px] py-3.5 px-7',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-body font-semibold rounded-full whitespace-nowrap transition-all duration-normal ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
