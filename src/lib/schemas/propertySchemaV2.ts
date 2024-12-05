import { z } from "zod";

export const propertyTitleSchema = z.object({
    property_title: z.string().min(1, { message: "Please enter a title." }).max(52, { message: "Title cannot exceed 52 characters." }).regex(/^[a-zA-Z0-9.,'(): -]*$/, {
        message: "Title can only include letters, numbers, commas, dots, apostrophes, and parentheses.",
    }),
});

export const propertyTypeSchema = z.object({
    property_type: z.string().min(1, { message: "Please select a property type." }),
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
    )
});

export const propertyDescriptionSchema = z.object({
    property_description: z.string().min(1, { message: "Please enter a description." }).max(1000),
});

export const propertyLocationSchema = z.object({
    property_address: z.string().min(1, { message: "Please enter an address." }),
    property_location: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
});

export type PropertyTitleData = z.infer<typeof propertyTitleSchema>;
export type PropertyTypeData = z.infer<typeof propertyTypeSchema>;
export type PropertyDescriptionData = z.infer<typeof propertyDescriptionSchema>;
export type PropertyLocationData = z.infer<typeof propertyLocationSchema>;
