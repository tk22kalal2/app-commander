
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import QuizSetup from "./pages/QuizSetup";
import Quiz from "./pages/Quiz";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import { ApiKeyInput } from "./components/ApiKeyInput";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => {
  // Check if we're on a direct HTML page
  const path = window.location.pathname;
  if (path === '/privacy-policy.html') {
    window.location.href = '/privacy-policy';
    return null;
  }
  if (path === '/disclaimer.html') {
    window.location.href = '/disclaimer';
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/apikey" element={<ApiKeyInput onSave={() => {}} />} />
            <Route path="/quiz/setup" element={<QuizSetup />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
