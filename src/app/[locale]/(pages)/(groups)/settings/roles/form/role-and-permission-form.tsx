"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInputField } from "@/components/ui/form-input";
import { useActivityLog } from "@/hooks/use-activity-log";
import { RouteBuilder } from "@/lib/path";
import report from "@/lib/report";
import { MenuModel, RoleModelWithPermission } from "@/model";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import AccordionMenuItem from "./accordion-menu-item";

const getPermissionSchema = z.object({
    menuId: z.string(),
    canView: z.boolean().catch(false),
    canCreate: z.boolean().catch(false),
    canUpdate: z.boolean().catch(false),
    canDelete: z.boolean().catch(false),
});
/* ----------------------------- Schema & Types ----------------------------- */
const getRoleSchema = (t: (key: string, values?: Record<string, string>) => string) => z.object({
    id: z.string().nullable(),
    name: z.string().min(1, t("validators.required.text",{field:t("role.form.input.roleName")})),
    description: z.string().nullable(),
    permissions: z.array(getPermissionSchema),
});

export type RoleSchema = z.infer<ReturnType<typeof getRoleSchema>>;
export type permissionSchema = z.infer<typeof getPermissionSchema>;


/* ------------------------------ Main Component ---------------------------- */
const RoleAndPermissionForm = ({
    data,
    menus,
    disabled = false
}: {
    data: RoleModelWithPermission | null;
    menus: MenuModel[];
    disabled?:boolean;
}) => {
    const router = useRouter();
    const t = useTranslations();

    const roleSchema = useMemo(() => getRoleSchema(t), [t]);

    const form = useForm<RoleSchema>({
        resolver: zodResolver(roleSchema),
        disabled: disabled,
        defaultValues: data ?? {
            id: "",
            name: "",
            description: "",
            permissions: [],
        },
    });

    /* ------------------------------- Submit Form ------------------------------ */
    const handleSubmit = async (schema: RoleSchema) => {
        const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/roles`;

        try {
            
            await axios({
                url: data ? url.concat(`/${data.id}`) : url,
                method: data ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                data: schema,
            });

            if (data) {
                useActivityLog().log("EDIT", RouteBuilder.SETTINGS.ROLE.VIEW(data.id!), { from: "ACTION IN FORM", data: schema });
            } else {
                useActivityLog().log("CREATE", RouteBuilder.SETTINGS.ROLE.CREATE, { from: "ACTION IN FORM", data: schema });
            }
            toast.success(t("role.toastSuccess", {
                msg: schema.name,
                state: data ? "updated" : "created"
            }), {
                duration: 2000,
                description: t("role.toastDescription"),
            });

            setTimeout(() => {
                form.reset();
                router.back();
            }, 2000);
        } catch (error) {
            toast.error(report(error), { duration: 3000 });
        }
    };

    /* ------------------------------- Render Form ------------------------------ */
    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="mt-5 flex flex-col gap-5"
                >
                    <div className="md:!max-w-lg flex flex-col gap-5">
                        <FormInputField control={form.control} name="name" label={t("role.form.input.roleName")} />
                        <FormInputField
                            control={form.control}
                            name="description"
                            label={t("role.form.input.roleDesc")}
                        />
                    </div>

                    {/* Menus */}
                    <div className="mb-5 flex flex-col gap-5 md:col-span-2">
                        <h1 className="text-xl font-bold">{t("common.listMenus")}</h1>
                        <AccordionMenuItem menuItems={menus} />
                    </div>

                    <Button disabled={form.formState.disabled} className="m-auto md:min-w-md">{t("common.btnSubmit")}</Button>
                </form>
            </Form>
        </>
    );
};

export default RoleAndPermissionForm;
