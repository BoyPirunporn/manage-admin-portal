import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { EnabledLocale } from '@/i18n/routing';
import { MapLocalMenu, MenuLabelKey } from '@/lib/menu-utils';
import { MenuModel } from '@/model';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { permissionSchema, RoleSchema } from './role-and-permission-form';



export const PERMISSIONS = ["VIEW", "CREATE", "UPDATE", "DELETE"] as const;
export type PermissionKey = (typeof PERMISSIONS)[number];
export const MenuPermissionActionLabel: Record<PermissionKey, keyof Pick<permissionSchema, 'canView' | 'canCreate' | 'canUpdate' | 'canDelete'>> = {
  "VIEW": "canView",
  "CREATE": "canCreate",
  "UPDATE": "canUpdate",
  "DELETE": "canDelete"
};

export type MenuPermissionAction = 'canView' | 'canCreate' | 'canUpdate' | 'canDelete';

const AccordionMenuItem = ({
  menuItems,
}: {
  menuItems: MenuModel[];
}) => {
  const t = useTranslations();
  const form = useFormContext<RoleSchema>();
  const locale = useLocale();
  const field: MenuLabelKey = MapLocalMenu[locale as EnabledLocale];
  const [accordionValue, setAccordionValue] = React.useState<string | undefined>(undefined);
  return (
    (
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={setAccordionValue}
        className="flex flex-col gap-5"
      >
        {menuItems.map((item, index) => (
          <AccordionItem key={item.id} value={item[field]}>
            <AccordionTrigger className="cursor-pointer border px-2">{item[field]}</AccordionTrigger>
            <AccordionContent className="rounded-md px-3 py-2">
              {item.children?.length ? (
                <AccordionMenuItem
                  menuItems={item.children}
                />
              ) : (
                <FormField
                  control={form.control}
                  name={`permissions`}
                  render={() => {
                    return (
                      <FormItem>
                        <div className="flex flex-row gap-4 flex-wrap">
                          {PERMISSIONS.map((permission) => {
                            const key = `${item.id}_${permission}`;
                            const fieldPermission = MenuPermissionActionLabel[permission as PermissionKey];
                            // const isChecked = checkedPermissions[key] ?? false;
                            return (
                              <FormField
                                key={key}
                                control={form.control}
                                name='permissions'
                                render={({ field }) => {
                                  const current = field.value;
                                  const existing = current.find((m) => m.menuId === item.id);
                                  const checked = existing && existing[fieldPermission];
                                  return (
                                    <FormItem>
                                      <FormControl >
                                        <div className="flex items-center gap-2">
                                          <Checkbox
                                            disabled={field.disabled}
                                            checked={checked}
                                            id={`${item.id}_${permission}`} // ให้ id ไม่ซ้ำ
                                            onCheckedChange={(checked) => {

                                              const updated = !existing
                                                ? [
                                                  ...current,
                                                  {
                                                    menuId: item.id!,
                                                    canView: permission === "VIEW" ? checked : false,
                                                    canCreate: permission === "CREATE" ? checked : false,
                                                    canUpdate: permission === "UPDATE" ? checked : false,
                                                    canDelete: permission === "DELETE" ? checked : false,
                                                  },
                                                ]
                                                : current.map((m) =>
                                                  m.menuId === item.id
                                                    ? {
                                                      ...m,
                                                      canView: permission === "VIEW" ? checked : m.canView,
                                                      canCreate: permission === "CREATE" ? checked : m.canCreate,
                                                      canUpdate: permission === "UPDATE" ? checked : m.canUpdate,
                                                      canDelete: permission === "DELETE" ? checked : m.canDelete,
                                                    }
                                                    : m
                                                );
                                              return field.onChange(updated.filter(e => e?.canView || e.canCreate || e.canUpdate || e.canDelete));
                                            }
                                            }
                                          />
                                          <Label
                                            className="cursor-pointer"
                                            htmlFor={`${item.id}_${permission}`}
                                          >
                                            {t("common.permission."+permission)}
                                          </Label>
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  );
                                }}
                              />
                            );
                          })}
                        </div>
                      </FormItem>
                    );
                  }}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  );
};

export default AccordionMenuItem;