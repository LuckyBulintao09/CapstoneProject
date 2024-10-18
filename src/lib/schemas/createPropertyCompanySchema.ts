import { z } from "zod";

export const createPropertyCompanySchema = z.object({
    company_name: z.string({ message: "Please select a company" }),
});