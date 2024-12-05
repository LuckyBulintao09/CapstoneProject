"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UnitSpecificationData, unitSpecificationSchema } from "@/lib/schemas/editUnitSchema";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { updateUnitSpecifications } from "@/actions/unit/update-unit";

import { cn } from "@/lib/utils";

import { Button as AriaButton, Group, Input, Label, NumberField } from "react-aria-components";

import { Minus, Plus } from "lucide-react";

function RoomSpecificationForm({ roomSpecifications, unitId }: { roomSpecifications: any; unitId: string }) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    const unitSpecificationForm = useForm<UnitSpecificationData>({
        resolver: zodResolver(unitSpecificationSchema),
        defaultValues: {
            occupants: roomSpecifications?.occupants,
            bedrooms: roomSpecifications?.bedrooms,
            beds: roomSpecifications?.beds,
        },
        mode: "onChange",
    });

    function onSubmit(values: UnitSpecificationData) {
        if (!isPending) {
            startTransition(() => {
                toast.promise(updateUnitSpecifications(unitId, values), {
                    loading: "Saving changes...",
                    success: () => {
                        router.refresh();
                        return "Unit updated successfully";
                    },
                    error: (error) => {
                        return "Error! Something went wrong.";
                    },
                });
            });
        }
    }

    return (
        <Form {...unitSpecificationForm}>
            <form onSubmit={unitSpecificationForm.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FormField
                    control={unitSpecificationForm.control}
                    name="occupants"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="occupants" id="occupants-label" className="text-sm font-medium text-foreground">
                                Occupants
                            </Label>
                            <FormControl>
                                <NumberField
                                    id="occupants"
                                    defaultValue={field.value}
                                    minValue={0}
                                    onChange={field.onChange}
                                    aria-label="Number of occupants"
                                    aria-labelledby="occupants-label"
                                >
                                    <div className="space-y-2">
                                        <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                            <AriaButton
                                                aria-label="Decrease number of occupants"
                                                slot="decrement"
                                                className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                            </AriaButton>
                                            <Input
                                                id="occupants"
                                                className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
                                                value={field.value}
                                                onChange={field.onChange}
                                                {...field}
                                                {...unitSpecificationForm.register("occupants", {
                                                    valueAsNumber: true,
                                                    setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
                                                })}
                                            />
                                            <AriaButton
                                                aria-label="Increase number of occupants"
                                                slot="increment"
                                                className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                                            </AriaButton>
                                        </Group>
                                    </div>
                                </NumberField>
                            </FormControl>
                            {unitSpecificationForm.formState.errors.occupants ? (
                                <FormMessage />
                            ) : (
                                <FormDescription>Number of occupants.</FormDescription>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={unitSpecificationForm.control}
                    name="bedrooms"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="bedrooms" id="bedrooms-label" className="text-sm font-medium text-foreground">
                                Bedrooms
                            </Label>
                            <FormControl>
                                <NumberField id="bedrooms" defaultValue={field.value} minValue={0} onChange={field.onChange} aria-labelledby="bedrooms-label">
                                    <div className="space-y-2">
                                        <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                            <AriaButton
                                                aria-label="Decrease number of bedrooms"
                                                slot="decrement"
                                                className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                            </AriaButton>
                                            <Input
                                                id="bedrooms"
                                                className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
                                                value={field.value}
                                                onChange={field.onChange}
                                                {...field}
                                                {...unitSpecificationForm.register("bedrooms", {
                                                    valueAsNumber: true,
                                                    setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
                                                })}
                                            />
                                            <AriaButton
                                                aria-label="Increase number of bedrooms"
                                                slot="increment"
                                                className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                                            </AriaButton>
                                        </Group>
                                    </div>
                                </NumberField>
                            </FormControl>
                            {unitSpecificationForm.formState.errors.bedrooms ? (
                                <FormMessage />
                            ) : (
                                <FormDescription>Number of bedrooms.</FormDescription>
                            )}
                        </FormItem>
                    )}
                />

                <FormField
                    control={unitSpecificationForm.control}
                    name="beds"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="beds" id="beds-label" className="text-sm font-medium text-foreground">
                                Beds
                            </Label>
                            <FormControl>
                                <NumberField id="beds" defaultValue={field.value} minValue={0} onChange={field.onChange} aria-labelledby="beds-label">
                                    <div className="space-y-2">
                                        <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                            <AriaButton
                                                aria-label="Decrease number of beds"
                                                slot="decrement"
                                                className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                            </AriaButton>
                                            <Input
                                                id="beds"
                                                className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
                                                value={field.value}
                                                onChange={field.onChange}
                                                {...field}
                                                {...unitSpecificationForm.register("beds", {
                                                    valueAsNumber: true,
                                                    setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
                                                })}
                                            />
                                            <AriaButton
                                                airia-label="Increase number of beds"
                                                slot="increment"
                                                className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                                            </AriaButton>
                                        </Group>
                                    </div>
                                </NumberField>
                            </FormControl>
                            {unitSpecificationForm.formState.errors.beds ? <FormMessage /> : <FormDescription>Number of beds.</FormDescription>}
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isPending || unitSpecificationForm.formState.isSubmitting || unitSpecificationForm.formState.errors.bedrooms !== undefined || unitSpecificationForm.formState.errors.beds !== undefined || unitSpecificationForm.formState.errors.occupants !== undefined}>
                    {(isPending || unitSpecificationForm.formState.isSubmitting) && (
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
                    )}{" "}
                    Save
                </Button>
            </form>
        </Form>
    );
}

export default RoomSpecificationForm;
