
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAdMob, showAppOpenAd } from '@/utils/admobUtils'

// Initialize AdMob for mobile apps
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Check if we're in a mobile app environment
    const isMobileApp = window.location.href.includes('capacitor://') || 
                        window.location.href.includes('app://') ||
                        document.URL.includes('app://') ||
                        navigator.userAgent.includes('Median');
    
    console.log('Environment check:', { isMobileApp, userAgent: navigator.userAgent });
    
    if (isMobileApp) {
      // Only initialize AdMob in mobile environments
      console.log('Initializing AdMob for mobile app');
      initializeAdMob();
      
      // Show app open ad on initial load with a delay
      setTimeout(() => {
        showAppOpenAd();
      }, 2000);
    } else {
      console.log('Skipping AdMob initialization - not in mobile app environment');
    }
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(<App />);
