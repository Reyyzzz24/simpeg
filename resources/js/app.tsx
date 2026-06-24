import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

let appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob<any>('./pages/**/*.tsx'),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);
        const initialAppSetting = (props.initialPage.props as any).appSetting;

        if (initialAppSetting?.app_name) {
            appName = initialAppSetting.app_name;
        }

        const ziggyConfig = (props.initialPage.props as any).ziggy;
        if (ziggyConfig) {
            // @ts-ignore
            window.route = (
                name: string,
                params?: any,
                absolute?: boolean,
                config = ziggyConfig
            ) => route(name, params, absolute, config);
        }

        root.render(
            <StrictMode>
                <TooltipProvider delayDuration={0}>
                    <App {...props} />
                    <Toaster richColors closeButton position="top-right" />
                </TooltipProvider>
            </StrictMode>,
        );
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
