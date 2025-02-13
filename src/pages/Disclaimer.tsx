
import { useEffect } from 'react';
import disclaimerContent from '../../Disclaimer.html?raw';

const Disclaimer = () => {
  useEffect(() => {
    document.title = "Disclaimer - MedquizAI";
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div 
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: disclaimerContent }} 
      />
    </div>
  );
};

export default Disclaimer;
