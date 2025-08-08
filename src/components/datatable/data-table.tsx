'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    flexRender,
    RowData,
    Table as TableType
} from '@tanstack/react-table';
import React from 'react';
import { EachElement } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

interface IOptionFilter<T> {
    filterHeader: boolean;
    customFilter?: React.ReactNode | null;
    sort?: {
        by: keyof T;
        placeHolderSort?: string;
    };
}

interface IDataTable<T extends RowData> {
    // options?: IOptionFilter<T>;
    table: TableType<T>;
    handlePreviousPage: () => void;
    handleNextPage: () => void;
    pageIndex: number;
    pageCount: number;
    isLoading: boolean;
    setPageSize: (value: PageSize) => void;
    pageSize: PageSize;
}

export const pageSizeOption = [2, 5, 10, 20, 50, 100];
export type PageSize = typeof pageSizeOption[number];

const DataTable = <T,>({
    table,
    pageIndex,
    pageCount,
    handlePreviousPage,
    handleNextPage,
    isLoading,
    setPageSize,
    pageSize
}: IDataTable<T>) => {
    return (
        <div className="w-full">
            <div className="rounded-md border overflow-x-auto">
                <Table className='min-w-max'>
                    <TableHeader >
                        <EachElement
                            of={table.getHeaderGroups()}
                            render={(headerGroup) => {
                                return (
                                    <TableRow key={headerGroup.id}>
                                        <EachElement
                                            of={headerGroup.headers}
                                            render={(header) => {
                                                return (
                                                    <TableHead key={header.id} style={{
                                                        width: `${header.getSize()}px`,
                                                        maxWidth: `${header.getSize()}px`,
                                                        minWidth: `${header.getSize()}px`,
                                                    }} >
                                                        {header.isPlaceholder ? null : (
                                                            flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )
                                                        )}
                                                    </TableHead>
                                                );
                                            }}
                                        />
                                    </TableRow>
                                );
                            }}
                        />
                    </TableHeader>
                    <TableBody >
                        {table.getRowModel().rows?.length ? (
                            <EachElement
                                of={table.getRowModel().rows}
                                render={(row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        <EachElement
                                            of={row.getVisibleCells()}
                                            render={(cell) => {
                                                return (
                                                    <TableCell style={{
                                                        width: `${cell.column.getSize()}px`,
                                                        maxWidth: `${cell.column.getSize()}px`,
                                                        minWidth: `${cell.column.getSize()}px`,
                                                        whiteSpace:"normal",
                                                        wordWrap:"break-word",
                                                        overflowWrap:"break-word"
                                                    }} key={cell.id} >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                );
                                            }}
                                        />
                                    </TableRow>
                                )}
                            />
                        ) : isLoading ? (
                            <EachElement
                                of={Array.from(Array(10).keys())}
                                render={(row) => {
                                    return (
                                        <TableRow
                                            key={row}
                                        >
                                            <EachElement
                                                of={Array.from(Array(table.getHeaderGroups()[0].headers.length).keys())}
                                                render={(cell) => {
                                                    return (
                                                        <TableCell key={cell} >
                                                            <Skeleton className=" rounded-sm h-[30px] w-full " />
                                                        </TableCell>
                                                    );
                                                }}
                                            />
                                        </TableRow>
                                    );
                                }}
                            />
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className='h-24 text-center'
                                >
                                    No Result
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {!table.getRowModel().rows?.length ? 0 : pageIndex + 1} of {pageCount || 0}
                </div>
                <Select
                    defaultValue={pageSize.toString()}
                    onValueChange={(value: any) => setPageSize(Number(value) as PageSize)}
                >
                    <SelectTrigger disabled={!table.getRowModel().rows?.length} className="max-w-[100px] cursor-pointer">
                        <SelectValue placeholder="Select a Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {pageSizeOption.map(item => (
                                <SelectItem className='cursor-pointer' key={item} value={item.toString()}>{item}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={pageIndex === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={(pageIndex + 1 === pageCount) || !table.getRowModel().rows?.length}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default DataTable;