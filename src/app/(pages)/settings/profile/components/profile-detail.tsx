import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input';
import { Skeleton } from '@/components/ui/skeleton';
import { EachElement } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z.string().array()
});

type ProfileSchema = z.infer<typeof profileSchema>;
const ProfileDetail = () => {
  const { data: session, status } = useSession();

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roles: []
    }
  });

  React.useEffect(() => {
    if (session?.user) {
      form.reset({
        firstName: session.user.firstName ?? "",
        lastName: session.user.lastName ?? "",
        email: session.user.email ?? "",
        roles: session.user.roles ?? []
      });
    }
  }, [session, form]);
  const handleSubmit = (data: ProfileSchema) => {

  };
  return (
    <Card className='bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm '>
      <CardHeader>
        <CardTitle className='md:text-xl'>Profile Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {status === "loading" ? (
              <EachElement
                of={Array.from(Array(4).keys())}
                render={e => <Skeleton key={e} className='w-full h-10' />}
              />
            ) : (
              <><FormInputField control={form.control} name="firstName" label='First name' placeholder='First name' />
                <FormInputField control={form.control} name="lastName" label='Last name' placeholder='Last name' />
                <FormInputField control={form.control} name="email" label='Email' placeholder='Email' />
                <FormInputField control={form.control} name="roles" label='Role' placeholder='Role' /></>
            )}
            <Button className='md:ml-auto md:col-span-2'>Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card >
  );
};

export default ProfileDetail;