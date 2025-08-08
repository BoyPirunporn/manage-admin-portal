"use client"
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


const changePassword = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
  confirmPassword: z.string().min(1)
}).superRefine((data, ctx) => {
  if (data.confirmPassword !== data.newPassword) {
   
    ctx.addIssue({
      code: "custom",
      message: "Password does'n match",
      path: ["confirmPassword"]
    });
  }

  if(data.newPassword === data.currentPassword){
    ctx.addIssue({
      code:"custom",
      message:"New Password must not be equal to Current Password",
      path:["newPassword"]
    })
  }
});

type ChangePasswordSchema = z.infer<typeof changePassword>;

const ChangePasswordPage = () => {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePassword),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    mode:"onBlur"
  });
  const handleSubmit = (data:ChangePasswordSchema) => {

  }
  return (
    <div className='flex flex-col gap-10'>
      <div className="flex flex-col gap-1 justify-center">
        <h1 className="text-xl md:text-2xl font-bold">Change Password</h1>
        <p className="text-sm text-gray-400">Change password your account</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-5 min-w-[500px] m-auto'>
          <FormInputField  control={form.control} name='currentPassword' label='Current Password' placeholder='Current Password' type="password"/>
          <FormInputField control={form.control} name='newPassword' label='New Password' placeholder='New password' type="password"/>
          <FormInputField control={form.control} name='confirmPassword' label='Confirm Password' placeholder='Confirm Password' type="password"/>
          <Button className='m-auto'>Save changes</Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordPage;