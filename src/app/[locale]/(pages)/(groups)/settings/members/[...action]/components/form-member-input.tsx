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
import { RoleModel } from '@/model';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useCustomRouter as useRouter } from '@/components/custom-router';
import Heading from '@/components/heading';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useActivityLog } from '@/hooks/use-activity-log';
import report from '@/lib/report';
import { cn } from '@/lib/utils';
import { getMemberSchema, MemberSchema } from '@/schema/member.schema';
import axios from 'axios';
import { useTranslations } from 'next-intl';



const FormMemberInput = ({
  data,
  roles,
  action
}: {
  data: MemberSchema | null;
  roles: RoleModel[];
  action: string;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const memberSchema = useMemo(() => getMemberSchema(t), [t]);
  const form = useForm<MemberSchema>({
    resolver: zodResolver(memberSchema as any),
    defaultValues: {
      id: null,
      email: "",
      firstName: "",
      lastName: "",
      roleId: "",
    },
    disabled: action === "view"
  });



  const handleSubmit = async (values: MemberSchema) => {
    try {
      await axios({
        url: process.env.NEXT_PUBLIC_APP_URL + "/api/v1/user-management",
        method: data ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(values)
      });
      if (data) {
        useActivityLog().log("EDIT", "EDIT:" + data.id!, { from: "ACTION IN FORM", data: values });
      } else {
        useActivityLog().log("CREATE", "CREATE:" + values.email, { from: "ACTION IN FORM", data: values });
      }
      toast.success(`Member ${data ? "updated" : "created"} successfully!`, {
        duration: 2 * 1000,
        description: "Redirecting to member list...",
      });

      setTimeout(() => {
        form.reset();
        router.back();
      }, 2 * 1000);
    } catch (error) {
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
          <FormInputField control={form.control} name='email' label={t("member.email")} />
          <FormInputField control={form.control} name='firstName' label={t("member.firstName")} />
          <FormInputField control={form.control} name='lastName' label={t("member.lastName")} />

          {/* Roles */}
          <div className='mb-5 flex flex-col gap-5 md:col-span-2'>
            <h1 className={cn("text-xl font-bold")}>{t("role.heading")}</h1>
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormControl>
                    <RadioGroup
                    disabled={field.disabled}
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {roles.map((role) => (
                        <FormItem className="flex items-center gap-3 " key={role.id}>
                          <FormControl>
                            <RadioGroupItem className='w-6 h-6 cursor-pointer' value={role.id!} />
                          </FormControl>
                          <FormLabel aria-disabled={field.disabled} className="aria-[disabled=true]:cursor-not-allowed font-normal text-base cursor-pointer">{role.name}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={form.formState.disabled || form.formState.isSubmitting} className='m-auto md:col-span-2 min-w-sm '>{t("common.btnSubmit")}</Button>
        </form>
      </div>
    </Form>
  );
};



export default FormMemberInput;