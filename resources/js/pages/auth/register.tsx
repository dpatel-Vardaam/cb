import { Form, Head } from '@inertiajs/react';
import { Chrome, Lock, Mail, Sparkles, User } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <div className="rounded-3xl border border-white/10 bg-[#0f1018]/80 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
                <div className="mb-6 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs tracking-[0.25em] text-emerald-400 uppercase">
                            Join the market
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-white">
                            Create account
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Start posting and discovering reptiles today.
                        </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-cyan-400 text-white shadow-lg shadow-emerald-500/25">
                        <Sparkles className="h-5 w-5" />
                    </div>
                </div>

                <div className="grid gap-3">
                    <Button
                        asChild
                        variant="outline"
                        className="w-full justify-center gap-2 border-white/10 bg-white/5 text-white hover:border-emerald-500/30 hover:bg-emerald-500/10"
                    >
                        <a href="/auth/google/redirect">
                            <Chrome className="h-4 w-4" />
                            Continue with Google
                        </a>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="w-full justify-center gap-2 border-white/10 bg-white/5 text-white hover:border-emerald-500/30 hover:bg-emerald-500/10"
                    >
                        <a href="/auth/apple/redirect">
                            <img
                                src="/apple.svg"
                                alt="Apple"
                                className="h-5 w-5 invert"
                            />
                            Continue with Apple
                        </a>
                    </Button>
                </div>

                <div className="mt-4 text-center text-xs tracking-[0.2em] text-zinc-600 uppercase">
                    or sign up with email
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="mt-4 flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-sm text-zinc-300"
                                    >
                                        Name
                                    </Label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Full name"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm text-zinc-300"
                                    >
                                        Email address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm text-zinc-300"
                                    >
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Password"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-sm text-zinc-300"
                                    >
                                        Confirm password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirm password"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25"
                                    tabIndex={5}
                                    data-test="register-user-button"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Create account
                                </Button>
                            </div>

                            <div className="text-center text-sm text-zinc-400">
                                Already have an account?{' '}
                                <TextLink
                                    href={login()}
                                    tabIndex={6}
                                    className="text-emerald-300 hover:text-emerald-200"
                                >
                                    Log in
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
