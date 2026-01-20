import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="dark relative flex min-h-svh flex-col items-center justify-center gap-6 bg-[#0a0a0f] p-6 text-white md:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_50%_-10%,rgba(16,185,129,0.18),transparent_60%)]" />
            <div className="relative z-10 w-full max-w-sm">{children}</div>
        </div>
    );
}
