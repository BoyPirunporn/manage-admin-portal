import ColumnAction from "@/components/datatable/column-action";
import { CustomColumnDef, UserRoleModel } from "@/model";
import useStoreDrawer from "@/stores/store-drawer";
import dynamic from "next/dynamic";

export const roleColumnDef: CustomColumnDef<UserRoleModel>[] = [

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
        alignItem: "center",
        header: "Created"
    },
    {
        accessorKey: "updatedAt",
        alignItem: "center",
        header: "Updated"
    },
    {
        accessorKey: "id",
        header: "Action",
        alignItem: "center",
        cell: ({ getValue, row }) => <ColumnAction
            handleEdit={() => {
                const RoleAndPermissionFormLazy = dynamic(() => import("./role-and-permission-form"),{
                    ssr:false
                })
                useStoreDrawer.getState().openDrawer({
                    title:"Edit " + row.original.name,
                    size:"lg",
                    content: (
                        <RoleAndPermissionFormLazy data={row.original}/>
                    )
                })
            }}
            handleView={() => { }}
        />
    }
];