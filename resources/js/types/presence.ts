export type DailyPresenceQrToken = {
    value: string;
    expires_at?: string | null;
    generated_at?: string | null;
    [key: string]: unknown;
};

export type DailyPresenceRecord = {
    id: number;
    employee_id: number;
    date: string;
    masuk_time?: string | null;
    pulang_time?: string | null;
    status: string;
    notes?: string | null;
    employee?: { id: number; name: string } | null;
    [key: string]: unknown;
};

export type PaginatedResponse<T> = {
    data: T[];
    meta?: {
        total?: number;
        per_page?: number;
        current_page?: number;
        last_page?: number;
    };
    [key: string]: unknown;
};
