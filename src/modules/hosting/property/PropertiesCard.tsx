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
        <div>
            <PropertiesHeader table={propertiesCardTable} />
            <div className="grid grid-cols-12 gap-7">
                {propertiesCardTable.getRowModel().rows?.length ? (
                    propertiesCardTable.getRowModel().rows.map((row) => (
                        <div key={row.id} className="col-span-12 airBnbTablet:col-span-6 airBnbDesktop:col-span-4">
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
                    <div>
                        <div>No results.</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PropertiesCard;
