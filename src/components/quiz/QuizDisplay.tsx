
import { Quiz } from "@/components/Quiz";

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
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-medblue mb-6">{quizTitle}</h1>
      {quizDescription && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">{quizDescription}</p>
      )}
      
      {formattedQuestions.length > 0 ? (
        <Quiz
          subject={quizTitle}
          chapter={quizTitle}
          topic={quizDescription || ""}
          difficulty="Medium"
          questionCount={questionCount.toString()}
          timeLimit={timePerQuestion || "No Limit"}
          quizId={quizId}
          simultaneousResults={true}
          preloadedQuestions={formattedQuestions}
        />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p>No questions available for this quiz.</p>
        </div>
      )}
    </div>
  );
};
