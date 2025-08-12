"use client";
import GlobalDataTable from '@/components/datatable/global-datatable';
import { Button } from '@/components/ui/button';
import React from 'react';
import { roleColumnDef } from './role-column-def';

const RoleAndPermissionPage = () => {
    const handAdd = () => { };
    return (
        <div>
            <div className='mb-5 flex'>
                <h1 className='text-xl font-bold'>Menu</h1>
                <Button className='ml-auto min-w-[100px]' onClick={handAdd}>Add</Button>
            </div>

            <GlobalDataTable
                columns={roleColumnDef}
                apiUrl={'/api/role-and-permission/datatable'}
                initialPageSize={10}
            />
        </div>
    );
};

export default RoleAndPermissionPage;