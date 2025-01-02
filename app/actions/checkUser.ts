"use server";
import { createClient } from "@/utils/supabase/server";

export const checkUser = async () => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message); 
    }

    return data
      ? { user: { id: data.user.id, email: data.user.email }, error: null }
      : { user: null, error: "No user found" };
  } catch (err: any) {
    console.error("Error fetching user:", err.message);
    return { user: null, error: err.message }; 
  }
};
