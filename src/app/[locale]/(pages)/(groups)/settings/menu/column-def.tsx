import ColumnAction from "@/components/datatable/column-action";
import { GlobalDataTableProps } from "@/components/datatable/global-datatable";
import RenderIcon, { IconName } from "@/components/ui/render-icon";
import { CustomColumnDef, MenuModel } from "@/model";
import useStoreModal from "@/stores/store-model";
import dynamic from "next/dynamic";
import React from "react";

export const menuItemColumn: CustomColumnDef<MenuModel>[] = [
    {
        accessorKey: "icon",
        header: () => <p className="text-center">Icon</p>,
        cell: ({ getValue }) => {
            return <div className="flex justify-center"><RenderIcon name={getValue() as IconName} /></div>;
        }
    },
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorKey: "visible",
        header: "Visible"
    },
    {
        accessorKey: "id",
        header: () => <p className="text-center">Action</p>,
        cell: ({ row, getValue }) => {
            return (
                <ColumnAction
                    target="MENU"
                    metadata={{
                        form: "settings/menu",
                        payload: {
                            menuId: row.original.id?.toString()
                        }
                    }}
                    handleEdit={() => {
                        const GlobalDataTableLazy = dynamic<GlobalDataTableProps<MenuModel>>(() => import("@/components/datatable/global-datatable"), {
                            ssr: false,
                        });
                        useStoreModal.getState().openModal({
                            title: "Menu of " + row.original.title,
                            size: "lg",
                            content: (
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    {/* <GlobalDataTableLazy
                                        queryKey={"parent-datatable-" + getValue()}
                                        searchCriteria={[
                                            {
                                                column: "parent",
                                                value: getValue() as string,
                                                searchable: false,
                                                orderable: false
                                            }
                                        ]} columns={menuItemColumn2} apiUrl={"/api/menu"} /> */}
                                </React.Suspense>
                            )
                        });
                    }}
                    handleView={() => {

                    }}
                />
            );
        }
    },
];
export const menuItemColumn2: CustomColumnDef<MenuModel>[] = [
    {
        accessorKey: "icon",
        header: () => <p className="text-center">Icon</p>,
        cell: ({ getValue }) => {
            return <div className="flex justify-center"><RenderIcon name={getValue() as IconName} /></div>;
        }
    },
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorKey: "visible",
        header: "Visible"
    },
    {
        accessorKey: "id",
        header: "Action",
        alignItem: "center",
        cell: ({ row, getValue }) => {
            return (
                <ColumnAction
                    handleEdit={() => {
                        const GlobalDataTableLazy = dynamic<GlobalDataTableProps<MenuModel>>(() => import("@/components/datatable/global-datatable"), {
                            ssr: false,
                        });
                        useStoreModal.getState().openModal({
                            title: "Menu of " + row.original.title,
                            size: "lg",
                            content: (
                                <React.Suspense fallback={<div>Loading...</div>}>
                                    {/* <GlobalDataTableLazy queryKey={"parent-datatable-" + getValue()} searchCriteria={[
                                        {
                                            column: "parent",
                                            value: getValue() as string,
                                            searchable: false,
                                            orderable: false
                                        }
                                    ]} columns={menuItemColumn2} apiUrl={"/api/menu"} /> */}
                                </React.Suspense>
                            )
                        });
                    }}
                    handleView={() => {

                    }}
                />
            );
        }
    },
];