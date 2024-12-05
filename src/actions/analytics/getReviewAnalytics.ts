'use server';
import { createClient } from "@/utils/supabase/server";
import { subDays } from "date-fns"; 

const supabase = createClient();

export async function getReviewAnalytics(propertyTitle: string, period: string) {
    console.log("Fetching unit IDs for property:", propertyTitle);

    const { data: propertyData, error: propertyError } = await supabase
        .from("property") 
        .select("id")
        .eq("title", propertyTitle) 
        .single(); 

    if (propertyError) throw new Error(`Error fetching property: ${propertyError.message}`);

    const propertyId = propertyData?.id;
    if (!propertyId) throw new Error("Property ID not found");

    console.log("Fetched property ID:", propertyId);

    const { data: unitData, error: unitError } = await supabase
        .from("unit") 
        .select("id")
        .eq("property_id", propertyId); 

    if (unitError) throw new Error(`Error fetching units: ${unitError.message}`);


    console.log("Fetched unit IDs:", unitData);

    if (unitData.length === 0) {
        throw new Error("No units found for this property.");
    }
    const unitIds = unitData.map(unit => unit.id); 
    console.log("Unit IDs to fetch reviews for:", unitIds);

    if (!Array.isArray(unitIds) || unitIds.length === 0) {
        throw new Error("Invalid unit IDs format.");
    }

   
    let dateRange = null;
    const currentDate = new Date();

    switch (period) {
        case "last24hrs":
            dateRange = subDays(currentDate, 1);
            break;
        case "last7days":
            dateRange = subDays(currentDate, 7);
            break;
        case "last4weeks":
            dateRange = subDays(currentDate, 28);
            break;
        case "allTime":
     
            dateRange = null;
            break;
        case "default":
   
            dateRange = null;
            break;
        default:
            throw new Error("Invalid period value");
    }

    let reviewsQuery = supabase
        .from("ratings_review") 
        .select("location, cleanliness, value_for_money, ratings")
        .in("unit_id", unitIds); 


    if (dateRange) {
        reviewsQuery = reviewsQuery.gte("created_at", dateRange.toISOString());
    }

    const { data: reviewsData, error: reviewsError } = await reviewsQuery;

    if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
        throw new Error(`Error fetching reviews: ${reviewsError.message}`);
    }


 
    if (reviewsData.length === 0) {
        console.log("No reviews found for the given units.");
    }

    
    const averages = {
        location: 0,
        cleanliness: 0,
        value_for_money: 0,
        ratings: 0,
        totalReviews: reviewsData.length, 
    };

    reviewsData.forEach((review) => {
        averages.location += review.location;
        averages.cleanliness += review.cleanliness;
        averages.value_for_money += review.value_for_money;
        averages.ratings += review.ratings;
    });

    const totalReviews = reviewsData.length;

 
    if (totalReviews > 0) {
        averages.location /= totalReviews;
        averages.cleanliness /= totalReviews;
        averages.value_for_money /= totalReviews;
        averages.ratings /= totalReviews;
    }

   
    averages.location = parseFloat(averages.location.toFixed(2));
    averages.cleanliness = parseFloat(averages.cleanliness.toFixed(2));
    averages.value_for_money = parseFloat(averages.value_for_money.toFixed(2));
    averages.ratings = parseFloat(averages.ratings.toFixed(2));

    console.log("Averages:", averages);

    return averages;
}
