import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    Heart,
    MapPin,
    MessageCircle,
    Package,
    Phone,
    Share2,
    Sparkles,
    User,
} from 'lucide-react';
import { useState } from 'react';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { SnakeBadge } from '@/components/ui/snake-badge';
import { US_STATES } from '@/data/states';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

type Category = {
    id: number;
    title: string;
    slug: string;
};

type ListingUser = {
    id: number;
    name: string;
    email: string;
};

type Listing = {
    id: number;
    uuid: string;
    title: string;
    description: string;
    price: string;
    location: string;
    state: string;
    city: string;
    species: string | null;
    morph: string | null;
    age: string | null;
    sex: string;
    images: string[] | null;
    status: string;
    is_negotiable: boolean;
    is_delivery_available: boolean;
    created_at: string;
    updated_at: string;
    image_urls: string[];
    user: ListingUser;
    category: Category;
};

type ListingShowProps = {
    listing: Listing;
};

const STATE_NAME_MAP = US_STATES.reduce<Record<string, string>>((acc, s) => {
    acc[s.code.toUpperCase()] = s.name;
    return acc;
}, {});

const formatCityName = (city?: string | null) =>
    city ? city.replace(/[_-]/g, ' ') : '';

const getStateName = (code?: string | null) =>
    code ? (STATE_NAME_MAP[code.toUpperCase()] ?? code) : '';

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const hasImages = images && images.length > 0;
    const totalImages = hasImages ? images.length : 0;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (!hasImages) {
        return (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 lg:aspect-[16/10]">
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <Sparkles className="mb-4 h-16 w-16 text-zinc-700" />
                    <p className="text-zinc-500">No images available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image Container */}
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 lg:aspect-[16/10]">
                {/* Main Image */}
                <div
                    className="relative h-full w-full cursor-zoom-in"
                    onClick={() => setIsZoomed(!isZoomed)}
                >
                    <img
                        src={images[currentIndex]}
                        alt={`${title} - Image ${currentIndex + 1}`}
                        className={cn(
                            'h-full w-full object-cover transition-transform duration-500',
                            isZoomed && 'scale-150 cursor-zoom-out',
                        )}
                    />

                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Navigation Arrows */}
                {totalImages > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevious();
                            }}
                            className="absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                            className="absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:border-emerald-500/50 hover:bg-emerald-500/20"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}

                {/* Image Counter */}
                <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                    {currentIndex + 1} / {totalImages}
                </div>

                {/* Dot Indicators */}
                {totalImages > 1 && totalImages <= 10 && (
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToSlide(index);
                                }}
                                className={cn(
                                    'h-2 rounded-full transition-all duration-300',
                                    index === currentIndex
                                        ? 'w-6 bg-emerald-400'
                                        : 'w-2 bg-white/50 hover:bg-white/80',
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {totalImages > 1 && (
                <div className="relative">
                    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300',
                                    index === currentIndex
                                        ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0a0a0f]'
                                        : 'opacity-60 hover:opacity-100',
                                )}
                            >
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ListingShow({ listing }: ListingShowProps) {
    const [isLiked, setIsLiked] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    const getSexLabel = (sex: string) => {
        const labels: Record<string, string> = {
            male: '♂ Male',
            female: '♀ Female',
            unknown: 'Unknown',
        };
        return labels[sex] || sex;
    };

    const badges: string[] = [];
    if (listing.is_negotiable) badges.push('Negotiable');
    if (listing.is_delivery_available) badges.push('Delivery Available');

    return (
        <>
            <Header />
            <div className="dark min-h-screen bg-[#0a0a0f] text-white">
                <Head title={`${listing.title} - Snake Market`} />

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
                            <Link
                                href={`/categories/${listing.category.slug}`}
                                className="flex items-center gap-2"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <span className="font-medium text-zinc-400 transition-colors hover:text-white">
                                    {listing.category.title}
                                </span>
                            </Link>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300',
                                    isLiked
                                        ? 'border-pink-500/50 bg-pink-500/20 text-pink-400'
                                        : 'border-white/10 bg-white/5 text-zinc-400 hover:border-pink-500/30 hover:text-pink-400',
                                )}
                            >
                                <Heart
                                    className={cn(
                                        'h-5 w-5',
                                        isLiked && 'fill-current',
                                    )}
                                />
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                        {/* Left Column - Images & Description */}
                        <div className="space-y-8">
                            {/* Image Carousel */}
                            <ImageCarousel
                                images={listing.image_urls}
                                title={listing.title}
                            />

                            {/* Description Section */}
                            <div className="rounded-2xl border border-white/10 bg-[#12121a]/80 p-6">
                                <h2 className="mb-4 text-lg font-semibold text-white">
                                    Description
                                </h2>
                                <div className="prose prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap text-zinc-400">
                                        {listing.description}
                                    </p>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="rounded-2xl border border-white/10 bg-[#12121a]/80 p-6">
                                <h2 className="mb-4 text-lg font-semibold text-white">
                                    Details
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {listing.species && (
                                        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                                                <Sparkles className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">
                                                    Species
                                                </p>
                                                <p className="font-medium text-white">
                                                    {listing.species}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {listing.morph && (
                                        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                                                <Sparkles className="h-5 w-5 text-violet-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">
                                                    Morph
                                                </p>
                                                <p className="font-medium text-white">
                                                    {listing.morph}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {listing.age && (
                                        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
                                                <Calendar className="h-5 w-5 text-amber-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">
                                                    Age
                                                </p>
                                                <p className="font-medium text-white">
                                                    {listing.age}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                                            <User className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                Sex
                                            </p>
                                            <p className="font-medium text-white">
                                                {getSexLabel(listing.sex)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20">
                                            <MapPin className="h-5 w-5 text-rose-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                Location
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-white">
                                                    {formatCityName(
                                                        listing.city,
                                                    )}
                                                </p>
                                                <span className="text-lg text-white">
                                                    •
                                                </span>
                                                <p className="font-medium text-white">
                                                    {getStateName(
                                                        listing.state,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                                            <Clock className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                Posted
                                            </p>
                                            <p className="font-medium text-white">
                                                {getRelativeTime(
                                                    listing.created_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Price & Seller Info */}
                        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                            {/* Price Card */}
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]/80">
                                <div className="border-b border-white/5 p-6">
                                    <h1 className="text-2xl font-bold text-white">
                                        {listing.title}
                                    </h1>

                                    {/* Badges */}
                                    {badges.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {badges.map((badge) => (
                                                <SnakeBadge
                                                    key={badge}
                                                    variant={
                                                        badge === 'Negotiable'
                                                            ? 'negotiable'
                                                            : 'delivery'
                                                    }
                                                >
                                                    {badge ===
                                                    'Delivery Available'
                                                        ? 'Delivery'
                                                        : badge}
                                                </SnakeBadge>
                                            ))}
                                        </div>
                                    )}

                                    {/* Price */}
                                    <div className="mt-4">
                                        <p className="text-sm text-zinc-500">
                                            Price
                                        </p>
                                        <p className="mt-1 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent">
                                            {'$'}
                                            {parseFloat(
                                                listing.price,
                                            ).toLocaleString('en-US')}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Buttons */}
                                <div className="space-y-3 p-6">
                                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-6 text-lg font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30">
                                        <Phone className="mr-2 h-5 w-5" />
                                        Contact Seller
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full border-white/10 bg-white/5 py-6 text-lg text-white hover:bg-white/10"
                                    >
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        Send Message
                                    </Button>
                                </div>
                            </div>

                            {/* Seller Card */}
                            <div className="rounded-2xl border border-white/10 bg-[#12121a]/80 p-6">
                                <h3 className="mb-4 text-lg font-semibold text-white">
                                    Seller Information
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-xl font-bold text-white">
                                        {listing.user.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">
                                            {listing.user.name}
                                        </p>
                                        <p className="text-sm text-zinc-500">
                                            Member since{' '}
                                            {formatDate(listing.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="#"
                                    className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-400 transition-colors hover:text-emerald-300"
                                >
                                    View all listings from this seller
                                </Link>
                            </div>

                            {/* Safety Tips */}
                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
                                <h3 className="mb-3 flex items-center gap-2 font-semibold text-amber-400">
                                    <Package className="h-5 w-5" />
                                    Safety Tips
                                </h3>
                                <ul className="space-y-2 text-sm text-zinc-400">
                                    <li>
                                        • Meet in a safe, public location for
                                        transactions
                                    </li>
                                    <li>
                                        • Verify the animal's health before
                                        purchase
                                    </li>
                                    <li>• Never send money in advance</li>
                                    <li>
                                        • Check local regulations for keeping
                                        exotic pets
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Custom Scrollbar Hide Style */}
                <style>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            </div>
        </>
    );
}
