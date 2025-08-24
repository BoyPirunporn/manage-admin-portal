"use client";
import GlobalDataTable from '@/components/datatable/global-datatable';
import { Button } from '@/components/ui/button';
import { PATH } from '@/lib/path';
import { usePermissions } from '@/providers/PermissionProvider';
import Link from 'next/link';
import { roleColumnDef } from '../role-column-def';

const ListPage = () => {
    const { can } = usePermissions();
    return (
        <div>
            <div className='mb-5 flex'>
                <h1 className='text-xl font-bold'>Menu</h1>
                {can('create', PATH.SETTINGS.ROLE.CREATE) && <Button className='ml-auto min-w-[100px]' asChild >
                    <Link href={"/settings/roles/create"}>Add</Link>
                </Button>}
            </div>

            <GlobalDataTable
                columns={roleColumnDef}
                apiUrl={'/api/roles/datatable'}
                tableState={{
                    pageSize: 10
                }}
            />
        </div>
    );
};

export default ListPage;