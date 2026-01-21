import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Clock, Heart, Map, MapPin } from 'lucide-react';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import wishlists from '@/routes/wishlists';

const formatCityName = (city?: string | null) =>
    city ? city.replace(/[_-]/g, ' ') : '';

type Listing = {
    uuid: string;
    slug?: string;
    seo_url?: string;
    title: string;
    price: string;
    state: string;
    city: string;
    images: string[] | null;
    image_urls?: string[];
    is_negotiable: boolean;
    is_delivery_available: boolean;
    created_at: string;
    category?: {
        title: string;
        slug: string;
    };
};

type WishlistIndexProps = {
    listings: Listing[];
};

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US');
}

export default function WishlistIndex({ listings = [] }: WishlistIndexProps) {
    const cards = listings.map((listing) => {
        const badges: string[] = [];
        if (listing.is_negotiable) badges.push('Negotiable');
        if (listing.is_delivery_available) badges.push('Delivery');

        const coverImage =
            listing.image_urls?.[0] ||
            (listing.images?.[0]
                ? `/storage/listings/${listing.slug}/${listing.images[0]}`
                : undefined);

        return {
            uuid: listing.uuid,
            title: listing.title,
            category: listing.category?.title ?? 'Uncategorized',
            price: parseFloat(listing.price),
            state: listing.state,
            city: listing.city,
            url:
                listing.seo_url ??
                (listing.slug
                    ? `/listing/${slugify(listing.state)}/${slugify(
                          listing.city,
                      )}/${slugify(
                          listing.category?.slug ??
                              listing.category?.title ??
                              'reptiles',
                      )}/${listing.slug}`
                    : '#'),
            posted: formatRelativeTime(listing.created_at),
            badges,
            image: coverImage,
        };
    });

    const removeFromWishlist = (e: React.MouseEvent, listingId: string) => {
        e.preventDefault();
        e.stopPropagation();

        router.delete(wishlists.destroy(listingId).url, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Header />
            <div className="dark min-h-screen bg-[#0a0a0f] text-white">
                <Head title="Wishlist" />

                <main className="mx-auto w-full max-w-7xl px-4 py-10">
                    <header className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm tracking-[0.2em] text-emerald-400 uppercase">
                                Saved items
                            </p>
                            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                                Wishlist
                            </h1>
                            <p className="mt-2 text-sm text-zinc-500">
                                {cards.length > 0
                                    ? `You have ${cards.length} saved listing${
                                          cards.length === 1 ? '' : 's'
                                      }.`
                                    : 'You have no saved listings yet.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                asChild
                                className="border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                            >
                                <Link
                                    href="/listings"
                                    className="flex items-center text-white"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Browse listings
                                </Link>
                            </Button>
                        </div>
                    </header>

                    {cards.length === 0 ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-zinc-400">
                            Start exploring the marketplace and tap the heart to
                            save listings.
                        </div>
                    ) : (
                        <section className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {cards.map((card) => (
                                    <Link
                                        key={card.uuid}
                                        href={card.url}
                                        className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]/80 shadow-lg shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:shadow-emerald-500/20"
                                    >
                                        <div className="relative h-52 w-full overflow-hidden bg-[#0f0f15]">
                                            {card.image ? (
                                                <img
                                                    src={card.image}
                                                    alt={card.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                                                    <MapPin className="h-8 w-8" />
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(e) =>
                                                    removeFromWishlist(
                                                        e,
                                                        card.uuid,
                                                    )
                                                }
                                                className={cn(
                                                    'absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300',
                                                    'border-pink-500/50 bg-pink-500/20 text-pink-400 hover:bg-pink-500/30',
                                                )}
                                                aria-label="Remove from wishlist"
                                            >
                                                <Heart className="h-4 w-4 fill-current" />
                                            </button>

                                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                            <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between text-sm text-white">
                                                <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium">
                                                    {card.category}
                                                </span>
                                                <span className="rounded-full bg-emerald-500/80 px-3 py-1 text-xs font-semibold text-black">
                                                    ${' '}
                                                    {card.price.toLocaleString(
                                                        'en-US',
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 p-4">
                                            <h3 className="line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-emerald-300">
                                                {card.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-zinc-400">
                                                <div className="flex flex-col space-y-1">
                                                    <span className="inline-flex min-w-0 flex-1 items-center gap-1">
                                                        <Map className="h-4 w-4" />
                                                        <span className="truncate">
                                                            {formatCityName(
                                                                card.city,
                                                            )}
                                                        </span>
                                                    </span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {card.state}
                                                    </span>
                                                </div>
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {card.posted}
                                                </span>
                                            </div>

                                            {card.badges.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {card.badges.map(
                                                        (badge) => (
                                                            <span
                                                                key={badge}
                                                                className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300"
                                                            >
                                                                {badge}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </>
    );
}
