"use client";
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input';
import { useActivityLog } from '@/hooks/use-activity-log';
import { handleClearSession } from '@/lib/auth/auth';
import { useStoreMenu } from '@/stores/store-menu';
import { useStoreUser } from '@/stores/store-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { changePasswordAction } from './action';


const changePassword = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
  confirmPassword: z.string().min(1)
}).superRefine((data, ctx) => {
  if (data.newPassword !== data.confirmPassword) {

    ctx.addIssue({
      code: "custom",
      message: "Password does'n match",
      path: ["confirmPassword"]
    });
  }

  if (data.newPassword === data.currentPassword) {
    ctx.addIssue({
      code: "custom",
      message: "New Password must not be equal to Current Password",
      path: ["newPassword"]
    });
  }
});

export type ChangePasswordSchema = z.infer<typeof changePassword>;

const ChangePasswordPage = () => {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePassword),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    mode: "all"
  });
  const handleSubmit = async (data: ChangePasswordSchema) => {
    try {
      const response = await changePasswordAction(data);

      if (response.status) {
        useActivityLog().log("CHANGE_PASSWORD", "/api/user-management/change-password");
        toast.success(response.message, { duration: 3000 });
        setTimeout(() => {
          (async () => {
            await handleClearSession();
            await signOut({ redirect: false });
            useStoreMenu.getState().clear();
            useStoreUser.getState().clearUser();
            window.location.href = `${useLocale()}/auth`;
          })();
        },);
      } else {
        toast.error(response.message, { duration: 3000 });
      }
    } catch (error) {
      toast.error((error as Error).message, { duration: 3000 });
    }
  };
  return (
    <div className='flex flex-col gap-10'>
      <Heading title={'Change Password'} description='Change password your account' />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-5 min-w-[500px] m-auto'>
          <FormInputField control={form.control} name='currentPassword' label='Current Password' placeholder='Current Password' type="password" />
          <FormInputField control={form.control} name='newPassword' label='New Password' placeholder='New password' type="password" />
          <FormInputField control={form.control} name='confirmPassword' label='Confirm Password' placeholder='Confirm Password' type="password" />
          <Button className='m-auto'>Save changes</Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordPage;