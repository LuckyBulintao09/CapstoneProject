import { z } from "zod";

export const createPropertySchema = z.object({
    title: z
        .string()
        .min(1, { message: "Please enter a title." })
        .max(52, { message: "Title cannot exceed 52 characters." })
        .regex(/^[a-zA-Z0-9.,'(): -]*$/, {
            message: "Title can only include letters, numbers, commas, dots, apostrophes, and parentheses.",
        }),
    address: z.string().min(1, { message: "Please enter an address." }),
    location: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
    description: z.string().min(1, { message: "Please enter a description." }).max(1000, {message: "Description must contain at most 1000 characters."}),
    house_rules: z.array(
        z.object(
            {
                id: z.string(),
                text: z
                    .string({ message: "Please enter a valid rule." })
                    .min(1, { message: "House rule name too short. Minimum of 1 character" })
                    .max(52, { message: "House rule name too long. Max of 52 characters." }),
            },
            {
                message: "House rule object shape is invalid.",
            }
        ),
        {
            message: "House rule is not an array.", required_error: "Please enter a house rule."
        }
    ).nonempty({message: "Please enter a house rule."}),
    image: z
        .array(z.string({ required_error: "Please add at least one image." }))
        .nonempty({ message: "Please add at least one image." }),

    property_type: z.string({ required_error: "Please select a property type." })
    .refine(
        (value) => ["dormitory", "condominium", "apartment"].includes(value),
        { message: "Invalid property type. Please select dormitory, condominium, or apartment." }
    )
    
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