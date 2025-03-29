
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Quiz } from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface FormattedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
}

interface QuizDisplayProps {
  quizTitle: string;
  quizDescription?: string | null;
  quizId: string;
  timePerQuestion?: string | null;
  questionCount: number;
  formattedQuestions: FormattedQuestion[];
}

export const QuizDisplay = ({
  quizTitle,
  quizDescription,
  quizId,
  timePerQuestion,
  questionCount,
  formattedQuestions
}: QuizDisplayProps) => {
  const [score, setScore] = useState<number>(0);
  const [isQuizComplete, setIsQuizComplete] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userCollege, setUserCollege] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: userData, error } = await supabase
            .from('profiles')
            .select('name, college_name')
            .eq('id', user.id)
            .single();
          
          if (error) {
            throw error;
          }
          
          if (userData) {
            setUserName(userData.name || "User");
            setUserCollege(userData.college_name || "");
          }
        }
      } catch (error: any) {
        console.error("Error fetching user info:", error);
        toast.error("Failed to load user information");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserInfo();
  }, []);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    setIsQuizComplete(true);
    submitQuizResult(newScore);
  };

  const submitQuizResult = async (finalScore: number) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to save quiz results");
        return;
      }
      
      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          quiz_id: quizId,
          user_id: user.id,
          user_name: userName || "User",
          score: finalScore,
          total_questions: formattedQuestions.length,
          time_taken: null
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setResultId(data.id);
      toast.success("Quiz results saved successfully!");
      
      // Navigate to results page
      setTimeout(() => {
        navigate(`/quiz/results/${data.id}`);
      }, 1000);
    } catch (error: any) {
      console.error("Error submitting quiz result:", error);
      toast.error("Failed to save quiz results: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-medblue" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-medblue mb-2">{quizTitle}</h1>
        {quizDescription && (
          <p className="text-gray-600 dark:text-gray-300">{quizDescription}</p>
        )}
        <div className="mt-4 text-gray-600 dark:text-gray-300">
          <p>Questions: {questionCount}</p>
          {timePerQuestion && <p>Time per question: {timePerQuestion}</p>}
        </div>
      </div>
      
      {formattedQuestions.length > 0 ? (
        <Quiz
          subject={quizTitle}
          chapter="Custom Quiz"
          topic=""
          difficulty="medium"
          questionCount={formattedQuestions.length.toString()}
          timeLimit={timePerQuestion || "No Limit"}
          simultaneousResults={true}
          quizId={quizId}
          preloadedQuestions={formattedQuestions}
          onScoreUpdate={handleScoreUpdate}
        />
      ) : (
        <Card className="p-8 text-center">
          <p className="text-lg text-red-500">No questions found for this quiz.</p>
          <Button
            onClick={() => navigate("/browse-quizzes")}
            className="mt-4"
          >
            Browse Other Quizzes
          </Button>
        </Card>
      )}
    </div>
  );
};
