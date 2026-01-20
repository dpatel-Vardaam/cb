import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Settings, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

import { home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Header() {
    const { auth, canRegister } = usePage<SharedData>().props;
    const { url } = usePage();

    const isHome = url === '/';
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const headerBg = isHome
        ? 'bg-black'
        : scrolled
          ? 'bg-black'
          : 'bg-[#12121a]';

    return (
        <header
            className={`sticky top-0 z-50 border-b border-white/5 backdrop-blur-2xl transition-colors duration-300 ${headerBg}`}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link
                        href={home()}
                        className="group flex items-center gap-3"
                    >
                        <div className="relative flex h-10 w-10 items-center justify-center">
                            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-400 to-cyan-400 opacity-75 blur-md transition-opacity group-hover:opacity-100" />
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-cyan-400 text-white shadow-lg shadow-emerald-500/25">
                                <Sparkles className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="grid leading-tight">
                            <span className="text-base font-bold tracking-tight text-white">
                                Snake Market
                            </span>
                            <span className="text-xs text-zinc-500">
                                India's #1 Reptile Marketplace
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Right nav */}
                <nav className="flex items-center gap-3">
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="group relative flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-transparent transition-all hover:ring-emerald-500/50 focus:ring-emerald-500/50 focus:outline-none">
                                    <Avatar className="h-10 w-10 border-2 border-white/10 transition-all group-hover:border-emerald-500/30">
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                        <AvatarFallback className="bg-linear-to-br from-emerald-400 to-cyan-400 text-sm font-semibold text-white">
                                            {auth.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-56 border-white/10 bg-[#12121a]/95 backdrop-blur-xl"
                            >
                                <div className="px-3 py-2">
                                    <p className="text-sm font-medium text-white">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        {auth.user.email}
                                    </p>
                                </div>

                                <DropdownMenuSeparator className="bg-white/10" />

                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/listings?mine=1"
                                        className="flex items-center gap-2 text-zinc-300 hover:text-white focus:bg-white/5"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        My Listings
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/settings/profile"
                                        className="flex items-center gap-2 text-zinc-300 hover:text-white focus:bg-white/5"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="bg-white/10" />

                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2 text-red-400 hover:text-red-300 focus:bg-white/5"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="ghost"
                                className="text-zinc-400 hover:bg-white/5 hover:text-white"
                            >
                                <Link href={login()}>Log in</Link>
                            </Button>

                            {canRegister && (
                                <Button
                                    asChild
                                    className="relative overflow-hidden bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
                                >
                                    <Link href={register()}>
                                        <span className="relative z-10">
                                            Get Started
                                        </span>
                                    </Link>
                                </Button>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
