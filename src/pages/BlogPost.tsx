
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { HorizontalAd } from "@/components/ads/HorizontalAd";
import { InArticleAd } from "@/components/ads/InArticleAd";

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would normally fetch from an API
    // For now, we'll use a placeholder
    setTimeout(() => {
      setPost({
        id: id || '1',
        title: "Understanding Medical MCQs: A Comprehensive Guide",
        content: `
          <p>Medical multiple-choice questions (MCQs) are a common assessment method in medical education. They test knowledge, application, and reasoning skills.</p>
          <p>When approaching medical MCQs, it's important to:</p>
          <ul>
            <li>Read the question carefully and identify what's being asked</li>
            <li>Consider each option methodically</li>
            <li>Eliminate obviously incorrect answers</li>
            <li>Use your clinical reasoning to select the best option</li>
          </ul>
          <p>Practice with a variety of questions to improve your test-taking skills and identify knowledge gaps.</p>
        `,
        author: "Dr. Anita Sharma",
        date: "May 15, 2023"
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-medbg dark:bg-gray-900">
        <Navbar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p>Loading post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-medbg dark:bg-gray-900">
        <Navbar />
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-red-500">Post not found</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medbg dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <article className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-medblue dark:text-white mb-4">{post.title}</h1>
            
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-6">
              <span>{post.author}</span>
              <span className="mx-2">•</span>
              <span>{post.date}</span>
            </div>
            
            <HorizontalAd />
            
            <div 
              className="prose dark:prose-invert max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="my-8">
              <InArticleAd />
            </div>
          </article>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
