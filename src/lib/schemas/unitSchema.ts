import z from "zod";

export const unitSchema = z.object({
    price: z.number().min(1, { message: "Please enter a price." }),
    title: z.string().min(2, { message: "Please enter a title." }).max(50),
    privacy_type: z.string().min(2, { message: "Please select a privacy type." }),
    bedrooms: z.number().min(1).max(14, { message: "Are you sure you have that many bedrooms." }),
    occupants: z.number().min(1).max(14, { message: "Are you sure you have that many occupants." }),
    beds: z.number().min(1).max(14, { message: "Are you sure you have that many beds." }),
    outside_view: z.boolean().default(false),
    room_size: z.number().min(1).max(9999, { message: "Please enter a valid room size." }),
    amenities: z.array(
        z.object({
            value: z.string(),
            label: z.string(),
        })
    ),
});



export type UnitData = z.infer<typeof unitSchema>;