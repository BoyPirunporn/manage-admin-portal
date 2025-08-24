import { MenuModel } from "@/model";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export const PERMISSIONS = ["VIEW", "CREATE", "UPDATE", "DELETE"] as const;
export type PermissionKey = (typeof PERMISSIONS)[number];

export const KEY_MAP: Record<string, PermissionKey> = {
  canView: "VIEW",
  canCreate: "CREATE",
  canUpdate: "UPDATE",
  canDelete: "DELETE",
};
const AccordionLevel = ({
  items,
  checkedPermissions,
  handleCheck,
  disabled
}: {
  items: MenuModel[];
  checkedPermissions: Record<string, boolean>;
  handleCheck: (menu: MenuModel, permission: PermissionKey, checked: boolean) => void;
  disabled: boolean;
}) => {
  const [accordionValue, setAccordionValue] = React.useState<string | undefined>(undefined);
  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
      className="flex flex-col gap-5"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.title}>
          <AccordionTrigger className="cursor-pointer border px-2">{item.title}</AccordionTrigger>
          <AccordionContent className="rounded-md px-3 py-2">
            {item.children?.length ? (
              <AccordionLevel
                disabled={disabled}
                items={item.children}
                checkedPermissions={checkedPermissions}
                handleCheck={handleCheck}
              />
            ) : (
              <div className="flex flex-row gap-4 flex-wrap">
                {PERMISSIONS.map((permission) => {
                  const key = `${item.id}_${permission}`;
                  const isChecked = checkedPermissions[key] ?? false;
                  return (
                    <div key={permission} className="flex items-center gap-2">
                      <Checkbox
                        disabled={disabled}
                        checked={isChecked}
                        id={`${item.id}_${permission}`} // ให้ id ไม่ซ้ำ
                        onCheckedChange={(checked) => {
                          handleCheck(item, permission, Boolean(checked));
                        }
                        }
                      />
                      <Label
                        className="cursor-pointer"
                        htmlFor={`${item.id}_${permission}`}
                      >
                        {permission}
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionLevel;