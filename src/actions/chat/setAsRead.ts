import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export async function setAsRead(conversationId: string) {
    await supabase
        .from("conversation")
        .update({ read: true })
        .eq("id", conversationId);
}