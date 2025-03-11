
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAdMob, showAppOpenAd } from './utils/admobUtils'

// Check if running in mobile app environment
const isMobileApp = window.location.href.includes('capacitor://') || 
                   window.location.href.includes('app://') ||
                   document.URL.includes('app://') ||
                   navigator.userAgent.includes('Median');

console.log('Environment check in main.tsx:', { 
  isMobileApp, 
  userAgent: navigator.userAgent,
  href: window.location.href 
});

// Initialize AdMob for mobile apps
if (isMobileApp) {
  // Initialize on both deviceready (Cordova event) and DOMContentLoaded
  document.addEventListener('deviceready', () => {
    console.log('deviceready event fired in main.tsx');
    initializeAdMob().then(() => {
      console.log('AdMob initialized from deviceready event');
      // Show app open ad on initial load with a delay
      setTimeout(() => {
        showAppOpenAd();
      }, 3000);
    });
  }, false);
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired in main.tsx');
    // Use a timeout to ensure the app is fully loaded
    setTimeout(() => {
      initializeAdMob().then(() => {
        console.log('AdMob initialized from DOMContentLoaded event');
        setTimeout(() => {
          showAppOpenAd();
        }, 3000);
      });
    }, 1000);
  });
  
  // Fallback initialization in case events don't fire properly
  setTimeout(() => {
    console.log('Fallback timeout executing for AdMob initialization');
    initializeAdMob().then(() => {
      console.log('AdMob initialized from fallback timeout');
    });
  }, 5000);
} else {
  console.log('Skipping AdMob initialization - not in mobile app environment');
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(<App />);
