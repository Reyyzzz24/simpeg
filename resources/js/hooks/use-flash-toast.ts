import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        let lastMessage: string | null = null;

        const showMessage = (type: 'success' | 'error' | 'info' | 'warning', message?: string) => {
            if (!message || lastMessage === `${type}:${message}`) {
                return;
            }

            toast[type](message);
            lastMessage = `${type}:${message}`;
        };

        const showFlash = (flash?: {
            success?: string;
            error?: string;
            toast?: FlashToast;
        }) => {
            if (flash?.toast?.type && flash.toast.message) {
                showMessage(flash.toast.type, flash.toast.message);
            }

            showMessage('success', flash?.success);
            showMessage('error', flash?.error);
        };

        const removeSuccessListener = router.on('success', (event) => {
            const page = (event as CustomEvent).detail?.page;
            const props = page?.props ?? {};

            showFlash(props.flash);

            if (props.errors && Object.keys(props.errors).length > 0) {
                showMessage('error', 'Mohon periksa kembali inputan Anda.');
            }
        });

        const removeErrorListener = router.on('error', (event) => {
            const errors = (event as CustomEvent).detail?.errors ?? {};

            if (Object.keys(errors).length > 0) {
                showMessage('error', 'Mohon periksa kembali inputan Anda.');
            }
        });

        return () => {
            removeSuccessListener();
            removeErrorListener();
        };
    }, []);
}
