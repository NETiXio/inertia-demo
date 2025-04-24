import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof Link>;

export default function TextLink({ className = '', children, ...props }: LinkProps) {
    return (
        <Link
            className={cn(
                'text-netix-primary underline decoration-netix-primary/30 underline-offset-4 transition-colors duration-300 ease-out hover:text-netix-primary/80 hover:decoration-netix-primary/80',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
