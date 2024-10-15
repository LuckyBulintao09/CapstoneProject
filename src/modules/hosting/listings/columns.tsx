"use client";

import React from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

export type Property = {
    id: string;
    structure: "apartment" | "condominium" | "dormitory";
    privacy_type: "room" | "shared room" | "entire place";
    country_or_region: string;
    unit_level?: string;
    street_address: string;
    barangay_or_district?: string;
    city_or_municipality: string;
    zip_code: string;
    province: string;
    occupants: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    bedroom_locker: boolean;
    ameneties: {
        id: string;
        text: string;
    }[];
    additional_ameneties: {
        id: string;
        text: string;
    }[];
    safety_items?: {
        id: string;
        text: string;
    }[];
    title: string;
    description: string;
    price: number;
    house_rules: string;
    thumbnail: string;
    images: string[];
};

export const columns: ColumnDef<Property>[] = [
    {
        accessorKey: "id",
        header: "ID",
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
        accessorKey: "street_address",
        header: "Address",
    },
    {
        accessorKey: "city_or_municipality",
        header: "City/Municipality",
    },
    {
        accessorKey: "province",
        header: "Province",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: (row) => {
            const price = row.getValue();
            return <div>{price}</div>;
        },
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
        cell: (row) => {
            const ameneties = row.getValue();
            <div>
                {ameneties.map((amenety) => (
                    <div key={amenety.id}>{amenety.text}</div>
                ))}
            </div>
        },
    },
    {
        accessorKey: "additional_ameneties",
        header: "Additional Ameneties",
        cell: (row) => {
            const additional_ameneties = row.getValue();
            <div>
                {additional_ameneties.map((amenety) => (
                    <div key={amenety.id}>{amenety.text}</div>
                ))}
            </div>
        },
    },
    {
        accessorKey: "safety_items",
        header: "Safety Items",
        cell: (row) => {
            const safety_items = row.getValue();
            <div>
                {safety_items?.map((amenety) => (
                    <div key={amenety.id}>{amenety.text}</div>
                ))}
            </div>
        },
    },
];
