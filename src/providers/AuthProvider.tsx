'use client';
import React, { useEffect } from 'react';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import PermissionProvider from './PermissionProvider';
import { useStoreUser } from '@/stores/store-user';

const AuthProvider = ({
    children,
    session
}: Readonly<{
    session: Session | null;
    children: React.ReactNode;
}>) => {
    const { setUser, user } = useStoreUser();
    useEffect(() => {
        if (session && !user) {
            setUser(session);
        }
    }, [session, setUser]);
    const permissions = session?.permissions || [];
    return (
        <SessionProvider session={session}>
            <PermissionProvider permissions={permissions}>
                {children}
            </PermissionProvider>
        </SessionProvider>
    );
};

export default AuthProvider;