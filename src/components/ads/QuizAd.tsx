
import React from 'react';

interface QuizAdProps {
  className?: string;
}

export const QuizAd: React.FC<QuizAdProps> = ({ className = '' }) => {
  return (
    <div className={`ad-container ${className}`}>
      {/* Ad implementation goes here */}
      <div className="bg-gray-100 p-4 text-center rounded">
        <p className="text-gray-500 text-sm">Advertisement</p>
      </div>
    </div>
  );
};
