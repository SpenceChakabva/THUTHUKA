import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'verified' | 'warning' | 'danger' | 'info' | 'neutral';
}

const variants = {
  verified: 'bg-sage-pale text-sage dark:bg-sage/10 dark:text-sage',
  warning: 'bg-amber-pale text-amber dark:bg-amber/10 dark:text-amber',
  danger: 'bg-clay-pale text-clay-red dark:bg-clay-red/10 dark:text-clay-red',
  info: 'bg-forest-pale text-forest-mid dark:bg-forest-light/10 dark:text-forest-light',
  neutral: 'bg-ivory-warm text-text-secondary dark:bg-dark-surface dark:text-text-dark-secondary',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'neutral', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1 text-xs font-semibold py-1 px-2.5 rounded-full tracking-wide ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
