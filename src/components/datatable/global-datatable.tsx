'use client';
import { report } from '@/app/api/_utils/api-request';
import logger from '@/lib/logger';
import { CustomColumnDef, PagedResponse, TableState } from '@/model';
import useStoreModal from '@/stores/store-model';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCoreRowModel, RowData, useReactTable } from '@tanstack/react-table';
import axios, { AxiosError, isAxiosError } from 'axios';
import { useState } from 'react';
import DataTable, { PageSize } from './data-table';
import { Button } from '../ui/button';
import { handleClearSession } from '@/lib/auth/auth';
import { signOut } from 'next-auth/react';
import { useStoreMenu } from '@/stores/store-menu';
import { useStoreUser } from '@/stores/store-user';

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
                const { data } = await axios<PagedResponse<T>>(process.env.NEXT_PUBLIC_APP_URL + `/${apiUrl}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    params,
                });
                return data as PagedResponse<T>;
            } catch (error: any) {
                logger.debug({ error });
                if (isAxiosError(error)) {
                    if (error.status === 401) {
                        await handleClearSession();
                        await signOut({ redirect: false });
                        useStoreMenu.getState().clear();
                        useStoreUser.getState().clearUser();
                        storeModal.openModal({
                            title: error?.name,
                            content: (
                                <div className="flex flex-col gap-3">
                                    <p>Session Timeout</p>
                                    <Button className="ml-auto" onClick={() => (window.location.href = "/auth")}>
                                        OK
                                    </Button>
                                </div>
                            ),
                            showCloseButton: false,
                            onInteractOutside: false,
                        });
                    }
                } else {
                    storeModal.openModal({
                        title: error?.name,
                        content: report(error)
                    });
                }

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
            pageCount={data?.totalPages ?? 0}
            totalElement={data?.totalElements ?? 0}
            pageSize={pageSize}
            setPageSize={(size) => {
                setPageSize(size);
                setPageIndex(0); // reset page
            }}
        />
    );
}

export default GlobalDataTable;
