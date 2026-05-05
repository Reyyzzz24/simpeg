import { Link, InertiaLinkProps } from '@inertiajs/react';

interface SmartLinkProps extends InertiaLinkProps {
    prefetch?: 'mount' | 'hover' | 'click';
}

export function SmartLink({
    prefetch = 'hover',
    children,
    ...props
}: SmartLinkProps) {
    return (
        <Link prefetch={prefetch} {...props}>
            {children}
        </Link>
    );
}
