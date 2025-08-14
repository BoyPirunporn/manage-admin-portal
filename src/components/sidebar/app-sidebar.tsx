"use client";
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import RenderIcon from '@/components/ui/render-icon';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar
} from '@/components/ui/sidebar';
import { useActivityLog } from '@/hooks/use-activity-log';
import { EachElement } from '@/lib/utils';
import { MenuModel } from '@/model';
import { useStoreMenu } from '@/stores/store-menu';
import { useStoreUser } from '@/stores/store-user';
import { Avatar } from '@radix-ui/react-avatar';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { NavUser } from './nav-user';


const buildMenu = (menus: MenuModel[], pathname: string, closeSideBar: () => void) => {
    return menus.map(menu => {
        if (menu.items?.length && menu.isGroup) {
            return (
                <Collapsible
                    key={menu.title}
                    defaultOpen
                    className="group/collapsible p-[calc(var(--spacing)_*_2)]"
                >
                    <CollapsibleTrigger className='flex flex-row items-center w-full cursor-pointer'>
                        {menu.title}
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='mt-2 flex flex-col gap-2'>
                            {buildMenu(menu.items, pathname, closeSideBar)}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            );
        } else {
            return menu.visible ? (
                <SidebarMenu key={menu.title}>
                    <SidebarMenuItem key={menu.title}>
                        <SidebarMenuButton
                            asChild isActive={menu.url === pathname}>
                            <Link href={menu.url ?? ""} onClick={() => {
                                useActivityLog().log("CLICK_MENU", "menu:" + menu.title, { from: "sidebar" });
                                closeSideBar();
                            }}>
                                {menu.icon && <RenderIcon name={menu.icon} />}
                                {menu.title}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            ) : null;
        }
    });
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user: session } = useStoreUser();
    const pathname = usePathname(); // ✅ ปลอดภัย เรียก hook ด้านบนสุด
    const { isMobile, setOpenMobile } = useSidebar();
    const { menus, setMenus } = useStoreMenu();
    React.useEffect(() => {
        if (session && !menus) {
            // fetch once
            (async () => {
                try {
                    const r = await fetch("http://localhost:3000/api/menu");
                    if (!r.ok) throw new Error("Failed to load menu");
                    const json = await r.json();
                    console.log({ json });
                    setMenus(json); // store
                } catch (e) {
                    console.error(e);
                }
            })();
        }
    }, [session, menus, setMenus]);

    return (
        <Sidebar {...props}>
            <SidebarHeader className='px-5'>
                <Avatar className="h-8 w-8 rounded-lg ">
                    <AvatarImage src={"https://github.com/shadcn.png"} alt={"logo"} />
                    <AvatarFallback className="rounded-lg">Logo</AvatarFallback>
                </Avatar>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    {!menus ? (
                        <SidebarGroupContent className='flex flex-col gap-3'>
                            <EachElement
                                of={Array.from(Array(10).keys())}
                                render={e => (
                                    <SidebarMenu key={e}>
                                        <SidebarMenuItem key={e}>
                                            <SidebarMenuButton>
                                                <Skeleton className='w-full h-10 ' />
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                )}
                            />
                        </SidebarGroupContent>
                    ) : (
                        <SidebarGroupContent className='gap-2 flex flex-col'>
                            {buildMenu(menus, pathname, () => {
                                if (isMobile) setOpenMobile(false);
                            })
                            }
                        </SidebarGroupContent>
                    )}

                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
