
import { Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-medblue dark:text-white mb-4">Contact Us</h3>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Mail className="h-4 w-4" />
              <a href="mailto:mynextpulse123@gmail.com">mynextpulse123@gmail.com</a>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-2">
              <Github className="h-4 w-4" />
              <a href="https://telegram.me/+QiCvb-5pEJU1Mzc1" target="_blank" rel="noopener noreferrer">Telegram Channel</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-medblue dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-medblue dark:text-white mb-4">About MedQuizAI</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Free medical question bank powered by AI for NEET PG, INICET, FMGE, USMLE, and MBBS preparation.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-300">
          <p>© {new Date().getFullYear()} MedQuizAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
