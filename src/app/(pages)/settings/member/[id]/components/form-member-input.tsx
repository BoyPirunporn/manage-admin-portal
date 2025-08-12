"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input';
import { Label } from '@/components/ui/label';
import { EachElement } from '@/lib/utils';
import { MenuModel, MenuModelWithRoleMenuPermission, PermissionModel, UserModel, UserRoleModel } from '@/model';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const roleSchema: z.ZodType<Omit<UserRoleModel, "permissions" | "createdAt" | "updatedAt">> = z.object({
  id: z.number().nullable(),
  name: z.string(),
  description: z.string().nullable(),
});

const menuItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  permissions: z.array(z.object({
    id: z.number(),
    name: z.string(),
  }))

});
const memberSchema = z.object({
  email: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(1),
  roles: z.array(roleSchema),
  menuItems: z.array(menuItemSchema)
});

type MemberSchema = z.infer<typeof memberSchema>;
const FormMemberInput = ({
  data,
  roles,
  menuItems,
  permissions
}: {
  data: UserModel | null;
  roles: UserRoleModel[];
  menuItems: MenuModelWithRoleMenuPermission[];
  permissions: PermissionModel[];
}) => {
  const form = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema as any),
    defaultValues: {
      email: data?.email ?? "",
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
      password: data?.password ?? "",
      roles: data?.roles ?? [],
      menuItems: []
    }
  });




  const [accordionValue, setAccordionValue] = React.useState<string | undefined>(undefined);
  const [checkedPermissions, setCheckedPermissions] = React.useState<Record<string, boolean>>({});

  const handleSubmit = (values: MemberSchema) => {
    console.log("Submit:", values, checkedPermissions);
  };



  const handleCheck = React.useCallback(
    (menu: MenuModelWithRoleMenuPermission, permission: PermissionModel, checked: boolean) => {
      const key = `${menu.id}_${permission.name}`;
      setCheckedPermissions((prev) => ({
        ...prev,
        [key]: checked,
      }));

      const currentMenuItems = form.getValues("menuItems");
      const existingMenu = currentMenuItems.find((m) => m.id === menu.id);

      let updatedMenuItems;

      if (!existingMenu) {
        // ยังไม่มีเมนูนี้ใน form → เพิ่มใหม่
        updatedMenuItems = [
          ...currentMenuItems,
          {
            id: menu.id!,
            title: menu.title,
            permissions: checked
              ? [{ id: permission.id!, name: permission.name }]
              : [],
          },
        ];
      } else {
        // มีเมนูนี้แล้ว → อัปเดต permissions
        updatedMenuItems = currentMenuItems.map((menuItem) => {
          if (menuItem.id === menu.id) {
            let newPermissions = [...menuItem.permissions];

            if (checked) {
              if (!newPermissions.some((p) => p.name === permission.name)) {
                newPermissions.push({ id: permission.id!, name: permission.name });
              }
            } else {
              newPermissions = newPermissions.filter((p) => p.name !== permission.name);
            }

            return { ...menuItem, permissions: newPermissions };
          }
          return menuItem;
        });
      }

      form.setValue("menuItems", updatedMenuItems);
    },
    [form]
  );
  
  const sortedPermissions = React.useMemo(
    () =>
      [...permissions].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [permissions]
  );
  return (
    <Form {...form}>
      <div className='flex flex-col h-full'>
        <div className='mb-5 flex'>
          <h1 className='text-xl font-bold'>Create {data ? "Update Member" : "New Member"}</h1>
        </div>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <FormInputField control={form.control} name='email' label='Email' />
          <FormInputField control={form.control} name='password' label='Password' type='password' />
          <FormInputField control={form.control} name='firstName' label='First Name' />
          <FormInputField control={form.control} name='lastName' label='Last Name' />

          {/* Roles */}
          <div className='mb-5 flex flex-col gap-5 md:col-span-2'>
            <h1 className='text-xl font-bold'>Roles</h1>
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  {roles.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="roles"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                className='w-5 h-5'
                                checked={field.value?.map(e => e.id).includes(item.id)}
                                onCheckedChange={(checked) => {

                                  return checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value.id !== item.id
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-md font-normal cursor-pointer">
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*End Roles */}

          {/* Menus */}
          <div className='mb-5 flex flex-col gap-5 md:col-span-2'>
            <h1 className='text-xl font-bold'>Menus</h1>
            <AccordionLevel
              items={menuItems}
              permissions={sortedPermissions}
              checkedPermissions={checkedPermissions}
              handleCheck={handleCheck}
            />
          </div>
          {/* End Menus */}
          <Button className='m-auto md:col-span-2 min-w-sm '>Submit</Button>
        </form>
      </div>
    </Form>
  );
};

function AccordionLevel({
  items,
  permissions,
  checkedPermissions,
  handleCheck,
}: {
  items: MenuModelWithRoleMenuPermission[];
  permissions: PermissionModel[];
  checkedPermissions: Record<string, boolean>;
  handleCheck: (menu: MenuModelWithRoleMenuPermission, permission: PermissionModel, checked: boolean) => void;
}) {
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

export default FormMemberInput;