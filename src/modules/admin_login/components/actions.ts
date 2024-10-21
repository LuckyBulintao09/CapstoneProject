"use server";

import { createClient } from "../../../utils/supabase/client";

const supabase = createClient();

interface LoginParams {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginParams) {
  try {
    const { data: accountData, error: roleError } = await supabase
      .from("account")
      .select("role")
      .eq("email", email)
      .single();

    if (roleError || !accountData || accountData.role !== "Admin") {
      return {
        success: false,
        error: "Access denied. Only admins can log in.",
      };
    }

    if (password !== "admin1234") {
      return { success: false, error: "Incorrect password." };
    }
    return { success: true };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
