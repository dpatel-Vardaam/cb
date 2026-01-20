import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Clock,
    Filter,
    ListChecks,
    MapPin,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export type Listing = {
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
    category?: {
        id: number;
        title: string;
        slug: string;
    };
};

type PaginatedResponse<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: any[];
    next_page_url?: string | null;
    prev_page_url?: string | null;
};

type ListingsIndexProps = {
    listings: PaginatedResponse<Listing>;
    categories: { id: number; title: string }[];
    filters?: Record<string, any>;
};

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

export default function ListingsIndex({
    listings,
    categories,
    filters = {},
}: ListingsIndexProps) {
    const page = usePage();
    const isMine = useMemo(() => page.url?.includes('mine=1'), [page.url]);

    const [openFilters, setOpenFilters] = useState(false);

    const [form, setForm] = useState({
        q: filters.q ?? '',
        category_id: filters.category_id ? String(filters.category_id) : 'all',
        location: filters.location ?? '',
        min_price: filters.min_price ?? '',
        max_price: filters.max_price ?? '',
        negotiable: Boolean(filters.negotiable),
        delivery: Boolean(filters.delivery),
    });

    const updateField = (key: keyof typeof form, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const submitFilters = () => {
        router.get(
            '/listings',
            {
                ...form,
                category_id:
                    form.category_id === 'all' ? undefined : form.category_id,
                q: form.q || undefined,
                mine: filters.mine,
            },
            { preserveScroll: true, preserveState: true },
        );
        setOpenFilters(false);
    };

    const clearFilters = () => {
        setForm({
            q: '',
            category_id: 'all',
            location: '',
            min_price: '',
            max_price: '',
            negotiable: false,
            delivery: false,
        });
        router.get(
            '/listings',
            { mine: filters.mine },
            { preserveScroll: true, preserveState: true },
        );
        setOpenFilters(false);
    };

    const cards = listings.data.map((listing) => {
        const badges: string[] = [];
        if (listing.is_negotiable) badges.push('Negotiable');
        if (listing.is_delivery_available) badges.push('Delivery');

        const coverImage =
            listing.image_urls?.[0] ||
            (listing.images?.[0]
                ? `/storage/listings/${listing.uuid}/${listing.images[0]}`
                : undefined);

        return {
            uuid: listing.uuid,
            title: listing.title,
            category: listing.category?.title ?? 'Uncategorized',
            price: parseFloat(listing.price),
            location: listing.location,
            posted: formatRelativeTime(listing.created_at),
            badges,
            image: coverImage,
        };
    });

    const FilterContent = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.12em] text-emerald-400 uppercase">
                    Search
                </p>
                <Input
                    value={form.q}
                    onChange={(e) => updateField('q', e.target.value)}
                    placeholder="Search listings"
                    className="h-10 border-white/10 bg-[#0f0f15] text-white placeholder:text-zinc-500"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') submitFilters();
                    }}
                />
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.12em] text-emerald-400 uppercase">
                    Category
                </p>
                <Select
                    value={form.category_id}
                    onValueChange={(value) => updateField('category_id', value)}
                >
                    <SelectTrigger className="h-10 border-white/10 bg-[#0f0f15] text-white">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f0f15] text-white">
                        <SelectItem value="all">All</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.12em] text-emerald-400 uppercase">
                    Location
                </p>
                <Input
                    value={form.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="City or region"
                    className="h-10 border-white/10 bg-[#0f0f15] text-white placeholder:text-zinc-500"
                />
            </div>

            <div className="space-y-3">
                <p className="text-xs font-semibold tracking-[0.12em] text-emerald-400 uppercase">
                    Price
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label className="text-[11px] text-zinc-400 uppercase">
                            Min
                        </Label>
                        <Input
                            type="number"
                            value={form.min_price}
                            onChange={(e) =>
                                updateField('min_price', e.target.value)
                            }
                            placeholder="0"
                            className="h-10 border-white/10 bg-[#0f0f15] text-white placeholder:text-zinc-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-[11px] text-zinc-400 uppercase">
                            Max
                        </Label>
                        <Input
                            type="number"
                            value={form.max_price}
                            onChange={(e) =>
                                updateField('max_price', e.target.value)
                            }
                            placeholder="100000"
                            className="h-10 border-white/10 bg-[#0f0f15] text-white placeholder:text-zinc-500"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                    {[1000, 5000, 10000, 25000].map((ceil) => (
                        <Button
                            key={ceil}
                            type="button"
                            size="sm"
                            className="border-white/10 bg-[#0f0f15] text-white hover:border-emerald-500/30 hover:bg-emerald-500/10"
                            onClick={() => {
                                updateField('min_price', '');
                                updateField('max_price', String(ceil));
                                submitFilters();
                            }}
                        >
                            Up to ₹{ceil.toLocaleString()}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.12em] text-emerald-400 uppercase">
                    Options
                </p>
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-white">
                        <Checkbox
                            checked={form.negotiable}
                            onCheckedChange={(checked) =>
                                updateField('negotiable', Boolean(checked))
                            }
                            className="border-white/20 bg-[#0f0f15] hover:cursor-pointer"
                        />
                        Negotiable
                    </label>
                    <label className="flex items-center gap-2 text-sm text-white">
                        <Checkbox
                            checked={form.delivery}
                            onCheckedChange={(checked) =>
                                updateField('delivery', Boolean(checked))
                            }
                            className="border-white/20 bg-[#0f0f15] hover:cursor-pointer"
                        />
                        Delivery
                    </label>
                </div>
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={submitFilters}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25"
                >
                    Apply
                </Button>
                <Button
                    onClick={clearFilters}
                    className="flex-1 border-white/30 text-white hover:border-emerald-500/30 hover:bg-emerald-500/10"
                >
                    Reset
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="dark min-h-screen bg-[#0a0a0f] text-white">
                <Head title={isMine ? 'My Listings' : 'Listings'} />

                <main className="mx-auto w-full max-w-7xl px-4 py-10">
                    {/* Header */}
                    <header className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm tracking-[0.2em] text-emerald-400 uppercase">
                                {isMine ? 'Your items' : 'Marketplace'}
                            </p>
                            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                                {isMine ? 'My Listings' : 'All Listings'}
                            </h1>
                            <p className="mt-2 text-sm text-zinc-500">
                                {isMine
                                    ? 'Everything you have posted is collected here.'
                                    : 'Browse all active listings from the community.'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                asChild
                                className="border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                            >
                                <Link
                                    href={
                                        isMine
                                            ? '/listings'
                                            : '/listings?mine=1'
                                    }
                                    className="flex items-center text-white"
                                >
                                    <ListChecks className="mr-2 h-4 w-4" />
                                    {isMine
                                        ? 'View Marketplace'
                                        : 'My Listings'}
                                </Link>
                            </Button>

                            <Button
                                asChild
                                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25"
                            >
                                <Link href="/listings/create">
                                    Post a Listing
                                </Link>
                            </Button>
                        </div>
                    </header>

                    {/* Mobile Filter Drawer */}
                    <Sheet open={openFilters} onOpenChange={setOpenFilters}>
                        <SheetTrigger asChild>
                            <Button
                                className="mb-4 flex items-center gap-2 md:hidden"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="border-white/10 bg-[#0a0a0f]">
                            <SheetHeader>
                                <SheetTitle className="text-white">
                                    Filters
                                </SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                                <FilterContent />
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Filter + Listings */}
                    <div className="grid gap-6 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr]">
                        {/* Filters Sidebar */}
                        <aside className="hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:block lg:sticky lg:top-20 lg:h-fit">
                            <FilterContent />
                        </aside>

                        {/* Listings */}
                        <section className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {cards.map((card) => (
                                    <Link
                                        key={card.uuid}
                                        href={`/listings/${card.uuid}`}
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
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                            <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between text-sm text-white">
                                                <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium">
                                                    {card.category}
                                                </span>
                                                <span className="rounded-full bg-emerald-500/80 px-3 py-1 text-xs font-semibold text-black">
                                                    ₹
                                                    {card.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 p-4">
                                            <h3 className="line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-emerald-300">
                                                {card.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-zinc-400">
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {card.location}
                                                </span>
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

                            {/* Pagination */}
                            {listings.last_page > 1 && (
                                <div className="flex items-center justify-center gap-4 pt-2">
                                    <Button
                                        className="h-10 w-10 border-white/10 text-white hover:bg-white/10"
                                        disabled={!listings.prev_page_url}
                                        asChild
                                    >
                                        <Link
                                            href={listings.prev_page_url ?? '#'}
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                        </Link>
                                    </Button>

                                    <span className="flex h-10 min-w-[40px] items-center justify-center rounded-md bg-white/10 text-sm font-medium">
                                        {listings.current_page}
                                    </span>

                                    <Button
                                        className="h-10 w-10 border-white/10 text-white hover:bg-white/10"
                                        disabled={!listings.next_page_url}
                                        asChild
                                    >
                                        <Link
                                            href={listings.next_page_url ?? '#'}
                                        >
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}
