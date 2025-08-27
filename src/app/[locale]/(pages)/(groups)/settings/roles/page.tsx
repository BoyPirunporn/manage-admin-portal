import PermissionGuard from '@/components/guard/PermissionGuard';
import { RouteBuilder } from '@/lib/path';
import { GlobalPropsWithParams } from '@/model';
import ListPage from './client/ListPage';

const RoleAndPermissionPage = async ({params}:GlobalPropsWithParams) => {
    return (
        <PermissionGuard action='view' path={RouteBuilder.SETTINGS.ROLE.LIST}>
            <ListPage />
        </PermissionGuard>
    );
};

export default RoleAndPermissionPage;