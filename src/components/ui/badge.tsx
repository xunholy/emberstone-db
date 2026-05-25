import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider',
  {
    variants: {
      tone: {
        default:   'border-ash-700 bg-ash-800/50 text-ash-200',
        ember:     'border-ember-700/60 bg-ember-900/40 text-ember-200',
        alliance:  'border-faction-alliance/60 bg-faction-alliance/15 text-blue-200',
        horde:     'border-faction-horde/60 bg-faction-horde/15 text-red-300',
        neutral:   'border-ash-700 bg-ash-800/50 text-ash-200',
        success:   'border-rarity-uncommon/50 bg-rarity-uncommon/10 text-rarity-uncommon',
        danger:    'border-red-800 bg-red-900/30 text-red-300'
      }
    },
    defaultVariants: { tone: 'default' }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, tone, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ tone }), className)} {...props} />
  )
);
Badge.displayName = 'Badge';
