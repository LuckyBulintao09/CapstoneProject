import { useEffect, useState } from "react";
import getAllReviewsUnderCompany from "@/actions/reviews/getAllReviewsUnderCompany";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Loader } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: number;
  comment: string;
  created_at: string;
  ratings: number;
  unit_id: number;
  firstname: string;
  lastname: string;
  profile_url: string | null; 
}

interface ReviewsUnderCompanyProps {
  companyId: number;
}

const ReviewsUnderCompany: React.FC<ReviewsUnderCompanyProps> = ({ companyId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const reviews = await getAllReviewsUnderCompany(companyId);
        setReviews(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [companyId]);

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      <div className="flex items-left space-x-2">
        <h1 className="text-2xl font-bold text-sky-700">Customer Reviews</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="h-10 w-10 animate-spin text-sky-500" />
        </div>
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          
            <Card className="relative my-4 shadow-lg border border-gray-200 bg-transparent dark:border-gray-700">
              <div className="absolute top-4 right-4">
                <Dropdown />
              </div>
              <CardHeader className="flex items-start space-x-4 border-b p-4 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Avatar className='h-10 w-10'>
                    <AvatarImage
                      src={review.profile_url || ""}
                      alt={`${review.firstname} ${review.lastname}`}
                    />
                    <AvatarFallback>{`${review.account.firstname.charAt(0)}${review.account.lastname.charAt(0)}`.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {`${review.account.firstname} ${review.account.lastname}`}
                    </p>
                    <small className="text-gray-500 dark:text-gray-400">
                      {new Date(review.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <CardTitle className="flex items-center space-x-1 ml-auto">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`h-5 w-5 ${index < review.ratings ? "text-yellow-400" : "text-gray-300"}`}
                      fill={index < review.ratings ? "#eab308" : "none"}
                    />
                  ))}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-gray-700 dark:text-gray-300">
                <p className="text-lg">{review.comment}</p>
              </CardContent>
              <Link
                key={review.id}
                href={`/property/room/${review.unit_id}`}
                passHref
                className="inline-flex items-center text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors duration-200"
                >
                <small className="underline">
                    Click here to view the unit
                </small>
            </Link>
            </Card>
          
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No reviews available for this company.</p>
      )}
    </div>
  );
};

const Dropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex justify-center p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        &#x22EE; 
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1">
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Report Review
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsUnderCompany;
