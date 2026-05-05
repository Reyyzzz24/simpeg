import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { appSetting } = usePage<SharedData>().props;
    const appName = appSetting?.app_name || 'SIMPEG';
    const branchName = appSetting?.branch_name;
    const logoUrl = appSetting?.logo_url;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md text-sidebar-primary-foreground">
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={appName}
                        className="size-10 object-contain"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {appName}
                </span>
                {branchName && (
                    <span className="truncate text-xs leading-tight text-muted-foreground">
                        {branchName}
                    </span>
                )}
            </div>
        </>
    );
}
