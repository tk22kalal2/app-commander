
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
      prepareRewardVideoAd: (options: any) => void;
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

export {};
