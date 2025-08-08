import ImageProvider from "@/providers/ImageProvider";
import { ColumnDef } from "@tanstack/react-table";

export const memberColumn: ColumnDef<{
    [key: string]: string;
}>[] = [
        {
            accessorKey: "id",
            header: "Id"
        },
        {
            accessorKey: "name",
            header: "Name"
        },
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
        }
    ];