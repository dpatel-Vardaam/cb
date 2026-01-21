import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance Settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <div className="rounded-2xl border border-white/10 bg-[#12121a]/80 p-6 shadow-lg shadow-emerald-500/5 backdrop-blur-md">
                        <AppearanceTabs />
                    </div>
                </div>
            </SettingsLayout>
        </>
    );
}
