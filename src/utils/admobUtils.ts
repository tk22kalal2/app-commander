
/**
 * Google Mobile Ads Integration Utility
 * Uses react-native-google-mobile-ads for modern ad integration
 */
import * as mobileAds from 'react-native-google-mobile-ads';

// Ad Unit IDs
const AD_UNITS = {
  banner: "ca-app-pub-5920367457745298/9145499918",
  interstitial: "ca-app-pub-5920367457745298/3026544626",
  native: "ca-app-pub-5920367457745298/5613147695",
  appOpen: "ca-app-pub-5920367457745298/7296993946",
  // Always include test ad IDs for development
  test: {
    banner: "ca-app-pub-3940256099942544/6300978111",
    interstitial: "ca-app-pub-3940256099942544/1033173712",
    native: "ca-app-pub-3940256099942544/2247696110",
    appOpen: "ca-app-pub-3940256099942544/3419835294"
  }
};

// Check if running in a mobile app environment
export const isMobileApp = (): boolean => {
  const isApp = window.location.href.includes('capacitor://') || 
         window.location.href.includes('app://') ||
         document.URL.includes('app://') ||
         navigator.userAgent.includes('Median') ||
         // Additional checks for React Native environment
         typeof global !== 'undefined' && global.HermesInternal != null;
  
  console.log('isMobileApp check:', { 
    isApp, 
    url: window.location.href, 
    userAgent: navigator.userAgent 
  });
  return isApp;
};

// Get the appropriate ad unit ID (use test ads in development)
const getAdUnitId = (adType: keyof typeof AD_UNITS): string => {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    console.log(`Using test ${adType} ad unit`);
    if (adType in AD_UNITS.test) {
      return AD_UNITS.test[adType as keyof typeof AD_UNITS.test];
    }
  }
  
  // Make sure we only return the string property from AD_UNITS
  // This ensures we never return the 'test' object itself
  if (adType !== 'test') {
    return AD_UNITS[adType] as string;
  }
  
  // Default fallback - should never reach here in normal operation
  console.warn(`Unknown ad type: ${adType}, returning banner ad unit ID`);
  return AD_UNITS.banner;
};

// Initialize Google Mobile Ads SDK
export const initializeAdMob = async (): Promise<void> => {
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping AdMob initialization');
    return;
  }

  try {
    console.log('Initializing Google Mobile Ads SDK');
    
    // Fix: Use the correct initialization method for the library
    // mobileAds.initialize() does not exist, use RequestConfiguration instead
    await mobileAds.setRequestConfiguration({
      // Configuration options according to the react-native-google-mobile-ads API
      maxAdContentRating: mobileAds.MaxAdContentRating.MA,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
      testDeviceIdentifiers: ['EMULATOR']
    });
    
    console.log('Google Mobile Ads SDK initialized successfully');
    
    // Load an initial interstitial ad
    preloadInterstitialAd();
    
    // Load app open ad
    preloadAppOpenAd();
    
  } catch (error) {
    console.error('Error initializing Google Mobile Ads SDK:', error);
  }
};

// Interstitial ad instance
let interstitialAd: mobileAds.InterstitialAd | null = null;

// Preload an interstitial ad
const preloadInterstitialAd = async (): Promise<void> => {
  if (!isMobileApp()) return;
  
  try {
    const adUnitId = getAdUnitId('interstitial');
    console.log('Preloading interstitial ad with ID:', adUnitId);
    
    interstitialAd = mobileAds.InterstitialAd.createForAdRequest(adUnitId, {
      keywords: ['medical', 'education', 'quiz'],
    });
    
    // Set up event listeners
    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      mobileAds.AdEventType.LOADED, 
      () => {
        console.log('Interstitial ad loaded successfully');
      }
    );
    
    const unsubscribeClosed = interstitialAd.addAdEventListener(
      mobileAds.AdEventType.CLOSED, 
      () => {
        console.log('Interstitial ad closed');
        // Preload the next ad
        unsubscribeLoaded();
        unsubscribeClosed();
        setTimeout(preloadInterstitialAd, 1000);
      }
    );
    
    // Load the ad
    await interstitialAd.load();
  } catch (error) {
    console.error('Error preloading interstitial ad:', error);
  }
};

// Show interstitial ad
export const showInterstitialAd = async (): Promise<void> => {
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping interstitial ad');
    return;
  }
  
  try {
    // Fix: Use the correct property 'loaded' instead of 'isLoaded'
    if (interstitialAd && interstitialAd.loaded) {
      console.log('Showing interstitial ad');
      await interstitialAd.show();
    } else {
      console.log('Interstitial ad not ready, preloading a new one');
      preloadInterstitialAd();
    }
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
    preloadInterstitialAd(); // Try to load a new one
  }
};

