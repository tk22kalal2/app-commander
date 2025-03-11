
// Google Mobile Ads type definitions
declare module 'react-native-google-mobile-ads' {
  export function initialize(config?: {
    maxAdContentRating?: 'G' | 'PG' | 'T' | 'MA';
    tagForChildDirectedTreatment?: boolean | null;
    tagForUnderAgeOfConsent?: boolean | null;
    testDeviceIdentifiers?: string[];
  }): Promise<void>;
  
  export function setRequestConfiguration(config: {
    maxAdContentRating?: 'G' | 'PG' | 'T' | 'MA';
    tagForChildDirectedTreatment?: boolean | null;
    tagForUnderAgeOfConsent?: boolean | null;
    testDeviceIdentifiers?: string[];
  }): Promise<void>;

  export class BannerAd {
    static createForAdRequest(adUnitId: string, options?: {
      requestNonPersonalizedAdsOnly?: boolean;
      keywords?: string[];
      size?: string;
    }): JSX.Element;
  }

  export class InterstitialAd {
    static createForAdRequest(adUnitId: string, options?: {
      requestNonPersonalizedAdsOnly?: boolean;
      keywords?: string[];
    }): InterstitialAd;
    load(): Promise<boolean>;
    show(): Promise<void>;
    addAdEventListener(event: string, handler: () => void): () => void;
  }

  export class AppOpenAd {
    static createForAdRequest(adUnitId: string, options?: {
      requestNonPersonalizedAdsOnly?: boolean;
      keywords?: string[];
    }): AppOpenAd;
    load(): Promise<boolean>;
    show(): Promise<void>;
    addAdEventListener(event: string, handler: () => void): () => void;
  }
}

// Legacy AdMob type definitions for backward compatibility
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
    destroyBannerView: () => void;
    prepareInterstitial: (options: any) => void;
    showInterstitial: () => void;
    showNativeAd?: (options: any) => void;
    showAppOpenAd?: (options: any) => void;
  };
  admobAppId?: string;
  admobAdUnits?: {
    banner: string;
    interstitial: string;
    native: string;
    appOpen: string;
  };
}
