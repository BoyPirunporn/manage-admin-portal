'use client';
import React from 'react'

import { SessionProvider, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useStoreUser } from '@/stores/store-user';

const SyncUserToStore = () => {
  const { data: session } = useSession();
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
    session: Session | null
    children: React.ReactNode
}>) => {
    return (
        <SessionProvider >
            <SyncUserToStore/>
            {children}
        </SessionProvider>
    )
}

export default AuthProvider