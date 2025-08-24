'use client';
import GlobalDataTable from '@/components/datatable/global-datatable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { PATH } from '@/lib/path';
import { usePermissions } from '@/providers/PermissionProvider';
import Link from 'next/link';
import { memberColumn } from '../columnDef/member-column';



const MemberClient = () => {
  const {can} = usePermissions()
  return (
    <div>
      <div className='mb-5 flex'>
        <Heading title={'Member'} description='Member management' />
        {can("create", PATH.SETTINGS.MEMBER.CREATE) && (
          <Button variant={"default"} className='ml-auto min-w-[100px] border' asChild>
            <Link href={PATH.SETTINGS.MEMBER.CREATE}>Add</Link>
          </Button>
        )}
      </div>

      <GlobalDataTable columns={memberColumn} apiUrl={'/api/member'} tableState={{
        pageSize: 10
      }} />
    </div>

  );
};

export default MemberClient;