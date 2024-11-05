import { z } from "zod";

export const createPropertySchema = z.object({
    title: z.string().min(1, { message: "Please name your property." }),
    company_id: z.string().min(1, { message: "Please select a company." }),
    address: z.string().min(1, { message: "Please enter an address." }),
    location: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
});

export const createUnitPropertySchema = z.object({
    property_id: z.string().min(1, { message: "Please select a property." }),
})

export const createUnitTypeSchema = z.object({
    unit_structure: z.enum(["apartment", "condominium", "dormitory"], {
        message: "Please select one of the options.",
    }),
    unit_type: z.enum(["room", "shared room", "entire place"], {
        message: "Please select one of the options.",
    }),
});

export const createUnitDetailSchema = z.object({
    unit_occupants: z.number(),
    unit_bedrooms: z.number(),
    unit_beds: z.number(),
});

export const createUnitAmenitySchema = z.object({
    amenities: z
        .array(
            z.object({
                id: z.number(),
                amenity_name: z.string(),
            })
        )
        .refine((value) => value.some((item) => item.id && item.amenity_name), {
            message: "You have to select at least one item.",
        }),
    additional_amenities: z
        .array(
            z.object({
                id: z.string(),
                text: z.string(),
            })
        )
        .optional(),
});

export const createUnitTitleSchema = z.object({
    unit_title: z.string().min(1).max(32),
    unit_description: z.string().min(1).max(500),
});

// Combine all schemas into a single type
export const createUnitSchema = z.object({
    ...createUnitPropertySchema.shape,
    ...createUnitTypeSchema.shape,
    ...createUnitDetailSchema.shape,
    ...createUnitAmenitySchema.shape,
    ...createUnitTitleSchema.shape,
});

// Export the type
export type CreateUnitType = z.infer<typeof createUnitSchema>;

export type CreatePropertyTypes = z.infer<typeof createPropertySchema>;