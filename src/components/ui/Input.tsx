import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-11 px-4 bg-ivory dark:bg-ivory-dark border-2 border-ivory-deep dark:border-forest-darkpale rounded-lg font-body text-[15px] text-text-primary dark:text-text-dark-primary transition-all duration-fast ease-out focus:outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 placeholder:text-text-muted dark:placeholder:text-text-dark-muted ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full min-h-[160px] p-4 bg-ivory dark:bg-ivory-dark border-2 border-ivory-deep dark:border-forest-darkpale rounded-2xl font-body text-[15px] text-text-primary dark:text-text-dark-primary leading-relaxed resize-y transition-all duration-fast ease-out focus:outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 placeholder:text-text-muted dark:placeholder:text-text-dark-muted ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
