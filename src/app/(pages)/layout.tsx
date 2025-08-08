import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ThemeMode from '@/components/ui/theme-mode';
import { Separator } from '@radix-ui/react-separator';
import React from 'react';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb-component';
import { AppSidebar } from '../../components/sidebar/app-sidebar';
import ProtectRoute from './_protect-route/protect-route';

const RootLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <ProtectRoute>
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <BreadcrumbComponent />
                        <ThemeMode />
                    </header>
                    <section className='py-10 px-5 '>
                        {children}
                    </section>
                </SidebarInset>
            </ProtectRoute>
        </SidebarProvider>
    );
};

export default RootLayout;