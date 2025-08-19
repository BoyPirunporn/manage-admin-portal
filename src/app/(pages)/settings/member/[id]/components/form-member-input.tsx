"use client";
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
import { logger } from '@/lib/utils';
import { MenuModelWithRoleMenuPermission, PermissionModel, UserRoleModel } from '@/model';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { report } from '@/app/api/_utils/api-request';
import AccordionLevel from '@/components/accordion-level';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const roleSchema: z.ZodType<Omit<UserRoleModel, "roleMenuPermissions" | "createdAt" | "updatedAt" | "description">> = z.object({
  id: z.number().nullable(),
  name: z.string(),
});

const menuItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  referenceId: z.string().nullable(),
  parent: z.object({
    id: z.number()
  }).nullable(),
  permissions: z.array(z.object({
    id: z.number(),
    name: z.string(),
  }))

});
const memberSchema = z.object({
  id: z.number().nullable(),
  email: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(1),
  roles: z.array(roleSchema),
  menuItems: z.array(menuItemSchema)
});


export type MemberSchema = z.infer<typeof memberSchema>;
type RoleSchema = z.infer<typeof roleSchema>;
type MenuItemSchema = z.infer<typeof menuItemSchema>;

const FormMemberInput = ({
  data,
  roles,
  menuItems,
  permissions
}: {
  data: MemberSchema | null;
  roles: UserRoleModel[];
  menuItems: MenuModelWithRoleMenuPermission[];
  permissions: PermissionModel[];
}) => {

  const router = useRouter();
  const form = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema as any),
    defaultValues: {
      id: null,
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      roles: [],
      menuItems: []
    }
  });


  const [checkedPermissions, setCheckedPermissions] = React.useState<Record<string, boolean>>({});

  const handleSubmit = async (values: MemberSchema) => {
    console.log(values)
    try {
      await axios({
        url: "http://localhost:3000/api/user-management",
        method: data ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(values)
      });
      toast.success(`Member ${data ? "updated" : "created"} successfully!`, {
        duration: 2 * 1000,
        description: "Redirecting to member list...",
      });
      // setTimeout(() => {
      //   form.reset();
      //   setCheckedPermissions({});
      //   router.back();
      // }, 2 * 1000);
    } catch (error) {
      logger.info({ error });
      toast.error(report(error), {
        duration: 3 * 1000,
      });
    }
  };

  console.log("Form Member Input Data:", form.formState.errors);

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
            referenceId: currentMenuItems.length === 0 ? null : currentMenuItems[0].referenceId,
            parent: menu.parent ? {
              id: menu.parent?.id!,
            } : null,
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
            const t = { ...menuItem, permissions: newPermissions }
            return t;
          }
          return menuItem;
        });
      }
      form.setValue("menuItems", updatedMenuItems.filter(item => item.permissions.length > 0));
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

  React.useEffect(() => {
    if (data) {

      form.reset({
        id: data?.id ?? null,
        email: data?.email ?? "",
        firstName: data?.firstName ?? "",
        lastName: data?.lastName ?? "",
        password: data?.password ?? "",
        roles: data?.roles ?? [],
        menuItems: data?.menuItems ?? []
      });
      // Set checked permissions based on initial menu items
      const initialCheckedPermissions: Record<string, boolean> = {};
      data.menuItems.forEach((item) => {
        item.permissions.forEach((permission) => {
          initialCheckedPermissions[`${item.id}_${permission.name}`] = true;
        });
      });
      setCheckedPermissions(initialCheckedPermissions);

    }
  }, [data, form]);

  return (
    <Form {...form}>
      <div className='flex flex-col h-full'>
        <div className='mb-5 flex'>
          <h1 className='text-xl font-bold'>Create {data ? "Update Member" : "New Member"}</h1>
        </div>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <FormInputField control={form.control} name='email' label='Email' />
          <FormInputField control={form.control} name='password' readonly={!!data} label='Password' type='password' />
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



export default FormMemberInput;