'use client';
import GlobalDataTable from '@/components/datatable/global-datatable';
import { Button } from '@/components/ui/button';
import useStoreDrawer from '@/stores/store-drawer';
import dynamic from 'next/dynamic';
import { memberColumn } from '../columnDef/member-column';
import Link from 'next/link';


const FormMemberInput = dynamic(() => import("../[id]/components/form-member-input"), {
  ssr: false
});
const MemberClient = () => {

  const drawer = useStoreDrawer();
  const handAdd = () => {
    // drawer.openDrawer({
    //   title: "Add member",
    //   content: (
    //     <FormMemberInput data={null} />
    //   )
    // });
  };
  return (
    <div>
      <div className='mb-5 flex'>
        <h1 className='text-xl font-bold'>Membership</h1>
        <Button variant={"default"} className='ml-auto min-w-[100px] border' asChild>
          <Link href={"/settings/member/create"}>Add</Link>
        </Button>
      </div>


      <GlobalDataTable columns={memberColumn} initialPageSize={2} apiUrl={'/api/member'} />
    </div>

  );
};

export default MemberClient;