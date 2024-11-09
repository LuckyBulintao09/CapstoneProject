import { z } from "zod";

// create schema first
export const loginSchema = z.object({
    email: z.string({message: "Please enter your email."}).email({message: "Invalid email address."}),
    password: z.string({message: "Please enter your password."}).min(1, {message: "Password must be at least 8 characters."}),
});

export const registerSchema = z.object({
    email: z.string({ message: "Email is required." }).email({message: "Invalid email address."}),
    password: z.string({ message: "Password is required." }).min(1, { message: "Password must be at least 8 characters." }),
    confirm_password: z.string({ message: "Confirm Password is required." }),
}).superRefine(
    (value, ctx) => {
        if (value.confirm_password.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Confirm Password is required",
                path: ["confirm_password"],
            })
        }
        if ((value.password !== value.confirm_password) && value.confirm_password.length > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passwords do not match",
                path: ["confirm_password"],
            });
        }
    }
)

// then add all typescript types here
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;