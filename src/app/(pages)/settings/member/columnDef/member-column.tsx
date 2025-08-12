import ColumnAction from "@/components/column-action";
import { CustomColumnDef, UserModel } from "@/model";
import ImageProvider from "@/providers/ImageProvider";
import useStoreDrawer from "@/stores/store-drawer";
import dynamic from "next/dynamic";
import React from 'react';
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
        cell: ({ row }) =>
            <ColumnAction handleEdit={() => {
                const FormMemberInputLazy = dynamic(() => import('../[id]/components/form-member-input'), {
                    ssr: false
                });
                useStoreDrawer.getState().openDrawer({
                    title: "Edit " + row.original.firstName,
                    content: (
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <FormMemberInputLazy data={row.original} />
                        </React.Suspense>
                    ),

                    size: "lg",
                });
            }}
                handleView={() => { }} />
    },
];