"use client";
import GlobalDataTable from '@/components/datatable/global-datatable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { RouteBuilder } from '@/lib/path';
import { usePermissions } from '@/providers/PermissionProvider';
import { useTranslations } from 'next-intl';
import { roleColumnDef } from '../columnDef/role-column';

const ListPage = () => {
    const { can } = usePermissions();
    const t = useTranslations();
    return (
        <div>
            <div className='mb-5 flex'>
                <Heading title={t("role.heading")} description={t("role.description")} />
                {can('create', RouteBuilder.SETTINGS.ROLE.CREATE) && <Button className='ml-auto min-w-[100px]' asChild >
                    <Link href={RouteBuilder.SETTINGS.ROLE.CREATE} className='w-full h-full text-center'>{t("common.btnAdd")}</Link>
                </Button>}
            </div>

            <GlobalDataTable
                columns={roleColumnDef()}
                apiUrl={'/api/roles/datatable'}
                tableState={{
                    pageSize: 10
                }}
            />
        </div>
    );
};

export default ListPage;