// App open ad instance
let appOpenAd: mobileAds.AppOpenAd | null = null;

// Preload an app open ad
const preloadAppOpenAd = async (): Promise<void> => {
  if (!isMobileApp()) return;
  
  try {
    const adUnitId = getAdUnitId('appOpen');
    console.log('Preloading app open ad with ID:', adUnitId);
    
    appOpenAd = mobileAds.AppOpenAd.createForAdRequest(adUnitId, {
      keywords: ['medical', 'education', 'quiz'],
    });
    
    // Set up event listeners
    const unsubscribeLoaded = appOpenAd.addAdEventListener(
      mobileAds.AdEventType.LOADED, 
      () => {
        console.log('App open ad loaded successfully');
      }
    );
    
    const unsubscribeClosed = appOpenAd.addAdEventListener(
      mobileAds.AdEventType.CLOSED, 
      () => {
        console.log('App open ad closed');
        // Preload the next ad
        unsubscribeLoaded();
        unsubscribeClosed();
        setTimeout(preloadAppOpenAd, 1000);
      }
    );
    
    // Load the ad
    await appOpenAd.load();
  } catch (error) {
    console.error('Error preloading app open ad:', error);
  }
};

// Show app open ad
export const showAppOpenAd = async (): Promise<void> => {
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping app open ad');
    return;
  }
  
  try {
    // Fix: Use the correct property 'loaded' instead of 'isLoaded'
    if (appOpenAd && appOpenAd.loaded) {
      console.log('Showing app open ad');
      await appOpenAd.show();
    } else {
      console.log('App open ad not ready, preloading a new one');
      preloadAppOpenAd();
    }
  } catch (error) {
    console.error('Error showing app open ad:', error);
    preloadAppOpenAd(); // Try to load a new one
  }
};

// Show banner ad - function signature kept for backward compatibility
export const showBannerAd = (position: number = 8): void => {
  console.log('Banner ads should now be implemented as React components using BannerAd.createForAdRequest()');
  console.log('Please update your implementation to use the React component approach');
};

// Hide banner ad - function signature kept for backward compatibility
export const hideBannerAd = (): void => {
  console.log('Banner ads should now be implemented as React components, which can be conditionally rendered');
  console.log('Please update your implementation to conditionally render the BannerAd component');
};

// Show native ad - function signature kept for backward compatibility
export const showNativeAd = (containerId: string): void => {
  console.log('Native ads should now be implemented as React components');
  console.log('Please update your implementation to use the React component approach');
};

// Backward compatibility layer for existing code
// This helps transition from the old cordova-plugin-admob to react-native-google-mobile-ads
if (typeof window !== 'undefined' && !window.admob) {
  console.log('Setting up backward compatibility layer for AdMob');
  window.admob = {
    initialize: (appId: string) => {
      console.log('Legacy admob.initialize called with ID:', appId);
      initializeAdMob();
    },
    AD_SIZE: {
      SMART_BANNER: 'SMART_BANNER',
      LARGE_BANNER: 'LARGE_BANNER',
      BANNER: 'BANNER',
      MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
      FULL_BANNER: 'FULL_BANNER',
      LEADERBOARD: 'LEADERBOARD'
    },
    createBannerView: (options: any) => {
      console.log('Legacy createBannerView called with options:', options);
      // Implementation will need to be handled through React components
    },
    showBannerAd: (show: boolean) => {
      console.log('Legacy showBannerAd called with show:', show);
      // Implementation will need to be handled through React components
    },
    destroyBannerView: () => {
      console.log('Legacy destroyBannerView called');
      // Implementation will need to be handled through React components
    },
    prepareInterstitial: (options: any) => {
      console.log('Legacy prepareInterstitial called with options:', options);
      if (options?.autoShow) {
        showInterstitialAd();
      } else {
        preloadInterstitialAd();
      }
    },
    showInterstitial: () => {
      console.log('Legacy showInterstitial called');
      showInterstitialAd();
    },
    showNativeAd: (options: any) => {
      console.log('Legacy showNativeAd called with options:', options);
      // Implementation will need to be handled through React components
    },
    showAppOpenAd: (options: any) => {
      console.log('Legacy showAppOpenAd called with options:', options);
      showAppOpenAd();
    }
  };
}
