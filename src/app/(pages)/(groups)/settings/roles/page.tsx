import PermissionGuard from '@/components/guard/PermissionGuard';
import { PATH } from '@/lib/path';
import ListPage from './client/ListPage';

const RoleAndPermissionPage = () => {
    return (
        <PermissionGuard action='view' path={PATH.SETTINGS.ROLE.LIST}>
            <ListPage />
        </PermissionGuard>
    );
};

export default RoleAndPermissionPage;