'use client';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { MenuModel } from '@/model';
import { useStoreMenu } from '@/stores/store-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
export function findBreadcrumb(
    pathname: string,
    menus: MenuModel[]
): { title: string; url: string; }[] {
    const path: { title: string; url: string; }[] = [];
    const dfs = (nodes: MenuModel[]): boolean => {
        nodes && nodes.forEach(node => {
            if (node.url && pathname === node.url) {
                path.unshift({ title: node.title, url: node.url });
                return true;
            }

            // ถ้ามี children ก็วนต่อ
            if (node.items && node.items.length > 0) {
                const found = dfs(node.items);
                if (found) {
                    path.unshift({ title: node.title, url: node.url! ?? null });
                    return true;
                }
            }
        })

        return false;
    };

    dfs(menus);
    return path;
}
export const BreadcrumbComponent = () => {
    const { menus } = useStoreMenu();
    const pathname = usePathname();
    const crumbs =findBreadcrumb(pathname, menus!);

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
                                        <Link href={crumb.url}>{crumb.title}</Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
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
