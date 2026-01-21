import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import { send } from '@/routes/verification';
import { type SharedData } from '@/types';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        auth.user.avatar ?? null,
    );
    const [photoObjectUrl, setPhotoObjectUrl] = useState<string | null>(null);
    const [removePhoto, setRemovePhoto] = useState(false);

    useEffect(() => {
        return () => {
            if (photoObjectUrl) {
                URL.revokeObjectURL(photoObjectUrl);
            }
        };
    }, [photoObjectUrl]);

    return (
        <>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    {/* 1. Header */}
                    <div>
                        <HeadingSmall
                            title="Profile Information"
                            description="Update your account's profile information and email address."
                            className="text-white [&>p]:text-zinc-400"
                        />
                    </div>

                    {/* 2. Main Profile Card (Glassmorphism) */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12121a]/80 p-6 shadow-lg shadow-emerald-500/5 backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-emerald-500/15">
                        {/* Glow Effect */}
                        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/10 opacity-50 blur-3xl" />

                        <Form
                            {...ProfileController.update.form()}
                            options={{ preserveScroll: true }}
                            className="relative z-10 w-full max-w-2xl space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <input
                                        type="hidden"
                                        name="remove_profile_photo"
                                        value={removePhoto ? '1' : '0'}
                                    />

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                                        <Avatar className="h-20 w-20 border-2 border-white/10">
                                            <AvatarImage
                                                src={photoPreview ?? undefined}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="bg-linear-to-br from-emerald-400 to-cyan-400 text-lg font-semibold text-white">
                                                {auth.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    Profile photo
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    PNG/JPG up to 2MB.
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    name="profile_photo"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        if (!file) return;

                                                        setRemovePhoto(false);
                                                        if (photoObjectUrl) {
                                                            URL.revokeObjectURL(
                                                                photoObjectUrl,
                                                            );
                                                        }

                                                        const url =
                                                            URL.createObjectURL(
                                                                file,
                                                            );
                                                        setPhotoObjectUrl(url);
                                                        setPhotoPreview(url);
                                                    }}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="border-white/10 bg-white/5 text-white hover:border-emerald-500/30 hover:bg-emerald-500/10"
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                >
                                                    Upload
                                                </Button>

                                                {photoPreview && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="text-zinc-400 hover:bg-white/5 hover:text-white"
                                                        onClick={() => {
                                                            if (
                                                                photoObjectUrl
                                                            ) {
                                                                URL.revokeObjectURL(
                                                                    photoObjectUrl,
                                                                );
                                                            }

                                                            setPhotoObjectUrl(
                                                                null,
                                                            );
                                                            setPhotoPreview(
                                                                null,
                                                            );
                                                            setRemovePhoto(
                                                                true,
                                                            );
                                                            if (
                                                                fileInputRef.current
                                                            ) {
                                                                fileInputRef.current.value =
                                                                    '';
                                                            }
                                                        }}
                                                    >
                                                        Remove photo
                                                    </Button>
                                                )}
                                            </div>

                                            <InputError
                                                className="mt-2"
                                                message={
                                                    errors.profile_photo as
                                                        | string
                                                        | undefined
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="name"
                                            className="text-zinc-300"
                                        >
                                            Name
                                        </Label>
                                        <Input
                                            id="name"
                                            className="border-white/10 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Full name"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.name}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-zinc-300"
                                        >
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="border-white/10 bg-zinc-900/50 text-white placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Email address"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.email}
                                        />
                                    </div>

                                    {/* Verification Notice */}
                                    {mustVerifyEmail &&
                                        auth.user.email_verified_at ===
                                            null && (
                                            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                                                <p className="text-sm text-yellow-200/80">
                                                    Your email is unverified.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="font-medium text-yellow-400 underline decoration-yellow-400/30 underline-offset-4 hover:text-yellow-300"
                                                    >
                                                        Resend verification
                                                        email.
                                                    </Link>
                                                </p>
                                                {status ===
                                                    'verification-link-sent' && (
                                                    <div className="mt-2 text-sm font-medium text-emerald-400">
                                                        Verification link sent!
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    {/* Save Button */}
                                    <div className="flex items-center gap-4 pt-2">
                                        <Button
                                            disabled={processing}
                                            className={cn(
                                                'border-0 bg-linear-to-r from-emerald-500 to-cyan-500 font-medium text-white shadow-lg shadow-emerald-500/20',
                                                'transition-all hover:shadow-emerald-500/30 hover:brightness-110',
                                                processing &&
                                                    'cursor-not-allowed opacity-70',
                                            )}
                                        >
                                            Save Changes
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0 translate-x-2"
                                            enterTo="opacity-100 translate-x-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-emerald-400">
                                                Saved
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* 3. Danger Zone (Delete Account) */}
                    <div className="relative overflow-hidden rounded-2xl border border-red-500/10 bg-[#12121a]/90 p-6 backdrop-blur-md transition-all hover:border-red-500/30">
                        <HeadingSmall
                            title="Danger Zone"
                            description="Irreversible actions regarding your account"
                            className="mb-4 text-red-400 [&>p]:text-red-400/60"
                        />

                        {/* We wrap DeleteUser to ensure it inherits dark styles if internally styled, 
                                but usually you might need to edit DeleteUser component directly for deep styling */}
                        <div className="dark-theme-override">
                            <DeleteUser />
                        </div>
                    </div>
                </div>
            </SettingsLayout>
        </>
    );
}
