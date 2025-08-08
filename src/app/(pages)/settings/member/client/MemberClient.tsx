'use client';
import GlobalDataTable from '@/components/datatable/global-datatable';
import { memberColumn } from '../columnDef/member-column';


const MemberClient = () => {
  return (
    <GlobalDataTable columns={memberColumn} initialPageSize={2} apiUrl={'/api/member'} />
  );
};

export default MemberClient;