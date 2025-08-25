"use client";
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import logger from '@/lib/logger';
import { EachElement } from '@/lib/utils';
import { MenuPermissionNode } from '@/model';
import { useStoreMenu } from '@/stores/store-menu';
import { useStoreUser } from '@/stores/store-user';
import { Avatar } from '@radix-ui/react-avatar';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import ThemeColor from '../theme-color';
import RenderIcon, { IconName } from '../ui/render-icon';
import { Skeleton } from '../ui/skeleton';
import ThemeMode from '../ui/theme-mode';
import { NavUser } from './nav-user';


const buildMenu = (menus: MenuPermissionNode[], pathname: string, closeSideBar: () => void) => {
    return menus.map(menu => {
        if (menu.children?.length && menu.isGroup) {
            return (
                <Collapsible
                    key={menu.menuName}
                    defaultOpen
                    className="group/collapsible p-[calc(var(--spacing)_*_2)]"
                >
                    <CollapsibleTrigger className='flex flex-row items-center w-full cursor-pointer '>
                        {menu.menuName}
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90 data-[state=open]:transition-transform duration-200" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='mt-2 flex flex-col gap-2'>
                            {buildMenu(menu.children, pathname, closeSideBar)}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            );
        } else {
            return menu.isVisible ? (
                <SidebarMenu key={menu.menuName}>
                    <SidebarMenuItem key={menu.menuName}>
                        <SidebarMenuButton
                            asChild isActive={menu.url === pathname}>
                            <Link href={menu.url ?? ""} onClick={() => {
                                useActivityLog().log("CLICK_MENU", "menu:" + menu.menuName, { from: "sidebar" });
                                closeSideBar();
                            }}>
                                {menu.icon && <RenderIcon name={menu.icon as IconName} />}
                                {menu.menuName}
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
        if (session && (!menus)) {
            (async () => {
                logger.debug("FETCHING MENU");
                try {
                    const r = await fetch("/api/menu/me");
                    if (!r.ok) throw new Error("Failed to load menu" + await r.text());
                    const json = await r.json();
                    logger.debug(json);
                    setMenus(json); // store
                } catch (e) {
                    logger.error(e);
                }
            })();
        }
    }, [session, menus, setMenus]);

    return (
        <Sidebar {...props}>
            <SidebarHeader className='px-5'>
                <Link href={"/"} className="h-8 w-8 rounded-lg">
                    <Avatar >
                        <AvatarImage src={"https://github.com/shadcn.png"} alt={"logo"} />
                        <AvatarFallback className="rounded-lg">Logo</AvatarFallback>
                    </Avatar>
                </Link>
                <div className=" md:hidden flex flex-row items-center justify-between border-dashed border border-primary p-4 gap-4">
                    <ThemeMode />
                    <ThemeColor />
                </div>
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
