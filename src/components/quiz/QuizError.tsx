
interface QuizErrorProps {
  message: string;
}

export const QuizError = ({ message }: QuizErrorProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-xl text-red-500 mb-4">{message || "Quiz not found."}</p>
      <a href="/" className="text-medblue hover:underline">Return to Home</a>
    </div>
  );
};
