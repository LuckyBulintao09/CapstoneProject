import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const createAnalytics = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("analytics").insert([{ card_id: id }]);

    if (error) {
      console.error("Error creating analytics:", error.message);
    }
  } catch (err) {
    console.error("Unexpected error in createAnalytics:", err);
  }
};
