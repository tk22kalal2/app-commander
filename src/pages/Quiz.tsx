
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Quiz as QuizComponent } from "@/components/Quiz";
import { Loader2 } from "lucide-react";

const Quiz = () => {
  const { subject, chapter, topic } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState("10");
  const [timeLimit, setTimeLimit] = useState("60");
  const [simultaneousResults, setSimultaneousResults] = useState(true);

  useEffect(() => {
    // Load parameters from URL or session storage
    const searchParams = new URLSearchParams(window.location.search);
    const difficultyParam = searchParams.get("difficulty");
    const questionCountParam = searchParams.get("count");
    const timeLimitParam = searchParams.get("time");
    const simultaneousParam = searchParams.get("simultaneous");

    if (difficultyParam) setDifficulty(difficultyParam);
    if (questionCountParam) setQuestionCount(questionCountParam);
    if (timeLimitParam) setTimeLimit(timeLimitParam);
    if (simultaneousParam) setSimultaneousResults(simultaneousParam === "true");

    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-medblue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medbg dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-medblue mb-6">
            {subject || "Medical"} Quiz
          </h1>
          
          <QuizComponent
            subject={subject || "General Medicine"}
            chapter={chapter || "All Topics"}
            topic={topic || ""}
            difficulty={difficulty}
            questionCount={questionCount}
            timeLimit={timeLimit}
            simultaneousResults={simultaneousResults}
            quizId="generated-quiz"
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Quiz;
