import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import ApiKeyInput from "@/pages/ApiKeyInput";
import QuizSetup from "@/pages/QuizSetup";
import TakeQuiz from "@/pages/TakeQuiz";
import CreateQuiz from "@/pages/CreateQuiz";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import BrowseQuizzes from "@/pages/BrowseQuizzes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/apikey",
    element: <ApiKeyInput />,
  },
  {
    path: "/quiz/setup",
    element: <QuizSetup />,
  },
  {
    path: "/browse-quizzes",
    element: <BrowseQuizzes />,
  },
  {
    path: "/quiz/take/:id",
    element: <TakeQuiz />,
  },
  {
    path: "/quiz/create",
    element: <CreateQuiz />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:id",
    element: <BlogPost />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
