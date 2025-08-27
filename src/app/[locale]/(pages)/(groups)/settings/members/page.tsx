import PermissionGuard from '@/components/guard/PermissionGuard';
import { RouteBuilder } from '@/lib/path';
import { GlobalPropsWithParams } from '@/model';
import MemberClient from './client/member-client';
const MemberPage = async ({
    params
}: GlobalPropsWithParams) => {
    const {locale} = await params;
    return (
        <PermissionGuard path={RouteBuilder(locale).SETTINGS.MEMBER.LIST} action={'view'}>
            <MemberClient />
        </PermissionGuard>
    );
};

export default MemberPage;