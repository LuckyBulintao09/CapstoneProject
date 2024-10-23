"use client";

import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

export default function useGetUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                // fetch user information profile
                const { data: user } = await supabase.from("account").select("*").eq("id", data.session.user.id).single();
                return user;
            }
            redirect("/");
        },
    });
};
