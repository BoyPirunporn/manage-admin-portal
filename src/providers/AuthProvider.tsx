'use client';
import React from 'react';

import { SessionProvider, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useStoreUser } from '@/stores/store-user';
import { useStoreMenu } from '@/stores/store-menu';
import useStoreModal from '@/stores/store-model';
import { Button } from '@/components/ui/button';

const SyncUserToStore = () => {
    const clearSession = React.useCallback(() => {
        useStoreMenu.getState().clear();
        useStoreUser.getState().clearUser();
    }, []);
    const { data: session } = useSession({
        required: true,
        onUnauthenticated: () => {
            console.log("this")
            
        }
    });
    const setUser = useStoreUser((state) => state.setUser);
    React.useEffect(() => {
        setUser(session ?? null);
    }, [session, setUser]);
    
    return null;
};

const AuthProvider = ({
    children,
    session
}: Readonly<{
    session: Session | null;
    children: React.ReactNode;
}>) => {
    return (
        <SessionProvider >
            <SyncUserToStore />
            {children}
        </SessionProvider>
    );
};

export default AuthProvider;