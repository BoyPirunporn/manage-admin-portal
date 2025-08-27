'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { EachElement } from '@/lib/utils';
import { useStoreBackdrop } from '@/stores/store-backdrop';
import { useLocale } from 'next-intl';
import { useEffect, useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { SelectGroup } from '@radix-ui/react-select';

export default function LanguageSwitcher() {
  // useTransition ใช้เพื่อแสดงสถานะ loading ขณะเปลี่ยนหน้า/ภาษา
  const [isPending, startTransition] = useTransition();

  // useRouter และ usePathname จาก next-intl สำหรับจัดการ routing
  const router = useRouter();
  const pathname = usePathname();

  // useLocale ใช้เพื่อดึงค่าภาษาปัจจุบัน
  const locale = useLocale();

  const handleSwitch = (newLocale: string) => {
    // startTransition จะช่วยให้ UI ไม่ค้างระหว่างที่รอโหลดภาษาใหม่
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  useEffect(() => {
    if (isPending) {
      useStoreBackdrop.getState().toggle("visible");
    } else {
      useStoreBackdrop.getState().toggle("invisible");
    }
  }, [isPending]);

  return (
    <Select defaultValue={locale} onValueChange={handleSwitch}>
      <SelectTrigger className="md:min-w-12 cursor-pointer" defaultValue={locale}>
        <SelectValue defaultValue={locale} />
      </SelectTrigger>
      <SelectContent defaultValue={locale}>
        <SelectGroup>
          <EachElement
            of={locales}
            render={(locale) => (
              <SelectItem className='cursor-pointer' key={locale} value={locale}>
                {locale.toUpperCase()}
              </SelectItem>
            )}
          />
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}