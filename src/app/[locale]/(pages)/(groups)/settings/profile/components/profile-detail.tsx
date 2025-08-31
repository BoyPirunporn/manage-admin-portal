import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input';
import { Skeleton } from '@/components/ui/skeleton';
import { EachElement } from '@/lib/utils';
import { useStoreMenu } from '@/stores/store-menu';
import { useStoreUser } from '@/stores/store-user';
import { zodResolver } from '@hookform/resolvers/zod';
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
  const { user: session } = useStoreUser();
  const { menus } = useStoreMenu();

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
            {!session ? (
              <EachElement
                of={Array.from(Array(4).keys())}
                render={e => <Skeleton key={e} className='w-full h-10' />}
              />
            ) : (
              <>
                <FormInputField control={form.control} readonly name="firstName" label='First name' placeholder='First name' />
                <FormInputField control={form.control} readonly name="lastName" label='Last name' placeholder='Last name' />
                <FormInputField control={form.control} readonly name="email" label='Email' placeholder='Email' />

                <div className="md:col-span-2 gap-2 flex flex-col">
                  <h1 className="text-xl">Roles</h1>
                  {/* <AccordionComponent
                    items={menus as MenuPermissionNode[]}
                  /> */}
                </div>
              </>
            )}
            <Button className='md:ml-auto md:col-span-2'>Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card >
  );
};

// const AccordionComponent = ({
//   items
// }: {
//   items: MenuPermissionNode[];
// }) => {
//   const locale = useLocale();
//   const field: MenuLabelKey = MapLocalMenu[locale as EnabledLocale];
//   const [accordionValue, setAccordionValue] = React.useState<string | undefined>(undefined);

//   const renderPermission = (item: MenuPermissionNode) => {
//     let elements: React.ReactNode[] = [];
//     Object.entries(item).forEach(([key, value]) => {
//       if (key in KEY_MAP) {
//         const mapKey = `${item.menuId}_${KEY_MAP[key]}`;
//         elements.push(
//           <div key={mapKey} className="flex items-center gap-2">
//             <Checkbox
//               checked={value}
//               disabled
//               id={mapKey}
//             />
//             <Label className='cursor-pointer ' htmlFor={mapKey}>{KEY_MAP[key]}</Label>
//           </div>
//         );
//       }
//     });
//     return elements;
//   };
//   return (
//     <Accordion
//       type="single"
//       collapsible
//       value={accordionValue}
//       onValueChange={setAccordionValue}
//       className="flex flex-col gap-5"
//     >
//       {items && items.length && items.map((item) => (
//         <AccordionItem key={item.menuId} value={item[field]}>
//           <AccordionTrigger className="cursor-pointer border px-2">{item[field]}</AccordionTrigger>
//           <AccordionContent className="rounded-md px-3 py-2">
//             {item.children?.length ? (
//               <AccordionComponent
//                 items={item.children}
//               />
//             ) : (
//               <div className="flex flex-row gap-4 flex-wrap">
//                 {
//                   renderPermission(item)
//                 }
//               </div>
//             )}
//           </AccordionContent>
//         </AccordionItem>
//       ))}
//     </Accordion>
//   );
// };

export default ProfileDetail;