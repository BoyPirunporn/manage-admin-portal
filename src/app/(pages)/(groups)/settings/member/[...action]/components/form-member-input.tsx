"use client";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input';
import logger from '@/lib/logger';
import { MenuModelWithRoleMenuPermission, PermissionModel, RoleModel } from '@/model';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { report } from '@/app/api/_utils/api-request';
import Heading from '@/components/heading';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import axios from 'axios';
import { useRouter } from 'next/navigation';


const roleSchema: z.ZodType<Omit<RoleModel, "description">> = z.object({
  id: z.string().nullable(),
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
  roleId: z.string(),
});


export type MemberSchema = z.infer<typeof memberSchema>;
type RoleSchema = z.infer<typeof roleSchema>;
type MenuItemSchema = z.infer<typeof menuItemSchema>;

const FormMemberInput = ({
  data,
  roles,
  menuItems,
  permissions,
  action
}: {
  data: MemberSchema | null;
  roles: RoleModel[];
  menuItems: MenuModelWithRoleMenuPermission[];
  permissions: PermissionModel[];
  action: string;
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
      roleId: "",
    },
    disabled: action === "view"
  });



  const handleSubmit = async (values: MemberSchema) => {
    try {
      await axios({
        url: process.env.NEXT_PUBLIC_APP_URL +"/api/user-management",
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
      setTimeout(() => {
        form.reset();
        router.back();
      }, 2 * 1000);
    } catch (error) {
      logger.info({ error });
      toast.error(report(error), {
        duration: 3 * 1000,
      });
    }
  };

  React.useEffect(() => {
    if (data) {

      form.reset({
        id: data?.id ?? null,
        email: data?.email ?? "",
        firstName: data?.firstName ?? "",
        lastName: data?.lastName ?? "",
        password: data?.password ?? "",
        roleId: data?.roleId ?? null,
      });
     
    }
  }, [data, form]);

  return (
    <Form {...form}>
      <div className='flex flex-col h-full'>
        <div className='mb-5 flex'>
          <Heading
            title={action ? action.substring(0, 1).toUpperCase() + action.substring(1).toLowerCase() + " Member" : "Create Member"}
          />
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
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {roles.map((role) => (
                        <FormItem className="flex items-center gap-3 " key={role.id}>
                          <FormControl>
                            <RadioGroupItem className='w-6 h-6 cursor-pointer' value={role.id!} />
                          </FormControl>
                          <FormLabel className="font-normal text-base cursor-pointer">{role.name}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  {roles.map((item) => (
                    // <FormField
                    //   key={item.id}
                    //   control={form.control}
                    //   name="roles"
                    //   render={({ field }) => {
                    //     return (
                    //       <FormItem
                    //         key={item.id}
                    //         className="flex flex-row items-center gap-2"
                    //       >
                    //         <FormControl>
                    //           <Checkbox
                    //             disabled={field.disabled}
                    //             className='w-5 h-5'
                    //             checked={field.value?.map(e => e.id).includes(item.id)}
                    //             onCheckedChange={(checked) => {

                    //               return checked
                    //                 ? field.onChange([...field.value, item])
                    //                 : field.onChange(
                    //                   field.value?.filter(
                    //                     (value) => value.id !== item.id
                    //                   )
                    //                 );
                    //             }}
                    //           />
                    //         </FormControl>
                    //         <FormLabel className="text-md font-normal cursor-pointer">
                    //           {item.name}
                    //         </FormLabel>
                    //       </FormItem>
                    //     );
                    //   }}
                    // />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          {/*End Roles */}

          {/* Menus */}
          {/* <div className='mb-5 flex flex-col gap-5 md:col-span-2'>
            <h1 className='text-xl font-bold'>Menus</h1>
            <AccordionLevel
              disabled={action === "view"}
              items={menuItems}
              permissions={sortedPermissions}
              checkedPermissions={checkedPermissions}
              handleCheck={handleCheck}
            />
          </div> */}
          {/* End Menus */}
          <Button disabled={action === "view"} className='m-auto md:col-span-2 min-w-sm '>Submit</Button>
        </form>
      </div>
    </Form>
  );
};



export default FormMemberInput;