"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  getSessionUserId,
  addReview,
  updateReview,
  fetchReviewData,
} from "@/actions/transaction/addreviewmodal";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface Review {
  id: number;
  created_at: string;
  user_id: string;
  ratings: number;
  comment: string;
  isReported: boolean;
  unit_id: number;
  location: number;
  cleanliness: number;
  value_for_money: number;
}
import { toast } from "sonner";
interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit_id: string;
  reviewData: Review | null;
  onDelete: () => void;
}

const mapScoreToRating = (averageScore: number): string => {
  if (averageScore >= 9) return "Exceptional";
  if (averageScore >= 8) return "Wonderful";
  if (averageScore >= 7) return "Excellent";
  if (averageScore >= 6) return "Good";
  if (averageScore >= 5) return "Pleasant";
  if (averageScore >= 4) return "Fair";
  if (averageScore >= 3) return "Disappointing";
  if (averageScore >= 2) return "Poor";
  if (averageScore >= 1) return "Very Poor";
  return "Bad";
};

const AddReviewModal = ({
  isOpen,
  onClose,
  unit_id,
  reviewData,
  onDelete,
  transactionId
}: AddReviewModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  const [locationHover, setLocationHover] = useState(0);
  const [cleanlinessHover, setCleanlinessHover] = useState(0);
  const [valueHover, setValueHover] = useState(0);
  const [locationRating, setLocationRating] = useState<number>(0);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(0);
  const [valueRating, setValueRating] = useState<number>(0);

  useEffect(() => {
    if (reviewData) {
      setRating(reviewData.ratings || 0);
      setReviewText(reviewData.comment || "");
      setLocationRating(reviewData.location || 0);
      setCleanlinessRating(reviewData.cleanliness || 0);
      setValueRating(reviewData.value_for_money || 0);
    } else {
      setRating(0);
      setReviewText("");
      setLocationRating(0);
      setCleanlinessRating(0);
      setValueRating(0);
    }
  }, [reviewData]);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getSessionUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const handleRatingChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number
  ) => {
    setter(value);
  };

  const handleSubmit = async () => {
    if (!rating || !reviewText || !userId || !unit_id) {
      toast.error("Please provide a rating, review, and ensure you're logged in.");
      return;
    }

    let success = false;
    if (reviewData) {
      success = await updateReview(
        reviewData.id,
        rating,
        reviewText,
        locationRating,
        cleanlinessRating,
        valueRating
      );
    } else {
      success = await addReview(
        unit_id,
        userId,
        rating,
        reviewText,
        locationRating,
        cleanlinessRating,
        valueRating,
        transactionId
      );
    }

    if (success) {
      toast.success("Review saved successfully!");

      const updatedReviewData = await fetchReviewData(unit_id, userId);
      setRating(updatedReviewData?.ratings || 0);
      setReviewText(updatedReviewData.comment || "");
      setLocationRating(updatedReviewData.location || 0);
      setCleanlinessRating(updatedReviewData.cleanliness || 0);
      setValueRating(updatedReviewData.value_for_money || 0);
      window.location.reload();
      onClose();
    } else {
      toast.error("Failed to save review.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80%] lg:max-w-[40%] bg-white dark:bg-secondary shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Property Rating</DialogTitle>
          <DialogDescription className="border-b border-gray-300 dark:text-gray-200 pb-2">
            {reviewData
              ? "Update your review for this property."
              : "Provide your feedback and rating for this property to complete your review."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full items-center gap-5">
          <form>
            {/* Overall Rating */}
            <div className="flex items-center flex-col space-y-1.5 mb-4">
              <Label htmlFor="property_rating">Overall Property Rating</Label>
              <div className="flex mb-4 flex-wrap gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    onClick={() => setRating(index + 1)}
                    onMouseEnter={() => setHoverRating(index + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`h-6 w-6 md:h-8 md:w-8 cursor-pointer ${
                      (hoverRating || rating) > index
                        ? "text-amber-500"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Location Rating */}
            <div className="flex flex-col space-y-1.5 mb-4">
              <Label htmlFor="location">Location Score</Label>
              <div className="w-full bg-white border-gray-400 rounded-lg overflow-hidden">
                <div className="grid grid-cols-10 divide-x divide-gray-200">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRatingChange(setLocationRating, index + 1);
                            }}
                            onMouseEnter={() => setLocationHover(index + 1)}
                            onMouseLeave={() => setLocationHover(0)}
                            className={`h-10 flex items-center justify-center text-sm font-medium border-0
														${
                              index + 1 <= (locationHover || locationRating)
                                ? "bg-amber-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }
														${index === 0 ? "rounded-l-lg" : index === 9 ? "rounded-r-lg" : ""}
													`}
                          >
                            {index + 1}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{mapScoreToRating(index + 1)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>

            {/* Cleanliness Rating */}
            <div className="flex flex-col space-y-1.5 mb-4">
              <Label htmlFor="cleanliness">Cleanliness Score</Label>
              <div className="w-full bg-white border-gray-400 rounded-lg overflow-hidden">
                <div className="grid grid-cols-10 divide-x divide-gray-200">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() =>
                              handleRatingChange(
                                setCleanlinessRating,
                                index + 1
                              )
                            }
                            onMouseEnter={() => setCleanlinessHover(index + 1)}
                            onMouseLeave={() => setCleanlinessHover(0)}
                            className={`h-10 flex items-center justify-center text-sm font-medium border-0
														${
                              index + 1 <=
                              (cleanlinessHover || cleanlinessRating)
                                ? "bg-amber-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }
														${index === 0 ? "rounded-l-lg" : index === 9 ? "rounded-r-lg" : ""}
													`}
                          >
                            {index + 1}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{mapScoreToRating(index + 1)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>

            {/* Value Rating */}
            <div className="flex flex-col space-y-1.5 mb-4">
              <Label htmlFor="value_for_money">Value for Money Score</Label>
              <div className="w-full bg-white border-gray-400 rounded-lg overflow-hidden">
                <div className="grid grid-cols-10 divide-x divide-gray-200">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() =>
                              handleRatingChange(setValueRating, index + 1)
                            }
                            onMouseEnter={() => setValueHover(index + 1)}
                            onMouseLeave={() => setValueHover(0)}
                            className={`h-10 flex items-center justify-center text-sm font-medium border-0
														${
                              index + 1 <= (valueHover || valueRating)
                                ? "bg-amber-500 text-white"
                                : "bg-gray-200 text-gray-800"
                            }
														${index === 0 ? "rounded-l-lg" : index === 9 ? "rounded-r-lg" : ""}
													`}
                          >
                            {index + 1}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{mapScoreToRating(index + 1)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>

            {/* Comment */}
            <div className="flex flex-col space-y-1.5 mb-4">
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                placeholder="Write your review here"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="min-h-[80px] md:min-h-[150px] dark:bg-tertiary dark:text-white"
              />
            </div>
          </form>
        </div>

        {/* Submit and Cancel Buttons */}
        <DialogFooter className="flex flex-col md:flex-row justify-between gap-1">
          <Button
            variant="outline"
            onClick={onDelete}
            className="w-full md:w-auto border-destructive hover:bg-transparent text-destructive hover:text-destructive dark:bg-destructive dark:text-white"
          >
            Delete
          </Button>
          <Button onClick={handleSubmit} className="w-full md:w-auto">
            {reviewData ? "Update Review" : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewModal;
