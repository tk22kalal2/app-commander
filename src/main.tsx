
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAdMob, showAppOpenAd } from './utils/admobUtils'

// Initialize AdMob for mobile apps
if (typeof window !== 'undefined') {
  const isMobileApp = window.location.href.includes('capacitor://') || 
                      window.location.href.includes('app://') ||
                      document.URL.includes('app://') ||
                      navigator.userAgent.includes('Median');
  
  console.log('Environment check in main.tsx:', { 
    isMobileApp, 
    userAgent: navigator.userAgent,
    href: window.location.href 
  });
  
  // Attempt to initialize on both deviceready (Cordova event) and DOMContentLoaded
  document.addEventListener('deviceready', () => {
    console.log('deviceready event fired in main.tsx');
    if (isMobileApp) {
      console.log('Initializing AdMob on deviceready event');
      initializeAdMob();
      
      // Show app open ad on initial load with a delay
      setTimeout(() => {
        showAppOpenAd();
      }, 3000);
    }
  }, false);
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired in main.tsx');
    if (isMobileApp) {
      console.log('Initializing AdMob on DOMContentLoaded event');
      setTimeout(() => {
        initializeAdMob();
        
        // Show app open ad on initial load with a delay
        setTimeout(() => {
          showAppOpenAd();
        }, 3000);
      }, 1000);
    } else {
      console.log('Skipping AdMob initialization - not in mobile app environment');
    }
  });
  
  // Fallback initialization in case events don't fire properly
  setTimeout(() => {
    console.log('Fallback timeout executing for AdMob initialization');
    if (isMobileApp) {
      console.log('Initializing AdMob in fallback timeout');
      initializeAdMob();
    }
  }, 5000);
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(<App />);
