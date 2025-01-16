import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const createAnnouncement = async (subject: string, content: string) => {
    const { data, error } = await supabase
        .from("announcement")
        .insert([{ subject, content }])
        .select();

    if (error) {
        console.error("Error creating announcement:", error.message);
        return { success: false, error: error.message };
    }

    return { success: true, data };
};
