import GlobalDataTable from "@/components/datatable/global-datatable";
import { Button } from "@/components/ui/button";
import RenderIcon, { IconName } from "@/components/ui/render-icon";
import { MenuModel } from "@/model";
import useStoreDrawer from "@/stores/store-drawer";
import useStoreModal from "@/stores/store-model";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import MenuInputForm from "./menu-input-form";

export const menuItemColumn: ColumnDef<MenuModel>[] = [
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
            const handleEdit = () => {
                useStoreModal.getState().openModal({
                    title: "Menu of " + row.original.title,
                    size:"lg",
                    content: (
                        <GlobalDataTable queryKey={"parent-datatable-" + getValue()} searchCriteria={[
                            {
                                column: "parent",
                                value: getValue() as string,
                                searchable: false,
                                orderable: false
                            }
                        ]} columns={menuItemColumn2} apiUrl={"/api/menu"} />
                    )
                });
            };
            
            const handleView = () => {

            }

            return (
                <div className="flex justify-center">
                    <Button variant={"ghost"} onClick={handleEdit}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant={"ghost"} onClick={handleView}>
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            );
        }
    },
];
export const menuItemColumn2: ColumnDef<MenuModel>[] = [
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
            const handleEdit = () => {
                useStoreDrawer.getState().openDrawer({
                    title: "Menu of " + row.original.title,
                    content: (
                        <MenuInputForm data={row.original} />
                    )
                });
            };
            const handleView = () => {

            }

            return (
                <div className="flex justify-center">
                    <Button variant={"ghost"} onClick={handleEdit}>
                        <Edit className="w-4 h-4" />
                    </Button>
                     <Button variant={"ghost"} onClick={handleView}>
                        <Eye className="w-4 h-4" />
                    </Button>
                </div>
            );
        }
    },
];