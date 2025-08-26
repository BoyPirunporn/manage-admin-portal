'use client';
import GlobalDataTable from '@/components/datatable/global-datatable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { RouteBuilder } from '@/lib/path';
import { usePermissions } from '@/providers/PermissionProvider';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { memberColumn } from '../columnDef/member-column';



const MemberClient = () => {
  const { can } = usePermissions();
  const t = useTranslations();
  const locale = useLocale()
  console.log(t("common.email"));
  return (
    <div>
      <div className='mb-5 flex'>
        <Heading title={'Members'} description='Create, update, and organize member information.' />
        {can("create", RouteBuilder(locale).SETTINGS.MEMBER.CREATE) && (
          <Button variant={"default"} className='ml-auto min-w-[100px] h-full border' asChild>
            <Link href={RouteBuilder(locale).SETTINGS.MEMBER.CREATE} className='w-full h-full text-center'>Add</Link>
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