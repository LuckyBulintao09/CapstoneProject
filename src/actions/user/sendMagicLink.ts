import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const handleResetPassword = async (email: string) => {
    const { data: user, error: userError } = await supabase
        .from("account")
        .select("*")
        .eq("email", email)
        .single(); 

    if (userError || !user) {
        throw new Error("Email does not exist. Please check and try again.");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/client/profile`, 
    });

    if (error) {
        throw new Error(error.message); 
    }
};
