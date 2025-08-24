import ColumnAction from "@/components/datatable/column-action";
import { PATH } from "@/lib/path";
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
        accessorKey: "id",
        header: "Action",
        alignItem: "center",
        cell: ({ getValue, row }) => {
            const router = useRouter();
            const {can} = usePermissions();
            return (
                <ColumnAction
                    canEdit={can("update",PATH.SETTINGS.ROLE.UPDATE(getValue() as string))}
                    canView={can("view",PATH.SETTINGS.ROLE.VIEW(getValue() as string))}
                    handleEdit={() => router.push(PATH.SETTINGS.ROLE.UPDATE(getValue() as string))}
                    handleView={() => router.push(PATH.SETTINGS.ROLE.VIEW(getValue() as string))}
                />
            );
        }
    }
];