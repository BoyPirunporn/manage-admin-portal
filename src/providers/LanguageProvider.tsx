"use client";
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import { DeepPartial } from 'react-hook-form';

const LanguageProvider = ({
    children,
    messages,
    locale
}: {
    children: React.ReactNode;
    messages: DeepPartial<Record<string, any>> | null | undefined;
    locale: string;
}) => {
    // const { setLocale } = useStoreLocale();
    // useEffect(() => {
    //     setLocale(locale);
    // }, [locale, setLocale]);
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
};

export default LanguageProvider;