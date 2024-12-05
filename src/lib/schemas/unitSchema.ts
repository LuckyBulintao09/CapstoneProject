import z from "zod";

export const unitSchema = z.object({
    price: z.number({ required_error: "Please enter a price.", message: "Please enter a valid price." }).min(1, { message: "Please enter a price." }),
    title: z.string({required_error: "Please enter a title."}).min(2, { message: "Title cannot be less than 2 characters." }).max(50, "Title cannot exceed 50 characters."),
    privacy_type: z.string().min(2, { message: "Please select a privacy type." }),
    bedrooms: z.number({ required_error: "Please enter a bedroom number.", message: "Please enter a valid bedroom number." }).min(1).max(14, { message: "Are you sure you have that many bedrooms." }),
    occupants: z.number({ required_error: "Please enter a occupant count.", message: "Please enter a valid occupant count." }).min(1).max(14, { message: "Are you sure you have that many occupants." }),
    beds: z.number({ required_error: "Please enter a number of beds.", message: "Please enter a valid number of beds." }).min(1).max(14, { message: "Are you sure you have that many beds." }),
    outside_view: z.boolean().default(false),
    room_size: z.number({ required_error: "Please enter a room size.", message: "Please enter a valid room size." }).min(1, { message: "Please enter a valid room size." }).max(9999, { message: "Please enter a valid room size." }),
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