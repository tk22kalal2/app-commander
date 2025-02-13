
import { useEffect } from 'react';
import privacyContent from '../../privacy-policy.html?raw';

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy Policy - MedquizAI";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div 
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: privacyContent }} 
      />
    </div>
  );
};

export default Privacy;
