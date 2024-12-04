"use client";

import React from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Minus, Plus } from "lucide-react";
import { Button as ShadBtn, buttonVariants } from "@/components/ui/button";

import { Button, Group, Input, Label, NumberField } from "react-aria-components";

import { cn } from "@/lib/utils";
import { z } from "zod";
import Link from "next/link";

const unitSchema = z.object({
    numberOfUnits: z.number().min(1, { message: "At least 1 unit is required." }).max(10, { message: "You can add up to 10 units only." }),
});

function NumberOfUnits({ propertyId }: { propertyId: string }) {
    const [value, setValue] = React.useState(1);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = () => {
        const validation = unitSchema.safeParse({ numberOfUnits: value });
        if (!validation.success) {
            setError(validation.error.errors[0].message);
        } else {
            setError(null);
            console.log("Valid number of units:", value);
            // Proceed with the logic to create units
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <ShadBtn variant="ghost" className={cn("gap-2 w-fit rounded-full")}>
                    <span>Add new unit</span>
                    <Plus className="h-4 w-4" />
                </ShadBtn>
            </DialogTrigger>
            <DialogContent className="z-[999] transform translate-x-[-50%] translate-y-[-50%]">
                <DialogHeader>
                    <DialogTitle>How many units do you wish to add for this property?</DialogTitle>
                    <DialogDescription>This will create an arbitrary amount of units with a minimum of 1 and a maximum of 10.</DialogDescription>
                </DialogHeader>

                <NumberField value={value} onChange={setValue} minValue={1} maxValue={10}>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Number of units.</Label>
                        <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                            <Button
                                slot="decrement"
                                className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Minus size={16} strokeWidth={2} aria-hidden="true" />
                            </Button>
                            <Input className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none" autoFocus={false} />
                            <Button
                                slot="increment"
                                className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                            </Button>
                        </Group>
                    </div>
                </NumberField>
                {error && <p className="text-sm text-red-500">{error}</p>}

                <DialogFooter className="sm:justify-start">
                    <Link
                        href={{
                            pathname: `/hosting/properties/${propertyId}/units/add-a-unit/unit-details`,
                            query: { numberOfUnits: value },
                        }}
                        className={cn(buttonVariants({ variant: "default" }))}
                    >
                        Create units
                    </Link>
                    <DialogClose asChild>
                        <ShadBtn type="button" variant="secondary">
                            Cancel
                        </ShadBtn>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default NumberOfUnits;
