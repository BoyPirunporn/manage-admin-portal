import { MenuModelWithRoleMenuPermission, PermissionModel } from "@/model";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const AccordionLevel = ({
  items,
  permissions,
  checkedPermissions,
  handleCheck,
}: {
  items: MenuModelWithRoleMenuPermission[];
  permissions: PermissionModel[];
  checkedPermissions: Record<string, boolean>;
  handleCheck: (menu: MenuModelWithRoleMenuPermission, permission: PermissionModel, checked: boolean) => void;
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
            {item.items?.length ? (
              <AccordionLevel
                items={item.items}
                permissions={permissions}
                checkedPermissions={checkedPermissions}
                handleCheck={handleCheck}
              />
            ) : (
              <div className="flex flex-row gap-4 flex-wrap">
                {permissions
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((permission) => {
                    const key = `${item.id}_${permission.name}`;
                    const isChecked = checkedPermissions[key] ?? false;
                    return (
                      <div key={permission.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={isChecked}
                          id={permission.id?.toString()}
                          onCheckedChange={(checked) =>
                            handleCheck(item, permission, Boolean(checked))
                          }
                        />
                        <Label className='cursor-pointer ' htmlFor={permission.id?.toString()}>{permission.name}</Label>
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
}

export default AccordionLevel;