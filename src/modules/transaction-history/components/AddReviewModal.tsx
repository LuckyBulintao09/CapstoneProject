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
  property_id: string;
}

const AddReviewModal = ({
  isOpen,
  onClose,
  property_id,
}: AddReviewModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<number | null>(null);

  console.log("Property Code passed to AddReviewModal:", property_id);

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error retrieving session:", error.message);
      }

      if (session?.user) {
        setUserId(session.user.id);
        console.log("Logged in User ID:", session.user.id);
      } else {
        console.log("No user session found");
      }
    };

    getUserId();
  }, []);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleStarHover = (index: number) => {
    setHoverRating(index + 1);
  };

  const resetHover = () => {
    setHoverRating(0);
  };

  const stars = Array(5).fill(null);

  // Submit the review to Supabase
  const handleSubmit = async () => {
    console.log("Submitting review...");
    console.log("Rating:", rating);
    console.log("Review Text:", reviewText);
    console.log("User ID:", userId);
    console.log("Property ID:", propertyId); // This can be null now

    // Check if the required fields are present
    if (!rating || !reviewText || !userId) {
      alert("Please provide a rating, review, and ensure you're logged in.");
      return;
    }

    try {
      // Insert the review into the ratings_review table with the property_id and user_id
      const { error } = await supabase.from("ratings_review").insert([
        {
          property_id: propertyId, // This can now be null if not found
          user_id: userId, // Taken from the logged-in session
          ratings: rating,
          comment: reviewText,
          isReported: false, // Default value for 'isReported'
        },
      ]);

      if (error) {
        console.error("Error saving review:", error.message);
        alert("Failed to save review. Please try again.");
      } else {
        alert("Review submitted successfully!");
        onClose(); // Close the modal after successful submission
      }
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
            {stars.map((_, index) => (
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
