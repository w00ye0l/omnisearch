import { NextRequest, NextResponse } from 'next/server';
import { AppStoreService } from '@/lib/services/appStore.service';
import { PlayStoreService } from '@/lib/services/playStore.service';

export const dynamic = 'force-dynamic';

/**
 * Trending Paid Apps API
 * Returns top paid apps from both App Store and Play Store
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country') || 'kr';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const validLimit = Math.min(Math.max(limit, 1), 20);

    // Fetch top paid apps from both stores in parallel
    const [appStoreApps, playStoreApps] = await Promise.all([
      AppStoreService.getTopPaidApps(country, validLimit),
      PlayStoreService.getTopPaidApps(country, validLimit),
    ]);

    return NextResponse.json({
      appStore: {
        count: appStoreApps.length,
        apps: appStoreApps,
      },
      playStore: {
        count: playStoreApps.length,
        apps: playStoreApps,
      },
      totalCount: appStoreApps.length + playStoreApps.length,
    });
  } catch (error) {
    console.error('Trending paid API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch trending paid apps',
        message: 'Unable to get trending paid apps. Please try again.',
      },
      { status: 500 }
    );
  }
}
