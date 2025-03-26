
import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StarRatingProps {
  quizId: string;
  initialRating?: number;
  onRated?: (rating: number) => void;
  readOnly?: boolean;
}

export const StarRating = ({ quizId, initialRating = 0, onRated, readOnly = false }: StarRatingProps) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = async (newRating: number) => {
    if (readOnly) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to rate quizzes");
        return;
      }
      
      const { error } = await supabase
        .from('quiz_ratings')
        .upsert({
          quiz_id: quizId,
          user_id: user.id,
          rating: newRating
        }, { onConflict: 'quiz_id, user_id' });
      
      if (error) throw error;
      
      setRating(newRating);
      if (onRated) onRated(newRating);
      toast.success("Thank you for your rating!");
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={isSubmitting || readOnly}
          className={`${
            isSubmitting ? "opacity-50 cursor-not-allowed" : readOnly ? "cursor-default" : "cursor-pointer"
          } transition-colors focus:outline-none`}
          onMouseEnter={() => !readOnly && setHoveredRating(star)}
          onMouseLeave={() => !readOnly && setHoveredRating(0)}
          onClick={() => handleRatingClick(star)}
        >
          <Star
            className={`h-6 w-6 ${
              star <= (hoveredRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};
