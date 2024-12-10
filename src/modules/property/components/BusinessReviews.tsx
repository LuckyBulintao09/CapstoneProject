import { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Star } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface Review {
  firstname: string;
  ratings: number;
  comment: string;
  created_at: string;
}

interface BusinessReviewsProps {
  propertyId: number | undefined;
  propertyReviews: Review[];
}

const BusinessReviews: React.FC<BusinessReviewsProps> = ({
  propertyId,
  propertyReviews,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortedReviews, setSortedReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  useEffect(() => {
    const updateReviewsPerPage = () => {
      setReviewsPerPage(window.innerWidth >= 1024 ? 6 : 4);
    };

    updateReviewsPerPage();
    window.addEventListener("resize", updateReviewsPerPage);
    return () => window.removeEventListener("resize", updateReviewsPerPage);
  }, []);

  useEffect(() => {
    const sorted = [...propertyReviews].sort((a, b) =>
      sortOrder === "latest"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    setSortedReviews(sorted);
  }, [propertyReviews, sortOrder]);

  useEffect(() => {
    const startIndex = currentPage * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    setReviews(sortedReviews.slice(startIndex, endIndex));
  }, [currentPage, sortedReviews, reviewsPerPage]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * reviewsPerPage < sortedReviews.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "latest" | "oldest");
    setCurrentPage(0);
  };

  return (
    <div>
      <div className="flex w-full">
        <div className="w-3/4">
          <h4 className="text-2xl font-semibold tracking-tight pb-4">
            Customer Reviews
          </h4>
        </div>
        <div className="flex justify-end w-1/4 p-1 space-x-2 items-center">
          <select
            onChange={handleSortChange}
            value={sortOrder}
            className="border border-gray-300 rounded p-2 text-sm"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`p-2 rounded-full ${
              currentPage === 0
                ? "text-gray-400"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={
              (currentPage + 1) * reviewsPerPage >= sortedReviews.length
            }
            className={`p-2 rounded-full ${
              (currentPage + 1) * reviewsPerPage >= sortedReviews.length
                ? "text-gray-400"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center mt-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <BentoGrid key={index} className="w-full">
              <BentoGridItem
                title={
                  <div className="flex items-center justify-between">
                    <span className="text-sm line-clamp-1">
                      {review.firstname}
                    </span>
                    <div className="flex items-center">
                      <Star
                        className="h-4 w-4 text-yellow-500"
                        fill="#eab308"
                      />
                      <span className="ml-1 text-xs sm:text-sm">
                        {review.ratings}
                      </span>
                    </div>
                  </div>
                }
                description={
                  <div>
                    <p className="line-clamp-4 text-xs sm:text-sm">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                }
                className="shadow-sm flex flex-col justify-between p-4 rounded-md"
              />
            </BentoGrid>
          ))
        ) : (
          <p>No reviews available for this property.</p>
        )}
      </div>
    </div>
  );
};

export default BusinessReviews;
