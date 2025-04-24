import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="bg-[#1a1a1a] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href={route('netix')} className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-12 w-12 items-center justify-center">
                        <h1 className="text-2xl font-tech-heading font-bold text-netix-primary">NETiX</h1>
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <div className="tech-card rounded-xl border border-netix-primary/20 bg-[#252525] p-6 shadow-md">
                        <div className="px-6 pt-6 pb-0 text-center">
                            <h2 className="text-xl font-tech-heading font-bold text-netix-primary mb-2">{title}</h2>
                            <p className="text-netix-light-muted font-tech">{description}</p>
                        </div>
                        <div className="px-6 py-8">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
