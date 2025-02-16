
import { Button } from "@/components/ui/button";
import { Book, Info, Lock, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-medblue dark:text-white">MedQuizAI</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <a href="/pages/blog.html" className="text-gray-700 dark:text-gray-300">Blog</a>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <Link to="/privacy-policy" className="text-gray-700 dark:text-gray-300">Privacy Policy</Link>
            </Button>
            <Button variant="ghost" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <Link to="/disclaimer" className="text-gray-700 dark:text-gray-300">Disclaimer</Link>
            </Button>
            <ThemeToggle />
            <Button 
              className="bg-medblue hover:bg-medblue/90 text-white flex items-center gap-2"
              onClick={handleLogin}
            >
              <Lock className="h-4 w-4" />
              <span>Login</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/pages/blog.html" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Blog</a>
            <Link to="/privacy-policy" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Privacy Policy</Link>
            <Link to="/disclaimer" className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">Disclaimer</Link>
            <Button 
              className="w-full text-left px-3 py-2 text-white bg-medblue rounded-md"
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
