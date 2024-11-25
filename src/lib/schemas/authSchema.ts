import { z } from "zod";

export const loginSchema = z.object({
    email: z.string({ message: "Please enter your email." }).email({ message: "Invalid email address." }),
    password: z.string({ message: "Please enter your password." }).min(1, { message: "Password is required." }),
});

export const registerSchema = z.object({
    firstname: z.string({ message: "First name is required." }).min(1, { message: "First name cannot be empty." }),
    lastname: z.string({ message: "Last name is required." }).min(1, { message: "Last name cannot be empty." }),
    email: z.string({ message: "Email is required." }).email({ message: "Invalid email address." }),
    password: z
        .string({ message: "Password is required." })
        .min(8, { message: "Password must be at least 8 characters." })
        .max(20, { message: "Password must not exceed 20 characters." })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,20}$/,
            {
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            }
        ),
    confirm_password: z.string({ message: "Confirm Password is required." }),
}).superRefine((value, ctx) => {
    if (value.confirm_password.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Confirm Password is required",
            path: ["confirm_password"],
        });
    }
    if (value.password !== value.confirm_password && value.confirm_password.length > 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match",
            path: ["confirm_password"],
        });
    }
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
