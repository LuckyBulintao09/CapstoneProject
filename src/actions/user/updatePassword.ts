
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const handleResetPassword = async (newPassword: string, confirmPassword: string) => {
    if (!newPassword || !confirmPassword) {
        return { error: "Please fill in both password fields." };
    }
    if (newPassword !== confirmPassword) {
        return { error: "Passwords do not match. Please try again." };
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) {
        console.error("Error updating password:", error);
        return { error: "There was an error updating your password." };
    }

    return { success: "Password updated successfully!" };
};
