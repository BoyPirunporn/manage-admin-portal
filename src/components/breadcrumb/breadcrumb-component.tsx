'use client';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { MenuPermissionNode } from '@/model';
import { useStoreMenu } from '@/stores/store-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';


export const BreadcrumbComponent = () => {
    const { menus } = useStoreMenu();
    const pathname = usePathname();

    function findMenuChainByUrl(
        menus: MenuPermissionNode[],
        pathname: string
    ): MenuPermissionNode[] {
        const pathSegments = pathname.split("/").filter(Boolean);

        for (const menu of menus) {
            if (menu.url === "/" && pathname === "/") {
                return [menu];
            }

            const menuSegments = menu.url?.split("/").filter(Boolean) ?? [];
            const isMatch = menuSegments.every((seg, i) => seg === pathSegments[i]);

            if (isMatch) {
                // ถ้าตรง และยังมี children -> ลองลงไปหา
                if (menu.children?.length) {
                    const childChain = findMenuChainByUrl(menu.children, pathname);
                    if (childChain.length) {
                        return [menu, ...childChain];
                    }
                }
                return [menu];
            }
        }

        return [];
    }

    const crumbs = React.useMemo(() => {
        return findMenuChainByUrl(menus ?? [], pathname);
    }, [pathname, menus]);

    if (crumbs.length === 0) return null;
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumbs.map((crumb, index) => {
                    return (
                        <div className="flex items-center" key={crumb.url}>
                            <BreadcrumbItem>
                                {index < crumbs.length - 1 && crumb.url ? (
                                    <BreadcrumbLink asChild>
                                        <Link href={crumb.url}>{crumb.menuName}</Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{crumb.menuName}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {index < crumbs.length - 1 && <BreadcrumbSeparator />}
                        </div>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
