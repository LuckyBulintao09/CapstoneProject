"use server";
import { createClient } from "@/utils/supabase/server";

export const checkUser = async () => {
  const supabase = await createClient();

  try {
    // Attempt to get the current user
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message); // Throw an error if one occurs
    }

    // Return the user info if available, or an error message if not
    return data
      ? { user: { id: data.user.id, email: data.user.email }, error: null }
      : { user: null, error: "No user found" };
  } catch (err: any) {
    // Log the error and return it
    console.error("Error fetching user:", err.message);
    return { user: null, error: err.message }; // Return error if any
  }
};
