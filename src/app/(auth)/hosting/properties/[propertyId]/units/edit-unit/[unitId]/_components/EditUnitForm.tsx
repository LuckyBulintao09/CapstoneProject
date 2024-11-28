"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { buttonVariants, Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import Link from "next/link";

import { UnitData, unitSchema } from "@/lib/schemas/unitSchema";

import { Label } from "@/components/ui/label";
import { CircleX, ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { SelectNative } from "@/components/ui/select-native";
import { Button as AriaButton, Group, Input as AriaInput, Label as AriaLabel, NumberField } from "react-aria-components";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

function EditUnitDetailsForm({unit}: any) {
    const router = useRouter();

    const unitForm = useForm<UnitData>({
        resolver: zodResolver(unitSchema),
        defaultValues: {
            unit_code: unit[0].unit_code,
            price: unit[0].price,
            title: unit[0].title,
            privacy_type: unit[0].privacy_type,
            bedrooms: unit[0].bedrooms,
            occupants: unit[0].occupants,
            beds: unit[0].beds,
            outside_view: unit[0].outside_view,
            room_size: unit[0].room_size,
        },
        mode: "onBlur",
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClearInput = (fieldName: keyof UnitData) => {
        unitForm.setValue(fieldName, "");
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    function onSubmit(values: UnitData) {
        console.log(values);
        // router.push(`/hosting/properties`);
    }

    return (
        <div className="bg-background h-screen">
            <Form {...unitForm}>
                <form onSubmit={unitForm.handleSubmit(onSubmit)} className="space-y-8 max-w-6xl mx-auto my-11">
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={unitForm.control}
                            name="unit_code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="unit_code">Unit number</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                id="unit_code"
                                                ref={inputRef}
                                                className={cn("pe-9", {
                                                    "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                        unitForm.formState.errors.unit_code,
                                                })}
                                                placeholder="Unit number..."
                                                type="text"
                                                value={field.value}
                                                onChange={field.onChange}
                                                {...field}
                                            />
                                            {field.value && (
                                                <button
                                                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    aria-label="Clear input"
                                                    onClick={() => handleClearInput("unit_code")}
                                                >
                                                    <CircleX size={16} strokeWidth={2} aria-hidden="true" />
                                                </button>
                                            )}
                                        </div>
                                    </FormControl>
                                    {unitForm.formState.errors.unit_code ? <FormMessage /> : <FormDescription>Enter room number.</FormDescription>}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={unitForm.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="price">Price</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                id="price"
                                                className={cn("peer pe-12 ps-6", {
                                                    "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                        unitForm.formState.errors.price,
                                                })}
                                                placeholder="0.00"
                                                type="number"
                                                {...field}
                                                {...unitForm.register("price", { valueAsNumber: true })}
                                            />
                                            <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                                                ₱
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                                                PHP
                                            </span>
                                        </div>
                                    </FormControl>
                                    {unitForm.formState.errors.price ? <FormMessage /> : <FormDescription>Enter price.</FormDescription>}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={unitForm.control}
                            name="privacy_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="privacy_type">Price</FormLabel>
                                    <FormControl>
                                        <SelectNative
                                            id="privacy_type"
                                            defaultValue=""
                                            className={cn("", {
                                                "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                    unitForm.formState.errors.privacy_type,
                                            })}
                                            value={field.value}
                                            onChange={field.onChange}
                                        >
                                            <option value="" disabled>
                                                Privacy type
                                            </option>
                                            <option value="room">Room</option>
                                            <option value="shared room">Shared room</option>
                                            <option value="whole place">Whole place</option>
                                        </SelectNative>
                                    </FormControl>
                                    {unitForm.formState.errors.privacy_type ? <FormMessage /> : <FormDescription>Enter price.</FormDescription>}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={unitForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="title">Title</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                id="title"
                                                ref={inputRef}
                                                className={cn("pe-9", {
                                                    "border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/20":
                                                        unitForm.formState.errors.title,
                                                })}
                                                placeholder="Title..."
                                                type="text"
                                                value={field.value}
                                                onChange={field.onChange}
                                                {...field}
                                            />
                                            {field.value && (
                                                <button
                                                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    aria-label="Clear input"
                                                    onClick={() => handleClearInput("title")}
                                                >
                                                    <CircleX size={16} strokeWidth={2} aria-hidden="true" />
                                                </button>
                                            )}
                                        </div>
                                    </FormControl>
                                    {unitForm.formState.errors.title ? <FormMessage /> : <FormDescription>Enter title.</FormDescription>}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={unitForm.control}
                            name="outside_view"
                            render={({ field }) => (
                                <FormItem>
                                    <div>
                                        <FormLabel htmlFor="outside_view">Outside view</FormLabel>
                                    </div>
                                    <FormControl>
                                        <div className="inline-flex items-center gap-2">
                                            <Switch
                                                id="outside_view"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                aria-label="Toggle switch"
                                            />
                                            <Label htmlFor="outside_view" className="text-sm font-medium">
                                                {field.value ? "yes" : "no"}
                                            </Label>
                                        </div>
                                    </FormControl>
                                    {unitForm.formState.errors.outside_view ? (
                                        <FormMessage />
                                    ) : (
                                        <FormDescription>Does unit have an outside view?</FormDescription>
                                    )}
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={unitForm.control}
                            name="occupants"
                            render={({ field }) => (
                                <FormItem>
                                    <AriaLabel htmlFor="occupants" className="text-sm font-medium text-foreground">
                                        Occupants
                                    </AriaLabel>
                                    <FormControl>
                                        <NumberField defaultValue={field.value} minValue={0} onChange={field.onChange}>
                                            <div className="space-y-2">
                                                <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                                    <AriaButton
                                                        slot="decrement"
                                                        className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                                    </AriaButton>
                                                    <Input
                                                        id="occupants"
                                                        className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
                                                        {...field}
                                                        {...unitForm.register("occupants", {
                                                            valueAsNumber: true,
                                                            setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
                                                        })}
                                                    />
                                                    <AriaButton
                                                        slot="increment"
                                                        className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Plus size={16} strokeWidth={2} aria-hidden="true" />
                                                    </AriaButton>
                                                </Group>
                                            </div>
                                        </NumberField>
                                    </FormControl>
                                    {unitForm.formState.errors.occupants ? <FormMessage /> : <FormDescription>Number of occupants.</FormDescription>}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={unitForm.control}
                            name="bedrooms"
                            render={({ field }) => (
                                <FormItem>
                                    <AriaLabel htmlFor="bedrooms" className="text-sm font-medium text-foreground">
                                        Bedrooms
                                    </AriaLabel>
                                    <FormControl>
                                        <NumberField defaultValue={field.value} minValue={0} onChange={field.onChange}>
                                            <div className="space-y-2">
                                                <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                                    <AriaButton
                                                        slot="decrement"
                                                        className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                                    </AriaButton>
                                                    <Input
                                                        id="bedrooms"
                                                        className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
                                                        {...field}
                                                        {...unitForm.register("bedrooms", {
                                                            valueAsNumber: true,
                                                            setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
                                                        })}
                                                    />
                                                    <AriaButton
                                                        slot="increment"
                                                        className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Plus size={16} strokeWidth={2} aria-hidden="true" />
                                                    </AriaButton>
                                                </Group>
                                            </div>
                                        </NumberField>
                                    </FormControl>
                                    {unitForm.formState.errors.bedrooms ? <FormMessage /> : <FormDescription>Number of bedrooms.</FormDescription>}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={unitForm.control}
                            name="beds"
                            render={({ field }) => (
                                <FormItem>
                                    <AriaLabel htmlFor="beds" className="text-sm font-medium text-foreground">
                                        Beds
                                    </AriaLabel>
                                    <FormControl>
                                        <NumberField defaultValue={field.value} minValue={0} onChange={field.onChange}>
                                            <div className="space-y-2">
                                                <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none data-[focus-within]:ring-[3px] data-[focus-within]:ring-ring/20">
                                                    <AriaButton
                                                        slot="decrement"
                                                        className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Minus size={16} strokeWidth={2} aria-hidden="true" />
                                                    </AriaButton>
                                                    <Input
                                                        id="beds"
                                                        className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus:outline-none"
                                                        {...field}
                                                        {...unitForm.register("beds", {
                                                            valueAsNumber: true,
                                                            setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
                                                        })}
                                                    />
                                                    <AriaButton
                                                        slot="increment"
                                                        className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Plus size={16} strokeWidth={2} aria-hidden="true" />
                                                    </AriaButton>
                                                </Group>
                                            </div>
                                        </NumberField>
                                    </FormControl>
                                    {unitForm.formState.errors.beds ? <FormMessage /> : <FormDescription>Number of beds.</FormDescription>}
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={unitForm.control}
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
                                                        unitForm.formState.errors.room_size,
                                                })}
                                                placeholder="0.00"
                                                type="number"
                                                {...field}
                                                {...unitForm.register("room_size", { valueAsNumber: true })}
                                            />
                                            <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                                                m<sup>2</sup>
                                            </span>
                                        </div>
                                    </FormControl>
                                    {unitForm.formState.errors.room_size ? <FormMessage /> : <FormDescription>Enter room_size.</FormDescription>}
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
}

export default EditUnitDetailsForm;
