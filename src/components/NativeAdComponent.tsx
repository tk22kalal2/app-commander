
import React, { useEffect, useState } from 'react';
import { isMobileApp } from '../utils/admobUtils';

interface NativeAdComponentProps {
  containerId?: string;
  className?: string;
}

const NativeAdComponent: React.FC<NativeAdComponentProps> = ({ 
  containerId = 'native-ad-container',
  className = ''
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  
  useEffect(() => {
    if (!isMobileApp()) {
      console.log('Not showing native ad in non-mobile environment');
      return;
    }
    
    try {
      console.log('NativeAdComponent mounted, containerId:', containerId);
      
      // For browser/development environment, simulate ad loading
      const timer = setTimeout(() => {
        setAdLoaded(true);
        console.log('Simulated native ad loaded');
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        console.log('NativeAdComponent unmounted');
      };
    } catch (error) {
      console.error('Error initializing native ad:', error);
    }
  }, [containerId]);
  
  // Show nothing in non-mobile environments
  if (!isMobileApp()) {
    return null;
  }
  
  // Placeholder div for web/hybrid environments
  return (
    <div 
      id={containerId}
      className={`native-ad-container ${adLoaded ? 'loaded' : 'loading'} ${className}`}
      style={{ 
        width: '100%',
        height: '120px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        padding: '12px',
        marginTop: '12px',
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <p className="text-sm text-gray-500 mb-1">Advertisement</p>
      {!adLoaded ? (
        <span>Ad loading...</span>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-gray-400">Native Ad would appear here in the mobile app</p>
        </div>
      )}
    </div>
  );
};

export default NativeAdComponent;
