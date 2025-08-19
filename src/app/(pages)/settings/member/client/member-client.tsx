'use client';
import GlobalDataTable from '@/components/datatable/global-datatable';
import { Button } from '@/components/ui/button';
import { useStoreUser } from '@/stores/store-user';
import Link from 'next/link';
import { memberColumn } from '../columnDef/member-column';
import Heading from '@/components/heading';



const MemberClient = () => {
  const { user: session } = useStoreUser();

  return (
    <div>
      <div className='mb-5 flex'>
        <Heading title={'Member'} description='Member management'/>
        {session?.user?.roles.map(e => e.toUpperCase()).includes("MEMBER_CREATE") && (
          <Button variant={"default"} className='ml-auto min-w-[100px] border' asChild>
            <Link href={"/settings/member/create"}>Add</Link>
          </Button>
        )}
      </div>


      <GlobalDataTable columns={memberColumn}  apiUrl={'/api/member'} />
    </div>

  );
};

export default MemberClient;