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

  useEffect(() => {
    document.title = "Take Quiz | MedquizAI";
    
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        const { data: quizData, error: quizError } = await supabase
          .from('custom_quizzes')
          .select('*')
          .eq('id', id)
          .single();
        
        if (quizError) throw quizError;
        
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
        
        const { data: questionsData, error: questionsError } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('quiz_id', id);
        
        if (questionsError) throw questionsError;
        
        if (questionsData) {
          const uniqueQuestionsMap = new Map();
          questionsData.forEach(q => {
            if (!uniqueQuestionsMap.has(q.question_text)) {
              uniqueQuestionsMap.set(q.question_text, q);
            }
          });
          
          const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
          setQuestions(uniqueQuestions);
        }
      } catch (error: any) {
        console.error("Error fetching quiz:", error);
        toast.error("Failed to load quiz: " + error.message);
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
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">Quiz not found.</p>
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
          
          {!isLoading && quiz && questions.length > 0 && (
            <Quiz
              subject={quiz.title}
              chapter={quiz.title}
              topic={quiz.description || ""}
              difficulty="Medium"
              questionCount={quiz.question_count.toString()}
              timeLimit={quiz.time_per_question || "No Limit"}
              quizId={quiz.id}  // Add this line to pass the quiz ID
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TakeQuiz;
