import React from 'react';
import MemberClient from './client/member-client';
import PermissionGuard from '@/components/guard/PermissionGuard';
import { PATH } from '@/lib/path';
const MemberPage = async () => {
    return (
        <PermissionGuard path={PATH.SETTINGS.MEMBER.LIST} action={'view'}>
            <MemberClient />
        </PermissionGuard>
    );
};

export default MemberPage;