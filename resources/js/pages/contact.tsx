import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Mail,
    MapPin,
    MessageSquareText,
    Phone,
    Send,
    Sparkles,
} from 'lucide-react';

import Header from '@/components/header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type SharedData } from '@/types';

type ContactProps = {
    contact: {
        email: string;
        phone: string;
    };
};

type Flash = {
    success?: string;
    error?: string;
};

type FormData = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

export default function Contact({ contact }: ContactProps) {
    const page = usePage<SharedData & { flash?: Flash }>();
    const flash = page.props.flash;

    const { data, setData, post, processing, errors, reset } =
        useForm<FormData>({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset('message'),
        });
    };

    return (
        <div className="dark min-h-screen bg-[#0a0a0f] text-white">
            <Head title="Contact" />

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

                    <div className="relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
                                <MessageSquareText className="h-4 w-4" />
                                We typically reply within 24 hours
                            </div>

                            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                                Contact us
                            </h1>
                            <p className="mt-4 max-w-xl text-lg text-zinc-400">
                                Have a question about a listing, need help with
                                your account, or want to partner with us? Send a
                                message and we’ll get back to you.
                            </p>

                            {(flash?.success || flash?.error) && (
                                <div
                                    className={`mt-6 rounded-2xl border p-4 text-sm ${
                                        flash?.success
                                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                                            : 'border-red-500/20 bg-red-500/10 text-red-200'
                                    }`}
                                >
                                    {flash?.success ?? flash?.error}
                                </div>
                            )}

                            <div className="mt-8 grid gap-4">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                                            <Mail className="h-5 w-5 text-emerald-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-zinc-500">
                                                Email
                                            </div>
                                            <a
                                                className="font-medium text-white hover:text-emerald-300"
                                                href={`mailto:${contact.email}`}
                                            >
                                                {contact.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                                            <Phone className="h-5 w-5 text-cyan-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-zinc-500">
                                                Phone
                                            </div>
                                            <a
                                                className="font-medium text-white hover:text-cyan-300"
                                                href={`tel:${contact.phone}`}
                                            >
                                                {contact.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                                            <MapPin className="h-5 w-5 text-violet-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-zinc-500">
                                                Safety
                                            </div>
                                            <p className="text-sm text-zinc-400">
                                                Meet in public, verify details,
                                                and avoid upfront payments.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-[#0f0f15]/60 p-6 backdrop-blur-sm md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-zinc-300"
                                        >
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                            placeholder="Your name"
                                            required
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-zinc-300"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                            placeholder="you@example.com"
                                            required
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="phone"
                                            className="text-zinc-300"
                                        >
                                            Phone (optional)
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                            placeholder="+1 555 000 0000"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="subject"
                                            className="text-zinc-300"
                                        >
                                            Subject
                                        </Label>
                                        <Input
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData(
                                                    'subject',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                            placeholder="How can we help?"
                                            required
                                        />
                                        <InputError message={errors.subject} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="message"
                                        className="text-zinc-300"
                                    >
                                        Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) =>
                                            setData('message', e.target.value)
                                        }
                                        rows={6}
                                        className="border-white/10 bg-white/5 text-white placeholder:text-zinc-500 focus:border-emerald-500/50"
                                        placeholder="Write your message..."
                                        required
                                    />
                                    <InputError message={errors.message} />
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2 bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                                    >
                                        <Send className="h-4 w-4" />
                                        Send message
                                    </Button>

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    >
                                        <Link href="/about">
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Learn more
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
