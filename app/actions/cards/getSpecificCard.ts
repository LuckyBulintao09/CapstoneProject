import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const getSpecificCard = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("card")
      .select("*")
      .eq("id", id)
      .single(); 

    if (error) {
      throw new Error(error.message);
    }

    return data; 
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching card:", error.message);
      return { error: error.message };
    } else {
      console.error("Unknown error occurred");
      return { error: "Unknown error occurred" };
    }
  }
};
