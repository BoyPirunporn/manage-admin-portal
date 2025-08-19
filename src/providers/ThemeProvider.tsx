'use client';
import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { applyTheme, useThemeStore } from '@/stores/store-theme';
const ThemeProvider = ({
    children
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const {theme} = useTheme();
    const color = useThemeStore((s) => s.color);

    // apply on mount & on change
    useEffect(() => { applyTheme({}); }, []);
    useEffect(() => { applyTheme({ color }); }, [color]);

    // listen system change when mode = system
    // useEffect(() => {
    //     if (mode !== "system" || typeof window === "undefined") return;
    //     const mq = window.matchMedia("(prefers-color-scheme: dark)");
    //     const handler = () => applyTheme({});
    //     mq.addEventListener?.("change", handler);
    //     return () => mq.removeEventListener?.("change", handler);
    // }, [mode]);

    const [mount, setMount] = useState(false);

    useEffect(() => {
        setMount(true);
    }, []);
    if (!mount) return null;

    return (
        <NextThemesProvider
            attribute={"class"}
            defaultTheme={theme}
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    );
};

export default ThemeProvider;