import { App } from '../types/app.types';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const gplayModule = require('google-play-scraper');
const gplay = gplayModule.default || gplayModule;

/**
 * Play Store Service
 * Handles all Play Store related operations
 */
export class PlayStoreService {
  /**
   * Search apps in the Play Store
   */
  static async search(
    term: string,
    country: string = 'kr',
    limit: number = 20
  ): Promise<App[]> {
    try {
      const results = await gplay.search({
        term,
        lang: this.getLanguageFromCountry(country),
        country,
        num: Math.min(limit, 50), // Max 50
      });

      return results.map((app: any) => this.transformPlayStoreApp(app));
    } catch (error) {
      console.error('Play Store search error:', error);
      throw new Error('Failed to search Play Store');
    }
  }

  /**
   * Transform Play Store app data to our unified App interface
   */
  private static transformPlayStoreApp(app: any): App {
    // Extract screenshots
    const screenshots = app.screenshots || [];

    return {
      id: app.appId || '',
      title: app.title || '',
      developer: app.developer || app.developerName || '',
      icon: app.icon || '',
      rating: app.score || app.scoreText ? parseFloat(app.scoreText) : 0,
      ratingCount: app.ratings || 0,
      price: this.formatPrice(app.price, app.currency, app.free),
      free: app.free !== undefined ? app.free : app.price === 0,
      store: 'playstore',
      url: app.url || `https://play.google.com/store/apps/details?id=${app.appId}`,
      description: app.summary || app.description || '',
      category: app.genre || '',
      screenshots: screenshots,
      version: app.version || '',
      releaseDate: app.released || app.updated || '',
      size: app.size || '',
    };
  }

  /**
   * Format price string
   */
  private static formatPrice(
    priceValue: any,
    currency: string = 'KRW',
    isFree: boolean = false
  ): string {
    // Check if free
    if (isFree || priceValue === 0 || priceValue === '0' || !priceValue) {
      return '무료';
    }

    const currencySymbols: Record<string, string> = {
      USD: '$',
      KRW: '₩',
      JPY: '¥',
      EUR: '€',
      GBP: '£',
    };

    // If price is already a formatted string with currency symbol, return as is
    if (typeof priceValue === 'string') {
      // Check if it already has a currency symbol
      if (priceValue.includes('₩') || priceValue.includes('$') || priceValue.includes('¥') || priceValue.includes('€') || priceValue.includes('£')) {
        return priceValue;
      }

      // Try to parse numeric value from string
      const numericMatch = priceValue.match(/[\d,.]+/);
      if (numericMatch) {
        const cleanedPrice = numericMatch[0].replace(/,/g, '');
        const parsedPrice = parseFloat(cleanedPrice);

        if (!isNaN(parsedPrice) && parsedPrice > 0) {
          const symbol = currencySymbols[currency] || currency;

          // 원화와 엔화는 소수점 없이 정수로, 다른 통화는 소수점 2자리
          let formattedPrice: string;
          if (currency === 'KRW' || currency === 'JPY') {
            formattedPrice = Math.round(parsedPrice).toLocaleString('en-US');
          } else {
            formattedPrice = parsedPrice.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });
          }

          return `${symbol}${formattedPrice}`;
        }
      }

      // If we can't parse it, it's probably free or invalid
      return '무료';
    }

    // Handle numeric price
    if (typeof priceValue === 'number') {
      if (priceValue === 0) {
        return '무료';
      }

      const symbol = currencySymbols[currency] || currency;

      // 원화와 엔화는 소수점 없이 정수로, 다른 통화는 소수점 2자리
      let formattedPrice: string;
      if (currency === 'KRW' || currency === 'JPY') {
        formattedPrice = Math.round(priceValue).toLocaleString('en-US');
      } else {
        formattedPrice = priceValue.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }

      return `${symbol}${formattedPrice}`;
    }

    // Default fallback
    return '무료';
  }

  /**
   * Get language code from country code
   */
  private static getLanguageFromCountry(country: string): string {
    const languageMap: Record<string, string> = {
      // Asia Pacific
      kr: 'ko',
      jp: 'ja',
      cn: 'zh',
      in: 'en',
      tw: 'zh',
      hk: 'zh',
      sg: 'en',
      th: 'th',
      vn: 'vi',
      id: 'id',
      ph: 'en',
      my: 'en',
      au: 'en',
      nz: 'en',
      // Americas
      us: 'en',
      ca: 'en',
      br: 'pt',
      mx: 'es',
      ar: 'es',
      cl: 'es',
      co: 'es',
      // Europe
      gb: 'en',
      fr: 'fr',
      de: 'de',
      es: 'es',
      it: 'it',
      ru: 'ru',
      nl: 'nl',
      se: 'sv',
      no: 'no',
      dk: 'da',
      fi: 'fi',
      pl: 'pl',
      at: 'de',
      ch: 'de',
      be: 'nl',
      tr: 'tr',
      // Middle East & Africa
      sa: 'ar',
      ae: 'ar',
      za: 'en',
      eg: 'ar',
    };

    return languageMap[country.toLowerCase()] || 'en';
  }

  /**
   * Get top free apps
   */
  static async getTopFreeApps(country: string = 'kr', limit: number = 10): Promise<App[]> {
    try {
      const results = await gplay.list({
        collection: gplay.collection.TOP_FREE,
        country,
        num: Math.min(limit, 120),
      });

      return results.map((app: any) => this.transformPlayStoreApp(app));
    } catch (error) {
      console.error('Play Store top free apps error:', error);
      return [];
    }
  }

  /**
   * Get top paid apps
   */
  static async getTopPaidApps(country: string = 'kr', limit: number = 10): Promise<App[]> {
    try {
      const results = await gplay.list({
        collection: gplay.collection.TOP_PAID,
        country,
        num: Math.min(limit, 120),
      });

      return results.map((app: any) => this.transformPlayStoreApp(app));
    } catch (error) {
      console.error('Play Store top paid apps error:', error);
      return [];
    }
  }

  /**
   * Get app details by ID
   */
  static async getAppDetails(appId: string, country: string = 'kr'): Promise<App | null> {
    try {
      const app = await gplay.app({
        appId,
        lang: this.getLanguageFromCountry(country),
        country,
      });

      return this.transformPlayStoreApp(app);
    } catch (error) {
      console.error('Play Store details error:', error);
      return null;
    }
  }
}
