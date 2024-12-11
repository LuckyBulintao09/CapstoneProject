"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectNative } from "@/components/ui/select-native";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UnitTypeData, unitTypeSchema } from "@/lib/schemas/unitSchema";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { updateUnitType } from "@/actions/unit/update-unit";

import { cn } from "@/lib/utils";

function AdditionalUnitDetailsForm({ unitDetails, unitId }: { unitDetails: any; unitId: string }) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    const additionalUnitDetailsForm = useForm<UnitTypeData>({
        resolver: zodResolver(unitTypeSchema),
        defaultValues: {
            privacy_type: unitDetails?.privacy_type,
            room_size: unitDetails?.room_size,
        },
        mode: "onChange",
    });

    function onSubmit(values: UnitTypeData) {
        if (!isPending) {
            startTransition(() => {
                toast.promise(updateUnitType(unitId, values), {
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
        <Form {...additionalUnitDetailsForm}>
            <form onSubmit={additionalUnitDetailsForm.handleSubmit(onSubmit)} className="flex flex-col gap-11">
                {" "}
                <FormField
                    control={additionalUnitDetailsForm.control}
                    name="room_size"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="room_size">Room size (in square meters)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        id="room_size"
                                        className={cn("peer pe-12", {
                                            "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                additionalUnitDetailsForm.formState.errors.room_size,
                                        })}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="0.00"
                                        type="number"
                                        {...field}
                                        {...additionalUnitDetailsForm.register("room_size", { valueAsNumber: true })}
                                    />
                                    <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                                        m<sup>2</sup>
                                    </span>
                                </div>
                            </FormControl>
                            {additionalUnitDetailsForm.formState.errors.room_size ? <FormMessage /> : <FormDescription>Enter room size.</FormDescription>}
                        </FormItem>
                    )}
                />
                <FormField
                    control={additionalUnitDetailsForm.control}
                    name="privacy_type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="privacy_type">Property type</FormLabel>
                            <div className={cn({ "[&_svg]:text-destructive/80": additionalUnitDetailsForm.formState.errors.privacy_type })}>
                                <SelectNative
                                    id="privacy_type"
                                    defaultValue=""
                                    className={cn({
                                        "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                            additionalUnitDetailsForm.formState.errors.privacy_type,
                                    })}
                                    value={field.value}
                                    onChange={field.onChange}
                                >
                                    <option value="" disabled>
                                        Property type
                                    </option>
                                    <option value="private room">Private room</option>
                                    <option value="shared room">Shared room</option>
                                    <option value="Whole place">Whole place</option>
                                </SelectNative>
                            </div>
                            {additionalUnitDetailsForm.formState.errors.privacy_type ? (
                                <FormMessage />
                            ) : (
                                <FormDescription>What describes your unit best?</FormDescription>
                            )}
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={
                        isPending ||
                        additionalUnitDetailsForm.formState.isSubmitting ||
                        additionalUnitDetailsForm.formState.errors.room_size !== undefined || 
                        additionalUnitDetailsForm.formState.errors.privacy_type !== undefined
                    }
                >
                    {(isPending || additionalUnitDetailsForm.formState.isSubmitting) && (
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

export default AdditionalUnitDetailsForm;
