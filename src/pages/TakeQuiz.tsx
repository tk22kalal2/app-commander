
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Quiz } from "@/components/Quiz";

interface CustomQuiz {
  id: string;
  title: string;
  creator_id: string;
  description?: string | null;
  question_count: number;
  time_per_question?: string | null;
  access_code?: string | null;
  created_at: string;
  updated_at: string;
  creator_name?: string;
}

interface Question {
  id: string;
  question_text: string;
  image_url?: string | null;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string | null;
}

const TakeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<CustomQuiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Take Quiz | MedquizAI";
    
    const fetchQuizData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!id) {
          throw new Error("Quiz ID is missing");
        }
        
        console.log("Fetching quiz with ID:", id);
        const { data: quizData, error: quizError } = await supabase
          .from('custom_quizzes')
          .select('*')
          .eq('id', id)
          .single();
        
        if (quizError) {
          console.error("Error fetching quiz:", quizError);
          throw quizError;
        }
        
        if (!quizData) {
          throw new Error("Quiz not found");
        }
        
        console.log("Quiz data fetched:", quizData);
        const quizWithCreator = { ...quizData, creator_name: undefined };
        
        const { data: creatorData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', quizData.creator_id)
          .single();
        
        if (creatorData) {
          quizWithCreator.creator_name = creatorData.name;
        }
        
        setQuiz(quizWithCreator);
        
        console.log("Fetching questions for quiz ID:", id);
        const { data: questionsData, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', id);
        
        if (questionsError) {
          console.error("Error fetching questions:", questionsError);
          throw questionsError;
        }
        
        if (!questionsData || questionsData.length === 0) {
          throw new Error("No questions found for this quiz");
        }
        
        console.log(`Found ${questionsData.length} questions`);
        
        // Ensure we have unique questions
        const uniqueQuestionsMap = new Map();
        questionsData.forEach(q => {
          if (!uniqueQuestionsMap.has(q.question_text)) {
            uniqueQuestionsMap.set(q.question_text, q);
          }
        });
        
        const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
        console.log(`Unique questions: ${uniqueQuestions.length}`);
        
        // Convert the format of questions to match what the Quiz component expects
        const formattedQuestions = uniqueQuestions.map(q => ({
          question: q.question_text,
          options: [
            `A. ${q.option_a}`,
            `B. ${q.option_b}`,
            `C. ${q.option_c}`,
            `D. ${q.option_d}`
          ],
          correctAnswer: q.correct_answer,
          explanation: q.explanation || "No explanation provided.",
          subject: quiz?.title || "Custom Quiz"
        }));
        
        setQuestions(formattedQuestions);
      } catch (error: any) {
        console.error("Error in fetchQuizData:", error);
        setError(error.message || "Failed to load quiz");
        toast.error("Failed to load quiz: " + (error.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuizData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-medblue" />
        <span className="ml-2">Loading quiz...</span>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-red-500 mb-4">{error || "Quiz not found."}</p>
        <a href="/" className="text-medblue hover:underline">Return to Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medbg dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-medblue mb-6">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4">{quiz.description}</p>
          )}
          
          {questions.length > 0 ? (
            <Quiz
              subject={quiz.title}
              chapter={quiz.title}
              topic={quiz.description || ""}
              difficulty="Medium"
              questionCount={quiz.question_count.toString()}
              timeLimit={quiz.time_per_question || "No Limit"}
              quizId={quiz.id}
              simultaneousResults={true}
              preloadedQuestions={questions}
            />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p>No questions available for this quiz.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TakeQuiz;
