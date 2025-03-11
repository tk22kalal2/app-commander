
declare interface Window {
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
    destroyBannerView: () => void;
    prepareInterstitial: (options: any) => void;
    showInterstitial: () => void;
    showNativeAd: (options: any) => void;
    showAppOpenAd: (options: any) => void;
  };
  admobAppId?: string;
  admobAdUnits?: {
    banner: string;
    interstitial: string;
    native: string;
    appOpen: string;
  };
  cordova?: any;
  HermesInternal?: any;
}

// Add this if your project uses global without explicit declaration
declare const global: {
  HermesInternal?: any;
  [key: string]: any;
};
