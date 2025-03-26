
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { StarRating } from "@/components/StarRating";
import { toast } from "sonner";
import { Search, Book, Star, User, Calendar, ChevronRight } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  question_count: number;
  creator_id: string;
  creator_name?: string;
  created_at: string;
  access_code: string | null;
  average_rating: number;
}

const BrowseQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [showAccessCodeInput, setShowAccessCodeInput] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Browse Quizzes | MedquizAI";
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      // Fetch quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('custom_quizzes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (quizzesError) throw quizzesError;

      // Get creator names and ratings
      const quizzesWithDetails = await Promise.all(quizzesData.map(async (quiz) => {
        // Get creator name
        const { data: creatorData } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', quiz.creator_id)
          .single();
        
        // Get average rating
        const { data: ratingData } = await supabase
          .rpc('get_quiz_avg_rating', { quiz_uuid: quiz.id });
        
        return {
          ...quiz,
          creator_name: creatorData?.name || 'Unknown',
          average_rating: Number(ratingData) || 0
        };
      }));
      
      setQuizzes(quizzesWithDetails);
    } catch (error: any) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to load quizzes: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is done client-side
  };

  const handleTakeQuiz = (quiz: Quiz) => {
    if (quiz.access_code) {
      setSelectedQuizId(quiz.id);
      setShowAccessCodeInput(true);
    } else {
      navigate(`/quiz/take/${quiz.id}`);
    }
  };

  const handleAccessCodeSubmit = () => {
    if (!selectedQuizId) return;
    
    const quiz = quizzes.find(q => q.id === selectedQuizId);
    if (!quiz) return;
    
    if (accessCode === quiz.access_code) {
      navigate(`/quiz/take/${selectedQuizId}`);
    } else {
      toast.error("Incorrect access code");
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    quiz.creator_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-medbg dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-medblue mb-8">Browse User Quizzes</h1>
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <Input
                placeholder="Search quizzes by title, description or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="bg-medblue">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
          
          {isLoading ? (
            <div className="text-center py-8">Loading quizzes...</div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-8">
              No quizzes found matching your search.
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quiz Title</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead className="text-center">Questions</TableHead>
                        <TableHead className="text-center">Rating</TableHead>
                        <TableHead className="text-center">Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuizzes.map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{quiz.title}</span>
                              {quiz.description && (
                                <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                  {quiz.description}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3 text-gray-500" />
                              <span>{quiz.creator_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Book className="h-3 w-3 text-gray-500" />
                              <span>{quiz.question_count}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{quiz.average_rating.toFixed(1)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-500" />
                              <span>{formatDate(quiz.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              onClick={() => handleTakeQuiz(quiz)}
                              size="sm"
                              className="bg-medblue"
                            >
                              Take Quiz
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          
          {showAccessCodeInput && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Access Code Required</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Enter access code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAccessCodeInput(false);
                      setAccessCode("");
                      setSelectedQuizId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAccessCodeSubmit}>Submit</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BrowseQuizzes;
