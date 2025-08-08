'use client';
import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
const ThemeProvider = ({
    children
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [mount,setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    },[])
    if(!mount) return null;
    return (
        <NextThemesProvider
            attribute={"class"}
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
};

export default ThemeProvider;