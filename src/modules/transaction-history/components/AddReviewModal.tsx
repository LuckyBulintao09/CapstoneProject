"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import {
  getSessionUserId,
  addReview,
  updateReview,
} from "@/actions/transaction/addreviewmodal";

interface Review {
  id: number;
  created_at: string;
  user_id: string;
  ratings: number;
  comment: string;
  isReported: boolean;
  unit_id: number;
}

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit_id: string;
  reviewData: Review | null;
}

const AddReviewModal = ({
  isOpen,
  onClose,
  unit_id,
  reviewData,
}: AddReviewModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (reviewData) {
      setRating(reviewData.ratings);
      setReviewText(reviewData.comment);
    } else {
      setRating(0);
      setReviewText("");
    }
  }, [reviewData]);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getSessionUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const handleStarClick = (index: number) => setRating(index + 1);
  const handleStarHover = (index: number) => setHoverRating(index + 1);
  const resetHover = () => setHoverRating(0);

  const handleSubmit = async () => {
    if (!rating || !reviewText || !userId || !unit_id) {
      alert("Please provide a rating, review, and ensure you're logged in.");
      return;
    }

    let success = false;
    if (reviewData) {
      success = await updateReview(reviewData.id, rating, reviewText);
    } else {
      success = await addReview(unit_id, userId, rating, reviewText);
    }

    if (success) {
      window.location.reload();
      onClose();
    } else {
      alert("Failed to save review. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-secondary">
        <DialogTitle className="text-center text-2xl font-bold">
          {reviewData ? "Edit Your Review" : "How was your experience?"}
        </DialogTitle>
        <div className="flex justify-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleStarHover(index)}
              onMouseLeave={resetHover}
              className={`h-8 w-8 cursor-pointer ${
                (hoverRating || rating) > index
                  ? "text-amber-500"
                  : "text-gray-400"
              }`}
            />
          ))}
        </div>
        <div className="py-4">
          <Textarea
            placeholder="Write your review here"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="min-h-[150px] dark:bg-tertiary dark:text-white"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {reviewData ? "Update Review" : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewModal;
