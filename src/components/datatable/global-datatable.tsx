'use client';
import { logger } from '@/lib/utils';
import { CustomColumnDef, DataTablesOutput } from '@/model';
import useStoreModal from '@/stores/store-model';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCoreRowModel, RowData, useReactTable } from '@tanstack/react-table';
import axios from 'axios';
import { useState } from 'react';
import DataTable, { PageSize } from './data-table';
import { report } from '@/app/api/_utils/api-request';

interface SearchCriteria {
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
    initialPageSize?: PageSize;
    searchCriteria?: SearchCriteria[];
    orders?: string[];
}


function GlobalDataTable<T extends RowData>({
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
            logger.debug(payload);
            try {
                const res = await axios<DataTablesOutput<T>>(`http://localhost:3000/${apiUrl}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    data: payload,
                });
                return res.data as DataTablesOutput<T>;
            } catch (error) {
                // logger.debug({error})
                console.log("ERROR -> ", error);
                storeModal.openModal({
                    title: "Error",
                    content: report(error)
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
