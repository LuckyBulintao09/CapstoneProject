import { z } from "zod";

const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/png"];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];
const MAX_FILE_SIZE = 1024 * 1024 * 5;

export const companySchema = z.object({
    company_name: z.string(),
    address: z.string(),
    about: z.string(),
    business_permit: z.array(z.instanceof(File)),
    logo: z.array(z.instanceof(File)).optional()
});


export type CompanySchemaTypes = z.infer<typeof companySchema>