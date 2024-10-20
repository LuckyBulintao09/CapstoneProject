"use client";
import { createClient } from "../../../../utils/supabase/client";
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

const supabase = createClient();

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit_id: string;
}

const AddReviewModal = ({ isOpen, onClose, unit_id }: AddReviewModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error retrieving session:", error.message);
        return;
      }

      if (session?.user) {
        setUserId(session.user.id);
        console.log("Fetched userId:", session.user.id);
      }
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

    try {
      const { error } = await supabase.from("ratings_review").insert([
        {
          unit_id,
          user_id: userId,
          ratings: rating,
          comment: reviewText,
          isReported: false,
        },
      ]);

      if (error) {
        console.error("Error saving review:", error.message);
        alert("Failed to save review. Please try again.");
        return;
      }

      alert("Review submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="px-4 mx-4">
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white dark:bg-secondary">
          <DialogTitle className="text-center text-2xl font-bold">
            How was your experience?
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
            <Button onClick={handleSubmit}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddReviewModal;
