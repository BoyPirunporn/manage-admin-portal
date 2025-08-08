import { Button } from '@/components/ui/button';
import { ComboBoxIcon } from '@/components/ui/combobox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input';
import { logger } from '@/lib/utils';
import { MenuModel } from '@/model';
import useStoreModal from '@/stores/store-model';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Icons from "lucide-react";
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { created } from './action';
import { useActivityLog } from '@/hooks/use-activity-log';

const baseMenuSchema: z.ZodType<MenuModel> = z.lazy(() =>
    z.object({
        id: z.number().nullable(),
        title: z.string().min(1).max(50).transform(v => v.charAt(0).toUpperCase() + v.slice(1)),
        url: z.string().nullable(),
        icon: z
            .union([
                z.literal(null),
                z.enum(Object.keys(Icons) as [keyof typeof Icons])
            ])
            .optional(),
        visible: z.preprocess(
            val => {
                return String(val) === "true";
            },
            z.boolean()
        ),
        isGroup: z.preprocess(
            val => {
                return String(val) === "true";
            },
            z.boolean()
        ),
        items: z.array(baseMenuSchema),
        parent: baseMenuSchema.nullable(),
    })
).superRefine((data, ctx) => {
    if (data.isGroup) {
        // ถ้าเป็นกลุ่ม ต้องไม่มี url หรือ url เป็น empty string
        if (data.url && data.url.trim() !== "") {
            ctx.addIssue({
                code: "custom",
                message: "If isGroup is true, url must be empty or undefined",
                path: ["url"],
            });
        }
    } else {
        // ถ้าไม่ใช่กลุ่ม ต้องมี url ที่ไม่ใช่ empty string
        if (!data.url || data.url.trim() === "") {
            ctx.addIssue({
                code: "custom",
                message: "If isGroup is false, url is required",
                path: ["url"],
            });
        }
    }
});

// infer type จาก schema
type BaseMenuSchema = z.infer<typeof baseMenuSchema>;


const MenuInputForm = ({
    data
}: Readonly<{
    data: MenuModel | null;
}>) => {
    const modal = useStoreModal();
    const form = useForm<MenuModel>({
        resolver: zodResolver(baseMenuSchema as any), // No error now,
        defaultValues: data ?? {
            id: null,
            title: "",
            url: "",
            visible: true,
            isGroup: false,
            icon: null,
            items: [],
            parent: null
        }
    });

    const handleSubmit = async (menu: BaseMenuSchema) => {
        try {
            await created(menu);
            toast.info("Menu has been created.");
        } catch (error) {
            logger.debug(error);
            toast.error("Menu has not been created");
        } finally {
            useActivityLog().log("CREATE", "CREATE:MENU:", { form: "settings/menu", payload: menu });
            modal.closeModal();
        }
    };

    const [searchQuery, setSearchQuery] = React.useState(data?.icon ?? "");
    const filteredOptions = Object.keys(Icons)
        .filter((icon) => icon.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 50)
        .map((icon) => ({ label: icon, value: icon }));

    logger.debug(form.formState.errors);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col h-full  gap-3'>
                <FormInputField control={form.control} name={"title"} label={'Title'} />
                <FormInputField control={form.control} name={"url"} label={'Url'} />
                <FormInputField
                    control={form.control}
                    name={"parent"}
                    label={'Parent'}
                    variant="autocomplete"
                    uri='/api/menu/find-by-title'
                    transformFn={(data) =>
                        data.map((item) => ({
                            label: item.title,
                            value: item.id!
                        }))
                    }
                    mapValueBeforSet={(data, value) => {
                        return data.find(item => item.id === Number(value))!;
                    }}
                />
                <FormInputField control={form.control} name='visible'
                    variant="select"
                    defaultValue={"true"}
                    options={[
                        { value: "true", label: "true" },
                        { value: "false", label: "false" }
                    ]}
                    label={'Visible'} />
                <FormInputField control={form.control} name='isGroup'
                    variant="select"
                    defaultValue={"true"}
                    options={[
                        { value: "true", label: "true" },
                        { value: "false", label: "false" }
                    ]}
                    label={'IsGroup'} />
                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Icon</FormLabel>
                            <FormControl>
                                <ComboBoxIcon
                                    options={filteredOptions}
                                    inputValue={searchQuery}
                                    value={field.value!}
                                    onChange={field.onChange}
                                    placeholder="Select an icon"
                                    onInputChange={(v) => {
                                        setSearchQuery(v);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="mt-auto">Submit</Button>
            </form>
        </Form>
    );
};

export default MenuInputForm;