export * from './auth';
export * from './navigation';
export * from './ui';
export * from './presence';
export type { DailyPresenceQrToken } from './presence';

import type { Auth } from './auth';

export type AppSetting = {
    app_name: string;
    branch_name: string | null;
    logo_path: string | null;
    logo_url: string | null;
    primary_color: string;
    phone: string | null;
    address: string | null;
};

export type SharedData = {
    name: string;
    appSetting: AppSetting;
    auth: Auth;
    [key: string]: unknown;
};
