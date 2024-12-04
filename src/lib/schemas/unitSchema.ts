import z from "zod";

export const unitSchema = z.object({
    price: z.number().min(1, { message: "Please enter a price." }),
    title: z.string().min(2, { message: "Please enter a title." }).max(50, "Title cannot exceed 50 characters."),
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
        }, {
          required_error: "Please select at least one amenity.",
        })
    ).min(1, "At least one amenity must be selected."),
    image: z.array(z.string({ required_error: "Please add at least one image." })).min(1, "At least one image must be added.").nonempty({ message: "Please add at least one image." }),
});



export type UnitData = z.infer<typeof unitSchema>;