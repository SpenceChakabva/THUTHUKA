import React from 'react';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className = '', selected, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`py-2.5 px-4.5 rounded-full border-2 text-[14px] font-medium cursor-pointer transition-all duration-fast ease-out active:scale-95 select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2
          ${selected 
            ? 'bg-terracotta border-terracotta text-ivory shadow-md dark:bg-terracotta dark:border-terracotta' 
            : 'bg-white border-ivory-deep text-text-primary hover:border-terracotta hover:bg-terracotta-pale dark:bg-dark-card dark:border-dark-border dark:text-text-dark-primary dark:hover:bg-dark-surface dark:hover:border-terracotta'
          } ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Chip.displayName = 'Chip';
