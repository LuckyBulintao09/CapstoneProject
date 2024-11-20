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
      .rpc('get_all_reviews_under_property', { p_id: propertyId })

    if (error) {
      console.error('Error fetching ratings with user details:', error);
      return null;
    }

    return data;
}

export const fetchPropertyFacilities = async (propertyId: number) => {
  const { data, error } = await supabase
  .rpc('get_property_common_amenities', { p_id: propertyId })

  if (error) {
    console.error("Error fetching property facilities:", error);
    return null;
  }
  return data.map(item => item.amenity_name)
}

export const fetchPropertyUnits = async (propertyId: number) => {
  const { data: units, error: unitError } = await supabase
    .rpc('get_unit_under_property', { p_id: propertyId });

  if (unitError) {
    console.error("Error fetching property units:", unitError);
    return null;
  }
  return units
  //KULANG PA COLUMNS NA NIRERETURN
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
      .eq("property_ID", propertyId);
    return !error;
  } else {
    const { error } = await supabase
      .from("favorites")
      .insert({ Account_ID: userId, property_ID: propertyId });
    return !error;
  }
};
