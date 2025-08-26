import ColumnAction from "@/components/datatable/column-action";
import { useActivityLog } from "@/hooks/use-activity-log";
import { RouteBuilder } from "@/lib/path";
import { CustomColumnDef, UserModel } from "@/model";
import ImageProvider from "@/providers/ImageProvider";
import { usePermissions } from "@/providers/PermissionProvider";
import { useRouter } from "next/navigation";
export const memberColumn: CustomColumnDef<UserModel>[] = [
    {
        accessorKey: "imageUrl",
        header: "Image",
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
        header: "Email"
    },
    {
        accessorKey: "firstName",
        header: "First Name"
    },
    {
        accessorKey: "lastName",
        header: "Last Name"
    },
    {
        accessorKey: "createdAt",
        header: "Created At"
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At"
    },
    {
        accessorKey: "action",

        header: "Action",
        alignItem: "center",
        cell: ({ getValue, row }) => {
            const { can } = usePermissions();
            const router = useRouter();
            const canView = can("view", RouteBuilder().SETTINGS.MEMBER.VIEW(row.original.id!));
            const canEdit = can("update", RouteBuilder().SETTINGS.MEMBER.UPDATE(row.original.id!));
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
                        router.push(RouteBuilder().SETTINGS.MEMBER.UPDATE(row.original.id!));
                    }}
                    handleView={() => {
                        useActivityLog().log("VIEW", RouteBuilder().SETTINGS.MEMBER.VIEW(row.original.id!), { from: "ACTION DATA TABLE", id: row.original.id });
                        router.push(RouteBuilder().SETTINGS.MEMBER.VIEW(row.original.id!));
                    }} />
            );
        }
    },
];