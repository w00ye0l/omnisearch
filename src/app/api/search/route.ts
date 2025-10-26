import { NextRequest, NextResponse } from 'next/server';
import { AppStoreService } from '@/lib/services/appStore.service';
import { PlayStoreService } from '@/lib/services/playStore.service';
import { SearchResponse } from '@/lib/types/app.types';

export const dynamic = 'force-dynamic';

/**
 * Unified Search API
 * Searches both App Store and Play Store simultaneously
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const country = searchParams.get('country') || 'kr';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validation
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required', message: 'Please provide a search term' },
        { status: 400 }
      );
    }

    if (query.length > 100) {
      return NextResponse.json(
        { error: 'Query too long', message: 'Search query must be less than 100 characters' },
        { status: 400 }
      );
    }

    const validLimit = Math.min(Math.max(limit, 1), 50);

    // Parallel search with error handling
    const [appStoreResult, playStoreResult] = await Promise.allSettled([
      AppStoreService.search(query, country, validLimit),
      PlayStoreService.search(query, country, validLimit),
    ]);

    // Extract results
    const appStoreApps =
      appStoreResult.status === 'fulfilled' ? appStoreResult.value : [];
    const playStoreApps =
      playStoreResult.status === 'fulfilled' ? playStoreResult.value : [];

    // Build response
    const response: SearchResponse = {
      query,
      country,
      totalCount: appStoreApps.length + playStoreApps.length,
      appStore: {
        count: appStoreApps.length,
        apps: appStoreApps,
      },
      playStore: {
        count: playStoreApps.length,
        apps: playStoreApps,
      },
      timestamp: new Date().toISOString(),
    };

    // Log any errors but still return partial results
    if (appStoreResult.status === 'rejected') {
      console.error('App Store search failed:', appStoreResult.reason);
    }
    if (playStoreResult.status === 'rejected') {
      console.error('Play Store search failed:', playStoreResult.reason);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An error occurred while searching. Please try again.',
      },
      { status: 500 }
    );
  }
}
