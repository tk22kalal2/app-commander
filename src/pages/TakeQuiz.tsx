
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuizData } from "@/hooks/useQuizData";
import { QuizLoader } from "@/components/quiz/QuizLoader";
import { QuizError } from "@/components/quiz/QuizError";
import { AccessCodeForm } from "@/components/quiz/AccessCodeForm";
import { QuizDisplay } from "@/components/quiz/QuizDisplay";

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const [isAccessVerified, setIsAccessVerified] = useState(false);
  
  const {
    quiz,
    formattedQuestions,
    isLoading,
    error,
    verifyAccessCode
  } = useQuizData(id || "", isAccessVerified);

  const handleVerifyAccessCode = async (code: string): Promise<boolean> => {
    const isValid = await verifyAccessCode(code);
    if (isValid) {
      setIsAccessVerified(true);
    }
    return isValid;
  };

  if (isLoading) {
    return <QuizLoader />;
  }

  if (error || !quiz) {
    return <QuizError message={error || "Quiz not found."} />;
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
          formattedQuestions={formattedQuestions}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default TakeQuiz;
