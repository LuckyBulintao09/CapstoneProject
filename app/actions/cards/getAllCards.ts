"use client";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const getAllCards = async () => {
  try {
    const { data, error } = await supabase
      .from("card")
      .select("*")
      .order("updated_at", { ascending: false, nullsFirst: true }) 
      .order("created_at", { ascending: false }); 

    if (error) {
      throw new Error(error.message); 
    }
    return data; 
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching cards:', error.message);
      return { error: error.message }; 
    } else {
      console.error('Unknown error occurred');
      return { error: 'Unknown error occurred' };
    }
  }
};
