import { z } from "zod";

export const createPropertyCompanySchema = z.object({
    company_id: z.string({ message: "Please select a company." }),
});

export const createPropertyTypeSchema = z.object({
    structure: z.enum(["apartment", "condominium", "dormitory"], {
        message: "Please select one of the options.",
    }),
    privacy_type: z.enum(["room", "shared room", "entire place"], {
        message: "Please select one of the options.",
    }),
});
