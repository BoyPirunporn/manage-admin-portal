import React from 'react';
import FormMemberInput from './components/form-member-input';
import { getMenuItems, getPermissions, getRoles } from './action';

const CreateOrUpdateMemberPage = async () => {
    //todo fetch data from api
    const roles = await getRoles();
    const menuItems = await getMenuItems();
    const permissions = await getPermissions();
    return (
        <div>
            <FormMemberInput data={null} roles={roles} menuItems={menuItems} permissions={permissions} />
        </div>
    );
};

export default CreateOrUpdateMemberPage;