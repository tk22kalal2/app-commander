
/**
 * Utility functions for Google AdMob integration
 */

// Check if running in a mobile app environment
export const isMobileApp = (): boolean => {
  const isApp = window.location.href.includes('capacitor://') || 
         window.location.href.includes('app://') ||
         document.URL.includes('app://') ||
         navigator.userAgent.includes('Median');
  
  console.log('isMobileApp check:', { 
    isApp, 
    url: window.location.href, 
    userAgent: navigator.userAgent 
  });
  return isApp;
};

// Make sure AdMob SDK is loaded
const loadAdMobSDK = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.admob) {
      console.log('AdMob SDK already loaded');
      resolve(true);
      return;
    }

    console.log('Waiting for AdMob SDK to load...');
    
    // Set a timeout to avoid hanging if the SDK doesn't load
    const timeout = setTimeout(() => {
      console.log('AdMob SDK load timeout');
      resolve(false);
    }, 10000);

    // Check periodically for admob object
    const checkInterval = setInterval(() => {
      if (window.admob) {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        console.log('AdMob SDK loaded successfully');
        resolve(true);
      }
    }, 200);
  });
};

// Initialize AdMob
export const initializeAdMob = async (): Promise<void> => {
  console.log('Initializing AdMob in admobUtils.ts');
  
  if (!isMobileApp()) {
    console.log('Not in a mobile app environment, skipping AdMob initialization');
    return;
  }

  // Wait for SDK to load
  const sdkLoaded = await loadAdMobSDK();
  if (!sdkLoaded) {
    console.log('AdMob SDK could not be loaded');
    return;
  }
  
  if (window.admob) {
    try {
      // If admobAppId is already defined in the window object, use that
      const appId = window.admobAppId || 'ca-app-pub-5920367457745298~6087552730';
      
      // If ad units are not defined, define them
      if (!window.admobAdUnits) {
        window.admobAdUnits = {
          banner: 'ca-app-pub-5920367457745298/9145499918',
          interstitial: 'ca-app-pub-5920367457745298/3026544626',
          native: 'ca-app-pub-5920367457745298/5613147695',
          appOpen: 'ca-app-pub-5920367457745298/7296993946'
        };
      }
      
      console.log('AdMob plugin found, initializing with ID:', appId);
      console.log('AdMob ad units:', window.admobAdUnits);
      
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
