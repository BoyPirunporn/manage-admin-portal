'use client';
import React, { useEffect } from 'react';

import { useStoreUser } from '@/stores/store-user';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

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
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
};

export default AuthProvider;