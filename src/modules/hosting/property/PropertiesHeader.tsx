"use client";

import React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { CheckCircledIcon, CircleBackslashIcon, CircleIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Input } from "@nextui-org/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { useMediaQuery } from "@/hooks/use-media-query";

import {
    LayoutGrid,
    Plus,
    Search,
    StretchHorizontal,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyViewModeContext } from "./PropertyViewModeProvider";

import { Table } from "@tanstack/react-table";

import CustomBreadcrumbs from "../components/CustomBreadcrumbs";

import { createProperty } from "@/actions/property/create-property";
import { DataTableFacetedFilter } from "./PropertiesTable/data-table-faceted-filter";
import { DataTableViewOptions } from "./PropertiesTable/data-table-view-options";

import { addDays, format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";


export const statuses = [
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircledIcon,
  },
  {
    value: "missing",
    label: "Missing",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "pending",
    label: "Pending",
    icon: CircleIcon,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: CircleBackslashIcon,
  },
]

interface HeaderToolbarData<TData> {
    table: Table<TData>;
}

function PropertiesHeader<TData>({ table }: HeaderToolbarData<TData>) {
    const [openSearch, setOpenSearch] = React.useState<boolean>(false);
    const { viewMode, setViewMode } = React.useContext(PropertyViewModeContext);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

	const isFiltered = table.getState().columnFilters.length > 0

    const isMobile = useMediaQuery("(max-width: 400px)");
    const isDesktop = useMediaQuery("(min-width: 748px)");
    const isSmallDesktop = useMediaQuery("(min-width: 950px)");

    return (
        <div>
            <header className="mt-12 flex items-center justify-center gap-[0px] w-full mx-0 airBnbDesktop:gap-[100px]">
                <div className={cn((!isDesktop && openSearch) || (!isSmallDesktop && openSearch) ? "hidden" : "")}>
                    <div>
                        <div className="font-medium text-[2rem] leading-9 -tracking-[0.04rem] airBnbMobile:text-nowrap">
                            <div className="my-1">
                                <h1 className="m-0 p-0 font-[1em]">Your Properties</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 airBnbMobile:gap-4 w-full">
                    <div className="w-full">
                        <div className="w-full flex justify-end">
                            {openSearch ? (
                                <Input
                                    type="text"
                                    startContent={<Search className="w-4 h-4" />}
                                    endContent={
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setOpenSearch(false);
                                                table.resetGlobalFilter();
                                            }}
                                            className="rounded-full h-5 w-5 min-w-[20px] min-h-[20px] hover:bg-slate-400 bg-slate-300 dark:bg-slate-500 hover:dark:bg-slate-400"
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    }
                                    radius="full"
                                    variant="bordered"
                                    placeholder="Search listings by name or location"
                                    className="w-full grow"
                                    value={table.getState().globalFilter}
                                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                                />
                            ) : (
                                <div className={cn({ "m-0 airBnbTablet:mt-1 airBnbDesktop:mt-0": openSearch })}>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() => {
                                            setOpenSearch(true);
                                        }}
                                    >
                                        <Search className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={cn({ "m-0 airBnbDesktop:mt-0": openSearch }, !isDesktop && openSearch && "hidden")}>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => {
                                setViewMode(viewMode === "table" ? "grid" : "table");
                            }}
                        >
                            {viewMode === "table" ? (
                                <LayoutGrid className="w-4 h-auto" />
                            ) : (
                                <StretchHorizontal className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    <div className={cn({ "m-0 airBnbDesktop:mt-0": openSearch }, !isDesktop && openSearch && "hidden")}>
                        <Button
                            onClick={async () => {
                                await createProperty();
                            }}
                            variant="outline"
                            size="icon"
                            className={cn("rounded-full")}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>
            <div className="flex justify-start items-center flex-wrap gap-2 mt-12 mb-2">
                {viewMode === "table" ? <DataTableViewOptions table={table} /> : null}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            size={"sm"}
                            className={cn(
                                "w-max justify-start text-left font-normal h-8",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-auto w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Filter due date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 " align="end">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(date) => {
                                setDate(date);
                                const { from, to } = date;
                                if (from && to) {
                                    table.getColumn("due_date")?.setFilterValue({
                                        from: new Date(from),
                                        to: new Date(to),
                                    });
                                } else if (from || to) {
                                    table.getColumn("due_date")?.setFilterValue({
                                        from: from ? new Date(from) : undefined,
                                        to: to ? new Date(to) : undefined,
                                    });
                                } else {
                                    table.getColumn("due_date")?.setFilterValue({
                                        from: undefined,
                                        to: undefined,
                                    });
                                }
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                {table.getColumn("isApproved") && (
                    <DataTableFacetedFilter column={table.getColumn("isApproved")} title="Status" options={statuses} />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters();
                            setDate(undefined);
                            table.resetSorting();
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="h-4 w-auto" />
                    </Button>
                )}
            </div>
        </div>
    );
}

export default PropertiesHeader;
