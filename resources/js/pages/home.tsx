import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    MapPin,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';

import { CategoryCard } from '@/components/categoryCard';
import Header from '@/components/header';
import { ListingCard } from '@/components/listingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';



type CategoryItem = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon?: string | null;
    image?: string | null;
};

type Listing = {
    id: number;
    uuid: string;
    title: string;
    description: string;
    price: string;
    location: string;
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
    seo_url?: string;
    slug?: string; // <--- ADDED THIS (matches Laravel $appends)
    user?: {
        id: number;
        name: string;
    };
    category?: {
        id: number;
        title: string;
        slug: string;
    };
};

const stats = [
    { icon: Users, label: 'Active Sellers', value: '2,500+' },
    { icon: TrendingUp, label: 'Listings', value: '15,000+' },
    { icon: Star, label: 'Happy Buyers', value: '8,000+' },
];

type HomeProps = {
    categories: CategoryItem[];
    listings: Listing[];
    userHasListings?: boolean;
    wishlistedListingIds?: string[];
};

const Home = ({
    categories,
    listings = [],
    userHasListings = false,
    wishlistedListingIds = [],
}: HomeProps) => {
    // Helper to format relative time
    const formatRelativeTime = (dateString: string) => {
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

    // Transform listings to ListingCard format
    const wishlistedSet = new Set(wishlistedListingIds);
    const transformedListings = listings.map((listing) => {
        const badges: string[] = [];
        if (listing.is_negotiable) badges.push('Negotiable');
        if (listing.is_delivery_available) badges.push('Delivery');

        const imageName = listing.images?.[0];
        const image = imageName
            ? `/storage/listings/${listing.slug}/${imageName}`
            : undefined;

        return {
            uuid: listing.uuid,
            id: listing.uuid,
            // Use the SEO URL from backend, fallback to old structure if missing
            url: listing.seo_url ?? '#',
            title: listing.title,
            category: listing.category?.title ?? 'Uncategorized',
            price: parseFloat(listing.price),
            location: listing.location,
            posted: formatRelativeTime(listing.created_at),
            badges,
            image,
            isWishlisted: wishlistedSet.has(listing.uuid),
        };
    });

    return (
        <div className="dark min-h-screen bg-[#0a0a0f] text-white">
            <Head title="Snake Market" />

            {/* Animated Background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0d14] to-[#0a0a0f]" />
                <div className="absolute -top-40 left-1/4 h-150 w-150 animate-pulse rounded-full bg-emerald-500/8 blur-[150px]" />
                <div
                    className="absolute top-1/3 -right-20 h-125 w-125 rounded-full bg-violet-500/8 blur-[150px]"
                    style={{ animation: 'pulse 4s ease-in-out infinite' }}
                />
                <div
                    className="absolute -bottom-32 left-1/3 h-100 w-100 rounded-full bg-cyan-500/8 blur-[150px]"
                    style={{
                        animation: 'pulse 5s ease-in-out infinite 1s',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <Header />

            <main className="mx-auto w-full max-w-7xl px-4 py-12">
                <div className="grid gap-20">
                    {/* Hero Section */}
                    <section className="relative pt-8">
                        <div className="pointer-events-none absolute -top-20 left-1/2 h-100 w-200 -translate-x-1/2 rounded-full bg-linear-to-r from-emerald-500/15 via-cyan-500/10 to-violet-500/15 blur-[100px]" />

                        <div className="relative z-10 grid gap-8 text-center">
                            <div className="flex justify-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
                                    <Zap className="h-4 w-4" />
                                    <span>
                                        Trusted by 2,500+ sellers across the
                                        United States
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
                                    Find your next{' '}
                                    <span className="relative">
                                        <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                                            snake
                                        </span>
                                        <span className="absolute -inset-1 -z-10 bg-linear-to-r from-emerald-500/30 via-cyan-500/30 to-emerald-500/30 blur-2xl" />
                                    </span>
                                </h1>
                                <p className="mx-auto max-w-2xl text-lg text-zinc-400 md:text-xl">
                                    Browse local listings, morph projects,
                                    enclosures, and feeders from trusted sellers
                                    across the United States.
                                </p>
                            </div>

                            {/* Search Card */}
                            <div className="mx-auto w-full max-w-3xl">
                                <div className="relative">
                                    <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-r from-emerald-500/20 via-cyan-500/20 to-violet-500/20 opacity-75 blur-lg" />

                                    <div className="relative rounded-2xl border border-white/10 bg-[#12121a]/90 p-6 shadow-2xl backdrop-blur-xl">
                                        <div className="grid gap-4 md:grid-cols-[1fr_180px_auto]">
                                            <div className="relative">
                                                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                                                <Input
                                                    className="h-12 border-white/10 bg-white/5 pl-12 text-base text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                                    placeholder="Search morph, species, gear..."
                                                />
                                            </div>
                                            <div className="relative">
                                                <MapPin className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                                                <Input
                                                    className="h-12 border-white/10 bg-white/5 pl-12 text-base text-white placeholder:text-zinc-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                                    placeholder="Location"
                                                />
                                            </div>
                                            <Button
                                                size="lg"
                                                className="h-12 bg-linear-to-r from-emerald-500 to-cyan-500 px-8 text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
                                            >
                                                <Search className="mr-2 h-4 w-4" />
                                                Search
                                            </Button>
                                        </div>

                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
                                                <span>Popular:</span>
                                                {[
                                                    'Ball python',
                                                    'Corn snake',
                                                    'Enclosure',
                                                ].map((term) => (
                                                    <button
                                                        key={term}
                                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-400 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                                                    >
                                                        {term}
                                                    </button>
                                                ))}
                                            </div>
                                            <Link
                                                href="/listings/create"
                                                className="flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm shadow-stone-500 backdrop-blur-sm hover:bg-white/10"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Post a listing
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center gap-8 pt-4 md:gap-16">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                                            <stat.icon className="h-5 w-5 text-emerald-400" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xl font-bold text-white">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-zinc-500">
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Categories Section */}
                    <section className="grid gap-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white md:text-3xl">
                                    Browse categories
                                </h2>
                                <p className="mt-2 text-zinc-500">
                                    Find exactly what you're looking for
                                </p>
                            </div>
                            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 md:flex">
                                <ShieldCheck className="h-4 w-4" />
                                Meet safely. Use escrow for shipping.
                            </div>
                        </div>

                        <Carousel
                            opts={{
                                align: 'start',
                                slidesToScroll: 1,
                                loop: true,
                            }}
                            plugins={[
                                Autoplay({
                                    delay: 3000, // ⏱ auto rotate every 3s
                                    stopOnInteraction: false, // keep autoplay after manual swipe
                                    stopOnMouseEnter: true, // pause on hover (recommended)
                                }),
                            ]}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {categories.map((cat, index) => (
                                    <CarouselItem
                                        key={cat.title}
                                        className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
                                    >
                                        <div
                                            className="animate-in duration-700 fade-in slide-in-from-bottom-2"
                                            style={{
                                                animationDelay: `${index * 100}ms`,
                                            }}
                                        >
                                            <CategoryCard
                                                title={cat.title}
                                                slug={cat.slug}
                                                description={
                                                    cat.description ?? ''
                                                }
                                                image={cat.image ?? undefined}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </section>

                    {/* Separator */}
                    <div className="relative h-px">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="h-8 w-8 rounded-full border border-white/10 bg-[#0a0a0f] p-1.5">
                                <div className="h-full w-full rounded-full bg-linear-to-br from-emerald-400 to-cyan-400" />
                            </div>
                        </div>
                    </div>

                    {/* Latest Listings Section */}
                    <section className="grid gap-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white md:text-3xl">
                                    Latest listings
                                </h2>
                                <p className="mt-2 text-zinc-500">
                                    Fresh arrivals from the community
                                </p>
                            </div>
                            <Link
                                href="/listings"
                                className="flex items-center gap-2 rounded-2xl border-white/10 bg-white/5 px-3 py-2 text-white shadow-sm shadow-stone-300 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                            >
                                Browse all
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {transformedListings.map((item, index) => (
                                <div
                                    key={item.uuid}
                                    className="animate-in duration-700 fade-in slide-in-from-bottom-4"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    {/* Now correctly passes 'url' prop via spread */}
                                    <ListingCard {...item} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Section - Only show if user hasn't listed anything */}
                    {!userHasListings && (
                        <section className="relative overflow-hidden rounded-3xl">
                            {/* Background effects */}
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/20 via-[#12121a] to-cyan-500/20" />
                            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px]" />
                            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px]" />

                            <div className="relative border border-white/10 p-8 md:p-12">
                                <div className="grid gap-6 text-center md:grid-cols-[1fr_auto] md:items-center md:text-left">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white md:text-3xl">
                                            Ready to sell?
                                        </h3>
                                        <p className="mt-3 text-lg text-zinc-400">
                                            List your snakes, enclosures, or
                                            supplies and reach thousands of
                                            enthusiasts.
                                        </p>
                                    </div>
                                    <Button
                                        size="lg"
                                        className="gap-2 bg-linear-to-r from-emerald-500 to-cyan-500 px-8 py-6 text-lg text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
                                    >
                                        <Plus className="h-5 w-5" />
                                        Post your first listing
                                    </Button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#08080c]">
                <div className="mx-auto max-w-7xl px-4 py-10">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 to-cyan-400">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm text-zinc-500">
                                Snake Market — USA's premier reptile classifieds
                            </span>
                        </div>
                        <div className="flex items-center gap-8 text-sm text-zinc-500">
                            {['About', 'Safety', 'Help', 'Terms'].map(
                                (link) => (
                                    <button
                                        key={link}
                                        className="transition-colors hover:text-emerald-400"
                                    >
                                        {link}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <p className="text-xs text-zinc-600">
                            © 2026 Snake Market. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
