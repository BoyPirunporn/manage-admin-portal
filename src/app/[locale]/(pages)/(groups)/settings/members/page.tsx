import PermissionGuard from '@/components/guard/PermissionGuard';
import { RouteBuilder } from '@/lib/path';
import MemberClient from './client/member-client';
const MemberPage = async () => {
    return (
        <PermissionGuard path={RouteBuilder.SETTINGS.MEMBER.LIST} action={'view'}>
            <MemberClient />
        </PermissionGuard>
    );
};

export default MemberPage;