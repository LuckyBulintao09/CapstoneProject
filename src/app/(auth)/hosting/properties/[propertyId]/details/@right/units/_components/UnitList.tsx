"use client";
import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllUnitUnderProperty, getUnitsCount } from "@/actions/unit/getAllUnitUnderProperty";
import { Frown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/utils/supabase/client";

import { useRouter } from "next/navigation";

import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toggleIsReserved } from "@/actions/unit/update-unit";

export default function UnitList({ propertyId }: { propertyId: string }) {
    const supabase = createClient();
    const router = useRouter();
    const lastPayloadRef = React.useRef(null);

    const [unitsData, setUnitsData] = useState([]);
    const [page, setPage] = useState(0);
    const [totalUnits, setTotalUnits] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUnits, setFilteredUnits] = useState([]);

    const [isPending, startTransition] = useTransition();

    // Initialize Fuse.js with memoization to avoid re-creating it on every render
    const fuse = React.useMemo(() => {
        return new Fuse(unitsData, {
            keys: ["title", "privacy_type", "price"],
            threshold: 0.4, // Stricter matching
            distance: 100, // Maximum distance for matches
            minMatchCharLength: 0, // Avoid matching on very short terms
            useExtendedSearch: true,
            includeScore: true, // Optional for debugging
            fieldNormWeight: 1.5, // Prioritize field lengths
        });
    }, [unitsData]);

    const getFromAndTo = (page: number) => {
        const from = page * 4;
        const to = from + 3; // Inclusive range for 4 items
        return { from, to };
    };

    const fetchUnits = async () => {
        if (loading) return; // Prevent duplicate fetches
        setLoading(true);
        const { from, to } = getFromAndTo(page);
        const data = await getAllUnitUnderProperty(propertyId, from, to);
        setPage(page + 1);

        setUnitsData((current) => {
            const newData = data.filter((unit) => !current.some((existingUnit) => existingUnit.id === unit.id));
            return [...current, ...newData];
        });
        setLoading(false);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsInitialLoading(true);
            const count = await getUnitsCount(propertyId);
            setTotalUnits(count);
            await fetchUnits();
            setIsInitialLoading(false);
        };

        fetchInitialData();
    }, []);

    React.useEffect(() => {
        const channel = supabase
            .channel("public-unit")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "unit",
                },
                (payload: any) => {
                    if (JSON.stringify(lastPayloadRef.current) !== JSON.stringify(payload)) {
                        lastPayloadRef.current = payload;
                        router.refresh();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (!term) {
            setFilteredUnits(unitsData); // Reset filter when the search term is cleared
        } else {
            const results = fuse.search(term).map(({ item }) => item);
            setFilteredUnits(results);
        }
    };

    useEffect(() => {
        setFilteredUnits(unitsData); // Update filtered units when unitsData changes
    }, [unitsData]);

    const isLoadMoreDisabled = unitsData.length >= totalUnits || loading;

    if (isInitialLoading) {
        return (
            <div className="h-[calc(100vh-68px-104px-40px)] flex items-center justify-center">
                <Spinner className="bg-primary dark:bg-primary h-16 w-16" />
            </div>
        );
    }
    console.log(unitsData);

    return (
        <>
            <div className="flex justify-center my-4">
                <Input
                    type="text"
                    placeholder="Search units by title, price, privacy type, etc..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="px-4 py-2 border rounded w-full max-w-md"
                />
            </div>

            {filteredUnits?.length > 0 ? (
                filteredUnits.map((unit) => (
                    <div
                        key={unit.id}
                        className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring"
                    >
                        <Switch
                            id="set_isReserved"
                            className="order-1 h-4 w-6 [&_span]:size-3 [&_span]:data-[state=checked]:translate-x-2 rtl:[&_span]:data-[state=checked]:-translate-x-2"
                            aria-describedby="set_isReserved-description"
                            checked={unit.isReserved}
                            onCheckedChange={async (checked) => {
                                setUnitsData((current) => {
                                    return current.map((u) => (u.id === unit.id ? { ...u, isReserved: checked } : u));
                                });
                                startTransition(async () => {
                                    await toggleIsReserved(unit.id, checked);
                                    fetchUnits();
                                });
                            }}
                            disabled={isPending}
                        />
                        <div className="flex grow items-center gap-3">
                            <div className="flex-shrink-0">
                                {unit.unit_image && unit.unit_image[0] ? (
                                    <Image
                                        src={unit.unit_image[0]}
                                        alt={unit.title}
                                        width={64}
                                        height={64}
                                        className="rounded object-cover aspect-square"
                                    />
                                ) : (
                                    <Image
                                        src={"/placeholderImage.webp"}
                                        alt={unit.title}
                                        width={64}
                                        height={64}
                                        className="rounded object-cover aspect-square"
                                    />
                                )}
                            </div>
                            <div className="grid grow gap-2">
                                <Label htmlFor="set_isReserved">
                                    {unit.title} <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                </Label>
                                <div>
                                    <p id="set_isReserved-description" className="text-xs text-muted-foreground">
                                        Private Type: {unit.privacy_type}
                                    </p>
                                    <p id="set_isReserved-description" className="text-xs text-muted-foreground">
                                        Price: ₱{new Intl.NumberFormat('en-PH', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(unit.price)} (PHP)
                                    </p>
                                    <Link
                                        href={`/hosting/properties/${propertyId}/units/edit-unit/${unit?.id}`}
                                        className={cn(buttonVariants({ variant: "link" }), "p-0 block text-xs h-fit w-fit m-0")}
                                    >
                                        Go to unit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-68px-104px-40px)] gap-4">
                    <Frown className="h-32 w-32 text-muted-foreground opacity-85" strokeWidth={1} />
                    <p className="text-center text-muted-foreground">No units found for the search term.</p>
                </div>
            )}
            {unitsData?.length > 0 && (
                <Button onClick={fetchUnits} disabled={isLoadMoreDisabled}>
                    {loading ? (
                        <div className="flex flex-row gap-2 items-center justify-center w-full">
                            <svg
                                aria-hidden="true"
                                className="size-6 mr-2 fill-accent animate-spin-fade dark:text-accent-foreground text-primary"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span>Loading</span>
                        </div>
                    ) : (
                        <span>Load more</span>
                    )}
                </Button>
            )}
        </>
    );
}
