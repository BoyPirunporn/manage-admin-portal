import { useCustomRouter } from "@/components/custom-router";
import ColumnAction from "@/components/datatable/column-action";
import { useActivityLog } from "@/hooks/use-activity-log";
import { RouteBuilder } from "@/lib/path";
import { CustomColumnDef, UserModel } from "@/model";
import ImageProvider from "@/providers/ImageProvider";
import { usePermissions } from "@/providers/PermissionProvider";
import { useTranslations } from "next-intl";
export const memberColumn = (): CustomColumnDef<UserModel>[] => {
    const t = useTranslations();
    return [
        {
            accessorKey: "imageUrl",
            header: t("member.table.image"),
            cell: ({ getValue }) => {
                return (
                    <div className="relative w-20 h-20">
                        <ImageProvider key={getValue() as string} src={getValue() as string} className="rounded-md" />
                    </div>
                );
            }
        },
        {
            accessorKey: "email",
            header: t("member.email")
        },
        {
            accessorKey: "firstName",
            header: t("member.firstName")
        },
        {
            accessorKey: "lastName",
            header: t("member.lastName")
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
            cell: ({  row }) => {
                const { can } = usePermissions();
                const router = useCustomRouter();
                const canView = can("view", RouteBuilder.SETTINGS.MEMBER.VIEW(row.original.id!));
                const canEdit = can("update", RouteBuilder.SETTINGS.MEMBER.UPDATE(row.original.id!));
                return (
                    <ColumnAction
                        target="MEMBER"
                        metadata={{
                            form: "settings/member",
                            payload: {
                                userId: row.original.id?.toString()
                            }
                        }}
                        canEdit={canEdit}
                        canView={canView}
                        handleEdit={() => {
                            router.push(RouteBuilder.SETTINGS.MEMBER.UPDATE(row.original.id!));
                        }}
                        handleView={() => {
                            useActivityLog().log("VIEW", RouteBuilder.SETTINGS.MEMBER.VIEW(row.original.id!), { from: "ACTION DATA TABLE", id: row.original.id });
                            router.push(RouteBuilder.SETTINGS.MEMBER.VIEW(row.original.id!));
                        }} />
                );
            }
        },
    ];
}