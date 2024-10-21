import { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Star } from "lucide-react";

import { createClient } from "../../../utils/supabase/client";

interface BusinessReviewsProps {
  unitId: number | undefined;

}

const supabase = createClient();

const BusinessReviews: React.FC<BusinessReviewsProps> = ({ unitId }) => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!unitId) return;

      const { data, error } = await supabase
        .from("ratings_review")
        .select(
          `
          user_id, 
          ratings, 
          comment, 
          account (firstname, lastname)
        `
        )
        .eq("unit_id", unitId);

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews(data);
      }
    };

    fetchReviews();
  }, [unitId]);


  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <BentoGrid key={index} className="w-full">
            <BentoGridItem
              title={
                <div className="flex items-center justify-between">
                  <span className="text-sm line-clamp-1">
                    {review.account.firstname} {review.account.lastname}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500" fill="#eab308" />
                    <span className="ml-1 text-xs sm:text-sm">
                      {review.ratings}
                    </span>
                  </div>
                </div>
              }
              description={
                <p className="line-clamp-2 text-xs sm:text-sm">
                  {review.comment}
                </p>
              }
              className="shadow-sm flex flex-col justify-between p-4 rounded-md"
            />
          </BentoGrid>
        ))
      ) : (
        <p>No reviews available for this property.</p>
      )}
    </div>
  );
};

export default BusinessReviews;
