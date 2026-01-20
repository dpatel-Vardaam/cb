import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CategoryCardProps {
    title: string;
    slug: string;
    description: string;
    icon?: React.ReactNode;
    image?: string | null;
    gradient?: string;
    className?: string;
}

export function CategoryCard({
    title,
    slug,
    description,
    icon,
    image,
    gradient = 'from-emerald-500/20 to-cyan-500/20',
    className,
}: CategoryCardProps) {
    return (
        <Link
            href={`/categories/${slug}`}
            className={cn(
                'group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]/80 p-6 transition-all duration-500',
                'hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10',
                'cursor-pointer backdrop-blur-sm',
                className,
            )}
        >
            {/* Gradient overlay on hover */}
            <div
                className={cn(
                    'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                    gradient,
                )}
            />

            {/* Glow effect */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-emerald-500/20 opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-100" />

            {/* Shine effect on hover */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

            <div className="relative z-10">
                {/* Image or Icon */}
                {image ? (
                    <div className="mb-3 inline-flex size-50 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    icon && (
                        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            {icon}
                        </div>
                    )
                )}

                <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-emerald-400">
                    {title}
                </h3>

                <p className="mt-2 text-sm text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
                    {description}
                </p>

                <div className="mt-5 flex items-center gap-1 text-sm font-medium text-emerald-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span>Browse</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
