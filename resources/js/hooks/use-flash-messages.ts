import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

// Definisikan tipe untuk props Inertia agar TS tidak protes
interface PageProps extends Record<string, any> {
    flash: {
        success?: string;
        error?: string;
    };
}

export function useFlashMessages() {
    const { props } = usePage<PageProps>();
    const { flash, errors } = props;

    const lastMessageRef = useRef<string | null>(null);

    useEffect(() => {
        const successMsg = flash?.success;
        const errorMsg = flash?.error;

        // 1. Tangani Success
        if (successMsg && lastMessageRef.current !== successMsg) {
            toast.success(successMsg);
            lastMessageRef.current = successMsg;
        }

        // 2. Tangani Error Session (bukan validasi)
        if (errorMsg && lastMessageRef.current !== errorMsg) {
            toast.error(errorMsg);
            lastMessageRef.current = errorMsg;
        }

        // 3. Tangani Error Validasi (Opsional)
        // Jika kamu ingin notifikasi umum saat validasi gagal:
        const hasErrors = Object.keys(errors).length > 0;
        if (hasErrors && lastMessageRef.current !== 'validation_error') {
            toast.error("Mohon periksa kembali inputan Anda.");
            lastMessageRef.current = 'validation_error';
        }

        // Cleanup: Reset ref jika semua pesan kosong
        if (!successMsg && !errorMsg && !hasErrors) {
            lastMessageRef.current = null;
        }
    }, [flash, errors]);
}