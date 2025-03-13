
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAdMob } from './utils/admobUtils'

// Initialize AdMob for mobile app
document.addEventListener('deviceready', () => {
  initializeAdMob();
}, false);

// Fallback initialization for when deviceready event might not fire
setTimeout(() => {
  initializeAdMob();
}, 2000);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(<App />);
