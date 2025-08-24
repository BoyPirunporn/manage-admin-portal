'use client';
import { report } from '@/app/api/_utils/api-request';
import logger from '@/lib/logger';
import { CustomColumnDef, PagedResponse, TableState } from '@/model';
import useStoreModal from '@/stores/store-model';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCoreRowModel, RowData, useReactTable } from '@tanstack/react-table';
import axios from 'axios';
import { useState } from 'react';
import DataTable, { PageSize } from './data-table';

export interface SearchCriteria {
    column: string;
    value: string;
    searchable: boolean;
    orderable: boolean;
    regex?: boolean;
}
export interface GlobalDataTableProps<T extends RowData> {
    columns: CustomColumnDef<T>[];
    apiUrl: string;
    queryKey?: string;
    tableState?: TableState;
}


function GlobalDataTable<T extends RowData>({
    columns,
    apiUrl,
    queryKey = 'datatable',
    tableState
}: GlobalDataTableProps<T>) {
    const storeModal = useStoreModal();
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState<PageSize>(() => tableState?.pageSize ?? 10);

    const { data, isLoading } = useQuery<PagedResponse<T>, Error>({
        queryKey: [queryKey, pageIndex, pageSize, tableState?.globalFilter],
        queryFn: async () => {
            const sortParams = tableState?.sorting?.map(sort =>
                `${sort.id},${sort.desc ? 'desc' : 'asc'}`
            ).join('');
            const params = {
                page: pageIndex,
                size: pageSize,
                sort: sortParams || 'asc', // ตั้งค่า default ถ้าไม่มีการเรียง
                search: tableState?.globalFilter || '',
            };
            try {
                const { data } = await axios<PagedResponse<T>>(process.env.NEXT_PUBLIC_APP_URL +`/${apiUrl}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    params,
                });
                return data as PagedResponse<T>;
            } catch (error: any) {
                logger.debug({ error });
                storeModal.openModal({
                    title: error?.name,
                    content: report(error)
                });
                return null as unknown as PagedResponse<T>;
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
        pageCount: Math.ceil(data?.totalPages! / pageSize) ?? -1
    });

    return (
        <DataTable
            table={table}
            isLoading={isLoading}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageCount={table.getPageCount() ?? 0}
            // handleNextPage={() => setPageIndex((p) => p + 1)}
            // handlePreviousPage={() => setPageIndex((p) => Math.max(0, p - 1))}
            pageSize={pageSize}
            setPageSize={(size) => {
                setPageSize(size);
                setPageIndex(0); // reset page
            }}
        />
    );
}

export default GlobalDataTable;
