import { useCurrentPageIcon } from '@/hooks/use-current-page-icon';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from './ui/badge';

interface HeaderIconProps {
    icon: LucideIcon;
    className?: string;
}

function HeaderIcon({ icon: Icon, className }: HeaderIconProps) {
    return <Icon className={className} />;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    description?: string;
    gradient?: string;
    icon?: ReactNode; // Emoji or Icon component for decorative background
    headerIcon?: LucideIcon; // Icon to display in the header (defaults to nav icon)
    children?: ReactNode;
    className?: string;
    shadowColor?: string;
    backUrl?: string; // Optional back URL
    backIcon?: React.ElementType; // Optional back icon component
}

export function PageHeader({
    title,
    subtitle,
    description,
    gradient = 'bg-linear-to-r from-purple-600 to-purple-500',
    icon,
    headerIcon,
    children,
    className,
    shadowColor = 'shadow-purple-200/50',
    backUrl,
    backIcon: BackIcon,
}: PageHeaderProps) {
    const currentPageIcon = useCurrentPageIcon();
    const headerIconComponent = headerIcon ?? currentPageIcon;

    return (
        <header
            className={cn(
                'animate-scale-in stagger-1 group relative overflow-hidden rounded-4xl px-8 py-4 text-white shadow-xl transition-all duration-500 hover:shadow-2xl',
                gradient,
                shadowColor,
                'hover:shadow-gray-500/60 dark:shadow-black/50',
                className,
            )}
        >
            <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="max-w-lg">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <HeaderIcon
                                icon={headerIconComponent}
                                className="size-6 text-white"
                            />
                        </div>
                        {subtitle && (
                            <Badge
                                variant="secondary"
                                className="bg-white/20 text-white backdrop-blur-sm"
                            >
                                {subtitle}
                            </Badge>
                        )}
                    </div>
                    {backUrl && BackIcon && (
                        <div className="mb-2">
                            <a
                                href={backUrl}
                                className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
                            >
                                <BackIcon className="h-4 w-4" />
                                Kembali
                            </a>
                        </div>
                    )}
                    <h1 className="mb-2 text-3xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-white/90 transition-transform duration-300 group-hover:translate-x-1">
                            {description}
                        </p>
                    )}
                </div>
                {children && (
                    <div className="flex items-center gap-2">{children}</div>
                )}
            </div>

            {/* Decorative Elements */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-1/3 opacity-30">
                <div className="absolute -top-10 right-0 h-40 w-40 rounded-full bg-white/20 blur-2xl transition-all duration-500 group-hover:scale-150"></div>
                <div className="absolute right-10 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all duration-500 group-hover:scale-110"></div>
            </div>

            {icon && (
                <div className="animate-pulse-slow pointer-events-none absolute right-12 bottom-8 text-[8rem] opacity-20 drop-shadow-2xl filter transition-transform duration-300 group-hover:scale-110">
                    {icon}
                </div>
            )}
        </header>
    );
}
