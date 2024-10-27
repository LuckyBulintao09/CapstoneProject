import { z } from "zod";

export const companySchema = z.object({
    company_name: z.string().min(2).max(50),
    about: z.string().min(2),
});

export const editCompanySchema = z.object({
    company_name: z.string().min(2).max(50),
    about: z.string().min(2),
});


export type CompanySchemaTypes = z.infer<typeof companySchema>
export type EditCompanySchemaTypes = z.infer<typeof editCompanySchema>