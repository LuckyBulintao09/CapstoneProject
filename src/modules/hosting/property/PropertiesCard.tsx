"use client";

import React from "react";

import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMediaQuery } from "@/hooks/use-media-query";

import { fuzzyFilter } from "./PropertiesTable/fuzzy-filters";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

import PropertiesHeader from "./PropertiesHeader";
import { DataTablePagination } from "./PropertiesTable/data-table-pagination";

function PropertiesCard<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilters, setGlobalFilters] = React.useState("");

    const propertiesCardTable = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilters,
        globalFilterFn: "fuzzy",
        state: {
            sorting,
            columnFilters,
            globalFilter: globalFilters,
        },
        filterFns: {
            fuzzy: fuzzyFilter,
        },
    });

    const isDesktop = useMediaQuery("(min-width: 740px)");
    
    return (
        <div className="h-full min-h-screen pb-11">
            <PropertiesHeader table={propertiesCardTable} />
            <div className="grid airBnbDesktop:grid-cols-5 airBnbTablet:grid-cols-2 grid-cols-1 gap-3">
                {propertiesCardTable.getRowModel().rows?.length ? (
                    propertiesCardTable.getRowModel().rows.map((row) => (
                        <div key={row.id} className="col-span-1">
                            {row.getVisibleCells().map((cell) => {
                                if (
                                    !isDesktop &&
                                    (cell.column.columnDef.header ===
                                        "Address")
                                ) {
                                    return null;
                                }
                                return (
                                    <div key={cell.id} className="bg-transparent cursor-pointer relative">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full border border-dashed flex items-center justify-center aspect-auto w-full h-[400px] rounded-xl">
                        <div>No results.</div>
                    </div>
                )}
            </div>
            <DataTablePagination table={propertiesCardTable} />
        </div>
    );
}

export default PropertiesCard;
