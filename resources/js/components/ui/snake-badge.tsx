import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const snakeBadgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-secondary text-secondary-foreground',
                verified: 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
                pickup: 'border border-amber-500/30 bg-amber-500/10 text-amber-200',
                delivery: 'border border-sky-500/30 bg-sky-500/10 text-sky-200',
                negotiable: 'border border-border bg-muted/40 text-muted-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

interface SnakeBadgeProps
    extends HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof snakeBadgeVariants> {}

export function SnakeBadge({ className, variant, ...props }: SnakeBadgeProps) {
    return (
        <span
            className={cn(snakeBadgeVariants({ variant }), className)}
            {...props}
        />
    );
}
