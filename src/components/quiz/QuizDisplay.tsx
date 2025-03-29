import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { handleDoubt } from "@/services/groqService";
import { SquareAd } from "../ads/SquareAd";
import { MultiplexVerticalAd } from "../ads/MultiplexVerticalAd";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string;
  image_url?: string;
}

interface QuizDisplayProps {
  quizTitle: string;
  quizDescription?: string;
  quizId: string;
  timePerQuestion?: string;
  questionCount: number;
  formattedQuestions: Question[];
}

export const QuizDisplay = ({
  quizTitle,
  quizDescription,
  quizId,
  timePerQuestion,
  questionCount,
  formattedQuestions,
}: QuizDisplayProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [quizTimeRemaining, setQuizTimeRemaining] = useState<number | null>(null);
  const [quizDuration, setQuizDuration] = useState<number | null>(null);
  const [isQuizRunning, setIsQuizRunning] = useState(false);
  const navigate = useNavigate();

  const currentQuestion = formattedQuestions[currentQuestionIndex];

  const startQuiz = useCallback(() => {
    setIsQuizRunning(true);
    setQuizStartTime(Date.now());
    
    const duration = timePerQuestion ? parseInt(timePerQuestion) * formattedQuestions.length * 1000 : null;
    setQuizDuration(duration);
    
    if (duration) {
      setQuizTimeRemaining(duration);
    }
  }, [timePerQuestion, formattedQuestions.length]);

  useEffect(() => {
    if (quizDuration && quizTimeRemaining !== null && quizTimeRemaining > 0 && isQuizRunning) {
      const timerInterval = setInterval(() => {
        setQuizTimeRemaining(quizDuration - (Date.now() - (quizStartTime || 0)));
      }, 100);
      
      return () => clearInterval(timerInterval);
    } else if (quizDuration && quizTimeRemaining !== null && quizTimeRemaining <= 0 && isQuizRunning) {
      handleSubmitQuiz();
    }
  }, [quizDuration, quizTimeRemaining, quizStartTime, isQuizRunning]);

  const handleAnswerSelect = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < formattedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (milliseconds: number | null): string => {
    if (milliseconds === null) return "∞";
    const seconds = Math.max(0, Math.floor(milliseconds / 1000));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(userAnswers).length !== formattedQuestions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    
    let finalScore = 0;
    for (let i = 0; i < formattedQuestions.length; i++) {
      if (userAnswers[i] === formattedQuestions[i].correct_answer) {
        finalScore++;
      }
    }
    
    // Save result to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to save your result.");
        return;
      }
      
      const { data: userData } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
        
      const userName = userData?.name || 'User';
      
      const { data: resultData, error } = await supabase
        .from('quiz_results')
        .insert({
          quiz_id: quizId,
          user_id: user.id,
          user_name: userName,
          score: finalScore,
          total_questions: questionCount,
          time_taken: quizTimeRemaining !== null ? Math.round((quizDuration - quizTimeRemaining) / 1000) : null
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast.success("Quiz completed!");
      navigate(`/quiz/results/${resultData.id}`);
    } catch (error: any) {
      console.error("Error saving quiz result:", error);
      toast.error("Failed to save result: " + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{quizTitle}</CardTitle>
          {quizDescription && <p className="text-gray-500">{quizDescription}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {!isQuizRunning ? (
            <div className="text-center">
              <p>Are you ready to start the quiz?</p>
              {timePerQuestion && (
                <p className="text-sm text-gray-500">
                  {formattedQuestions.length} questions, {timePerQuestion} seconds per question
                </p>
              )}
              <Button onClick={startQuiz} className="bg-medblue hover:bg-medblue/90">
                Start Quiz
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Question {currentQuestionIndex + 1} / {questionCount}
                </div>
                <div className="text-lg">
                  Time Remaining: {formatTime(quizTimeRemaining)}
                </div>
              </div>
              
              <div className="mb-4">
                <SquareAd />
              </div>
              
              <div className="mb-4">
                <MultiplexVerticalAd />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{currentQuestion.question_text}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className={`justify-start ${userAnswers[currentQuestionIndex] === currentQuestion.option_a ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => handleAnswerSelect(currentQuestion.option_a)}
                    disabled={!!userAnswers[currentQuestionIndex]}
                  >
                    A) {currentQuestion.option_a}
                  </Button>
                  <Button
                    variant="outline"
                    className={`justify-start ${userAnswers[currentQuestionIndex] === currentQuestion.option_b ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => handleAnswerSelect(currentQuestion.option_b)}
                    disabled={!!userAnswers[currentQuestionIndex]}
                  >
                    B) {currentQuestion.option_b}
                  </Button>
                  <Button
                    variant="outline"
                    className={`justify-start ${userAnswers[currentQuestionIndex] === currentQuestion.option_c ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => handleAnswerSelect(currentQuestion.option_c)}
                    disabled={!!userAnswers[currentQuestionIndex]}
                  >
                    C) {currentQuestion.option_c}
                  </Button>
                  <Button
                    variant="outline"
                    className={`justify-start ${userAnswers[currentQuestionIndex] === currentQuestion.option_d ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => handleAnswerSelect(currentQuestion.option_d)}
                    disabled={!!userAnswers[currentQuestionIndex]}
                  >
                    D) {currentQuestion.option_d}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="secondary"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === formattedQuestions.length - 1}
                >
                  Next
                </Button>
              </div>
              {currentQuestionIndex === formattedQuestions.length - 1 && (
                <Button onClick={handleSubmitQuiz} className="w-full bg-green-500 hover:bg-green-700 text-white">
                  Submit Quiz
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
