
import React from 'react';

interface QuizAdProps {
  className?: string;
}

export const QuizAd: React.FC<QuizAdProps> = ({ className = "" }) => {
  return (
    <div className={`bg-gray-100 rounded-md p-4 text-center ${className}`}>
      <p className="text-gray-500 text-sm">Advertisement</p>
    </div>
  );
};
