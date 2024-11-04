"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { useMediaQuery } from "@/hooks/use-media-query";

import { PropertyViewModeContext } from "@/modules/hosting/property/PropertyViewModeProvider";

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "title",
        header: "Property",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
]