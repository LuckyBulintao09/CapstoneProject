import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const handleResetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/client/profile`,
    });

    if (error) {
        throw new Error(error.message);
    }
};
