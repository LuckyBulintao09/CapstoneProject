"use client";

import React from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

export type Property = {
    id: string;
    structure?: "apartment" | "condominium" | "dormitory" | null;
    privacy_type?: "room" | "shared room" | "entire place" | null;
    address?: string | null;
    occupants?: number | null;
    bedrooms?: number | null;
    beds?: number | null;
    bathrooms?: number | null;
    bedroom_lock?: boolean | null;
    ameneties?:
        | {
              id: string;
              text: string;
          }[]
        | null;
    additional_ameneties?:
        | {
              id: number;
              name: string;
          }[]
        | null;
    safety_items?:
        | {
              id: string;
              text: string;
          }[]
        | null;
    title?: string | null;
    description?: string | null;
    price?: number | null;
    thumbnail?: string | null;
    house_rules?: string | null;
    images?: string[] | null;
};

export const columns: ColumnDef<Property>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "thumbnail_url",
        header: "Thumbnail",
        cell: ({ row }) => {
            const thumbnailUrl = row.getValue<string>("thumbnail_url");
            const title = row.getValue<string>("title");
            return (
                <div className="">
                    <Image
                        src={thumbnailUrl || "/placeholderImage.webp"}
                        alt={title || "Thumbnail"}
                        width={64}
                        height={64}
                        className="rounded-md aspect-square object-cover"
                    />
                </div>
            );
        },
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
