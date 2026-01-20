import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Clock, Heart, MapPin, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SnakeBadge } from '@/components/ui/snake-badge';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

type Category = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    image?: string | null;
    gradient?: string;
};

type Listing = {
    id: number;
    uuid: string;
    slug?: string;
    seo_url?: string;
    title: string;
    description: string;
    price: string;
    location: string;
    state?: string;
    city?: string;
    species: string | null;
    morph: string | null;
    age: string | null;
    sex: string;
    images: string[] | null;
    status: string;
    is_negotiable: boolean;
    is_delivery_available: boolean;
    created_at: string;
    image_urls?: string[];
    user?: {
        id: number;
        name: string;
    };
};

type PaginatedListings = {
    data: Listing[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

type CategoryShowProps = {
    category: Category;
    listings: PaginatedListings;
    filters?: Record<string, unknown>;
};

type FiltersState = {
    q: string;
    location: string;
    min_price: string;
    max_price: string;
    negotiable: boolean;
    delivery: boolean;
};

function VerticalListingCard({ listing }: { listing: Listing }) {
    const [isLiked, setIsLiked] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US');
    };

    const coverImage =
        listing.image_urls && listing.image_urls.length > 0
            ? listing.image_urls[0]
            : null;

    const badges: string[] = [];
    if (listing.is_negotiable) badges.push('Negotiable');
    if (listing.is_delivery_available) badges.push('Delivery');

    return (
        <Link
            href={listing.seo_url ?? '#'}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]/80 transition-all duration-500 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                        <Sparkles className="h-12 w-12 text-zinc-700" />
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent opacity-60" />

                {/* Like button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLiked(!isLiked);
                    }}
                    className={cn(
                        'absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300',
                        isLiked
                            ? 'border-pink-500/50 bg-pink-500/20 text-pink-400'
                            : 'border-white/20 bg-black/30 text-white hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-400',
                    )}
                >
                    <Heart
                        className={cn(
                            'h-4 w-4 transition-transform',
                            isLiked && 'scale-110 fill-current',
                        )}
                    />
                </button>

                {/* Price tag */}
                <div className="absolute bottom-3 left-3">
                    <div className="rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                        <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-lg font-bold text-transparent">
                            ${parseFloat(listing.price).toLocaleString('en-US')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
                {/* Title */}
                <h3 className="line-clamp-2 text-base font-semibold text-white transition-colors duration-300 group-hover:text-emerald-300">
                    {listing.title}
                </h3>

                {/* Species & Morph */}
                {(listing.species || listing.morph) && (
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                        {[listing.species, listing.morph]
                            .filter(Boolean)
                            .join(' • ')}
                    </p>
                )}

                {/* Meta info */}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {listing.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(listing.created_at)}
                    </span>
                </div>

                {/* Badges */}
                {badges.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {badges.map((badge) => (
                            <SnakeBadge
                                key={badge}
                                variant={
                                    badge === 'Negotiable'
                                        ? 'negotiable'
                                        : 'delivery'
                                }
                                className="text-xs"
                            >
                                {badge}
                            </SnakeBadge>
                        ))}
                    </div>
                )}

                {/* Seller info */}
                {listing.user && (
                    <div className="mt-auto pt-3">
                        <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-medium text-emerald-400">
                                {listing.user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-zinc-500">
                                {listing.user.name}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}

export default function CategoryShow({
    category,
    listings,
    filters = {},
}: CategoryShowProps) {
    const [form, setForm] = useState<FiltersState>({
        q: (filters.q as string | undefined) ?? '',
        location: (filters.location as string | undefined) ?? '',
        min_price: (filters.min_price as string | undefined) ?? '',
        max_price: (filters.max_price as string | undefined) ?? '',
        negotiable: Boolean(filters.negotiable),
        delivery: Boolean(filters.delivery),
    });

    const updateField = (key: keyof typeof form, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const submitFilters = () => {
        router.get(
            `/categories/${category.slug}`,
            {
                ...form,
                q: form.q || undefined,
                location: form.location || undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const clearFilters = () => {
        setForm({
            q: '',
            location: '',
            min_price: '',
            max_price: '',
            negotiable: false,
            delivery: false,
        });
        router.get(`/categories/${category.slug}`, undefined, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const cards = useMemo(() => listings.data, [listings.data]);

    return (
        <div className="dark min-h-screen bg-[#0a0a0f] text-white">
            <Head title={`${category.title} - Snake Market`} />

            {/* Background Effects */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d14] to-[#0a0a0f]" />
                <div className="absolute -top-40 left-1/4 h-150 w-150 animate-pulse rounded-full bg-emerald-500/8 blur-[150px]" />
                <div
                    className="absolute top-1/3 -right-20 h-125 w-125 rounded-full bg-violet-500/8 blur-[150px]"
                    style={{ animation: 'pulse 4s ease-in-out infinite' }}
                />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-2xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={home()}
                            className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="hidden sm:inline">Back</span>
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-semibold">
                                {category.title}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8">
                {/* Category Header */}
                <div className="mb-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white md:text-4xl">
                                {category.title}
                            </h1>
                            {category.description && (
                                <p className="mt-2 text-zinc-400">
                                    {category.description}
                                </p>
                            )}
                            <p className="mt-1 text-sm text-zinc-500">
                                {listings.total} listing
                                {listings.total !== 1 ? 's' : ''} available
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                asChild
                                className="border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                            >
                                <Link href="/listings/create">
                                    Post a Listing
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
                    {/* Filters */}
                    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:sticky lg:top-20 lg:h-fit">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs tracking-wide text-zinc-400 uppercase">
                                    Search
                                </Label>
                                <Input
                                    value={form.q}
                                    onChange={(e) =>
                                        updateField('q', e.target.value)
                                    }
                                    placeholder="Search listings"
                                    className="h-10 border-white/10 bg-[#0f0f15] text-white placeholder:text-zinc-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') submitFilters();
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs tracking-wide text-zinc-400 uppercase">
                                    Location
                                </Label>
                                <Input
                                    value={form.location}
                                    onChange={(e) =>
                                        updateField('location', e.target.value)
                                    }
                                    placeholder="City or region"
                                    className="h-10 border-white/10 bg-[#0f0f15] text-white placeholder:text-zinc-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-xs tracking-wide text-zinc-400 uppercase">
                                        Min Price
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.min_price}
                                        onChange={(e) =>
                                            updateField(
                                                'min_price',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0"
                                        className="h-10 border-white/10 bg-[#0f0f15] text-white placeholder:text-zinc-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs tracking-wide text-zinc-400 uppercase">
                                        Max Price
                                    </Label>
                                    <Input
                                        type="number"
                                        value={form.max_price}
                                        onChange={(e) =>
                                            updateField(
                                                'max_price',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="100000"
                                        className="h-10 border-white/10 bg-[#0f0f15] text-white placeholder:text-zinc-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 text-sm text-white">
                                    <Checkbox
                                        checked={form.negotiable}
                                        onCheckedChange={(checked) =>
                                            updateField(
                                                'negotiable',
                                                Boolean(checked),
                                            )
                                        }
                                        className="border-white/20 bg-[#0f0f15] hover:cursor-pointer"
                                    />
                                    Negotiable
                                </label>
                                <label className="flex items-center gap-2 text-sm text-white">
                                    <Checkbox
                                        checked={form.delivery}
                                        onCheckedChange={(checked) =>
                                            updateField(
                                                'delivery',
                                                Boolean(checked),
                                            )
                                        }
                                        className="border-white/20 bg-[#0f0f15] hover:cursor-pointer"
                                    />
                                    Delivery
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={submitFilters}
                                    className="flex-1 bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:cursor-pointer"
                                >
                                    Apply
                                </Button>
                                <Button
                                    onClick={clearFilters}
                                    variant="outline"
                                    className="flex-1 border-white/30 text-white hover:cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-500/10"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </aside>

                    {/* Listings Grid - 3 columns */}
                    {cards.length > 0 ? (
                        <section className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {cards.map((listing, index) => (
                                    <div
                                        key={listing.id}
                                        className="animate-in duration-500 fade-in slide-in-from-bottom-4"
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                        }}
                                    >
                                        <VerticalListingCard
                                            listing={listing}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {listings.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex items-center gap-2">
                                        {listings.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={cn(
                                                    'flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-all',
                                                    link.active
                                                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                                                        : link.url
                                                          ? 'border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                                                          : 'cursor-not-allowed text-zinc-600',
                                                )}
                                                preserveState
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                                <Sparkles className="h-10 w-10 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">
                                No listings yet
                            </h3>
                            <p className="mt-2 max-w-sm text-zinc-500">
                                Be the first to list in {category.title}! Create
                                a listing and reach thousands of buyers.
                            </p>
                            <Button
                                asChild
                                className="mt-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25"
                            >
                                <Link href="/listings/create">
                                    Create a Listing
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
