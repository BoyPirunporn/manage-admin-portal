'use client';
import { applyTheme, useThemeStore } from '@/stores/store-theme';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useEffect, useState } from 'react';
const ThemeProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const color = useThemeStore((s) => s.color);

    // apply on mount & on change
    useEffect(() => { applyTheme({}); }, []);
    useEffect(() => { applyTheme({ color }); }, [color]);

    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, []);
    if (!mount) return null;

    return (
        <NextThemesProvider
            attribute={"class"}
            defaultTheme={"system"}
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
};

export default ThemeProvider;