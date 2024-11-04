"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Input } from "@nextui-org/input";

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

interface HeaderToolbarData<TData> {
    table: Table<TData>;
}

function PropertiesHeader<TData>({ table }: HeaderToolbarData<TData>) {
    const [openSearch, setOpenSearch] = React.useState<boolean>(false);
    const { viewMode, setViewMode } = React.useContext(PropertyViewModeContext);

    const isMobile = useMediaQuery("(max-width: 400px)");
    const isDesktop = useMediaQuery("(min-width: 748px)");
    const isSmallDesktop = useMediaQuery("(min-width: 950px)");

    return (
        <div className="flex flex-row items-center gap-5 my-5 py-3">
            <div
                className={cn(
                    (!isDesktop && openSearch) ||
                        (!isSmallDesktop && openSearch)
                        ? "hidden"
                        : "md:mr-14"
                )}
            >
                <h1
                    className={cn(
                        !isMobile
                            ? "text-nowrap font-light text-4xl"
                            : "font-light text-4xl text-wrap"
                    )}
                >
                    Your listings
                </h1>
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
                        onChange={(event) =>
                            table.setGlobalFilter(event.target.value)
                        }
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

            <div
                className={cn(
                    !isDesktop && openSearch ? "hidden" : "flex flex-row gap-5"
                )}
            >
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
                        <StretchHorizontal className="w-4 h-auto" />
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn("rounded-full")}
                >
                    <Plus className="w-5 h-auto" />
                </Button>
            </div>
        </div>
    );
}

export default PropertiesHeader;
