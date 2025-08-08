'use client';
import React from 'react'

import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
const AuthProvider = ({
    children,
    session
}: Readonly<{
    session: Session | null
    children: React.ReactNode
}>) => {
    return (
        <SessionProvider >
            {children}
        </SessionProvider>
    )
}

export default AuthProvider