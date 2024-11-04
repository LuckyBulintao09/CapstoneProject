"use server";
import { createClient } from "../../../../supabase/server";

export async function sendPasswordReset(email: string) {
  console.log("sendPasswordReset", email);

  // Create a Supabase client without auth
  const supabase = createClient();

  // Check if the email exists in the `auth.users` table
  const { data: user, error: checkError } = await supabase
    .from("auth.users") // Use the correct schema if necessary
    .select("*")
    .eq("email", email)
    .single();

  if (checkError || !user) {
    throw new Error("Email does not exist. Please check and try again.");
  }

  // Send password reset link if the email exists
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/client/profile`, 
  });

  if (error) throw new Error(error.message);

  return data;
}
