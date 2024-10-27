"use server"

import { createClient } from "@/utils/supabase/client"

export const getUserId = async () => {

    const supabase = createClient();

    try {
        const { data } = await supabase.auth.getSession();

        if (data.session?.user) {
            const { data: user } = await supabase.from("account").select("*").eq("id", data.session.user.id).single();
            return user;
        }

    } catch (error: any) {

        return error;

    }
};
