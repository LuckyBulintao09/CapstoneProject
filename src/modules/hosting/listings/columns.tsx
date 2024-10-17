"use client";

import React from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

export type Property = {
    id: string;
    structure: "apartment" | "condominium" | "dormitory";
    privacy_type: "room" | "shared room" | "entire place";
    address: string;
    occupants: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    bedroom_lock: boolean;
    ameneties: {
        id: string;
        text: string;
    }[];
    additional_ameneties: {
        id: number;
        name: string;
    }[];
    safety_items?: {
        id: string;
        text: string;
    }[];
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    house_rules: string;
    images: string[];
};

export const columns: ColumnDef<Property>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "thumbnail_url",
        header:"Thumbnail",
        cell: ({row}) => {
            return (
                <Image
                    src={row.getValue<string>("thumbnail_url")}
                    alt={row.getValue<string>("title")}
                    width={64}
                    height={64}
                    className="rounded-md aspect-square object-cover"
                />
            );
        }
    },
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "structure",
        header: "Structure",
    },
    {
        accessorKey: "privacy_type",
        header: "Privacy Type",
    },
    {
        accessorKey: "company.address",
        header: "Address",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "bedrooms",
        header: "Bedrooms",
    },
    {
        accessorKey: "bathrooms",
        header: "Bathrooms",
    },
    {
        accessorKey: "occupants",
        header: "Occupants",
    },
    {
        accessorKey: "ameneties",
        header: "Ameneties",
    },
    {
        accessorKey: "additional_ameneties",
        header: "Additional Ameneties",
    },
    {
        accessorKey: "safety_items",
        header: "Safety Items",
    },
];
