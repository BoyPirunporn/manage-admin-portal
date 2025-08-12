import { Form } from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input';
import { EachElement } from '@/lib/utils';
import { UserRoleModel } from '@/model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const permissionSchema = z.object({
    id: z.number().nullable(),
    name: z.string().min(1),
    description: z.string().nullable()
});
const roleSchema = z.object({
    id: z.number().nullable(),
    name: z.string().min(1),
    description: z.string().nullable(),
    permissions: z.array(permissionSchema)
});

type PermissionSchema = z.infer<typeof permissionSchema>;
type RoleSchema = z.infer<typeof roleSchema>;


const RoleAndPermissionForm = ({
    data
}: {
    data: UserRoleModel | null;
}) => {

    const form = useForm<RoleSchema>({
        resolver: zodResolver(roleSchema),
        defaultValues: data ?? {
            name: "",
            permissions: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "permissions"
    });

    const handleSubmit = (data: RoleSchema) => {

    };
    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-5 mt-5'>
                <FormInputField control={form.control} name='name' label='Role name' />
                <FormInputField control={form.control} name='description' label='Role description' />

                <div className="flex flex-col gap-3">
                    <EachElement
                        of={fields}
                        render={(_,index) => {
                            return (
                                <div className='grid grid-cols-2 border border-dashed py-5 px-2 space-x-3'>
                                    <FormInputField control={form.control} name={`permissions.${index}.name`} label='Permission name' />
                                    <FormInputField control={form.control} name={`permissions.${index}.description`} label='Permission description' />
                                </div>
                            );
                        }}
                    />
                </div>
            </form>
        </Form>
    );
};

export default RoleAndPermissionForm;