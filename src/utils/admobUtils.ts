
/**
 * Utility functions for Google AdMob integration
 */

// Check if running in a mobile app environment
export const isMobileApp = (): boolean => {
  return window.location.href.includes('capacitor://') || 
         window.location.href.includes('app://') ||
         document.URL.includes('app://') ||
         navigator.userAgent.includes('Median');
};

// Initialize AdMob
export const initializeAdMob = (): void => {
  console.log('Initializing AdMob');
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
      
      window.admob.initialize(appId);
      console.log('AdMob initialized with ID:', appId);
      
      // Show an initial banner ad
      setTimeout(() => {
        showBannerAd(8);
      }, 2000);
    } catch (error) {
      console.error('Error initializing AdMob:', error);
    }
  } else {
    console.log('AdMob not available');
  }
};

// Create and show banner ad
export const showBannerAd = (position: number = 8): void => {
  console.log('Attempting to show banner ad');
  if (window.admob && window.admobAdUnits) {
    try {
      window.admob.createBannerView({
        adSize: window.admob.AD_SIZE.SMART_BANNER,
        adId: window.admobAdUnits.banner,
        position: position, // 8 = bottom, 2 = top
        autoShow: true
      });
      console.log('Banner ad displayed');
    } catch (error) {
      console.error('Error showing banner ad:', error);
    }
  } else {
    console.log('AdMob or ad units not available for banner');
  }
};

// Show interstitial ad
export const showInterstitialAd = (): void => {
  console.log('Attempting to show interstitial ad');
  if (window.admob && window.admobAdUnits) {
    try {
      window.admob.prepareInterstitial({
        adId: window.admobAdUnits.interstitial,
        autoShow: true
      });
      console.log('Interstitial ad displayed');
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  } else {
    console.log('AdMob or ad units not available for interstitial');
  }
};

// Show native ad
export const showNativeAd = (containerId: string): void => {
  console.log('Attempting to show native ad in', containerId);
  if (window.admob && window.admobAdUnits) {
    try {
      if (window.admob.showNativeAd) {
        window.admob.showNativeAd({
          adId: window.admobAdUnits.native,
          containerId: containerId
        });
        console.log('Native ad displayed');
      } else {
        console.log('Native ad function not available');
      }
    } catch (error) {
      console.error('Error showing native ad:', error);
    }
  } else {
    console.log('AdMob or ad units not available for native');
  }
};

// Show app open ad
export const showAppOpenAd = (): void => {
  console.log('Attempting to show app open ad');
  if (window.admob && window.admobAdUnits) {
    try {
      if (window.admob.showAppOpenAd) {
        window.admob.showAppOpenAd({
          adId: window.admobAdUnits.appOpen
        });
        console.log('App open ad displayed');
      } else {
        console.log('App open ad function not available');
      }
    } catch (error) {
      console.error('Error showing app open ad:', error);
    }
  } else {
    console.log('AdMob or ad units not available for app open');
  }
};

// Hide banner ad
export const hideBannerAd = (): void => {
  console.log('Attempting to hide banner ad');
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
