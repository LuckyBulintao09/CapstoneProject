import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data.user?.id || null;
};

export const fetchProperty = async (
  propertyId: number,
  userId: string | null
) => {
  const { data: unit, error } = await supabase
    .from("unit")
    .select(
      `
      *,
      property (
        address,
        company (
          owner_id (
            firstname,
            lastname,
            id
          ),
          company_name
        )
      )
    `
    )
    .eq("id", propertyId)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  let favorite = false;
  if (userId) {
    const { data: favoriteData } = await supabase
      .from("favorites")
      .select("id")
      .eq("Account_ID", userId)
      .eq("unit_ID", propertyId)
      .single();

    favorite = !!favoriteData;
  }

  return { unit, favorite };
};

export const toggleFavourite = async (
  isFavourite: boolean,
  userId: string | null,
  propertyId: number
) => {
  if (!userId || !propertyId) return false;

  if (isFavourite) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("Account_ID", userId)
      .eq("unit_ID", propertyId);
    return !error;
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert([{ Account_ID: userId, unit_ID: propertyId }]);
    return !error;
  }
};
