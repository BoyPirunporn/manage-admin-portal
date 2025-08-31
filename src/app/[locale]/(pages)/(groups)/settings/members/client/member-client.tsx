'use client';
import { memberColumn } from '@/columns/member.column';
import GlobalDataTable from '@/components/datatable/global-datatable';
import Heading from '@/components/heading';
import NavigateLinkEvent from '@/components/navigate-link-event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { RouteBuilder } from '@/lib/path';
import { usePermissions } from '@/providers/PermissionProvider';
import { useTranslations } from 'next-intl';
import { useState } from 'react';



const MemberClient = () => {
  const { can } = usePermissions();
  const t = useTranslations();
  const [filter, setFilter] = useState<string>("");
  const debouncedValue = useDebounce(filter,500)
  return (
    <div>
      <div className='mb-5 flex'>
        <Heading title={t("member.heading")} description={t("member.descriptions")} />
        {can("create", RouteBuilder.SETTINGS.MEMBER.CREATE) && (
          <Button variant={"default"} className='ml-auto min-w-[100px] h-full border' asChild >
            <NavigateLinkEvent href={RouteBuilder.SETTINGS.MEMBER.CREATE} className='w-full h-full text-center'>{t("member.btnAdd")}</NavigateLinkEvent>
          </Button>
        )}
      </div>
      <div className="mb-5 flex">
        <Input className='w-2xs ml-auto' placeholder={t("member.table.searchPlaceHolder",{
          field:t("member.firstName")
        })} onChange={(v) => setFilter(v.target.value)} />
      </div>

      <GlobalDataTable
        columns={memberColumn()}
        queryKey='members'
        apiUrl={'/api/v1/member'} tableState={{
          pageSize: 10,
          filterBy: "firstName",
          filter: debouncedValue
        }} />
    </div>

  );
};

export default MemberClient;