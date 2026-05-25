import * as React from 'react';
import { cn } from '~/lib/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-ash-800 bg-bg-inset px-3 py-1 text-sm',
        'placeholder:text-ash-500 text-ash-50',
        'transition-colors focus:border-ember-700 focus:outline-none focus:ring-1 focus:ring-ember-700/60',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
