import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

import Header from '@/components/header';
import { useActiveUrl } from '@/hooks/use-active-url';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { show } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { type NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Two-Factor Auth',
        href: show(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { urlIsActive } = useActiveUrl();

    return (
        <>
            <Header />
            <div className="dark min-h-screen bg-[#0a0a0f] text-white">
                <main className="mx-auto w-full max-w-7xl px-4 py-10">
                    <header className="mb-8">
                        <p className="text-sm tracking-[0.2em] text-emerald-400 uppercase">
                            Account
                        </p>
                        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                            Settings
                        </h1>
                        <p className="mt-2 text-sm text-zinc-500">
                            Manage your account settings and preferences.
                        </p>
                    </header>

                    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                        <aside className="shrink-0">
                            <div className="rounded-2xl border border-white/10 bg-[#12121a]/70 p-2 shadow-lg shadow-emerald-500/5 backdrop-blur-md">
                                <nav className="flex space-x-2 overflow-x-auto lg:flex-col lg:space-y-1 lg:space-x-0">
                                    {sidebarNavItems.map((item) => {
                                        const isActive = urlIsActive(item.href);
                                        const key =
                                            typeof item.href === 'string'
                                                ? item.href
                                                : item.href.url;
                                        return (
                                            <Link
                                                key={key}
                                                href={item.href}
                                                className={cn(
                                                    'group relative flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                                                    isActive
                                                        ? 'bg-linear-to-r from-emerald-500/15 to-cyan-500/15 text-white shadow-[0_0_30px_rgba(16,185,129,0.10)] ring-1 ring-emerald-500/20'
                                                        : 'text-zinc-400 hover:bg-white/5 hover:text-white',
                                                )}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span
                                                        className={cn(
                                                            'h-1.5 w-1.5 rounded-full transition-opacity',
                                                            isActive
                                                                ? 'bg-emerald-400 opacity-100 shadow-[0_0_8px_currentColor]'
                                                                : 'bg-white/20 opacity-0 group-hover:opacity-60',
                                                        )}
                                                    />
                                                    {item.title}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </aside>

                        <div className="animate-in duration-500 fade-in slide-in-from-bottom-4">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
