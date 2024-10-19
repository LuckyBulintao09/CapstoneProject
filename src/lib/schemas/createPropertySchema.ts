import { z } from "zod";

export const createPropertyCompanySchema = z.object({
    company_id: z.string({ message: "Please select a company." }),
});

export const createPropertyTypeSchema = z.object({
    structure: z.enum(["apartment", "condominium", "dormitory"], {
        message: "Please select one of the options.",
    }),
    privacy_type: z.enum(["room", "shared room", "entire place"], {
        message: "Please select one of the options.",
    }),
});

export const createPropertyDetailSchema = z.object({
    unit_number: z.string({ message: "Please enter a unit number." }),
    occupants: z.number(),
    bedrooms: z.number(),
    beds: z.number(),
    bathrooms: z.number(),
});

export const createPropertyAmenitySchema = z.object({
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

export const createPropertyTitleSchema = z.object({
    title: z.string().min(1).max(32),
    description: z.string().min(1).max(500),
});
