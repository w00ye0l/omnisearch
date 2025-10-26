import store from "app-store-scraper";
import { App } from "../types/app.types";

/**
 * App Store Service
 * Handles all App Store related operations
 */
export class AppStoreService {
  /**
   * Search apps in the App Store
   */
  static async search(
    term: string,
    country: string = "kr",
    limit: number = 20
  ): Promise<App[]> {
    try {
      const results = await store.search({
        term,
        country,
        num: Math.min(limit, 50), // Max 50
      });

      return results.map((app: any) => this.transformAppStoreApp(app));
    } catch (error) {
      console.error("App Store search error:", error);
      throw new Error("Failed to search App Store");
    }
  }

  /**
   * Transform App Store app data to our unified App interface
   */
  private static transformAppStoreApp(app: any): App {
    // Extract screenshots from various possible fields
    const screenshots =
      app.screenshots ||
      app.screenshotUrls ||
      app.ipadScreenshotUrls ||
      app.appletvScreenshotUrls ||
      [];

    return {
      id: app.id?.toString() || "",
      title: app.title || app.trackName || "",
      developer: app.developer || app.artistName || "",
      icon: app.icon || app.artworkUrl100 || app.artworkUrl60 || "",
      rating: app.score || app.averageUserRating || 0,
      ratingCount: app.ratings || app.userRatingCount || 0,
      price: this.formatPrice(app.price, app.currency),
      free: app.free || app.price === 0,
      store: "appstore",
      url: app.url || `https://apps.apple.com/app/id${app.id}`,
      description: app.description || "",
      category: app.genre || app.primaryGenreName || "",
      screenshots: screenshots,
      version: app.version || "",
      releaseDate: app.released || app.currentVersionReleaseDate || "",
      size: app.size || "",
    };
  }

  /**
   * Format price string
   */
  private static formatPrice(price: number, currency: string = "USD"): string {
    if (price === 0) {
      return "무료";
    }

    const currencySymbols: Record<string, string> = {
      USD: "$",
      KRW: "₩",
      JPY: "¥",
      EUR: "€",
      GBP: "£",
    };

    const symbol = currencySymbols[currency] || currency;

    // 원화와 엔화는 소수점 없이 정수로, 다른 통화는 소수점 2자리
    let formattedPrice: string;
    if (currency === "KRW" || currency === "JPY") {
      // 정수로 표시하고 천단위 콤마 추가
      formattedPrice = Math.round(price).toLocaleString('en-US');
    } else {
      // 소수점 2자리 + 천단위 콤마
      formattedPrice = price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }

    return `${symbol}${formattedPrice}`;
  }

  /**
   * Get top free apps
   */
  static async getTopFreeApps(country: string = 'kr', limit: number = 10): Promise<App[]> {
    try {
      const results = await store.list({
        collection: store.collection.TOP_FREE_IOS,
        country,
        num: Math.min(limit, 50),
      });

      return results.map((app: any) => this.transformAppStoreApp(app));
    } catch (error) {
      console.error('App Store top free apps error:', error);
      return [];
    }
  }

  /**
   * Get top paid apps
   */
  static async getTopPaidApps(country: string = 'kr', limit: number = 10): Promise<App[]> {
    try {
      const results = await store.list({
        collection: store.collection.TOP_PAID_IOS,
        country,
        num: Math.min(limit, 50),
      });

      return results.map((app: any) => this.transformAppStoreApp(app));
    } catch (error) {
      console.error('App Store top paid apps error:', error);
      return [];
    }
  }

  /**
   * Get app details by ID
   */
  static async getAppDetails(
    appId: string,
    country: string = "kr"
  ): Promise<App | null> {
    try {
      // App Store requires numeric ID
      const numericId = parseInt(appId, 10);

      if (isNaN(numericId)) {
        console.error("Invalid App Store ID:", appId);
        return null;
      }

      console.log("Fetching App Store details:", { id: numericId, country });

      // Try different country codes if the specified one fails
      const countriesToTry = [country, "us", "kr"];

      for (const tryCountry of countriesToTry) {
        try {
          const app = await store.app({
            id: numericId,
            country: tryCountry,
          });

          if (app) {
            console.log("App found in country:", tryCountry);
            return this.transformAppStoreApp(app);
          }
        } catch (err) {
          console.log(`App not found in ${tryCountry}, trying next...`);
          continue;
        }
      }

      console.error("App not found in any country");
      return null;
    } catch (error) {
      console.error("App Store details error:", error);
      return null;
    }
  }
}
