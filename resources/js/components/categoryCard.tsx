import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

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
                'group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]/80 p-4 transition-all duration-500',
                'hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10',
                'cursor-pointer backdrop-blur-sm',
                className,
            )}
        >
            {/* Gradient overlay */}
            <div
                className={cn(
                    'pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                    gradient,
                )}
            />

            {/* Glow */}
            <div className="pointer-events-none absolute -top-12 -right-12 h-24 w-24 rounded-full bg-emerald-500/20 opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-100" />

            {/* Shine */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

            <div className="relative z-10">
                {/* BIG SQUARE IMAGE */}
                {image ? (
                    <div className="mb-3 aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <img
                            src={image}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ) : (
                    icon && (
                        <div className="mb-3 flex aspect-square w-full items-center justify-center rounded-xl bg-primary/10 text-primary">
                            {icon}
                        </div>
                    )
                )}

                {/* COMPACT TEXT */}
                <h3 className="text-sm font-semibold text-white transition-colors group-hover:text-emerald-400">
                    {title}
                </h3>

                <p className="mt-1 line-clamp-1 text-xs text-zinc-500 transition-colors group-hover:text-zinc-400">
                    {description}
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-400 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <span>Browse</span>
                    <ChevronRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
