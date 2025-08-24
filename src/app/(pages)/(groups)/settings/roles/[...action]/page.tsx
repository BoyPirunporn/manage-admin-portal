import PermissionGuard, { PermissionAction } from '@/components/guard/PermissionGuard';
import Heading from '@/components/heading';
import { PATH } from '@/lib/path';
import { MenuModel, RoleModelWithPermission } from '@/model';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getMenus, getRoleById } from '../action';

const RoleAndPermissionForm = dynamic(() => import("../form/role-and-permission-form"), {
    ssr: true,
    loading: () => (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-primary/50 aspect-auto rounded-xl" />
                <div className="bg-primary/50 aspect-auto rounded-xl" />
                <div className="bg-primary/50 aspect-auto rounded-xl" />
            </div>
        </div>
    )
});

const RolePage = async ({
    params
}: {
    params: Promise<{ action: string[]; }>;
}) => {
    const actionParams = (await params).action || []; // If no params, it's the list view
    let path = null;
    let action: PermissionAction;
    let id: string | null = null;
    let roleData: RoleModelWithPermission | null = null; // To hold data for edit/view forms
    let menus: MenuModel[] = []; // To hold data for edit/view forms

    // --- Logic to parse the URL and determine the action ---
    if (actionParams.length === 1 && actionParams[0] === 'create') {
        action = 'create';
        path = PATH.SETTINGS.ROLE.CREATE;
    } else if (actionParams.length === 2 && actionParams[1] === 'update') {
        action = 'update';
        id = actionParams[0];
        path = PATH.SETTINGS.ROLE.UPDATE(id);
    } else if (actionParams.length === 2 && actionParams[1] === 'view') {
        action = 'view';
        id = actionParams[0];
        path = PATH.SETTINGS.ROLE.VIEW(id);
    } else {
        // Any other URL structure is not valid for this page
        notFound();
    }

    // Pre-fetch data on the server if needed for create/edit forms
    if (action === 'create' || action === 'update' || action === "view") {
        [roleData, menus] = await Promise.all([
            id ? getRoleById(id) : null,
            getMenus(),
        ]);
    }
    return (
        <PermissionGuard action={action} path={path}>
            <Heading
                title={action.substring(0, 1).toUpperCase() + action.substring(1) + " Role"}
                description='Manage role'
            />
            <Suspense fallback={"loading"}>
                <RoleAndPermissionForm data={roleData} menus={menus} />
            </Suspense>
        </PermissionGuard>
    );
};

export default RolePage;