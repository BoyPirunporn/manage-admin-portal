'use client';
import useStoreModal from '@/stores/store-model';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import DataTable, { PageSize } from './data-table';
import { DataTablesOutput } from '@/model';
import { logger } from '@/lib/utils';

interface GlobalDataTableProps<T> {
    columns: ColumnDef<T, any>[];
    apiUrl: string;
    queryKey?: string;
    initialPageSize?: PageSize;
    searchCriteria?: {
        column:string;
        value:string;
        searchable:boolean;
        orderable:boolean;
        regex?:boolean;
    }[];
    orders?:string[]
}


function GlobalDataTable<T>({
    columns,
    apiUrl,
    queryKey = 'datatable',
    initialPageSize = 10,
    searchCriteria = [],
    orders = []
}: GlobalDataTableProps<T>) {
    const storeModal = useStoreModal();
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState<PageSize>(() => initialPageSize);
    const { data, isLoading } = useQuery<DataTablesOutput<T>, Error>({
        queryKey: [queryKey, pageIndex, pageSize, searchCriteria],
        queryFn: async () => {
            const payload = {
                draw: pageIndex + 1,
                start: pageIndex * pageSize,
                length: pageSize,
                search: {
                    value: searchCriteria.find((s) => s.searchable)?.value || "", // หรือ key ที่ใช้จริง
                    regex: false,
                },
                order: orders,
                columns: searchCriteria.map((search) => ({
                    data: search.column,
                    name: search.column,
                    searchable: search.searchable,
                    orderable: search.orderable,
                    search: {
                        value: search.value,
                        regex: search.regex,
                    },
                })), // optional
            };
            logger.debug(payload)
            try {
                const res = await fetch(`http://localhost:3000/${apiUrl}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json() as Promise<DataTablesOutput<T>>;
            } catch (error) {
                storeModal.openModal({
                    title: "Error",
                    content: (error as Error).message
                });
                return null as unknown as DataTablesOutput<T>;
            }
        },
        placeholderData: keepPreviousData,
        retry: false
    });

    const table = useReactTable({
        data: data?.data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(data?.recordsFiltered! / pageSize) ?? -1
    });

    return (
        <DataTable
            table={table}
            isLoading={isLoading}
            pageIndex={pageIndex}
            pageCount={table.getPageCount() ?? 0}
            handleNextPage={() => setPageIndex((p) => p + 1)}
            handlePreviousPage={() => setPageIndex((p) => Math.max(0, p - 1))}
            pageSize={pageSize}
            setPageSize={(size) => {
                setPageSize(size);
                setPageIndex(0); // reset page
            }}
        />
    );
}

export default GlobalDataTable;
