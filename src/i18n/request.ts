import fs from 'fs';
import { getRequestConfig } from 'next-intl/server';
import path from 'path';
import { EnabledLocale, routing } from './routing';

export default getRequestConfig(async ({requestLocale}) => {
    let locale = (await requestLocale) as EnabledLocale | undefined;
    console.log({locale})
    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale)) {
        locale = routing.defaultLocale;
    }
    const langs: Record<string, any> = findLangDir(locale);
    const messages = {
        ...langs
    };
    return ({
        messages,
        locale
    });
});

const findLangDir = (locale: string): Record<string, any> => {
    const dir = path.resolve();
    if (!locale) {
        return {};
    }
    const langDir = path.join(dir, "src/lang", locale!);
    const allFile = fs.readdirSync(langDir) as string[];
    const messages: Record<string, any> = {};
    allFile.forEach(file => {
        const key = path.basename(file, ".json");
        const data = fs.readFileSync(path.join(langDir, file), { encoding: "utf-8" });
        messages[key] = JSON.parse(data);
    });
    return messages;

};