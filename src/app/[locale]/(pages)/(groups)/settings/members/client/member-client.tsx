'use client';
import GlobalDataTable from '@/components/datatable/global-datatable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { RouteBuilder } from '@/lib/path';
import { usePermissions } from '@/providers/PermissionProvider';
import { useTranslations } from 'next-intl';
import { memberColumn } from '../columnDef/member-column';



const MemberClient = () => {
  const { can } = usePermissions();
  const t = useTranslations();
  return (
    <div>
      <div className='mb-5 flex'>
        <Heading title={t("member.heading")} description={t("member.descriptions")} />
        {can("create", RouteBuilder.SETTINGS.MEMBER.CREATE) && (
          <Button variant={"default"} className='ml-auto min-w-[100px] h-full border' asChild>
            <Link href={RouteBuilder.SETTINGS.MEMBER.CREATE} className='w-full h-full text-center'>{t("member.btnAdd")}</Link>
          </Button>
        )}
      </div>

      <GlobalDataTable columns={memberColumn()} apiUrl={'/api/member'} tableState={{
        pageSize: 10
      }} />
    </div>

  );
};

export default MemberClient;