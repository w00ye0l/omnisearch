import { App } from '../types/app.types';

/**
 * Interleave apps from App Store and Play Store
 * Preserves the original order from each store's API (which is already relevance-sorted)
 * but mixes the two stores together for variety
 *
 * Pattern: AS1, PS1, AS2, PS2, AS3, PS3, ...
 */
export function sortAppsByRelevance(apps: App[], query: string): App[] {
  // Separate by store (maintaining original order from API)
  const appStoreApps = apps.filter(app => app.store === 'appstore');
  const playStoreApps = apps.filter(app => app.store === 'playstore');

  // Interleave results alternating between stores
  const result: App[] = [];
  const maxLength = Math.max(appStoreApps.length, playStoreApps.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < appStoreApps.length) {
      result.push(appStoreApps[i]);
    }
    if (i < playStoreApps.length) {
      result.push(playStoreApps[i]);
    }
  }

  return result;
}
