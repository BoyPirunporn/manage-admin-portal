import ColumnAction from "@/components/datatable/column-action";
import { useActivityLog } from "@/hooks/use-activity-log";
import { RouteBuilder } from "@/lib/path";
import { CustomColumnDef, UserModel } from "@/model";
import ImageProvider from "@/providers/ImageProvider";
import { usePermissions } from "@/providers/PermissionProvider";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
export const memberColumn = (): CustomColumnDef<UserModel>[] => {
    const locale = useLocale();
    const t = useTranslations("member");
    return [
        {
            accessorKey: "imageUrl",
            header: t("table.image"),
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
            header: t("table.email")
        },
        {
            accessorKey: "firstName",
            header: t("table.firstName")
        },
        {
            accessorKey: "lastName",
            header: t("table.lastName")
        },
        {
            accessorKey: "createdAt",
            header: t("table.createdAt")
        },
        {
            accessorKey: "updatedAt",
            header: t("table.updatedAt")
        },
        {
            accessorKey: "id",
            header: t("table.action"),
            alignItem: "center",
            cell: ({ getValue, row }) => {
                const { can } = usePermissions();
                const router = useRouter();
                const canView = can("view", RouteBuilder(locale).SETTINGS.MEMBER.VIEW(row.original.id!));
                const canEdit = can("update", RouteBuilder(locale).SETTINGS.MEMBER.UPDATE(row.original.id!));
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
                            router.push(RouteBuilder(locale).SETTINGS.MEMBER.UPDATE(row.original.id!));
                        }}
                        handleView={() => {
                            useActivityLog().log("VIEW", RouteBuilder(locale).SETTINGS.MEMBER.VIEW(row.original.id!), { from: "ACTION DATA TABLE", id: row.original.id });
                            router.push(RouteBuilder(locale).SETTINGS.MEMBER.VIEW(row.original.id!));
                        }} />
                );
            }
        },
    ];
}