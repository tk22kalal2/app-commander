
interface AdMobOptions {
  adSize?: string;
  adId?: string;
  position?: number;
  autoShow?: boolean;
  x?: number;
  y?: number;
  isTesting?: boolean;
  bannerAtTop?: boolean;
  adInterval?: number;
  overlap?: boolean;
}

interface Window {
  admob?: {
    initialize: (appId: string) => void;
    AD_SIZE: {
      SMART_BANNER: string;
      BANNER: string;
      MEDIUM_RECTANGLE: string;
      FULL_BANNER: string;
      LEADERBOARD: string;
      LARGE_BANNER: string;
      SKYSCRAPER: string;
      CUSTOM: string;
    };
    createBannerView: (options: AdMobOptions) => void;
    showBannerAd: (show: boolean) => void;
    destroyBannerView: () => void;
    requestInterstitialAd: (options: AdMobOptions) => void;
    prepareInterstitial: (options: AdMobOptions) => void;
    showInterstitialAd: () => void;
    prepareRewardVideoAd: (options: AdMobOptions) => void;
    showRewardVideoAd: () => void;
  };
  admobAppId: string;
}
