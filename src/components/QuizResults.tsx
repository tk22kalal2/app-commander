
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestartQuiz?: () => void;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: string;
  questions?: any[];
  answers?: Record<number, string>;
  quizId?: string;
}

export const QuizResults = ({ 
  score, 
  totalQuestions, 
  onRestartQuiz,
  subject,
  chapter,
  topic,
  difficulty,
  questions = [],
  answers = {},
  quizId
}: QuizResultsProps) => {
  const [userName, setUserName] = useState<string>("");
  const [rankings, setRankings] = useState<any[]>([]);
  const [calculatedScore, setCalculatedScore] = useState<number>(score);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const percentage = Math.round((calculatedScore / totalQuestions) * 100);
  
  useEffect(() => {
    console.log("QuizResults received:", {
      score,
      totalQuestions,
      answers,
      questions: questions?.map(q => ({ 
        question: q.question,
        correctAnswer: q.correctAnswer
      }))
    });
    
    // Double-check the score by counting correct answers
    if (questions && questions.length > 0 && Object.keys(answers).length > 0) {
      let correctCount = 0;
      
      Object.entries(answers).forEach(([index, answer]) => {
        const questionIndex = parseInt(index);
        if (questionIndex < questions.length) {
          const question = questions[questionIndex];
          if (question && answer === question.correctAnswer) {
            correctCount++;
          }
        }
      });
      
      console.log("Calculated score from answers:", correctCount);
      if (correctCount !== score) {
        console.warn("Score mismatch, using calculated score:", correctCount, "vs provided:", score);
        setCalculatedScore(correctCount);
      }
    }
    
    const fetchUserDataAndRankings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: userData } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();
          
          if (userData) {
            setUserName(userData.name || 'User');
          }
        }
        
        if (quizId) {
          const { data: resultsData } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('quiz_id', quizId)
            .order('score', { ascending: false });
            
          if (resultsData) {
            const userIds = resultsData
              .filter(r => r.user_id)
              .map(r => r.user_id);
            
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, college_name')
              .in('id', userIds);
              
            const userCollegeMap = new Map();
            if (profilesData) {
              profilesData.forEach(profile => {
                userCollegeMap.set(profile.id, profile.college_name);
              });
            }
            
            const formattedRankings = resultsData.map(result => ({
              ...result,
              college_name: result.user_id && userCollegeMap.has(result.user_id) 
                ? userCollegeMap.get(result.user_id) 
                : 'Not specified'
            }));
            
            setRankings(formattedRankings);
          }
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchUserDataAndRankings();
  }, [quizId, score, totalQuestions, questions, answers]);
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="text-center mt-16">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {userName && (
            <div className="text-xl text-gray-600">
              Great job, {userName}!
            </div>
          )}
          <div className="text-4xl font-bold text-medical-blue">
            {calculatedScore} / {totalQuestions}
          </div>
          <div className="text-2xl text-gray-600">
            {percentage}% Correct
          </div>
          
          {questions.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-4 text-left">Question Analysis</h3>
              
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm ${
                      index === selectedQuestionIndex
                        ? 'bg-medical-blue text-white'
                        : 'bg-gray-100 border'
                    }`}
                    onClick={() => {
                      setSelectedQuestionIndex(index);
                      setShowExplanation(false);
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              {selectedQuestionIndex !== null && (
                <div className="p-4 border rounded-lg">
                  <p className="font-medium">{questions[selectedQuestionIndex].question}</p>
                  <div className="mt-4 space-y-2">
                    {questions[selectedQuestionIndex].options.map((option: string, idx: number) => {
                      const optionLetter = option[0];
                      const isUserAnswer = answers[selectedQuestionIndex] === optionLetter;
                      const isCorrectAnswer = questions[selectedQuestionIndex].correctAnswer === optionLetter;
                      
                      return (
                        <div 
                          key={idx}
                          className={`p-3 rounded border ${
                            isCorrectAnswer 
                              ? 'bg-green-50 border-green-300' 
                              : isUserAnswer && !isCorrectAnswer
                              ? 'bg-red-50 border-red-300'
                              : 'bg-gray-50'
                          }`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                  
                  <Button
                    onClick={() => setShowExplanation(!showExplanation)}
                    variant="outline"
                    className="mt-4"
                  >
                    {showExplanation ? "Hide" : "Show"} Explanation
                  </Button>
                  
                  {showExplanation && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                      <p>{questions[selectedQuestionIndex].explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {rankings.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Rank</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">College</th>
                      <th className="px-4 py-2 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((ranking, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                        </td>
                        <td className="px-4 py-2 font-medium">{ranking.user_name}</td>
                        <td className="px-4 py-2">{ranking.college_name}</td>
                        <td className="px-4 py-2 text-right">{ranking.score}/{ranking.total_questions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-gray-600">
              Keep practicing to improve your medical knowledge.
            </p>
            {onRestartQuiz && (
              <Button 
                onClick={onRestartQuiz}
                className="mt-4 bg-medical-blue hover:bg-medical-blue/90"
              >
                Start New Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
