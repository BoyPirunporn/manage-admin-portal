import PermissionGuard, { PermissionAction } from '@/components/guard/PermissionGuard';
import { RouteBuilder } from '@/lib/path';
import { GlobalPropsWithParams } from '@/model';
import { getRoles, getUser } from '@/services/user.service';
import { notFound } from 'next/navigation';
import FormMemberInput from './components/form-member-input';

type Action = 'view' | 'create' | 'update';

const CreateOrUpdateMemberPage = async (
    { params }: { params: GlobalPropsWithParams['params'] & Promise<{ action: string[]; }>; }
) => {
    const actionParams = (await params).action || []; // If no params, it's the list view
    let path = null;
    let action: PermissionAction;
    let id: string | null = null;
    let userData = null; // To hold data for edit/view forms
    let rolesData = null; // To hold roles for forms

    // --- Logic to parse the URL and determine the action ---
    if (actionParams.length === 1 && actionParams[0] === 'create') {
        action = 'create';
        path = RouteBuilder.SETTINGS.MEMBER.CREATE;
    } else if (actionParams.length === 2 && actionParams[1] === 'update') {
        action = 'update';
        id = actionParams[0];
        path = RouteBuilder.SETTINGS.MEMBER.UPDATE(id);
    } else if (actionParams.length === 2 && actionParams[1] === 'view') {
        action = 'view';
        id = actionParams[0];
        path = RouteBuilder.SETTINGS.MEMBER.VIEW(id);
    } else {
        // Any other URL structure is not valid for this page
        notFound();
    }

    // Pre-fetch data on the server if needed for create/edit forms
    if (action === 'create' || action === 'update' || action === "view") {
        [userData, rolesData] = await Promise.all([
            id ? getUser(id) : null,
            getRoles(),
        ]);
    }
    return (
        <PermissionGuard path={path ?? ""} action={action}>
            <FormMemberInput action={action} data={userData} roles={rolesData!} />
        </PermissionGuard>
    );
};

export default CreateOrUpdateMemberPage;