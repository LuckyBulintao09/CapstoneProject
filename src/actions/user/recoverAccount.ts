"use server";
import { createClient } from "@/utils/supabase/server";

export async function sendPasswordReset(email: string) {
  console.log("sendPasswordReset", email);

  const supabase = createClient();

  const { data: user, error: checkError } = await supabase
    .from("auth.users") 
    .select("*")
    .eq("email", email)
    .single();

  if (checkError || !user) {
    throw new Error("Email does not exist. Please check and try again.");
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/client/profile`, 
  });

  if (error) throw new Error(error.message);

  return data;
}
