/**
 * Date formatting utilities for Indonesian locale.
 * Centralizes date formatting patterns used across the application.
 */

import { parse } from 'date-fns';

type DateInput = Date | string | number;

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const dateTimeWithSpacePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?$/;
const timeOnlyPattern = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

/**
 * Parse a date input safely, treating date-only strings as local dates.
 */
export function parseDateInput(
    date: DateInput | null | undefined,
): Date | undefined {
    if (date === null || date === undefined) {
        return undefined;
    }

    if (date instanceof Date) {
        return date;
    }

    if (typeof date === 'string') {
        const trimmed = date.trim();
        if (!trimmed) {
            return undefined;
        }

        if (dateOnlyPattern.test(trimmed)) {
            const parsed = parse(trimmed, 'yyyy-MM-dd', new Date());
            return Number.isNaN(parsed.getTime()) ? undefined : parsed;
        }

        if (dateTimeWithSpacePattern.test(trimmed)) {
            const format =
                trimmed.split(':').length === 3
                    ? 'yyyy-MM-dd HH:mm:ss'
                    : 'yyyy-MM-dd HH:mm';
            const parsed = parse(trimmed, format, new Date());
            return Number.isNaN(parsed.getTime()) ? undefined : parsed;
        }

        const timeMatch = trimmed.match(timeOnlyPattern);
        if (timeMatch) {
            const hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            const seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;

            if (
                hours >= 0 &&
                hours < 24 &&
                minutes >= 0 &&
                minutes < 60 &&
                seconds >= 0 &&
                seconds < 60
            ) {
                const parsed = new Date();
                parsed.setHours(hours, minutes, seconds, 0);
                return parsed;
            }

            return undefined;
        }

        const parsed = new Date(trimmed);
        return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }

    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

/**
 * Format a date to Indonesian locale with common format options.
 */
export function formatDate(
    date: DateInput,
    options?: Intl.DateTimeFormatOptions,
): string {
    const parsedDate =
        typeof date === 'string' || typeof date === 'number'
            ? new Date(date)
            : date;

    return parsedDate.toLocaleDateString('id-ID', options);
}

/**
 * Format date as: "01 Januari 2024"
 */
export function formatDateLong(date: DateInput): string {
    return formatDate(date, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Format date as: "01/01/2024"
 */
export function formatDateShort(date: DateInput): string {
    return formatDate(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

/**
 * Format date as: "Senin, 01 Januari 2024"
 */
export function formatDateFull(date: DateInput): string {
    return formatDate(date, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Format date as: "Senin, 01 Januari"
 */
export function formatDateWithDay(date: DateInput): string {
    return formatDate(date, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}

/**
 * Get day name in Indonesian: "Senin", "Selasa", etc.
 */
export function getDayName(date: DateInput): string {
    return formatDate(date, { weekday: 'long' });
}

/**
 * Format time as: "14:30"
 */
export function formatTime(date: DateInput): string {
    const parsedDate =
        typeof date === 'string' || typeof date === 'number'
            ? new Date(date)
            : date;

    return parsedDate.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

/**
 * Format date and time as: "01 Januari 2024, 14:30"
 */
export function formatDateTime(date: DateInput): string {
    const parsedDate =
        typeof date === 'string' || typeof date === 'number'
            ? new Date(date)
            : date;

    return parsedDate.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

/**
 * Format relative time (e.g., "2 jam yang lalu", "kemarin")
 */
export function formatRelativeTime(date: DateInput): string {
    const parsedDate =
        typeof date === 'string' || typeof date === 'number'
            ? new Date(date)
            : date;

    const now = new Date();
    const diffMs = now.getTime() - parsedDate.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
        return 'Baru saja';
    }
    if (diffMins < 60) {
        return `${diffMins} menit yang lalu`;
    }
    if (diffHours < 24) {
        return `${diffHours} jam yang lalu`;
    }
    if (diffDays === 1) {
        return 'Kemarin';
    }
    if (diffDays < 7) {
        return `${diffDays} hari yang lalu`;
    }

    return formatDateLong(parsedDate);
}
