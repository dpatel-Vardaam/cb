import { Form, Head } from '@inertiajs/react';
import { Chrome, Lock, Mail, Sparkles } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AuthLayout
            title="Welcome back"
            description="Sign in to continue your reptile marketplace journey"
        >
            <Head title="Log in" />

            <div className="rounded-3xl border border-white/10 bg-[#0f1018]/80 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
                <div className="mb-6 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs tracking-[0.25em] text-emerald-400 uppercase">
                            Secure Access
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-white">
                            Log in
                        </h1>
                        <p className="text-sm text-zinc-500">
                            Use your email and password or continue with
                            Google/Apple.
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
                    or continue with email
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="mt-4 flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
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
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm text-zinc-300"
                                        >
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-sm text-emerald-300 hover:text-emerald-200"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="Password"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-zinc-200"
                                    >
                                        Remember me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    Log in
                                </Button>
                            </div>

                            {canRegister && (
                                <div className="text-center text-sm text-zinc-400">
                                    Don't have an account?{' '}
                                    <TextLink
                                        href={register()}
                                        tabIndex={5}
                                        className="text-emerald-300 hover:text-emerald-200"
                                    >
                                        Sign up
                                    </TextLink>
                                </div>
                            )}
                        </>
                    )}
                </Form>

                {status && (
                    <div className="mt-4 text-center text-sm font-medium text-emerald-400">
                        {status}
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
