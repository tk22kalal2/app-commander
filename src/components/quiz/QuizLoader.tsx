
import { Loader2 } from "lucide-react";

export const QuizLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-medblue" />
      <span className="ml-2">Loading quiz...</span>
    </div>
  );
};
