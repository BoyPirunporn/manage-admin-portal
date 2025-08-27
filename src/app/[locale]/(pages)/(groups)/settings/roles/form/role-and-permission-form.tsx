"use client";

import AccordionLevel, { KEY_MAP, PermissionKey } from "@/components/accordion-level";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInputField } from "@/components/ui/form-input";
import { useActivityLog } from "@/hooks/use-activity-log";
import logger from "@/lib/logger";
import { RouteBuilder } from "@/lib/path";
import report from "@/lib/report";
import { MenuModel, RoleModelWithPermission } from "@/model";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/* ----------------------------- Schema & Types ----------------------------- */
const roleSchema = z.object({
    id: z.string().nullable(),
    name: z.string().min(1, "Role name is required"),
    description: z.string().nullable(),
    permissions: z.array(
        z.object({
            menuId: z.string(),
            canView: z.boolean().catch(false),
            canCreate: z.boolean().catch(false),
            canUpdate: z.boolean().catch(false),
            canDelete: z.boolean().catch(false),
        })
    ),
});

type RoleSchema = z.infer<typeof roleSchema>;



/* ------------------------------ Main Component ---------------------------- */
const RoleAndPermissionForm = ({
    data,
    menus,
}: {
    data: RoleModelWithPermission | null;
    menus: MenuModel[];
}) => {
    const [checkedPermissions, setCheckedPermissions] = useState<
        Record<string, boolean>
    >({});
    const router = useRouter();
    const t = useTranslations();

    const form = useForm<RoleSchema>({
        resolver: zodResolver(roleSchema),
        disabled: !!data,
        defaultValues: data ?? {
            id: "",
            name: "",
            description: "",
            permissions: [],
        },
    });

    /* ---------------------------- Handle Permission --------------------------- */
    const handleCheck = useCallback(
        (menu: MenuModel, permission: PermissionKey, checked: boolean) => {
            const key = `${menu.id}_${permission}`;
            setCheckedPermissions((prev) => ({ ...prev, [key]: checked }));

            const current = form.getValues("permissions");
            const existing = current.find((m) => m.menuId === menu.id);

            const updated = !existing
                ? [
                    ...current,
                    {
                        menuId: menu.id!,
                        canView: permission === "VIEW" ? checked : false,
                        canCreate: permission === "CREATE" ? checked : false,
                        canUpdate: permission === "UPDATE" ? checked : false,
                        canDelete: permission === "DELETE" ? checked : false,
                    },
                ]
                : current.map((m) =>
                    m.menuId === menu.id
                        ? {
                            ...m,
                            canView: permission === "VIEW" ? checked : m.canView,
                            canCreate: permission === "CREATE" ? checked : m.canCreate,
                            canUpdate: permission === "UPDATE" ? checked : m.canUpdate,
                            canDelete: permission === "DELETE" ? checked : m.canDelete,
                        }
                        : m
                );

            form.setValue(
                "permissions",
                updated.filter(
                    (m) => m.canView || m.canCreate || m.canUpdate || m.canDelete
                )
            );
        },
        [form]
    );

    /* ------------------------------- Submit Form ------------------------------ */
    const handleSubmit = async (schema: RoleSchema) => {
        try {
            await axios({
                url: `${process.env.NEXT_PUBLIC_APP_URL}/api/roles`,
                method: data ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                data: schema,
            });

            if (data) {
                useActivityLog().log("EDIT", RouteBuilder.SETTINGS.ROLE.VIEW(data.id!), { from: "ACTION IN FORM", data: schema });
            } else {
                useActivityLog().log("CREATE", RouteBuilder.SETTINGS.ROLE.CREATE, { from: "ACTION IN FORM", data: schema });
            }
            toast.success(`Role has been ${data ? "updated" : "created"}!`, {
                duration: 2000,
                description: "Redirecting to Role list...",
            });

            setTimeout(() => {
                form.reset();
                router.back();
            }, 2000);
        } catch (error) {
            logger.info({ error });
            toast.error(report(error), { duration: 3000 });
        }
    };

    /* ---------------------------- Hydrate Permission -------------------------- */
    useEffect(() => {
        if (!data) return;

        data.permissions.forEach((perm) => {
            Object.entries(perm).forEach(([key, value]) => {
                if (key in KEY_MAP) {
                    const mapKey = `${perm.menuId}_${KEY_MAP[key]}`;
                    setCheckedPermissions((prev) => ({
                        ...prev,
                        [mapKey]: value as boolean,
                    }));
                }
            });
        });
    }, [data]);

    /* ------------------------------- Render Form ------------------------------ */
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="mt-5 flex flex-col gap-5"
            >
                <div className="md:!max-w-lg flex flex-col gap-2">
                    <FormInputField control={form.control} name="name" label={t("role.form.input.roleName")} />
                    <FormInputField
                        control={form.control}
                        name="description"
                        label={t("role.form.input.roleDesc")}
                    />
                </div>

                {/* Menus */}
                <div className="mb-5 flex flex-col gap-5 md:col-span-2">
                    <h1 className="text-xl font-bold">Menus</h1>
                    <AccordionLevel
                        disabled={!!data}
                        items={menus}
                        checkedPermissions={checkedPermissions}
                        handleCheck={handleCheck}
                    />
                </div>

                <Button disabled={!!data} className="m-auto md:min-w-md">Submit</Button>
            </form>
        </Form>
    );
};

export default RoleAndPermissionForm;
