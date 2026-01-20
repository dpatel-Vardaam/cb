// Components
import { Form, Head } from '@inertiajs/react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking the link we sent."
        >
            <Head title="Email verification" />

            <div className="mx-auto max-w-md space-y-6 rounded-2xl border border-foreground/10 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/20 p-6 shadow-lg shadow-emerald-500/10">
                <div className="space-y-2 text-center">
                    <p className="text-sm text-slate-100/80">
                        We just sent a verification email. Open it and click the
                        magic link to activate your account. If you don&apos;t
                        see it, check your spam or resend below.
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
                            A new verification link has been sent. Please check
                            your inbox.
                        </div>
                    )}
                </div>

                <Form {...send.form()}>
                    {({ processing }) => (
                        <div className="flex flex-col gap-3">
                            <Button
                                disabled={processing}
                                variant="secondary"
                                className="w-full justify-center gap-2"
                            >
                                {processing && <Spinner />}
                                Resend verification email
                            </Button>

                            <TextLink
                                href={logout()}
                                className="text-center text-sm text-slate-200 hover:text-white"
                            >
                                Log out and sign in with a different email
                            </TextLink>
                        </div>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
