import React from 'react';
import FormMemberInput from './components/form-member-input';
import { getMenuItems, getPermissions, getRoles, getUser } from './action';

const CreateOrUpdateMemberPage = async (
    { params }: { params: Promise<{ id: string; }>; }
) => {
    const { id } = await params;
    const [user, roles, menuItems, permissions] = await Promise.all([
        getUser(id),
        getRoles(),
        getMenuItems(),
        getPermissions(),
    ]);

    console.log("User Data:", user);

    return (
        <div>
            <FormMemberInput data={user} roles={roles} menuItems={menuItems} permissions={permissions} />
        </div>
    );
};

export default CreateOrUpdateMemberPage;