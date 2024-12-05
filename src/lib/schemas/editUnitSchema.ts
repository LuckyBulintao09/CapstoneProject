import { z } from "zod";

export const unitTitleSchema = z.object({
    unit_title: z.string().min(1, { message: "Please enter a title." }).max(52),
});

export const unitTypeSchema = z.object({
    privacy_type: z.string().min(2, { message: "Please select a privacy type." }),
    room_size: z
        .number({ required_error: "Please enter a valid room size.", message: "Please enter a valid room size." })
        .min(1, { message: "Please enter a valid room size." })
        .max(9999, { message: "Please enter a valid room size." }),
});

export const unitSpecificationSchema = z.object({
    bedrooms: z
        .number({ required_error: "Please enter a bedroom number.", message: "Please enter a valid bedroom number." })
        .min(1)
        .max(14, { message: "Are you sure you have that many bedrooms." }),
    occupants: z
        .number({ required_error: "Please enter a occupant count.", message: "Please enter a valid occupant count." })
        .min(1)
        .max(14, { message: "Are you sure you have that many occupants." }),
    beds: z
        .number({ required_error: "Please enter a number of beds.", message: "Please enter a valid number of beds." })
        .min(1)
        .max(14, { message: "Are you sure you have that many beds." }),
});

export const unitAmenitySchema = z.object({
    amenities: z.array(
        z.object({
          value: z.string().transform((val) => parseInt(val)),
          label: z.string(),
        }, {
          required_error: "Please select at least one amenity.",
        }),
        { required_error: "Please select at least one amenity.", message: "Please select at least one amenity." }
    ).min(1, "At least one amenity must be selected."),

    additional_amenities: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
        }),
    ).optional(),

})

export type UnitTitleData = z.infer<typeof unitTitleSchema>;

export type UnitTypeData = z.infer<typeof unitTypeSchema>;

export type UnitSpecificationData = z.infer<typeof unitSpecificationSchema>;

export type UnitAmenityData = z.infer<typeof unitAmenitySchema>;