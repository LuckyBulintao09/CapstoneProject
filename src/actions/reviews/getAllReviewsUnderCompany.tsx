import { createClient } from "../../../supabase/client";

const supabase = createClient();

export default async function getAllReviewsUnderCompany(companyId: string) {
    const { data: properties, error: propertyError } = await supabase
        .from("property")
        .select("id")
        .eq("company_id", companyId);

    if (propertyError) {
        console.error(propertyError);
        return propertyError;
    }

    if (!properties || properties.length === 0) {
        return []; 
    }

    const propertyIds = properties.map((property) => property.id);

    const { data: units, error: unitError } = await supabase
        .from("unit")
        .select("id")
        .in("property_id", propertyIds);

    if (unitError) {
        console.error(unitError);
        return unitError;
    }

    if (!units || units.length === 0) {
        return [];
    }

    const unitIds = units.map((unit) => unit.id);

    const { data: reviews, error: reviewError } = await supabase
        .from("ratings_review")
        .select(`
          *,
          account: user_id (firstname, lastname, profile_url)
        `) 
        .in("unit_id", unitIds);

    if (reviewError) {
        console.error(reviewError);
        return reviewError;
    }
    return reviews;
}
