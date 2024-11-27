import { z } from "zod";

export const propertyTitleSchema = z.object({
    property_title: z.string().min(1, { message: "Please enter a title." }).max(52),
});

export const propertyTypeSchema = z.object({
    property_type: z.string().min(1, { message: "Please select a property type." }),
});

export const propertyDescriptionSchema = z.object({
    property_description: z.string().min(1, { message: "Please enter a description." }).max(500),
});

export type PropertyTitleData = z.infer<typeof propertyTitleSchema>;
export type PropertyTypeData = z.infer<typeof propertyTypeSchema>;
export type PropertyDescriptionData = z.infer<typeof propertyDescriptionSchema>;
