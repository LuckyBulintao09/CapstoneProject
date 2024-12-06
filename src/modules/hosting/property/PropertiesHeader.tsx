"use client";

import React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Input } from "@nextui-org/input";

import {
    LayoutGrid,
    Plus,
    Search,
    StretchHorizontal,
    X,
	CheckCircle, CircleOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyViewModeContext } from "./PropertyViewModeProvider";

import { Table } from "@tanstack/react-table";

import CustomBreadcrumbs from "../components/CustomBreadcrumbs";
import { createProperty } from "@/actions/property/create-property";
import { DataTableFacetedFilter } from "./PropertiesTable/data-table-faceted-filter";
import { DataTableViewOptions } from "./PropertiesTable/data-table-view-options";

export const statuses = [
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircle,
  },
  {
    value: "action required",
    label: "Action required",
    icon: CircleOff,
  },
]

interface HeaderToolbarData<TData> {
    table: Table<TData>;
}

function PropertiesHeader<TData>({ table }: HeaderToolbarData<TData>) {
    const [openSearch, setOpenSearch] = React.useState<boolean>(false);
    const { viewMode, setViewMode } = React.useContext(PropertyViewModeContext);

	const isFiltered = table.getState().columnFilters.length > 0

    const isMobile = useMediaQuery("(max-width: 400px)");
    const isDesktop = useMediaQuery("(min-width: 748px)");
    const isSmallDesktop = useMediaQuery("(min-width: 950px)");

    return (
        <div className="flex flex-col justify-start py-5 gap-4">
            <CustomBreadcrumbs />
            <div className="flex flex-row items-center gap-5">
                <div className={cn((!isDesktop && openSearch) || (!isSmallDesktop && openSearch) ? "hidden" : "md:mr-14")}>
                    <h1 className={cn(!isMobile ? "text-nowrap font-semibold text-3xl" : "font-semibold text-3xl text-wrap")}>Your properties</h1>
                </div>

                <div className="relative w-full flex justify-end">
                    {openSearch ? (
                        <Input
                            type="text"
                            startContent={<Search className="w-4 h-auto" />}
                            endContent={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setOpenSearch(false);
                                        table.resetGlobalFilter();
                                    }}
                                    className="rounded-full h-5 w-5 hover:bg-slate-400 bg-slate-300 dark:bg-slate-500 hover:dark:bg-slate-400"
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            }
                            radius="full"
                            variant="bordered"
                            placeholder="Search listings by name or location"
                            className="w-full"
                            value={table.getState().globalFilter}
                            onChange={(event) => table.setGlobalFilter(event.target.value)}
                        />
                    ) : (
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => {
                                setOpenSearch(true);
                            }}
                        >
                            <Search className="w-4 h-auto" />
                        </Button>
                    )}
                </div>

                <div className={cn(!isDesktop && openSearch ? "hidden" : "flex flex-row gap-5 items-center")}>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => {
                            setViewMode(viewMode === "table" ? "grid" : "table");
                        }}
                    >
                        {viewMode === "table" ? <LayoutGrid className="w-4 h-auto" /> : <StretchHorizontal className="w-4 h-auto" />}
                    </Button>
                    <Button
                        // href={'/hosting/properties/host-a-property'}
                        onClick={async () => {
                            await createProperty();
                        }}
                        variant="outline"
                        size="icon"
                        className={cn(
                            // buttonVariants({ size: 'icon', variant: 'outline' }),
                            "rounded-full"
                        )}
                    >
                        <Plus className="w-5 h-auto" />
                    </Button>
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            {/* <div className="flex items-center gap-2">
                {table.getColumn("isApproved") && <DataTableFacetedFilter column={table.getColumn("isApproved")} title="Status" options={statuses} />}
                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reset
                        <X className="h-4 w-auto" />
                    </Button>
                )}
            </div> */}
        </div>
    );
}

export default PropertiesHeader;
