
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuizData } from "@/hooks/useQuizData";
import { QuizLoader } from "@/components/quiz/QuizLoader";
import { QuizError } from "@/components/quiz/QuizError";
import { AccessCodeForm } from "@/components/quiz/AccessCodeForm";
import { QuizDisplay } from "@/components/quiz/QuizDisplay";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const [isAccessVerified, setIsAccessVerified] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const navigate = useNavigate();
  
  const {
    quiz,
    formattedQuestions,
    isLoading,
    error,
    verifyAccessCode
  } = useQuizData(id || "", isAccessVerified);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsUserAuthenticated(!!session);
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleVerifyAccessCode = async (code: string): Promise<boolean> => {
    const isValid = await verifyAccessCode(code);
    if (isValid) {
      setIsAccessVerified(true);
    }
    return isValid;
  };

  const handleLogin = () => {
    // Save current quiz ID to redirect back after login
    navigate("/auth", { state: { redirectTo: `/quiz/take/${id}` } });
  };

  if (isLoading || isAuthChecking) {
    return <QuizLoader />;
  }

  if (error || !quiz) {
    return <QuizError message={error || "Quiz not found."} />;
  }

  // If user is not authenticated, show login prompt
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen bg-medbg dark:bg-gray-900">
        <Navbar />
        
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-medblue mb-4">Login Required</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              You need to be logged in to take this quiz. Your results will be saved and displayed on the leaderboard.
            </p>
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-medblue hover:bg-medblue/90"
            >
              Log In to Continue
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Show access code form if quiz is private and access is not verified
  if (quiz.is_private && !isAccessVerified) {
    return (
      <div className="min-h-screen bg-medbg dark:bg-gray-900">
        <Navbar />
        
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <AccessCodeForm 
            quizTitle={quiz.title}
            onVerify={handleVerifyAccessCode}
          />
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medbg dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <QuizDisplay 
          quizTitle={quiz.title}
          quizDescription={quiz.description}
          quizId={quiz.id}
          timePerQuestion={quiz.time_per_question}
          questionCount={quiz.question_count}
          formattedQuestions={formattedQuestions.map(q => ({
            id: q.question,  // Using question as id since FormattedQuestion doesn't have id
            question_text: q.question,
            option_a: q.options[0].substring(3),
            option_b: q.options[1].substring(3),
            option_c: q.options[2].substring(3),
            option_d: q.options[3].substring(3),
            correct_answer: q.correctAnswer,  // Fixed property name
            explanation: q.explanation
          }))}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default TakeQuiz;
