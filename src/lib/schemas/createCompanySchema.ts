import { z } from "zod";

export const companySchema = z.object({
    company_name: z.string().min(2).max(50),
    about: z.string().min(2),
});


export type CompanySchemaTypes = z.infer<typeof companySchema>