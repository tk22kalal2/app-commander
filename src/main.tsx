
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAdMob, showAppOpenAd } from './utils/admobUtils'

// Initialize AdMob for mobile apps
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeAdMob();
    
    // Show app open ad on initial load
    setTimeout(() => {
      showAppOpenAd();
    }, 1000);
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(<App />);
