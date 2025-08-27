import ColumnAction from "@/components/datatable/column-action";
import { useActivityLog } from "@/hooks/use-activity-log";
import { useRouter } from "@/i18n/navigation";
import { RouteBuilder } from "@/lib/path";
import { CustomColumnDef, RoleModel } from "@/model";
import { usePermissions } from "@/providers/PermissionProvider";
import { useTranslations } from "next-intl";

export const roleColumnDef = (): CustomColumnDef<RoleModel>[] => {
    const t = useTranslations();
    return (
        [

            {
                accessorKey: "name",
                header: t("role.table.column.name")
            },
            {
                accessorKey: "description",
                header: t("role.table.column.desc")
            },
            {
                accessorKey: "createdAt",
                header: t("common.createdAt")
            },
            {
                accessorKey: "updatedAt",
                header: t("common.updatedAt")
            },
            {
                accessorKey: "id",
                header: t("common.action"),
                alignItem: "center",
                cell: ({ getValue }) => {
                    const router = useRouter();
                    const { can } = usePermissions();
                    return (
                        <ColumnAction
                            canEdit={can("update", RouteBuilder.SETTINGS.ROLE.UPDATE(getValue() as string))}
                            canView={can("view", RouteBuilder.SETTINGS.ROLE.VIEW(getValue() as string))}
                            handleEdit={() => router.push(RouteBuilder.SETTINGS.ROLE.UPDATE(getValue() as string))}
                            handleView={() => {
                                useActivityLog().log("VIEW", RouteBuilder.SETTINGS.ROLE.VIEW(getValue() as string), { from: "ACTION DATA TABLE", id: getValue() });
                                router.push(RouteBuilder.SETTINGS.ROLE.VIEW(getValue() as string));
                            }}
                        />
                    );
                }
            }
        ]
    );
};