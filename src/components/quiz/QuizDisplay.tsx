
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Quiz } from "@/components/Quiz";

interface QuizDisplayProps {
  quizTitle: string;
  quizDescription?: string;
  quizId: string;
  timePerQuestion?: string | null;
  questionCount: number;
  formattedQuestions: {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    explanation?: string | null;
  }[];
}

export const QuizDisplay = ({
  quizTitle,
  quizDescription,
  quizId,
  timePerQuestion,
  questionCount,
  formattedQuestions
}: QuizDisplayProps) => {
  const [loading, setLoading] = useState(true);
  
  // Transform our formatted questions to match Quiz component's expected format
  const transformedQuestions = formattedQuestions.map(q => ({
    question: q.question_text,
    options: [
      `A. ${q.option_a}`,
      `B. ${q.option_b}`,
      `C. ${q.option_c}`,
      `D. ${q.option_d}`
    ],
    correctAnswer: q.correct_answer,
    explanation: q.explanation || "No explanation provided.",
    subject: quizTitle
  }));
  
  // Calculate total time if time per question is provided
  const totalTime = timePerQuestion ? 
    (parseInt(timePerQuestion) * questionCount).toString() : 
    "No Limit";
  
  useEffect(() => {
    // Set loading to false once questions are ready
    if (formattedQuestions.length > 0) {
      setLoading(false);
    }
  }, [formattedQuestions]);
  
  if (loading && formattedQuestions.length === 0) {
    return <div className="text-center p-6">Loading questions...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">{quizTitle}</h1>
        {quizDescription && <p className="mb-6 text-gray-600">{quizDescription}</p>}
        
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <h2 className="font-semibold mb-2">Quiz Info:</h2>
          <p><span className="font-medium">Questions:</span> {questionCount}</p>
          <p><span className="font-medium">Time Limit:</span> {totalTime === "No Limit" ? 
            "No time limit" : 
            `${totalTime} seconds`}
          </p>
        </div>
      </Card>
      
      <Quiz
        subject={quizTitle}
        chapter="Custom Quiz"
        topic=""
        difficulty="medium"
        questionCount={questionCount.toString()}
        timeLimit={totalTime}
        quizId={quizId}
        simultaneousResults={true}
        preloadedQuestions={transformedQuestions}
      />
    </div>
  );
};
