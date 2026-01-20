import { Form, Head } from '@inertiajs/react';
import {
    Chrome,
    Lock,
    Mail,
    MessageCircle,
    Sparkles,
    User,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import sms from '@/routes/sms';

export default function Register() {
    const [sendingCode, setSendingCode] = useState(false);
    const [smsStatus, setSmsStatus] = useState<string | null>(null);
    const [phoneInput, setPhoneInput] = useState('');
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [showSmsCode, setShowSmsCode] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verifiedAt, setVerifiedAt] = useState<string | null>(null);
    const [smsCode, setSmsCode] = useState('');

    const normalizedPhone = useMemo(() => {
        const digits = phoneInput.replace(/[^\d]/g, '');
        return digits ? `+${digits}` : '';
    }, [phoneInput]);

    const csrfToken = useMemo(
        () =>
            (
                document.querySelector(
                    'meta[name="csrf-token"]',
                ) as HTMLMetaElement
            )?.content ?? '',
        [],
    );

    const xsrfCookie = useMemo(() => {
        const match = document.cookie
            ?.split(';')
            .map((c) => c.trim())
            .find((c) => c.startsWith('XSRF-TOKEN='));
        if (!match) return '';
        try {
            return decodeURIComponent(match.split('=')[1]);
        } catch (_e) {
            return '';
        }
    }, []);

    const sendSms = async () => {
        if (!normalizedPhone) return;

        setShowSmsCode(true);
        setSmsStatus(null);
        setSendingCode(true);

        try {
            const response = await fetch(sms.send().url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || xsrfCookie,
                    'X-XSRF-TOKEN': xsrfCookie,
                },
                body: JSON.stringify({
                    phone: normalizedPhone,
                }),
            });

            const contentType = response.headers.get('content-type') ?? '';
            const isJson = contentType.includes('application/json');
            const data = isJson
                ? await response.json()
                : { message: await response.text() };

            if (!response.ok) {
                throw new Error(data.message ?? 'Unable to send code');
            }

            setSmsStatus('Verification code sent.');
            setPhoneTouched(false);
            setVerifiedAt(null);
        } catch (error) {
            setSmsStatus(
                error instanceof Error ? error.message : 'Unable to send code',
            );
        } finally {
            setSendingCode(false);
        }
    };

    const verifySms = async () => {
        if (!normalizedPhone) return;
        if (!smsCode) return;

        setVerifying(true);
        setSmsStatus(null);

        try {
            const response = await fetch(sms.verify().url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken || xsrfCookie,
                    'X-XSRF-TOKEN': xsrfCookie,
                },
                body: JSON.stringify({
                    phone: normalizedPhone,
                    sms_code: smsCode,
                }),
            });

            const contentType = response.headers.get('content-type') ?? '';
            const isJson = contentType.includes('application/json');
            const data = isJson
                ? await response.json()
                : { message: await response.text() };

            if (!response.ok) {
                throw new Error(data.message ?? 'Unable to verify code');
            }

            setVerifiedAt(data.verified_at ?? new Date().toISOString());
            setSmsStatus('Phone number verified.');
        } catch (error) {
            setSmsStatus(
                error instanceof Error
                    ? error.message
                    : 'Unable to verify code',
            );
        } finally {
            setVerifying(false);
        }
    };

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
                                        htmlFor="phone"
                                        className="text-sm text-zinc-300"
                                    >
                                        Phone number
                                    </Label>
                                    <PhoneInput
                                        country={'us'}
                                        value={phoneInput}
                                        onChange={(value) => {
                                            setPhoneInput(value);
                                            setPhoneTouched(true);
                                        }}
                                        enableSearch
                                        countryCodeEditable={false}
                                        inputProps={{
                                            name: 'phone',
                                            required: true,
                                            autoFocus: false,
                                        }}
                                        inputClass="!w-full !h-11 !bg-white/5 !border !border-white/10 !text-white !pl-12 !pr-3 !py-2 !rounded-xl focus:!border-emerald-400"
                                        containerClass="w-full"
                                        buttonClass="!bg-white/10 !border-white/10 !text-black"
                                    />
                                    <input
                                        type="hidden"
                                        name="phone"
                                        value={normalizedPhone}
                                    />
                                    <InputError message={errors.phone} />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-center border-white/10 bg-white/5 text-white hover:border-emerald-500/30 hover:bg-emerald-500/10"
                                        onClick={sendSms}
                                        disabled={
                                            sendingCode ||
                                            !normalizedPhone ||
                                            !phoneTouched
                                        }
                                    >
                                        {sendingCode && <Spinner />}
                                        Send verification code
                                    </Button>
                                    {smsStatus && (
                                        <p className="text-sm text-emerald-300">
                                            {smsStatus}
                                        </p>
                                    )}
                                </div>

                                {showSmsCode && (
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="sms_code"
                                            className="text-sm text-zinc-300"
                                        >
                                            SMS verification code
                                        </Label>
                                        <div className="relative">
                                            <MessageCircle className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                                            <Input
                                                id="sms_code"
                                                type="text"
                                                required
                                                tabIndex={6}
                                                name="sms_code"
                                                placeholder="6-digit code"
                                                className="pl-10"
                                                value={smsCode}
                                                onChange={(e) =>
                                                    setSmsCode(e.target.value)
                                                }
                                            />
                                        </div>
                                        <InputError message={errors.sms_code} />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full justify-center border-white/10 bg-white/5 text-white hover:border-emerald-500/30 hover:bg-emerald-500/10"
                                            onClick={verifySms}
                                            disabled={verifying || !smsCode}
                                        >
                                            {verifying && <Spinner />}
                                            Verify code
                                        </Button>
                                        {verifiedAt && (
                                            <p className="text-sm text-emerald-300">
                                                Verified at{' '}
                                                {new Date(
                                                    verifiedAt,
                                                ).toLocaleString('en-US')}
                                            </p>
                                        )}
                                    </div>
                                )}

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
                                            tabIndex={4}
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
                                            tabIndex={5}
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
                                    tabIndex={7}
                                    data-test="register-user-button"
                                    disabled={processing || !verifiedAt}
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
