import ColumnAction from "@/components/datatable/column-action";
import { useActivityLog } from "@/hooks/use-activity-log";
import { RouteBuilder } from "@/lib/path";
import { CustomColumnDef, RoleModel } from "@/model";
import { usePermissions } from "@/providers/PermissionProvider";
import { useRouter } from "next/navigation";

export const roleColumnDef: CustomColumnDef<RoleModel>[] = [

    {
        accessorKey: "name",
        header: "Name"
    },
    {
        accessorKey: "description",
        header: "Description"
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
        accessorKey: "id",
        header: "Action",
        alignItem: "center",
        cell: ({ getValue }) => {
            const router = useRouter();
            const { can } = usePermissions();
            return (
                <ColumnAction
                    canEdit={can("update", RouteBuilder().SETTINGS.ROLE.UPDATE(getValue() as string))}
                    canView={can("view", RouteBuilder().SETTINGS.ROLE.VIEW(getValue() as string))}
                    handleEdit={() => router.push(RouteBuilder().SETTINGS.ROLE.UPDATE(getValue() as string))}
                    handleView={() => {
                        useActivityLog().log("VIEW", RouteBuilder().SETTINGS.ROLE.VIEW(getValue() as string), { from: "ACTION DATA TABLE", id: getValue() });
                        router.push(RouteBuilder().SETTINGS.ROLE.VIEW(getValue() as string));
                    }}
                />
            );
        }
    }
];