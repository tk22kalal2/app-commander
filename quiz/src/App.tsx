
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { AuthForm } from "@/components/AuthForm";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router basename="/medquiz-genius/quiz">
      <Layout>
        <Routes>
          <Route path="/" element={
            isAuthenticated ? <ApiKeyInput onSave={() => {}} /> : <Navigate to="/auth" />
          } />
          <Route path="/auth" element={
            !isAuthenticated ? <AuthForm onAuthSuccess={() => {}} /> : <Navigate to="/" />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
};

export default App;
