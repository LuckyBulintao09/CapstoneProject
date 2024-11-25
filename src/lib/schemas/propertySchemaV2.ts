import {z} from "zod";

export const propertyTitleSchema = z.object({
    property_title: z.string().min(1).max(52),
});

export type PropertyTitleData = z.infer<typeof propertyTitleSchema>;