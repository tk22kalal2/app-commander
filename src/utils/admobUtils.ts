
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
  if (isMobileApp() && window.admob && window.admobAppId) {
    try {
      window.admob.initialize(window.admobAppId);
      console.log('AdMob initialized with ID:', window.admobAppId);
    } catch (error) {
      console.error('Error initializing AdMob:', error);
    }
  }
};

// Create and show banner ad
export const showBannerAd = (position: number = 8): void => {
  if (isMobileApp() && window.admob && window.admobAdUnits) {
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
  }
};

// Show interstitial ad
export const showInterstitialAd = (): void => {
  if (isMobileApp() && window.admob && window.admobAdUnits) {
    try {
      window.admob.prepareInterstitial({
        adId: window.admobAdUnits.interstitial,
        autoShow: true
      });
      console.log('Interstitial ad displayed');
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  }
};

// Show native ad
export const showNativeAd = (containerId: string): void => {
  if (isMobileApp() && window.admob && window.admobAdUnits) {
    try {
      if (window.admob.showNativeAd) {
        window.admob.showNativeAd({
          adId: window.admobAdUnits.native,
          containerId: containerId
        });
        console.log('Native ad displayed');
      }
    } catch (error) {
      console.error('Error showing native ad:', error);
    }
  }
};

// Show app open ad
export const showAppOpenAd = (): void => {
  if (isMobileApp() && window.admob && window.admobAdUnits) {
    try {
      if (window.admob.showAppOpenAd) {
        window.admob.showAppOpenAd({
          adId: window.admobAdUnits.appOpen
        });
        console.log('App open ad displayed');
      }
    } catch (error) {
      console.error('Error showing app open ad:', error);
    }
  }
};

// Hide banner ad
export const hideBannerAd = (): void => {
  if (isMobileApp() && window.admob) {
    try {
      window.admob.showBannerAd(false);
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Error hiding banner ad:', error);
    }
  }
};
