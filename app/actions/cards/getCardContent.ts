import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const getCardContent = async (cardId: string) => {
    try {
        const { data, error } = await supabase
            .from("card_content")
            .select("*")
            .eq("parent_card", cardId); 

        if (error) {
            throw new Error(error.message);
        }

        return data; 
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching card content:", error.message);
            return { error: error.message }; 
        } else {
            console.error("Unknown error occurred");
            return { error: "Unknown error occurred" }; 
        }
    }
};