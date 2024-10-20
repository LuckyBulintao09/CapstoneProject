import { z } from "zod";

const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];
const MAX_FILE_SIZE = 1024 * 1024 * 5;

export const companySchema = z.object({
    company_name: z.string(),
    address: z.string(),
    about: z.string(),
    logo: z.number(),

    business_permit: z
        .any()
        .refine((files) => {
            return files?.[0]?.size <= MAX_FILE_SIZE;
        }, `Max image size is 5MB.`)
        .refine((files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type), "Only .jpg, .jpeg, .png and .webp formats are supported."),
});
