import ColumnAction from "@/components/datatable/column-action";
import { CustomColumnDef, UserModel } from "@/model";
import ImageProvider from "@/providers/ImageProvider";
import useStoreDrawer from "@/stores/store-drawer";
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
        accessorKey: "action",

        header: "Action",
        alignItem: "center",
        cell: ({ row }) => {
            const router = useRouter();
            return (
                <ColumnAction
                    target="MEMBER"
                    metadata={{
                        form: "settings/member",
                        payload: {
                            userId: row.original.id?.toString()
                        }
                    }}
                    handleEdit={() => {
                        router.push("/settings/member/" + row.original.id);
                    }}
                    handleView={() => {
                        useStoreDrawer.getState().openDrawer({
                            title: "Member Details",
                            content: "settings/member/[id]",
                            size: "lg",
                        })
                    }} />
            );
        }
    },
];