
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
  const percentage = Math.round((score / totalQuestions) * 100);
  
  useEffect(() => {
    const fetchUserDataAndRankings = async () => {
      try {
        // Fetch current user name
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
        
        // Fetch rankings for this quiz
        if (quizId) {
          const { data: resultsData } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('quiz_id', quizId)
            .order('score', { ascending: false });
            
          if (resultsData) {
            // Get unique user IDs from results
            const userIds = resultsData
              .filter(r => r.user_id)
              .map(r => r.user_id);
            
            // Fetch college names for users
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
            
            // Add college names to results
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
  }, [quizId]);
  
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
            {score} / {totalQuestions}
          </div>
          <div className="text-2xl text-gray-600">
            {percentage}% Correct
          </div>
          
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
