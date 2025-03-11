/**
 * Utility functions for Google AdMob integration
 */

// Check if running in a mobile app environment
export const isMobileApp = (): boolean => {
  const isApp = window.location.href.includes('capacitor://') || 
         window.location.href.includes('app://') ||
         document.URL.includes('app://') ||
         navigator.userAgent.includes('Median');
  
  console.log('isMobileApp check:', { isApp, url: window.location.href, userAgent: navigator.userAgent });
  return isApp;
};

// Initialize AdMob
export const initializeAdMob = (): void => {
  console.log('Initializing AdMob');
  
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping AdMob initialization');
    return;
  }
  
  if (window.admob) {
    try {
      // Use the actual AdMob app ID
      const appId = 'ca-app-pub-5920367457745298~6087552730';
      window.admobAppId = appId;
      window.admobAdUnits = {
        banner: 'ca-app-pub-5920367457745298/9145499918',
        interstitial: 'ca-app-pub-5920367457745298/3026544626',
        native: 'ca-app-pub-5920367457745298/5613147695',
        appOpen: 'ca-app-pub-5920367457745298/7296993946'
      };
      
      console.log('AdMob plugin found, initializing with ID:', appId);
      window.admob.initialize(appId);
      console.log('AdMob initialized successfully');
      
      // Show an initial banner ad with a delay to ensure initialization completes
      setTimeout(() => {
        showBannerAd(8);
      }, 3000);
    } catch (error) {
      console.error('Error initializing AdMob:', error);
    }
  } else {
    console.log('AdMob plugin not available');
  }
};

// Create and show banner ad
export const showBannerAd = (position: number = 8): void => {
  console.log('Attempting to show banner ad');
  
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping banner ad');
    return;
  }
  
  if (window.admob && window.admobAdUnits) {
    try {
      console.log('Showing banner ad with ID:', window.admobAdUnits.banner);
      window.admob.createBannerView({
        adSize: window.admob.AD_SIZE.SMART_BANNER,
        adId: window.admobAdUnits.banner,
        position: position, // 8 = bottom, 2 = top
        autoShow: true
      });
      console.log('Banner ad request sent');
    } catch (error) {
      console.error('Error showing banner ad:', error);
    }
  } else {
    console.log('AdMob or ad units not available for banner', { 
      admob: !!window.admob, 
      adUnits: !!window.admobAdUnits 
    });
  }
};

// Show interstitial ad
export const showInterstitialAd = (): void => {
  console.log('Attempting to show interstitial ad');
  
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping interstitial ad');
    return;
  }
  
  if (window.admob && window.admobAdUnits) {
    try {
      console.log('Showing interstitial ad with ID:', window.admobAdUnits.interstitial);
      window.admob.prepareInterstitial({
        adId: window.admobAdUnits.interstitial,
        autoShow: true
      });
      console.log('Interstitial ad request sent');
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  } else {
    console.log('AdMob or ad units not available for interstitial', { 
      admob: !!window.admob, 
      adUnits: !!window.admobAdUnits 
    });
  }
};

// Show native ad
export const showNativeAd = (containerId: string): void => {
  console.log('Attempting to show native ad in', containerId);
  
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping native ad');
    return;
  }
  
  if (window.admob && window.admobAdUnits) {
    try {
      if (window.admob.showNativeAd) {
        console.log('Showing native ad with ID:', window.admobAdUnits.native);
        window.admob.showNativeAd({
          adId: window.admobAdUnits.native,
          containerId: containerId
        });
        console.log('Native ad request sent');
      } else {
        console.log('Native ad function not available in this version of the AdMob plugin');
      }
    } catch (error) {
      console.error('Error showing native ad:', error);
    }
  } else {
    console.log('AdMob or ad units not available for native', {
      admob: !!window.admob, 
      adUnits: !!window.admobAdUnits
    });
  }
};

// Show app open ad
export const showAppOpenAd = (): void => {
  console.log('Attempting to show app open ad');
  
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping app open ad');
    return;
  }
  
  if (window.admob && window.admobAdUnits) {
    try {
      if (window.admob.showAppOpenAd) {
        console.log('Showing app open ad with ID:', window.admobAdUnits.appOpen);
        window.admob.showAppOpenAd({
          adId: window.admobAdUnits.appOpen
        });
        console.log('App open ad request sent');
      } else {
        console.log('App open ad function not available in this version of the AdMob plugin');
      }
    } catch (error) {
      console.error('Error showing app open ad:', error);
    }
  } else {
    console.log('AdMob or ad units not available for app open', {
      admob: !!window.admob, 
      adUnits: !!window.admobAdUnits
    });
  }
};

// Hide banner ad
export const hideBannerAd = (): void => {
  console.log('Attempting to hide banner ad');
  
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping hide banner ad');
    return;
  }
  
  if (window.admob) {
    try {
      window.admob.showBannerAd(false);
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Error hiding banner ad:', error);
    }
  } else {
    console.log('AdMob not available to hide banner');
  }
};

// Declare global types to keep TypeScript happy
declare global {
  interface Window {
    admob?: {
      initialize: (appId: string) => void;
      AD_SIZE: {
        SMART_BANNER: string;
        LARGE_BANNER: string;
        BANNER: string;
        MEDIUM_RECTANGLE: string;
        FULL_BANNER: string;
        LEADERBOARD: string;
      };
      createBannerView: (options: any) => void;
      showBannerAd: (show: boolean) => void;
      prepareInterstitial: (options: any) => void;
      prepareRewardVideoAd?: (options: any) => void;
      showNativeAd?: (options: any) => void;
      showAppOpenAd?: (options: any) => void;
    };
    admobAppId: string;
    admobAdUnits?: {
      banner: string;
      interstitial: string;
      native: string;
      appOpen: string;
    };
  }
}
