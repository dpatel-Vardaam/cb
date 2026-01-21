import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    Globe,
    HeartHandshake,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';

const values = [
    {
        title: 'Trust & transparency',
        description:
            'Clear listings, clear communication, and a community that puts animal welfare first.',
        icon: ShieldCheck,
    },
    {
        title: 'Support breeders & keepers',
        description:
            'Built for hobbyists and professionals—tools that make selling and buying simple.',
        icon: HeartHandshake,
    },
    {
        title: 'Grow the community',
        description:
            'Discover new projects, connect locally, and share knowledge with fellow enthusiasts.',
        icon: Users,
    },
];

const stats = [
    { label: 'Active Sellers', value: '2,500+', icon: Users },
    { label: 'Listings', value: '15,000+', icon: TrendingUp },
    { label: 'States Covered', value: '50', icon: Globe },
];

export default function About() {
    return (
        <div className="dark min-h-screen bg-[#0a0a0f] text-white">
            <Head title="About" />

            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0f] via-[#0d0d14] to-[#0a0a0f]" />
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
            </div>

            <Header />

            <main className="mx-auto w-full max-w-7xl px-4 py-12">
                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#12121a]/70 p-8 shadow-2xl backdrop-blur-xl md:p-12">
                    <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-[90px]" />
                    <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-cyan-500/15 blur-[90px]" />

                    <div className="relative z-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
                                <BadgeCheck className="h-4 w-4" />
                                Built for safe, simple reptile classifieds
                            </div>

                            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                                About{' '}
                                <span className="bg-linear-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                                    Snake Market
                                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-lg text-zinc-400">
                                Snake Market is a modern marketplace where
                                breeders, keepers, and hobbyists can buy and
                                sell reptiles and gear with confidence.
                            </p>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    asChild
                                    className="bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                                >
                                    <Link href="/contact">
                                        Contact us
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="outline"
                                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                >
                                    <Link href={home()}>Browse listings</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                                        <stat.icon className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">
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

                <section className="mt-14 grid gap-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white md:text-3xl">
                            What we stand for
                        </h2>
                        <p className="mt-2 text-zinc-500">
                            A safer marketplace, better tools, and a stronger
                            community.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#12121a]/60 p-6 backdrop-blur-sm"
                            >
                                <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

                                <div className="relative">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                                        <value.icon className="h-5 w-5 text-emerald-300" />
                                    </div>

                                    <h3 className="mt-4 text-lg font-semibold text-white">
                                        {value.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-emerald-500/15 via-[#12121a] to-cyan-500/15">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-cyan-400">
                                        <Sparkles className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        Ready to join the marketplace?
                                    </h3>
                                </div>
                                <p className="mt-3 text-zinc-400">
                                    Discover listings, save favorites, and
                                    connect with sellers across the U.S.
                                </p>
                            </div>

                            <Button
                                asChild
                                className="bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                            >
                                <Link href={home()}>
                                    Explore listings
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
