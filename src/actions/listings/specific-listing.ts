"use server"
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
  const { data: property, error } = await supabase
    .from('property')
    .select(`
      *,
      company:company_id (
        *,
        account:owner_id (*)
      )
    `)
    .eq('id', propertyId)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return { property };
};

export const fetchPropertyReviews = async (propertyId: number) => {
      const { data, error } = await supabase
      .from('ratings_review')
      .select(`
        ratings,
        comment,
        cleanliness,
        location,
        value_for_money,
        account:user_id (
          firstname,
          lastname
        ),
        unit:unit_id (
          property:property_id (
            id
          )
        )
      `)
      .eq('unit.property.id', propertyId);

    if (error) {
      console.error('Error fetching ratings with user details:', error);
      return null;
    }

    return data;
}

export const fetchFavorite = async (userId: string | null, propertyId: number) => {
  let favorite = false
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("Account_ID", userId)
    .eq("property_ID", propertyId)
    .single();

    favorite = !!data

  if (error) {
    console.error("Error fetching favorites:", error);
    return null;
  }

  return favorite;
}

export const fetchPropertyLocation = async (propertyId: number) => {
  const { data, error } = await supabase
    .rpc('get_property_location' , { p_id: propertyId })

  if (error) {
    console.error("Error fetching property location:", error);
    return null;
  }
  return data
}



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
