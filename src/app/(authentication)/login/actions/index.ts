"use server";

import { createClient } from "@/utils/supabase/server";

import { loginSchema, LoginFormData } from "@/lib/schemas/authSchema";
import { redirect } from "next/navigation";

export async function LoginWithPassword(values: LoginFormData) {
    const verifiedFormData = loginSchema.safeParse(values);

    if (!verifiedFormData.success) {
        throw verifiedFormData.error;
    }

    const supabase = createClient();

    try {
        const { error } = await (
            await supabase
        ).auth.signInWithPassword({
            email: verifiedFormData.data.email,
            password: verifiedFormData.data.password,
        });

        if (error) {
            throw error.message;
        }

        return;
    } catch (error: any) {
        // handle some error if possible
        throw error;
    }
}

export async function SignOut() {
    const supabase = createClient();
    await (await supabase).auth.signOut();
    redirect("/login");
}
