import { Link, router } from '@inertiajs/react';
import { ChevronRight, Clock, Heart, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { SnakeBadge } from '@/components/ui/snake-badge';
import { cn } from '@/lib/utils';
import wishlists from '@/routes/wishlists';

interface ListingCardProps {
    id: string;
    title: string;
    url: string;
    category: string;
    price: number;
    location: string;
    posted: string;
    image?: string | null;
    badges?: string[];
    className?: string;
    isWishlisted?: boolean;
}

function getBadgeVariant(badge: string) {
    const lower = badge.toLowerCase();
    if (lower.includes('verified')) return 'verified';
    if (lower.includes('pickup')) return 'pickup';
    if (lower.includes('delivery')) return 'delivery';
    if (lower.includes('negotiable')) return 'negotiable';
    return 'default';
}

export function ListingCard({
    id,
    title,
    url,
    category,
    price,
    location,
    posted,
    image,
    badges = [],
    className,
    isWishlisted = false,
}: ListingCardProps) {
    const [isLiked, setIsLiked] = useState(isWishlisted);

    useEffect(() => {
        setIsLiked(isWishlisted);
    }, [isWishlisted]);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent triggering the parent Link if wrapped in one
        e.stopPropagation();

        // 1. Optimistic UI Update (Immediate visual feedback)
        const previousState = isLiked;
        const nextState = !isLiked;
        setIsLiked(nextState);

        // 2. Send request to backend
        const options = {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                // Optional: Toast notification here
            },
            onError: () => {
                setIsLiked(previousState);
            },
        };

        if (nextState) {
            router.post(wishlists.store().url, { listing_id: id }, options);
            return;
        }

        router.delete(wishlists.destroy(id).url, options);
    };
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]/80 transition-all duration-500',
                'hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10',
                'backdrop-blur-sm',
                className,
            )}
        >
            {/* Gradient overlay on hover */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-cyan-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Glow effect */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-emerald-500/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
                    {/* Image */}
                    <div className="md:w-40">
                        <div className="relative h-40 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
                            {image ? (
                                <img
                                    src={image}
                                    alt={title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-900 text-zinc-600">
                                    <MapPin className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between gap-4">
                        {/* Header with price and like button */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <h3 className="line-clamp-2 text-base font-semibold text-white transition-colors duration-300 group-hover:text-emerald-300">
                                    {title}
                                </h3>

                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400">
                                        {category}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {location}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        {posted}
                                    </span>
                                </div>
                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-2">
                                <button
                                    onClick={toggleWishlist}
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300',
                                        isLiked
                                            ? 'border-pink-500/50 bg-pink-500/20 text-pink-400'
                                            : 'border-white/10 bg-white/5 text-zinc-500 hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-400',
                                    )}
                                >
                                    <Heart
                                        className={cn(
                                            'h-4 w-4 transition-transform',
                                            isLiked && 'scale-110 fill-current',
                                        )}
                                    />
                                </button>
                                <div className="text-right">
                                    <div className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-xl font-bold text-transparent">
                                        {'$'}
                                        {price.toLocaleString('en-US')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Badges */}
                        {badges.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {badges.map((badge) => (
                                    <SnakeBadge
                                        key={badge}
                                        variant={getBadgeVariant(badge)}
                                    >
                                        {badge}
                                    </SnakeBadge>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                            <Link
                                href={url}
                                className="group inline-flex items-center gap-1 rounded-2xl px-3 py-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
                            >
                                <span>View Details</span>
                                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>

                            <Button
                                size="sm"
                                className="bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30"
                            >
                                Contact Seller
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
