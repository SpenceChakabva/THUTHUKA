import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  accent?: 'verified' | 'warning' | 'danger' | 'info';
}

const accents = {
  verified: 'border-l-4 border-l-sage dark:border-l-sage',
  warning: 'border-l-4 border-l-amber dark:border-l-amber',
  danger: 'border-l-4 border-l-clay-red dark:border-l-clay-red',
  info: 'border-l-4 border-l-forest-light dark:border-l-forest-light',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', interactive, accent, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white dark:bg-dark-card border border-ivory-deep dark:border-dark-border rounded-2xl p-6 shadow-card dark:shadow-dark-card ${
          interactive ? 'cursor-pointer transition-all duration-fast ease-out hover:-translate-y-1 hover:shadow-float dark:hover:shadow-dark-float' : ''
        } ${accent ? accents[accent] : ''} ${className}`}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
