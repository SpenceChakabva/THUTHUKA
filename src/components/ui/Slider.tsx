import React from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        className={`w-full h-1 bg-ivory-deep dark:bg-forest-darkpale rounded-full appearance-none outline-none accent-terracotta dark:accent-terracotta-light cursor-pointer ${className}`}
        {...props}
      />
    );
  }
);

Slider.displayName = 'Slider';
