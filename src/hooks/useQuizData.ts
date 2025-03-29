
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  is_private: boolean;
}

// This interface represents the database structure of quiz questions
interface DbQuestion {
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

// This interface matches what the Quiz component expects
interface FormattedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
}

export const useQuizData = (quizId: string, isAccessVerified: boolean) => {
  const [quiz, setQuiz] = useState<CustomQuiz | null>(null);
  const [questions, setQuestions] = useState<DbQuestion[]>([]);
  const [formattedQuestions, setFormattedQuestions] = useState<FormattedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Take Quiz | MedquizAI";
    
    const fetchQuizData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!quizId) {
          throw new Error("Quiz ID is missing");
        }
        
        console.log("Fetching quiz with ID:", quizId);
        const { data: quizData, error: quizError } = await supabase
          .from('custom_quizzes')
          .select('*')
          .eq('id', quizId)
          .single();
        
        if (quizError) {
          console.error("Error fetching quiz:", quizError);
          throw quizError;
        }
        
        if (!quizData) {
          throw new Error("Quiz not found");
        }
        
        console.log("Quiz data fetched:", quizData);
        
        // Determine if the quiz is private based on the presence of an access_code
        const isPrivate = !!quizData.access_code;
        
        const quizWithCreator = { 
          ...quizData, 
          creator_name: undefined,
          is_private: isPrivate
        };
        
        const { data: creatorData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', quizData.creator_id)
          .single();
        
        if (creatorData) {
          quizWithCreator.creator_name = creatorData.name;
        }
        
        setQuiz(quizWithCreator);
        
        // If the quiz is not private or access is already verified, fetch questions
        if (!isPrivate || isAccessVerified) {
          await fetchQuizQuestions(quizId);
        }
      } catch (error: any) {
        console.error("Error in fetchQuizData:", error);
        setError(error.message || "Failed to load quiz");
        toast.error("Failed to load quiz: " + (error.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuizData();
  }, [quizId, isAccessVerified]);

  const fetchQuizQuestions = async (quizId: string) => {
    try {
      console.log("Fetching questions for quiz ID:", quizId);
      const { data: questionsData, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId);
      
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
      
      const uniqueQuestions = Array.from(uniqueQuestionsMap.values()) as DbQuestion[];
      console.log(`Unique questions: ${uniqueQuestions.length}`);
      
      // Store the original database questions
      setQuestions(uniqueQuestions);
      
      // Convert the format of questions to match what the Quiz component expects
      const formatted = uniqueQuestions.map(q => ({
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
      
      setFormattedQuestions(formatted);
      console.log("Formatted questions for Quiz component:", formatted.length);
    } catch (error: any) {
      console.error("Error in fetchQuizQuestions:", error);
      setError(error.message || "Failed to load quiz questions");
      toast.error("Failed to load quiz questions: " + (error.message || "Unknown error"));
    }
  };

  const verifyAccessCode = async (code: string): Promise<boolean> => {
    if (!quiz) return false;
    return quiz.access_code === code;
  };

  return {
    quiz,
    questions,
    formattedQuestions,
    isLoading,
    error,
    verifyAccessCode
  };
};
